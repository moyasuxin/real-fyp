// src/app/dashboard/StudentSummary.tsx
"use client";
import React, { useEffect, useState, useRef } from "react";
import { supabase } from "@/services/supabaseClient";

interface Student {
  id: number;
  name?: string | null;
  gender?: string | null;
  dob?: string | null;
  program?: string | null;
  cgpa?: string | null;
  programming_score?: string | null;
  design_score?: string | null;
  it_infrastructure_score?: string | null;
  co_curricular_points?: string | null;
  github_url?: string | null;
  linkedin_url?: string | null;
  portfolio_url?: string | null;
  description?: string | null; // AI summary
}

interface StudentSummaryProps {
  student: Student;
}

const StudentSummary: React.FC<StudentSummaryProps> = ({ student }) => {
  const [summary, setSummary] = useState(student.description || "");
  const [recommendedCareer, setRecommendedCareer] = useState<string>(""); // 🟢 new state
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const lastData = useRef<string>("");

  // ✅ Auto-regenerate summary when student data changes (except description)
  useEffect(() => {
    if (!student) return;

    const { description, ...dataToCompare } = student;
    const serialized = JSON.stringify(dataToCompare);

    if (serialized === lastData.current && summary === student.description)
      return;

    lastData.current = serialized;

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      generateSummary();
    }, 2000);
  }, [student]);

  // ✅ Generate AI summary via /api/gemini-summary
  const generateSummary = async () => {
    setLoading(true);
    setStatus("Generating summary...");

    try {
      const res = await fetch("/api/gemini-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student }), // 🟢 ensure structure matches API
      });

      const data = await res.json();

      if (!data.summary) throw new Error("No summary returned from API");

      setSummary(data.summary);
      setRecommendedCareer(data.recommendedCareer || ""); // 🟢 store AI career

      // ✅ Save both summary and career to Supabase
      const { error } = await supabase
        .from("students")
        .update({
          description: data.summary,
          recommended_career: data.recommendedCareer,
        })
        .eq("id", student.id);

      if (error) {
        console.error("Supabase update failed:", error.message);
        setStatus("⚠️ Failed to save summary to Supabase");
      } else {
        setStatus("✅ Summary saved successfully!");
      }
    } catch (err) {
      console.error("Error generating summary:", err);
      setStatus("❌ Error generating summary");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mt-6">
      <h2 className="text-xl font-semibold mb-4">AI Student Summary</h2>

      <button
        onClick={generateSummary}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate Summary"}
      </button>

      {status && <p className="mt-2 text-sm text-gray-500">{status}</p>}

      {summary && (
        <>
          <p className="mt-4 text-gray-700 whitespace-pre-line">{summary}</p>
          {recommendedCareer && (
            <p className="mt-4 text-lime-600 font-medium">
              Recommended Career: {recommendedCareer}
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default StudentSummary;
