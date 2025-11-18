// src/app/api/comments/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/services/supabaseClient";
import { createClient } from "@supabase/supabase-js";

// Helper function to retry API calls
async function fetchWithRetry(url: string, options: RequestInit, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok || response.status === 400) {
        return response;
      }
      if ((response.status === 503 || response.status === 429) && i < maxRetries - 1) {
        const waitTime = Math.pow(2, i) * 1000;
        console.log(`Retry ${i + 1}/${maxRetries} after ${waitTime}ms due to ${response.status}...`);
        await new Promise(r => setTimeout(r, waitTime));
        continue;
      }
      return response;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      const waitTime = Math.pow(2, i) * 1000;
      await new Promise(r => setTimeout(r, waitTime));
    }
  }
  throw new Error("Max retries exceeded");
}

// GET: Fetch all comments for a student
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId");

    if (!studentId) {
      return NextResponse.json(
        { error: "Student ID is required" },
        { status: 400 }
      );
    }

    const { data: comments, error } = await supabase
      .from("student_comments")
      .select("*")
      .eq("student_id", studentId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching comments:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ comments });
  } catch (error) {
    console.error("Comments GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST: Add a new comment with AI sentiment analysis
export async function POST(req: NextRequest) {
  try {
    const { student_id, commenter_id, commenter_name, content } = await req.json();

    if (!student_id || !commenter_id || !commenter_name || !content) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    console.log("=== Comment Analysis API Called ===");
    console.log("Analyzing comment from:", commenter_name);

    // Analyze comment with Gemini AI
    const prompt = `You are an expert at analyzing lecturer/admin feedback for computing/IT students.

Analyze this comment about a student and provide a sentiment score:

Comment: "${content}"

Provide a JSON response with:

1. **sentiment_score**: Overall sentiment and helpfulness (0-100 scale)
   - Consider: constructiveness, specificity, actionability, tone
   - Examples:
     * Generic/unhelpful (e.g., "good student", "needs improvement") = 10-30
     * Somewhat specific feedback = 30-50
     * Constructive with specific examples = 50-70
     * Detailed, actionable feedback with strengths and areas to improve = 70-90
     * Exceptional feedback with concrete examples and guidance = 90-100
   - Negative but constructive = can still score high if specific and helpful
   - Vague negative = low score

2. **is_useful**: Boolean - whether this comment provides meaningful feedback
   - true: Contains specific observations or actionable advice
   - false: Too vague, generic, or not helpful (e.g., "ok", "fine", "deleted")

3. **summary**: Brief 1-sentence interpretation of the feedback

Return ONLY valid JSON:
{
  "sentiment_score": number,
  "is_useful": boolean,
  "summary": "string"
}`;

    const geminiRes = await fetchWithRetry(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
        }),
      },
      3
    );

    if (!geminiRes.ok) {
      console.error("Gemini API error:", geminiRes.status);
      throw new Error("Failed to analyze comment");
    }

    const data = await geminiRes.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

    let jsonText = text.trim();
    if (jsonText.startsWith("```json")) {
      jsonText = jsonText.replace(/```json\n?/g, "").replace(/```\n?/g, "");
    } else if (jsonText.startsWith("```")) {
      jsonText = jsonText.replace(/```\n?/g, "");
    }

    const analysis = JSON.parse(jsonText);
    console.log("Comment analysis:", analysis);

    // Insert comment into database
    const { data: comment, error: insertError } = await supabase
      .from("student_comments")
      .insert({
        student_id,
        commenter_id,
        commenter_name,
        content,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error inserting comment:", insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    // Update student's feedback_sentiment_score
    // Calculate average of all useful comments
    const { data: allComments } = await supabase
      .from("student_comments")
      .select("content")
      .eq("student_id", student_id);

    let totalScore = analysis.sentiment_score;
    let usefulCount = analysis.is_useful ? 1 : 0;

    // Re-analyze previous comments to get average
    if (allComments && allComments.length > 1) {
      const otherComments = allComments.filter(c => c.content !== content);
      
      for (const prevComment of otherComments.slice(0, 5)) { // Limit to last 5 for performance
        try {
          const prevPrompt = `Rate this comment sentiment 0-100: "${prevComment.content}". Return only JSON: {"sentiment_score": number, "is_useful": boolean}`;
          const prevRes = await fetchWithRetry(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
              process.env.GEMINI_API_KEY,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [{ role: "user", parts: [{ text: prevPrompt }] }],
              }),
            },
            2
          );

          if (prevRes.ok) {
            const prevData = await prevRes.json();
            let prevText = prevData?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
            prevText = prevText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
            const prevAnalysis = JSON.parse(prevText);
            
            if (prevAnalysis.is_useful) {
              totalScore += prevAnalysis.sentiment_score;
              usefulCount++;
            }
          }
        } catch (err) {
          console.error("Error analyzing previous comment:", err);
        }
      }
    }

    const averageScore = usefulCount > 0 ? Math.round(totalScore / usefulCount) : 50;

    // Update student record
    await supabase
      .from("students")
      .update({ feedback_sentiment_score: averageScore })
      .eq("id", student_id);

    return NextResponse.json({
      comment,
      analysis: {
        sentiment_score: analysis.sentiment_score,
        is_useful: analysis.is_useful,
        summary: analysis.summary,
        average_score: averageScore,
      },
    });
  } catch (error) {
    console.error("Comments POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE: Mark comment as deleted (soft delete)
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const commentId = searchParams.get("commentId");
    const commenterId = searchParams.get("commenterId");

    if (!commentId || !commenterId) {
      return NextResponse.json(
        { error: "Comment ID and Commenter ID are required" },
        { status: 400 }
      );
    }

    // Verify the comment belongs to the commenter
    const { data: comment, error: fetchError } = await supabase
      .from("student_comments")
      .select("*")
      .eq("id", commentId)
      .single();

    if (fetchError || !comment) {
      return NextResponse.json(
        { error: "Comment not found" },
        { status: 404 }
      );
    }

    if (comment.commenter_id !== commenterId) {
      return NextResponse.json(
        { error: "Unauthorized: You can only delete your own comments" },
        { status: 403 }
      );
    }

    // Soft delete by updating content
    const { error: updateError } = await supabase
      .from("student_comments")
      .update({ content: "[Comment deleted]" })
      .eq("id", commentId);

    if (updateError) {
      console.error("Error deleting comment:", updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // Recalculate feedback_sentiment_score
    const { data: remainingComments } = await supabase
      .from("student_comments")
      .select("content")
      .eq("student_id", comment.student_id)
      .neq("content", "[Comment deleted]");

    let newAverageScore = 50; // Default if no comments left
    
    if (remainingComments && remainingComments.length > 0) {
      // Recalculate average (simplified version)
      newAverageScore = 50; // Keep existing for now, or trigger full recalc
    }

    await supabase
      .from("students")
      .update({ feedback_sentiment_score: newAverageScore })
      .eq("id", comment.student_id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Comments DELETE error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
