// src/app/studentmanager/components/StudentEdit.tsx
"use client";
import React, { useState } from "react";
import { Student } from "../types/student";
import CourseSection from "./CourseSection";
import { supabase } from "@/services/supabaseClient";

interface Props {
  student: Student | null;
  onClose: () => void;
}

export default function StudentEdit({ student, onClose }: Props) {
  const [profileUrls, setProfileUrls] = useState({
    github_url: student?.github_url || "",
    linkedin_url: student?.linkedin_url || "",
    portfolio_url: student?.portfolio_url || "",
  });
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [saving, setSaving] = useState(false);

  if (!student) return null;

  const analyzeProfiles = async () => {
    if (
      !profileUrls.github_url &&
      !profileUrls.linkedin_url &&
      !profileUrls.portfolio_url
    ) {
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
        body: JSON.stringify(profileUrls),
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

  const saveProfileUrls = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("students")
        .update(profileUrls)
        .eq("id", student.id);

      if (error) throw error;
      alert("Profile URLs saved successfully!");
    } catch (error) {
      console.error("Failed to save URLs:", error);
      alert("Failed to save profile URLs.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-zinc-800 p-6 rounded-2xl shadow-md w-full space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Edit Student — {student.name}</h2>
        <button
          onClick={onClose}
          className="bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600 transition"
        >
          Back
        </button>
      </div>

      <div className="space-y-1 text-gray-300">
        <p>
          <strong>Program:</strong> {student.program}
        </p>
        <p>
          <strong>CGPA:</strong>{" "}
          {student.cgpa ? parseFloat(student.cgpa.toString()).toFixed(2) : "-"}
        </p>
      </div>

      {/* Profile Analysis Results */}
      {showAnalysis && analysisResult && (
        <div className="bg-gradient-to-r from-blue-900 to-purple-900 p-4 rounded-xl shadow-lg border border-blue-500">
          <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
            🔍 Profile Analysis
            <span className="text-sm font-normal text-gray-300">
              Computing Relevance: {analysisResult.computingRelevance}/100
            </span>
          </h3>

          <div className="space-y-3 text-sm">
            <div className="bg-black/30 p-3 rounded-lg">
              <p className="text-gray-200">{analysisResult.summary}</p>
            </div>

            {analysisResult.github && (
              <div className="bg-black/30 p-3 rounded-lg">
                <h4 className="font-semibold text-green-400 mb-1">💻 GitHub</h4>
                <div className="text-gray-300">
                  <div>
                    Languages: {analysisResult.github.languages.join(", ")}
                  </div>
                  <div>Projects: {analysisResult.github.projects.length}</div>
                </div>
              </div>
            )}

            {analysisResult.portfolio && (
              <div className="bg-black/30 p-3 rounded-lg">
                <h4 className="font-semibold text-purple-400 mb-1">
                  🎨 Portfolio
                </h4>
                <div className="text-gray-300">
                  Skills: {analysisResult.portfolio.skills.join(", ")}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setShowAnalysis(false)}
            className="mt-3 text-sm text-gray-400 hover:text-white"
          >
            ✕ Close
          </button>
        </div>
      )}

      {/* Profile URLs Section */}
      <div className="bg-zinc-900 p-4 rounded-lg space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Online Profiles</h3>
          <div className="flex gap-2">
            <button
              onClick={analyzeProfiles}
              disabled={
                analyzing ||
                (!profileUrls.github_url &&
                  !profileUrls.linkedin_url &&
                  !profileUrls.portfolio_url)
              }
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {analyzing ? (
                <>
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Analyzing...
                </>
              ) : (
                <>🔍 Analyze</>
              )}
            </button>
            <button
              onClick={saveProfileUrls}
              disabled={saving}
              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition disabled:opacity-50"
            >
              {saving ? "Saving..." : "💾 Save"}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">GitHub URL</label>
          <input
            className="w-full bg-zinc-700 p-2 rounded-md text-sm"
            placeholder="https://github.com/username"
            value={profileUrls.github_url}
            onChange={(e) =>
              setProfileUrls({ ...profileUrls, github_url: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">
            LinkedIn URL
          </label>
          <input
            className="w-full bg-zinc-700 p-2 rounded-md text-sm"
            placeholder="https://linkedin.com/in/username"
            value={profileUrls.linkedin_url}
            onChange={(e) =>
              setProfileUrls({ ...profileUrls, linkedin_url: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">
            Portfolio URL
          </label>
          <input
            className="w-full bg-zinc-700 p-2 rounded-md text-sm"
            placeholder="https://yourportfolio.com"
            value={profileUrls.portfolio_url}
            onChange={(e) =>
              setProfileUrls({ ...profileUrls, portfolio_url: e.target.value })
            }
          />
        </div>
      </div>

      <CourseSection studentId={student.id} />
    </div>
  );
}
