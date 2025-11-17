// src/app/api/analyze-cocurricular/route.ts
import { NextRequest, NextResponse } from "next/server";

// Helper function to retry API calls
async function fetchWithRetry(url: string, options: RequestInit, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok || response.status === 400) {
        // Return successful responses or client errors (don't retry 400s)
        return response;
      }
      if (response.status === 503 && i < maxRetries - 1) {
        // Wait before retrying (exponential backoff)
        await new Promise(r => setTimeout(r, Math.pow(2, i) * 1000));
        continue;
      }
      return response;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(r => setTimeout(r, Math.pow(2, i) * 1000));
    }
  }
  throw new Error("Max retries exceeded");
}

export async function POST(req: NextRequest) {
  console.log("=== Co-curricular Analysis API Called ===");
  try {
    const { organization_name, organization_type, position, responsibilities, activity_period } = await req.json();
    console.log("Request data:", { organization_name, organization_type, position, responsibilities: responsibilities?.substring(0, 50) + "..." });

    if (!organization_name || !responsibilities) {
      console.error("Validation failed: Missing required fields");
      return NextResponse.json(
        { error: "Organization name and responsibilities are required" },
        { status: 400 }
      );
    }

    // Check if API key exists
    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not configured");
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }
    
    console.log("API key found, preparing Gemini request...");

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

    // Call Gemini API using REST endpoint with retry logic
    console.log("Calling Gemini API...");
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
      3 // Retry up to 3 times on 503 errors
    );

    console.log("Gemini API response status:", geminiRes.status);
    
    if (!geminiRes.ok) {
      const errorText = await geminiRes.text().catch(() => "Unknown error");
      console.error(`Gemini API error ${geminiRes.status}:`, errorText);
      throw new Error(`Gemini API error: ${geminiRes.status} - ${geminiRes.statusText}`);
    }

    const data = await geminiRes.json();
    console.log("Gemini raw response received, extracting text...");
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

    if (!text) {
      console.error("Gemini returned empty response:", JSON.stringify(data, null, 2));
      throw new Error("No response from Gemini AI");
    }
    
    console.log("Gemini text response:", text.substring(0, 100) + "...");
    
    // Extract JSON from response (handle markdown code blocks)
    let jsonText = text.trim();
    if (jsonText.startsWith("```json")) {
      jsonText = jsonText.replace(/```json\n?/g, "").replace(/```\n?/g, "");
    } else if (jsonText.startsWith("```")) {
      jsonText = jsonText.replace(/```\n?/g, "");
    }

    const analysis = JSON.parse(jsonText);
    console.log("Parsed analysis:", analysis);

    // Validate scores are within range
    const validateScore = (score: number) => Math.max(0, Math.min(100, score || 0));
    
    const response = {
      impact_score: validateScore(analysis.impact_score),
      leadership_score: validateScore(analysis.leadership_score),
      relevance_score: validateScore(analysis.relevance_score),
      summary: analysis.summary || "Activity analyzed successfully",
    };
    
    console.log("Returning successful response:", response);
    return NextResponse.json(response);

  } catch (error) {
    console.error("Co-curricular analysis error:", error);
    
    // More detailed error logging
    let errorType = "UNKNOWN_ERROR";
    let errorMessage = "Unknown error";
    
    if (error instanceof SyntaxError) {
      console.error("JSON parsing failed - Gemini response may not be valid JSON");
      errorType = "JSON_PARSE_ERROR";
      errorMessage = "Failed to parse AI response";
    } else if (error instanceof Error) {
      errorMessage = error.message;
      if (error.message.includes("503")) {
        errorType = "SERVICE_UNAVAILABLE";
        errorMessage = "Gemini AI is temporarily unavailable. Please try again in a few moments.";
      } else if (error.message.includes("429")) {
        errorType = "RATE_LIMIT";
        errorMessage = "API rate limit exceeded. Please wait a moment and try again.";
      } else if (error.message.includes("API key")) {
        errorType = "AUTH_ERROR";
        errorMessage = "API authentication failed";
      }
    }
    
    return NextResponse.json(
      { 
        error: "Failed to analyze activity",
        details: errorMessage,
        type: errorType
      },
      { status: 500 }
    );
  }
}
