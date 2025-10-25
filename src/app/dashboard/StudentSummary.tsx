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
  recommended_career?: string | null; // AI career
}

interface StudentSummaryProps {
  student: Student;
}

const StudentSummary: React.FC<StudentSummaryProps> = ({ student }) => {
  const [summary, setSummary] = useState(student.description || "");
  const [recommendedCareer, setRecommendedCareer] = useState(
    student.recommended_career || ""
  );
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const lastData = useRef<string>("");

  // ✅ Automatically regenerate when student data changes
  useEffect(() => {
    if (!student) return;

    // ignore unchanged data
    const { description, recommended_career, ...dataToCompare } = student;
    const serialized = JSON.stringify(dataToCompare);
    if (
      serialized === lastData.current &&
      summary === student.description &&
      recommendedCareer === student.recommended_career
    )
      return;

    lastData.current = serialized;

    // debounce 2 seconds before regenerate
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      generateSummary();
    }, 2000);
  }, [student]);

  // ✅ Unified AI Summary & Career generation
  const generateSummary = async () => {
    setLoading(true);
    setStatus("Generating summary and career...");

    try {
      const res = await fetch("/api/gemini-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student }),
      });

      const data = await res.json();
      if (!data.summary) throw new Error("No summary returned from API");

      // Update state
      setSummary(data.summary);
      setRecommendedCareer(data.recommendedCareer || "");

      // Update Supabase (redundant but safe)
      const { error } = await supabase
        .from("students")
        .update({
          description: data.summary,
          recommended_career: data.recommendedCareer,
        })
        .eq("id", student.id);

      if (error) {
        console.error("Supabase update failed:", error.message);
        setStatus("⚠️ Failed to save summary to database");
      } else {
        setStatus("✅ Summary & career saved successfully!");
      }
    } catch (err) {
      console.error("Error generating summary:", err);
      setStatus("❌ Error generating summary and career");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mt-6">
      <h2 className="text-xl font-semibold mb-4">AI Student Summary</h2>

      {/* Generate Button */}
      <button
        onClick={generateSummary}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate Summary & Career"}
      </button>

      {status && <p className="mt-2 text-sm text-gray-500">{status}</p>}

      {/* Output */}
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
