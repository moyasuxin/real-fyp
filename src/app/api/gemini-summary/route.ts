// src/app/api/gemini-summary/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/services/supabaseClient";

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
      console.log(`Retry ${i + 1}/${maxRetries} after ${waitTime}ms due to network error...`);
      await new Promise(r => setTimeout(r, waitTime));
    }
  }
  throw new Error("Max retries exceeded");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const student = body.student || body;

    if (!student?.id) {
      return NextResponse.json({ error: "Student data missing" }, { status: 400 });
    }

    // 🧩 Fetch lecturer/admin comments
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

    // 🎯 Fetch co-curricular activities
    const { data: cocurricular, error: cocurricularError } = await supabase
      .from("cocurricular_activities")
      .select("*")
      .eq("student_id", student.id)
      .order("created_at", { ascending: false });

    if (cocurricularError) console.error("Error fetching co-curricular activities:", cocurricularError);

    let cocurricularDetails = "";
    if (cocurricular && cocurricular.length > 0) {
      const formattedActivities = cocurricular.map((activity) => {
        const scores = `Impact: ${activity.ai_impact_score}/100, Leadership: ${activity.ai_leadership_score}/100, Relevance: ${activity.ai_relevance_score}/100`;
        return `  • ${activity.organization_name} (${activity.organization_type || "Organization"})
    Position: ${activity.position || "Member"}${activity.activity_period ? ` | Period: ${activity.activity_period}` : ""}
    Responsibilities: ${activity.responsibilities}
    AI Analysis: ${scores}
    Summary: ${activity.ai_summary || "N/A"}`;
      }).join("\n\n");
      
      cocurricularDetails = `\n\nCo-curricular Activities (${cocurricular.length} total):\n${formattedActivities}`;
    }

    // 🌐 Fetch profile analysis data if URLs exist
    let profileDetails = "";
    if (student.github_url || student.linkedin_url || student.portfolio_url) {
      try {
        const analysisRes = await fetch(`${req.url.split('/api')[0]}/api/analyze-profile`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            github_url: student.github_url || "",
            linkedin_url: student.linkedin_url || "",
            portfolio_url: student.portfolio_url || "",
          }),
        });

        if (analysisRes.ok) {
          const analysis = await analysisRes.json();
          
          // Build detailed profile information
          const profileParts = [];
          
          if (analysis.github) {
            const languages = analysis.github.languages.join(", ");
            const projectCount = analysis.github.projects.length;
            const projectNames = analysis.github.projects.map((p: { name: string }) => p.name).slice(0, 3).join(", ");
            profileParts.push(
              `GitHub: Has ${projectCount} computing projects (${projectNames}${projectCount > 3 ? ', and more' : ''}) using ${languages}`
            );
          }
          
          if (analysis.portfolio) {
            const skills = analysis.portfolio.skills.slice(0, 10).join(", ");
            if (analysis.portfolio.requiresManualReview) {
              profileParts.push(`Portfolio: Has an interactive portfolio website showcasing web development and design skills`);
            } else if (skills) {
              profileParts.push(`Portfolio: Demonstrates skills in ${skills}`);
            }
          }
          
          if (analysis.linkedin) {
            profileParts.push(`LinkedIn: Maintains professional networking presence`);
          }
          
          if (profileParts.length > 0) {
            profileDetails = "\n\nOnline Presence Analysis:\n" + profileParts.map(p => `- ${p}`).join("\n");
          }
        }
      } catch (error) {
        console.error("Profile analysis failed:", error);
        // Continue without profile data
      }
    }

    // 🧩 Optional links (now without showing URLs, since we have scraped data)
    const cocurricularLine =
      student.co_curricular_points && Number(student.co_curricular_points) > 0
        ? `- Co-curricular Points: ${student.co_curricular_points}`
        : "";

    const studentInfo = `
- Name: ${student.name || "Unknown"}
- Program: ${student.program || "Not specified"}
- CGPA: ${student.cgpa || "N/A"}
- Gender: ${student.gender || "N/A"}
- Programming Score: ${student.programming_score || "N/A"}
- Design Score: ${student.design_score || "N/A"}
- IT Infrastructure Score: ${student.it_infrastructure_score || "N/A"}
- Feedback Sentiment Score: ${student.feedback_sentiment_score || "N/A"}
- Professional Engagement Score: ${student.professional_engagement_score || "N/A"}
${cocurricularLine}
${profileDetails}
${cocurricularDetails}
`;

    // 🧠 Your Original Gemini Prompt (kept intact)
    const prompt = `
You are an AI that analyzes and summarizes student performance and recommends careers.
Write clearly in **simple English** and avoid difficult words.  
Do **not** include any introductions like “Here’s an analysis” or “Summary:” — start directly with the description.

"The scores have already been computed using a machine learning model. Do not infer or modify them — just interpret the meaning."

**IMPORTANT: Never mention specific score numbers or percentages. Instead, use descriptive terms:**
- High scores (80-100): "excels at", "very strong in", "highly skilled in", "outstanding in"
- Good scores (60-79): "competent in", "good at", "solid understanding of", "capable in"
- Average scores (40-59): "developing skills in", "working on", "building foundation in", "gaining experience in"
- Low scores (0-39): "could improve in", "needs development in", "room to grow in", "opportunity to strengthen"

Focus on:
- The student's strongest and weakest skill areas (using descriptive terms only, never numbers).
- Academic performance (CGPA can be mentioned).
- **If "Online Presence Analysis" section is provided: Integrate specific project names, programming languages, and skills into the narrative naturally.**
- **If GitHub data shows projects: Mention specific repository names and languages used.**
- **IMPORTANT about Portfolio analysis: If portfolio data shows "interactive portfolio website" or limited information, this means the portfolio requires user interaction (clicking, navigation) to view content. DO NOT make negative statements like "doesn't show projects" or "doesn't highlight skills". Instead, acknowledge they maintain an online portfolio to showcase their work. Only mention lack of portfolio if NO portfolio URL is provided at all.**
- **If "Co-curricular Activities" section is provided: Highlight their leadership roles, impact, and involvement. Mention specific organizations and achievements naturally in the narrative.**
- DO NOT mention URLs or say things like "explore their GitHub" or "visit their profile".
- If portfolio content couldn't be fully analyzed (e.g., requires JavaScript/interaction), acknowledge the portfolio exists professionally without negative implications.
- Use the actual scraped data to describe their work when available (e.g., "has developed 5 projects including react-dashboard and mobile-game using JavaScript and Python").
- Use friendly and natural language.
- Avoid phrases like "demonstrated" or "evidenced".
- When discussing co-curricular activities, integrate them into the story (e.g., "served as president of the Computing Club where they led workshops for 100+ students").

Then, under "Recommended Career Path:", list only **2–3 short job titles** separated by commas (no sentences, no explanation).

Example Output:
Summary: Lim Chun Xin, a self-proclaimed architect of logic, walks the fine line between curiosity and chaos. Though a student by title, he’s far more of an experimenter—one who dissects the digital world to understand what makes it tick.
Born and raised in the quiet town of Kuala Pilah, Chun Xin’s story doesn’t begin with grandeur, but with relentless tinkering. Whether crafting an AI-powered system to predict human potential or building games that teach through play, he sees code not as commands, but as conversations between man and machine.
Those who’ve worked with him describe him as analytical, quick-witted, and... occasionally detached. “I don’t ignore emotions—I just process them differently,” he once remarked, when asked about his calm demeanor amidst chaos. An ENTP by type, he thrives in debate, challenges the obvious, and sees flaws not as failures, but as data waiting to be interpreted.
There are whispers of a project—an AI system said to understand more than just numbers; one that reads potential itself. Whether it’s ambition or obsession that drives him is unclear. What is clear is this: Lim Chun Xin is not content with simply writing code—he intends to teach machines how to understand humanity.
“Perfection isn’t the goal,” he once said. “Comprehension is.”

Recommended Career Path: Software Developer, AI Specialist, Systems Analyst
For this student:
${studentInfo}

Lecturer/Admin Comments:
${formattedComments}
`;

  // 🧠 Call Gemini API
  console.log("=== Gemini Summary API Called ===");
  console.log("Calling Gemini API for student:", student.name, "ID:", student.id);
  
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
    3 // Retry up to 3 times
  );

  console.log("Gemini API response status:", geminiRes.status);
  
  if (!geminiRes.ok) {
    const errorText = await geminiRes.text().catch(() => "Unknown error");
    console.error("Gemini API error:", geminiRes.status, errorText);
    throw new Error(`Gemini API failed: ${geminiRes.status} - ${geminiRes.statusText}`);
  }

  const data = await geminiRes.json();
  console.log("Gemini response received, candidates:", data?.candidates?.length);
  
  const rawText =
    data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
    "No summary generated.";

  if (rawText === "No summary generated.") {
    console.error("Gemini returned empty response:", JSON.stringify(data, null, 2));
  } else {
    console.log("Gemini text response (first 150 chars):", rawText.substring(0, 150) + "...");
  }

  // 🧩 Split into summary + career
  const [summaryPart, careerPart] = rawText.split(/Recommended Career Path[:\-]?\s*/i);
