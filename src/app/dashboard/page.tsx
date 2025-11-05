"use client";

import React, { useState, useEffect, useRef } from "react";
import StudentSidebar from "./DashboardSidebar";
import StudentSelector from "./StudentSelector";
import StudentProfileDisplay from "./StudentProfileDisplay";
import { supabase } from "@/services/supabaseClient";
import { Session } from "@supabase/supabase-js";

export interface Student {
  id: number;
  name: string;
  gender: "Male" | "Female" | "Other";
  dob: string;
  image_url: string;
  description: string | null;
  level: string;
  program: string;
  created_at?: string | null;
  cgpa?: string | null;
  programming_score?: string | null;
  design_score?: string | null;
  it_infrastructure_score?: string | null;
  co_curricular_points?: string | null;
  github_url?: string | null;
  linkedin_url?: string | null;
  portfolio_url?: string | null;
  recommended_career?: string | null;
  feedback?: string | null;
  social_media?: string | null;
  last_summary_updated?: string | null;
  last_hash?: string | null;
  feedback_sentiment_score?: number | null;
  professional_engagement_score?: number | null;
}

export default function DashboardPage() {
  const [activeGroup, setActiveGroup] = useState("Degree");
  const [activeProgram, setActiveProgram] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [aiSummary, setAiSummary] = useState<string>("");
  const [recommendedCareer, setRecommendedCareer] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  const prevProgram = useRef<string>("");
  const prevHash = useRef<string>("");

  // ✅ Check session once (for lecturer/admin tool visibility)
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
  }, []);

  // ✅ Fetch and auto-analyze when program changes
  useEffect(() => {
    if (!activeProgram) return;

    const fetchAndAnalyze = async () => {
      try {
        if (prevProgram.current === activeProgram) return;

        const res = await fetch(`/api/students?program=${activeProgram}`);
        if (!res.ok) throw new Error("Failed to fetch students");
        const data: Student[] = await res.json();
        if (!data?.length) return;

        const parsedData = data.map((student) => {
          try {
          } catch {}
          return student;
        });

        setStudents(parsedData);
        const firstStudent = parsedData[0];
        setSelectedStudent(firstStudent);
        if (!firstStudent) return;

        // ✅ Core data for hash check
        const coreDataHash = JSON.stringify({
          cgpa: firstStudent.cgpa ?? "0",
          programming_score: firstStudent.programming_score ?? "0",
          design_score: firstStudent.design_score ?? "0",
          it_infrastructure_score: firstStudent.it_infrastructure_score ?? "0",
          co_curricular_points: firstStudent.co_curricular_points ?? "0",
          feedback_sentiment_score: firstStudent.feedback_sentiment_score ?? 0,
          professional_engagement_score:
            firstStudent.professional_engagement_score ?? 0,
        });

        const now = new Date();
        const lastUpdated = firstStudent.last_summary_updated
          ? new Date(firstStudent.last_summary_updated)
          : null;
        const hoursSinceLast = lastUpdated
          ? (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60)
          : Infinity;

        const hasChanged = coreDataHash !== firstStudent.last_hash;
        const needsRefresh = hasChanged || hoursSinceLast >= 6;

        if (!needsRefresh) {
          setAiSummary(firstStudent.description || "No summary available.");
          setRecommendedCareer(
            firstStudent.recommended_career || "Not available."
          );
          prevProgram.current = activeProgram;
          prevHash.current = coreDataHash;
          return;
        }

        // ✅ Auto regenerate if needed
        await regenerateSummary(firstStudent, coreDataHash);
        prevProgram.current = activeProgram;
        prevHash.current = coreDataHash;
      } catch (error) {
        console.error("Dashboard unified error:", error);
        setAiSummary("❌ Failed to load AI summary.");
        setRecommendedCareer("❌ Failed to load career prediction.");
      }
    };

    fetchAndAnalyze();
  }, [activeProgram]);

  // ✅ Reusable function to refresh AI summary manually or automatically
  const regenerateSummary = async (student: Student, coreDataHash: string) => {
    try {
      setLoading(true);
      setAiSummary("Generating AI summary...");
      setRecommendedCareer("Analyzing career path...");

      const aiRes = await fetch("/api/gemini-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student }),
      });

      const aiData = await aiRes.json();
      const summary = aiData.summary || "No summary generated.";
      const career = aiData.recommendedCareer || "No career generated.";

      const { data: updatedStudent } = await supabase
        .from("students")
        .select("*")
        .eq("id", student.id)
        .single();

      if (updatedStudent) {
        setSelectedStudent(updatedStudent);
        setAiSummary(updatedStudent.description || summary);
        setRecommendedCareer(updatedStudent.recommended_career || career);
      } else {
        setAiSummary(summary);
        setRecommendedCareer(career);
      }

      await supabase
        .from("students")
        .update({
          last_summary_updated: new Date().toISOString(),
          last_hash: coreDataHash,
        })
        .eq("id", student.id);
    } catch (error) {
      console.error("Manual refresh error:", error);
      setAiSummary("❌ Failed to refresh AI summary.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Manual refresh handler
  const handleManualRefresh = async () => {
    if (!selectedStudent) return;
    const coreDataHash = JSON.stringify({
      cgpa: selectedStudent.cgpa ?? "0",
      programming_score: selectedStudent.programming_score ?? "0",
      design_score: selectedStudent.design_score ?? "0",
      it_infrastructure_score: selectedStudent.it_infrastructure_score ?? "0",
      co_curricular_points: selectedStudent.co_curricular_points ?? "0",
      feedback_sentiment_score: selectedStudent.feedback_sentiment_score ?? 0,
      professional_engagement_score:
        selectedStudent.professional_engagement_score ?? 0,
    });
    await regenerateSummary(selectedStudent, coreDataHash);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 animate-fade-in">
      <StudentSidebar
        activeGroup={activeGroup}
        activeProgram={activeProgram}
        onSelectGroup={setActiveGroup}
        onSelectProgram={setActiveProgram}
      />

      <div className="flex-grow min-w-0 space-y-6">
        {selectedStudent ? (
          <>
            {/* ✅ Display student info */}
            <StudentProfileDisplay
              student={selectedStudent}
              aiSummary={aiSummary}
              recommendedCareer={recommendedCareer}
              loading={loading}
            />

            {/* ✅ Refresh button visible only to lecturers/admin */}
            {session && (
              <div className="flex justify-end">
                <button
                  onClick={handleManualRefresh}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Refreshing..." : "🔄 Refresh AI Summary"}
                </button>
              </div>
            )}

            {/* ✅ Student selector */}
            <StudentSelector
              students={students}
              selectedStudentId={selectedStudent?.id || null}
              onSelectStudent={(id) => {
                const found = students.find((s) => s.id === id) || null;
                setSelectedStudent(found);
              }}
            />
          </>
        ) : (
          <p className="text-gray-400">Select a course to view students.</p>
        )}
      </div>
    </div>
  );
}
