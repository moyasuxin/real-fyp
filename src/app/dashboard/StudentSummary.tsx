// src/app/dashboard/StudentSummary.tsx
"use client";
import React, { useState } from "react";
import { supabase } from "@/services/supabaseClient"; // import Supabase client

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
  description?: string | null;
}

interface StudentSummaryProps {
  student: Student;
}

const StudentSummary: React.FC<StudentSummaryProps> = ({ student }) => {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const generateSummary = async () => {
    setLoading(true);

    // 1️⃣ Send student data to your Gemini API route
    const res = await fetch("/api/summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(student),
    });

    const data = await res.json();
    setSummary(data.summary);

    // 2️⃣ Save AI-generated summary into Supabase table
    const { error } = await supabase
      .from("students")
      .update({ description: data.summary })
      .eq("id", student.id);

    if (error) {
      console.error("Failed to update summary in Supabase:", error.message);
    } else {
      console.log("Summary saved to Supabase successfully!");
    }

    setLoading(false);
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

      {summary && (
        <p className="mt-4 text-gray-700 whitespace-pre-line">{summary}</p>
      )}
    </div>
  );
};

export default StudentSummary;
