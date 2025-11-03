// src/app/api/gemini-summary/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/services/supabaseClient";

// ✅ Define expected structure of Gemini AI output
interface GeminiResponse {
  summary?: string;
  recommendedCareer?: string;
  programming_score?: number;
  design_score?: number;
  it_infrastructure_score?: number;
  co_curricular_points?: number;
  feedback_sentiment_score?: number;
  professional_engagement_score?: number;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const student = body.student || body;

    if (!student?.id) {
      return NextResponse.json({ error: "Student data missing" }, { status: 400 });
    }

    // 🧩 Fetch lecturer/admin comments
    const { data: comments } = await supabase
      .from("student_comments")
      .select("commenter_name, content, created_at")
      .eq("student_id", student.id)
      .order("created_at", { ascending: false });

    const formattedComments =
      comments && comments.length > 0
        ? comments
            .map(
              (c) =>
                `- ${c.commenter_name} (${new Date(
                  c.created_at
                ).toLocaleDateString()}): ${c.content}`
            )
            .join("\n")
        : "No comments available.";

    // 🧩 Optional links and additional info
    const optionalLinks = [
      student.github_url ? `- GitHub: ${student.github_url}` : "",
      student.linkedin_url ? `- LinkedIn: ${student.linkedin_url}` : "",
      student.portfolio_url ? `- Portfolio: ${student.portfolio_url}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const cocurricularLine =
      student.co_curricular_points && Number(student.co_curricular_points) > 0
        ? `- Co-curricular Points: ${student.co_curricular_points}`
        : "";

    const studentInfo = `
- Name: ${student.name || "Unknown"}
- Program: ${student.program || "Not specified"}
- CGPA: ${student.cgpa || "N/A"}
- Gender: ${student.gender || "N/A"}
${cocurricularLine}
${optionalLinks}
`;

    // 🧠 Gemini Prompt
    const prompt = `
You are an AI that analyzes students and recommends careers.

For this student:
${studentInfo}

Comments:
${formattedComments}

Return output in JSON only.
{
  "summary": "short natural summary",
  "recommendedCareer": "2–3 job titles separated by commas",
  "programming_score": number (0–100),
  "design_score": number (0–100),
  "it_infrastructure_score": number (0–100),
  "co_curricular_points": number (0–100),
  "feedback_sentiment_score": number (0–100),
  "professional_engagement_score": number (0–100)
}
`;

    // 🧠 Call Gemini API
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await geminiRes.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

    // 🧩 Parse JSON safely
    const match = rawText.match(/\{[\s\S]*\}/);
    let parsed: GeminiResponse = {};
    if (match) {
      try {
        parsed = JSON.parse(match[0]);
      } catch (e) {
        console.error("JSON parse error:", e);
      }
    }

    const {
      summary,
      recommendedCareer,
      programming_score,
      design_score,
      it_infrastructure_score,
      co_curricular_points,
      feedback_sentiment_score,
      professional_engagement_score,
    } = parsed;

    // ✅ Validation check before saving
    const safeNumber = (val: unknown): number | null =>
      typeof val === "number" && !isNaN(val) ? val : null;

    const updatedData = {
      description: summary || null,
      recommended_career: recommendedCareer || null,
      programming_score: safeNumber(programming_score),
      design_score: safeNumber(design_score),
      it_infrastructure_score: safeNumber(it_infrastructure_score),
      co_curricular_points: safeNumber(co_curricular_points),
      feedback_sentiment_score: safeNumber(feedback_sentiment_score),
      professional_engagement_score: safeNumber(professional_engagement_score),
      last_summary_updated: new Date().toISOString(),
    };

    // 🧩 Update student record in Supabase
    const { error: updateError } = await supabase
      .from("students")
      .update(updatedData)
      .eq("id", student.id);

    if (updateError) {
      console.error("Supabase update failed:", updateError);
      return NextResponse.json({ error: "Failed to update student record" }, { status: 500 });
    }

    // ✅ Return structured response
    return NextResponse.json({
      success: true,
      summary: summary || "",
      recommendedCareer: recommendedCareer || "",
      scores: {
        programming_score: safeNumber(programming_score),
        design_score: safeNumber(design_score),
        it_infrastructure_score: safeNumber(it_infrastructure_score),
        co_curricular_points: safeNumber(co_curricular_points),
        feedback_sentiment_score: safeNumber(feedback_sentiment_score),
        professional_engagement_score: safeNumber(professional_engagement_score),
      },
    });
  } catch (error) {
    console.error("Gemini Summary API error:", error);
    return NextResponse.json(
      { error: "Failed to generate summary and career" },
      { status: 500 }
    );
  }
}
