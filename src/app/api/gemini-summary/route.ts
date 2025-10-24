// src/app/api/gemini-summary/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/services/supabaseClient";

export async function POST(req: Request) {
  try {
    const { student } = await req.json();

    if (!student?.id) {
      return NextResponse.json({ error: "Student ID missing" }, { status: 400 });
    }

    // 🧩 Step 1: Fetch related comments (unstructured data)
    const { data: comments, error: commentError } = await supabase
      .from("student_comments")
      .select("commenter_name, content, created_at")
      .eq("student_id", student.id)
      .order("created_at", { ascending: false });

    if (commentError) {
      console.error("Error fetching comments:", commentError);
    }

    const formattedComments =
      comments && comments.length > 0
        ? comments
            .map(
              (c) => `- ${c.commenter_name} (${new Date(c.created_at).toLocaleDateString()}): ${c.content}`
            )
            .join("\n")
        : "No comments available.";

    // 🧠 Step 2: Build an AI-rich prompt using both structured & unstructured data
    const prompt = `
You are an academic advisor AI. Analyze the following student's structured and unstructured data 
to generate a short summary (3–5 sentences) describing their academic strengths, technical skills, 
co-curricular performance, and professional potential. Then, propose 1–2 possible career paths 
based on the data.

Student Profile:
- Name: ${student.name || "Unknown"}
- Gender: ${student.gender || "Not specified"}
- Program: ${student.program || "Not specified"}
- CGPA: ${student.cgpa || "Not available"}
- Programming Score: ${student.programming_score || "N/A"}
- Design Score: ${student.design_score || "N/A"}
- IT Infrastructure Score: ${student.it_infrastructure_score || "N/A"}
- Co-curricular Points: ${student.co_curricular_points || "N/A"}
- GitHub: ${student.github_url || "N/A"}
- LinkedIn: ${student.linkedin_url || "N/A"}
- Portfolio: ${student.portfolio_url || "N/A"}

Lecturer/Admin Comments:
${formattedComments}

Please output your response in **two sections**:
1. Summary — 3–5 concise sentences summarizing the student.
2. Recommended Career Path — 1–2 likely suitable job roles.
`;

    // 🧩 Step 3: Send to Gemini API
    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await res.json();

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No summary generated.";

    // 🧩 Step 4: Split Gemini output into structured fields
    const [summaryPart, careerPart] = text.split(/Recommended Career Path[:\-]?\s*/i);
    const summary = summaryPart?.trim() || "No summary generated.";
    const recommendedCareer = careerPart?.trim() || "Not available.";

    // 🧩 Step 5: Save results to Supabase
    const { error: updateError } = await supabase
      .from("students")
      .update({
        description: summary,
        recommended_career: recommendedCareer,
      })
      .eq("id", student.id);

    if (updateError) {
      console.error("Supabase update failed:", updateError);
    }

    return NextResponse.json({
      summary,
      recommendedCareer,
      success: true,
    });
  } catch (error) {
    console.error("Gemini API error:", error);
    return NextResponse.json(
      { error: "Failed to generate summary" },
      { status: 500 }
    );
  }
}