// 🧹 Clean up unwanted prefixes from AI output
let summary = summaryPart || "No summary generated.";

// Remove any generic introductions like "Here's an analysis..." or "Summary:"
summary = summary
  .replace(/^.*?(Here('|’)s an analysis|Summary)[:\-]?\s*/i, "")
  .replace(/^["'\s]+|["'\s]+$/g, "") // trim quotes and spaces
  .trim();

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

  console.log("Parsed summary length:", summary.length);
  console.log("Parsed career:", recommendedCareer);



    // 🧩 Update Supabase student record
  const { error: updateError } = await supabase
  .from("students")
  .update({
    description: summary,
    recommended_career: recommendedCareer,
  })
  .eq("id", student.id);


  if (updateError) {
    console.error("Supabase update failed:", updateError);
    return NextResponse.json({ error: "Failed to update student record" }, { status: 500 });
  }

  console.log("✅ Summary generated and saved successfully");
  
  // 🧩 Final response
  return NextResponse.json({
    summary,
    recommendedCareer,
    success: true,
  });

  } catch (error) {
    console.error("Gemini Summary API error:", error);
    
    // Provide detailed error information
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error details:", errorMessage);
    
    return NextResponse.json({ 
      error: "Internal Server Error",
      details: errorMessage
    }, { status: 500 });
  }
}
