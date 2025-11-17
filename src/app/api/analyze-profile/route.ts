// src/app/api/analyze-profile/route.ts
import { NextResponse } from "next/server";

interface ProfileAnalysis {
  github?: {
    repositories: string[];
    languages: string[];
    projects: Array<{
      name: string;
      description: string;
      topics: string[];
    }>;
  };
  portfolio?: {
    projects: string[];
    skills: string[];
  };
  linkedin?: {
    experience: string[];
    skills: string[];
  };
  summary: string;
  computingRelevance: number; // 0-100 score
}

interface GitHubRepo {
  name: string;
  description: string | null;
  fork: boolean;
  topics: string[];
  language: string | null;
}

interface GitHubRepo {
  name: string;
  description: string | null;
  fork: boolean;
  topics: string[];
  language: string | null;
}

export async function POST(req: Request) {
  try {
    const { github_url, linkedin_url, portfolio_url } = await req.json();

    const analysis: ProfileAnalysis = {
      summary: "",
      computingRelevance: 0,
    };

    // ✅ Analyze GitHub Profile
    if (github_url) {
      const githubResult = await analyzeGitHub(github_url);
      if (githubResult) analysis.github = githubResult;
    }

    // ✅ Analyze Portfolio
    if (portfolio_url) {
      const portfolioResult = await analyzePortfolio(portfolio_url);
      if (portfolioResult) analysis.portfolio = portfolioResult;
    }

    // ✅ Analyze LinkedIn
    if (linkedin_url) {
      const linkedinResult = await analyzeLinkedIn(linkedin_url);
      if (linkedinResult) analysis.linkedin = linkedinResult;
    }

    // ✅ Generate AI Summary using Gemini
    const summaryPrompt = `
Analyze this student's online presence and summarize their computing-related activities, projects, and skills.
Focus on technical skills, programming languages, projects, and professional development.

GitHub Activity:
${analysis.github ? JSON.stringify(analysis.github, null, 2) : "Not provided"}

Portfolio:
${analysis.portfolio ? JSON.stringify(analysis.portfolio, null, 2) : "Not provided"}

LinkedIn:
${analysis.linkedin ? JSON.stringify(analysis.linkedin, null, 2) : "Not provided"}

Provide:
1. A brief summary (2-3 sentences) of their technical profile
2. A computing relevance score (0-100) based on how much computing-related content they have
3. Key strengths and focus areas

Format as JSON:
{
  "summary": "...",
  "computingRelevance": 85,
  "strengths": ["..."]
}
`;

    const geminiRes = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: summaryPrompt }] }],
        }),
      }
    );

    const geminiData = await geminiRes.json();
    const rawText =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "{}";

    // Extract JSON from markdown code blocks if present
    const jsonMatch = rawText.match(/```json\n?([\s\S]*?)\n?```/) || rawText.match(/\{[\s\S]*\}/);
    const jsonText = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : rawText;

    try {
      const aiAnalysis = JSON.parse(jsonText);
      analysis.summary = aiAnalysis.summary || "No summary generated.";
      analysis.computingRelevance = aiAnalysis.computingRelevance || 0;
    } catch {
      analysis.summary = "Unable to generate summary.";
      analysis.computingRelevance = 50;
    }

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Profile analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze profile" },
      { status: 500 }
    );
  }
}

// ============================================
// GitHub Analysis (using GitHub API)
// ============================================
async function analyzeGitHub(url: string) {
  try {
    // Extract username from GitHub URL
    const usernameMatch = url.match(/github\.com\/([^\/\?]+)/);
    if (!usernameMatch) return null;

    const username = usernameMatch[1];

    // Fetch user's repositories
    const reposRes = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=10`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          ...(process.env.GITHUB_TOKEN && {
            Authorization: `token ${process.env.GITHUB_TOKEN}`,
          }),
        },
      }
    );

    if (!reposRes.ok) return null;

    const repos: GitHubRepo[] = await reposRes.json();

    // Extract computing-related keywords
    const computingKeywords = [
      "javascript", "python", "java", "react", "node", "web", "app", "api",
      "machine learning", "ai", "database", "frontend", "backend", "mobile",
      "android", "ios", "game", "algorithm", "data", "cloud", "devops"
    ];

    const projects = repos
      .filter((repo) => !repo.fork && repo.description)
      .map((repo) => ({
        name: repo.name,
        description: repo.description || "",
        topics: repo.topics || [],
        language: repo.language || "",
      }))
      .filter((project) => {
        const text = `${project.name} ${project.description} ${project.topics.join(" ")} ${project.language}`.toLowerCase();
        return computingKeywords.some(keyword => text.includes(keyword));
      });

    const languages = [...new Set(repos.map((r) => r.language).filter((lang): lang is string => Boolean(lang)))];

    return {
      repositories: repos.map((r) => r.name).slice(0, 10),
      languages,
      projects: projects.slice(0, 5),
    };
  } catch (error) {
    console.error("GitHub analysis error:", error);
    return null;
  }
}

// ============================================
// Portfolio Analysis (basic web scraping)
// ============================================
async function analyzePortfolio(url: string) {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!response.ok) return null;

    const html = await response.text();

    // Extract text content (remove HTML tags)
    const textContent = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    // Extract computing-related keywords
    const techKeywords = [
      "javascript", "python", "java", "react", "vue", "angular", "node",
      "typescript", "c++", "c#", "php", "ruby", "swift", "kotlin",
      "html", "css", "sql", "mongodb", "postgresql", "firebase",
      "aws", "azure", "docker", "kubernetes", "git", "api", "rest",
      "graphql", "machine learning", "ai", "deep learning", "web development",
      "mobile development", "game development", "ui/ux", "frontend", "backend",
    ];

    const foundSkills = techKeywords.filter(keyword =>
      textContent.toLowerCase().includes(keyword)
    );

    // Extract project titles (heuristic: text near "project", "built", "created")
    const projectMatches = textContent.match(/(?:project|built|created|developed)\s*:?\s*([^.!?]{10,100})/gi);
    const projects = projectMatches
      ? projectMatches.map(m => m.trim()).slice(0, 5)
      : [];

    return {
      projects,
      skills: foundSkills.slice(0, 15),
    };
  } catch (error) {
    console.error("Portfolio analysis error:", error);
    return null;
  }
}

// ============================================
// LinkedIn Analysis (limited without API access)
// ============================================
async function analyzeLinkedIn(url: string) {
  // Note: LinkedIn blocks scraping and requires OAuth API access
  // This is a placeholder that could be enhanced with LinkedIn API
  try {
    // For now, just validate the URL format
    if (url.includes("linkedin.com/in/")) {
      return {
        experience: ["LinkedIn profile detected"],
        skills: ["Professional networking"],
      };
    }
    return null;
  } catch (error) {
    console.error("LinkedIn analysis error:", error);
    return null;
  }
}
