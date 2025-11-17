// src/app/api/analyze-cocurricular/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { organization_name, organization_type, position, responsibilities, activity_period } = await req.json();

    if (!organization_name || !responsibilities) {
      return NextResponse.json(
        { error: "Organization name and responsibilities are required" },
        { status: 400 }
      );
    }

    const prompt = `You are an expert evaluator of student co-curricular activities and their impact on computing/IT career readiness.

Analyze this co-curricular activity and provide scores:

Organization: ${organization_name}
Type: ${organization_type || "Not specified"}
Position: ${position || "Member"}
Period: ${activity_period || "Not specified"}
Responsibilities/Achievements: ${responsibilities}

Provide a JSON response with these scores (0-100 scale):

1. **impact_score**: Overall impact and significance of the activity
   - Consider: scope of work, number of people impacted, achievements, awards
   - Examples: 
     * Basic participation = 20-40
     * Active contribution = 40-60
     * Major project/event organization = 60-80
     * Award-winning/exceptional impact = 80-100

2. **leadership_score**: Leadership and initiative demonstrated
   - Consider: position, team management, decision-making, mentoring
   - Examples:
     * Regular member = 10-30
     * Committee member = 30-50
     * Team leader/coordinator = 50-70
     * President/founding member = 70-100

3. **relevance_score**: Relevance to computing/IT field
   - Consider: technical skills used, computing-related activities, IT projects
   - Examples:
     * Non-technical (sports, general volunteering) = 10-30
     * Partially technical (IT support, tech workshops) = 30-60
     * Technical club/project (programming, web dev, app) = 60-90
     * Advanced computing work (hackathons, research, publications) = 90-100

4. **summary**: A brief 1-2 sentence analysis of the activity's significance

Return ONLY valid JSON in this exact format:
{
  "impact_score": number,
  "leadership_score": number,
  "relevance_score": number,
  "summary": "string"
}`;

    // Call Gemini API using REST endpoint (same as gemini-summary)
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

    if (!geminiRes.ok) {
      throw new Error(`Gemini API error: ${geminiRes.status}`);
    }

    const data = await geminiRes.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

    if (!text) {
      throw new Error("No response from Gemini AI");
    }
    
    // Extract JSON from response (handle markdown code blocks)
    let jsonText = text.trim();
    if (jsonText.startsWith("```json")) {
      jsonText = jsonText.replace(/```json\n?/g, "").replace(/```\n?/g, "");
    } else if (jsonText.startsWith("```")) {
      jsonText = jsonText.replace(/```\n?/g, "");
    }

    const analysis = JSON.parse(jsonText);

    // Validate scores are within range
    const validateScore = (score: number) => Math.max(0, Math.min(100, score || 0));
    
    return NextResponse.json({
      impact_score: validateScore(analysis.impact_score),
      leadership_score: validateScore(analysis.leadership_score),
      relevance_score: validateScore(analysis.relevance_score),
      summary: analysis.summary || "Activity analyzed successfully",
    });

  } catch (error) {
    console.error("Co-curricular analysis error:", error);
    return NextResponse.json(
      { 
        error: "Failed to analyze activity",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
