"use client";
import React, { useState, ChangeEvent } from "react";

export interface StudentFormData {
  name: string;
  gender: string; // ✅ Added this
  program: string;
  cgpa: number;
  programming_score: number;
  design_score: number;
  it_infrastructure_score: number;
  co_curricular_points: number;
  github_url: string;
  linkedin_url: string;
  portfolio_url: string;
  course_id: string;
  course_name: string;
  course_title: string;
  course_description: string;
  unit: number;
  social_media: string;
}

interface Props {
  onSubmit: (data: StudentFormData) => void;
  loading: boolean;
}

type FormState = Record<
  keyof Omit<
    StudentFormData,
    | "cgpa"
    | "programming_score"
    | "design_score"
    | "it_infrastructure_score"
    | "co_curricular_points"
    | "unit"
  >,
  string
> & {
  cgpa: string;
  programming_score: string;
  design_score: string;
  it_infrastructure_score: string;
  co_curricular_points: string;
  unit: string;
};

export default function StudentForm({ onSubmit, loading }: Props) {
  const [form, setForm] = useState<FormState>({
    name: "",
    gender: "", // ✅ Added
    program: "",
    cgpa: "",
    programming_score: "",
    design_score: "",
    it_infrastructure_score: "",
    co_curricular_points: "",
    github_url: "",
    linkedin_url: "",
    portfolio_url: "",
    course_id: "",
    course_name: "",
    course_title: "",
    course_description: "",
    unit: "",
    social_media: "",
  });

  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    computingRelevance?: number;
    summary?: string;
    github?: {
      projects: { name: string; description: string }[];
      languages?: string[];
    };
    linkedin?: { experience: unknown[]; education: unknown[] };
    portfolio?: {
      skills: string[];
      projects: { length: number } | number;
    };
  } | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const handleChange = <K extends keyof FormState>(
    key: K,
    value: string
  ): void => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const analyzeProfiles = async () => {
    if (!form.github_url && !form.linkedin_url && !form.portfolio_url) {
      alert(
        "Please provide at least one profile URL (GitHub, LinkedIn, or Portfolio)"
      );
      return;
    }

    setAnalyzing(true);
    setShowAnalysis(false);

    try {
      const res = await fetch("/api/analyze-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          github_url: form.github_url,
          linkedin_url: form.linkedin_url,
          portfolio_url: form.portfolio_url,
        }),
      });

      const data = await res.json();
      setAnalysisResult(data);
      setShowAnalysis(true);
    } catch (error) {
      console.error("Profile analysis failed:", error);
      alert("Failed to analyze profiles. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...form,
      cgpa: parseFloat(form.cgpa),
      programming_score: parseInt(form.programming_score),
      design_score: parseInt(form.design_score),
      it_infrastructure_score: parseInt(form.it_infrastructure_score),
      co_curricular_points: parseInt(form.co_curricular_points),
      unit: form.unit ? parseFloat(form.unit) : 3.0,
    });
    setForm({
      name: "",
      gender: "",
      program: "",
      cgpa: "",
      programming_score: "",
      design_score: "",
      it_infrastructure_score: "",
      co_curricular_points: "",
      github_url: "",
      linkedin_url: "",
      portfolio_url: "",
      course_id: "",
      course_name: "",
      course_title: "",
      course_description: "",
      unit: "",
      social_media: "",
    });
  };

  return (
    <div className="space-y-4">
      {/* Profile Analysis Results */}
      {showAnalysis && analysisResult && (
        <div className="bg-gradient-to-r from-blue-900 to-purple-900 p-6 rounded-2xl shadow-lg border border-blue-500">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            🔍 Profile Analysis Results
            <span className="text-sm font-normal text-gray-300">
              Computing Relevance: {analysisResult.computingRelevance}/100
            </span>
          </h3>

          <div className="space-y-4">
            {/* Summary */}
            <div className="bg-black/30 p-4 rounded-lg">
              <p className="text-gray-200">{analysisResult.summary}</p>
            </div>

            {/* GitHub Analysis */}
            {analysisResult.github && (
              <div className="bg-black/30 p-4 rounded-lg">
                <h4 className="font-semibold text-green-400 mb-2">
                  💻 GitHub Activity
                </h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-400">Languages: </span>
                    <span className="text-white">
                      {analysisResult.github.languages?.join(", ") || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Projects: </span>
                    <span className="text-white">
                      {analysisResult.github.projects.length} computing-related
                      projects found
                    </span>
                  </div>
                  {analysisResult.github.projects
                    .slice(0, 3)
                    .map(
                      (
                        proj: { name: string; description: string },
                        i: number
                      ) => (
                        <div key={i} className="ml-4 text-gray-300">
                          • {proj.name}: {proj.description}
                        </div>
                      )
                    )}
                </div>
              </div>
            )}

            {/* Portfolio Analysis */}
            {analysisResult.portfolio && (
              <div className="bg-black/30 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-400 mb-2">
                  🎨 Portfolio
                </h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-400">Skills Found: </span>
                    <span className="text-white">
                      {analysisResult.portfolio.skills.join(", ")}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Projects: </span>
                    <span className="text-white">
                      {typeof analysisResult.portfolio.projects === "number"
                        ? analysisResult.portfolio.projects
                        : analysisResult.portfolio.projects?.length || 0}{" "}
                      projects
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setShowAnalysis(false)}
            className="mt-4 text-sm text-gray-400 hover:text-white"
          >
            ✕ Close Analysis
          </button>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-zinc-800 p-6 rounded-2xl shadow-lg space-y-4"
      >
        {/* Profile Analysis Button */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Student Information</h3>
          <button
            type="button"
            onClick={analyzeProfiles}
            disabled={
              analyzing ||
              (!form.github_url && !form.linkedin_url && !form.portfolio_url)
            }
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {analyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Analyzing...
              </>
            ) : (
              <>🔍 Analyze Profiles</>
            )}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {(
            Object.keys(form).filter((key) => key !== "social_media") as Array<
              keyof FormState
            >
          ).map((key) => (
            <input
              key={key}
              type="text"
              placeholder={key.replace(/_/g, " ").toUpperCase()}
              value={form[key]}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleChange(key, e.target.value)
              }
              className="bg-zinc-700 p-2 rounded-md text-white"
            />
          ))}
        </div>

        <textarea
          placeholder="Social Media / Activity Links"
          value={form.social_media}
          onChange={(e) => handleChange("social_media", e.target.value)}
          className="bg-zinc-700 p-2 rounded-md text-white w-full"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 py-2 bg-lime-400 text-black font-semibold rounded-md hover:bg-lime-500 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Add Student"}
        </button>
      </form>
    </div>
  );
}
