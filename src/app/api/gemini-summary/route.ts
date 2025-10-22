// src/app/api/gemini-summary/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const student = await req.json();

  // 🧠 Build a clear AI prompt
  const prompt = `
Write a short and simple summary (3–5 sentences) about this student's academic and co-curricular performance.

Student Information:
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

Generate a summary that highlights the student's academic strengths, technical skills, and co-curricular involvement.
`;

  try {
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
    const summary =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ??
      "No summary generated.";

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Gemini API error:", error);
    return NextResponse.json(
      { error: "Failed to generate summary" },
      { status: 500 }
    );
  }
}
