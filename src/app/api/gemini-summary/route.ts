// src/app/api/gemini-summary/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/services/supabaseClient";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const student = body.student || body;

    if (!student?.id) {
      return NextResponse.json({ error: "Student data missing" }, { status: 400 });
    }

    // 🧩 Fetch related comments
    const { data: comments, error: commentError } = await supabase
      .from("student_comments")
      .select("commenter_name, content, created_at")
      .eq("student_id", student.id)
      .order("created_at", { ascending: false });

    if (commentError) console.error("Error fetching comments:", commentError);

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

    // 🧩 Build optional links and fields
    const optionalLinks = [
      student.github_url ? `- GitHub: ${student.github_url}` : "",
      student.linkedin_url ? `- LinkedIn: ${student.linkedin_url}` : "",
      student.portfolio_url ? `- Portfolio: ${student.portfolio_url}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    // ✅ Only include co-curricular if real number > 0
    const cocurricularLine =
      student.co_curricular_points && Number(student.co_curricular_points) > 0
        ? `- Co-curricular Points: ${student.co_curricular_points}`
        : "";

    const studentInfo = `
- Name: ${student.name || "Unknown"}
- Gender: ${student.gender || "Not specified"}
- Program: ${student.program || "Not specified"}
- CGPA: ${student.cgpa || "N/A"}
- Programming Score: ${student.programming_score || "N/A"}
- Design Score: ${student.design_score || "N/A"}
- IT Infrastructure Score: ${student.it_infrastructure_score || "N/A"}
${cocurricularLine}
${optionalLinks ? optionalLinks + "\n" : ""}
`;

    // 🧠 Gemini prompt
    const prompt = `
You are an AI that summarizes student performance and recommends careers.
Write clearly in **simple English** and avoid difficult words.

Focus on:
- The student's strongest and weakest skill areas (based on the numbers).
- Academic performance (CGPA).
- Mention co-curricular only if provided in data.
- Skip GitHub, LinkedIn, and Portfolio if missing.
- Use friendly and natural language (3–5 short sentences max).
- Avoid phrases like "demonstrated" or "evidenced".

Then, under "Recommended Career Path:", list only **2–3 short job titles** separated by commas (no sentences, no explanation).

Example Output:
Summary: John is strong in programming but weaker in design. He has a good CGPA.
Recommended Career Path: Software Engineer, DevOps Engineer

-------------------------
Student Data:
${studentInfo}

Lecturer/Admin Comments:
${formattedComments}
`;

    // 🧩 Call Gemini API
    const geminiRes = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await geminiRes.json();
    const rawText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      "No summary generated.";

    // 🧩 Split into summary + career
    const [summaryPart, careerPart] = rawText.split(/Recommended Career Path[:\-]?\s*/i);
    const summary =
      summaryPart?.replace(/^Summary[:\-]?\s*/i, "").trim() || "No summary generated.";

    // 🧩 Extract clean job titles only
    const cleanedCareer =
      careerPart
        ?.replace(/\*\*/g, "")
        .replace(/[\n\r]/g, " ")
        .replace(/Recommended Career Path.*?:/gi, "")
        .trim() || "";

    const regex =
      /\b([A-Z][a-z]+(?: [A-Z][a-z]+)* (?:Engineer|Developer|Designer|Analyst|Manager|Administrator|Scientist|Architect|Specialist))\b/g;
    const matches = cleanedCareer.match(regex);
    const recommendedCareer =
      matches && matches.length > 0
        ? [...new Set(matches)].join(", ")
        : cleanedCareer || "Not available.";

    // 🧩 Save both to Supabase
    const { error: updateError } = await supabase
      .from("students")
      .update({
        description: summary,
        recommended_career: recommendedCareer,
      })
      .eq("id", student.id);

    if (updateError) console.error("Supabase update failed:", updateError);

    return NextResponse.json({
      summary,
      recommendedCareer,
      success: true,
    });
  } catch (error) {
    console.error("Gemini Summary API error:", error);
    return NextResponse.json(
      { error: "Failed to generate summary and career" },
      { status: 500 }
    );
  }
}
