import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { student } = await req.json();

  const prompt = `
Write a short and simple summary about this student in 3–5 sentences.

Name: ${student.name}
Program: ${student.program}
CGPA: ${student.cgpa}
Co-curricular: ${student.cocu}
Lecturer Feedback: ${student.feedback}
Social Media Activity: ${student.social_media}
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
      { error: "Failed to get summary" },
      { status: 500 }
    );
  }
}
