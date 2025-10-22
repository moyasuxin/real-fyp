// src/app/api/gemini-career/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { student, comments = [] } = await req.json();

    if (!student) {
      return NextResponse.json({ error: "Missing student data" }, { status: 400 });
    }

    // 🧩 Prepare AI prompt integrating structured + unstructured data
    const commentSection =
      comments.length > 0
        ? comments.map(c => `- (${c.created_at}) ${c.commenter}: ${c.content}`).join("\n")
        : "No lecturer or admin comments yet.";

    const prompt = `
You are an AI student performance analyst.

Using the information below, analyze the student's academic performance, soft skills, co-curricular involvement, and public digital presence.
Then, recommend 1–3 suitable **career paths** with reasoning based on the data.

Structured Data:
- Name: ${student.name || "Unknown"}
- Program: ${student.program || "N/A"}
- CGPA: ${student.cgpa || "N/A"}
- Programming Score: ${student.programming_score || "N/A"}
- Design Score: ${student.design_score || "N/A"}
- IT Infrastructure Score: ${student.it_infrastructure_score || "N/A"}
- Co-curricular Points: ${student.co_curricular_points || "N/A"}
- GitHub: ${student.github_url || "N/A"}
- LinkedIn: ${student.linkedin_url || "N/A"}
- Portfolio: ${student.portfolio_url || "N/A"}

Unstructured Data:
- Lecturer Feedback: ${student.feedback || "Not available"}
- Social Media Activity: ${student.social_media || "Not available"}
- Co-curricular Description: ${student.cocu || "Not available"}
- Comments:
${commentSection}

⚙️ Task:
1. Identify the student's academic focus and skills.
2. Infer soft skills or behavioral traits from unstructured data.
3. Recommend suitable careers with short reasoning (e.g., “Software Engineer — strong in coding and teamwork”).
4. Write 3–5 sentences, natural and concise.
`;

    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }
    );

    const data = await res.json();
    const recommendation =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ??
      "No career recommendation generated.";

    return NextResponse.json({ recommendation });
  } catch (error) {
    console.error("Gemini Career API error:", error);
    return NextResponse.json(
      { error: "Failed to generate career recommendation" },
      { status: 500 }
    );
  }
}
