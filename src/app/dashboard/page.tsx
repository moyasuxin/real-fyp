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
  const [pageLoading, setPageLoading] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const prevProgram = useRef<string>("");
  const prevHash = useRef<string>("");

  // ✅ Check session once (for lecturer/admin tool visibility)
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session?.user) {
        // Fetch user details from admin_users table
        supabase
          .from("admin_users")
          .select("id, username, email")
          .eq("id", data.session.user.id)
          .single()
          .then(({ data: userData }) => {
            if (userData) {
              setCurrentUser({
                id: userData.id,
                name: userData.username || userData.email || "Admin",
              });
            }
          });
      }
    });
  }, []);

  // ✅ Fetch and auto-analyze when program changes
  useEffect(() => {
    if (!activeProgram) return;

    const fetchAndAnalyze = async () => {
      try {
        setPageLoading(true);
        setSelectedStudent(null);
        setAiSummary("");
        setRecommendedCareer("");

        const res = await fetch(`/api/students?program=${activeProgram}`);
        if (!res.ok) throw new Error("Failed to fetch students");
        const data: Student[] = await res.json();

        if (!data?.length) {
          setStudents([]);
          setPageLoading(false);
          prevProgram.current = activeProgram;
          return;
        }

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
      } finally {
        setPageLoading(false);
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

      console.log("🔄 Calling Gemini Summary API for student:", student.name);

      const aiRes = await fetch("/api/gemini-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student }),
      });

      console.log("API Response status:", aiRes.status);

      if (!aiRes.ok) {
        const errorData = await aiRes.json();
        console.error("❌ Gemini Summary API failed:", errorData);
        throw new Error(
          errorData.details || errorData.error || "API request failed"
        );
      }

      const aiData = await aiRes.json();
      console.log("✅ API Response received:", {
        summaryLength: aiData.summary?.length || 0,
        career: aiData.recommendedCareer,
      });

      const summary = aiData.summary || "No summary generated.";
      const career = aiData.recommendedCareer || "No career generated.";

      // Fetch the updated student from database
      const { data: updatedStudent } = await supabase
        .from("students")
        .select("*")
        .eq("id", student.id)
        .single();

      if (updatedStudent) {
        setSelectedStudent(updatedStudent);
        setAiSummary(updatedStudent.description || summary);
        setRecommendedCareer(updatedStudent.recommended_career || career);
        console.log("📊 Updated from database:", {
          description: updatedStudent.description?.substring(0, 50) + "...",
          career: updatedStudent.recommended_career,
        });
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
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      setAiSummary(`❌ Failed to refresh AI summary: ${errorMsg}`);
      setRecommendedCareer("❌ Generation failed");
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
        {pageLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[500px] space-y-4">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400 animate-pulse">
              Loading student data...
            </p>
          </div>
        ) : selectedStudent ? (
          <>
            {/* ✅ Display student info */}
            <StudentProfileDisplay
              student={selectedStudent}
              aiSummary={aiSummary}
              recommendedCareer={recommendedCareer}
              loading={loading}
              currentUserId={currentUser?.id || null}
              currentUserName={currentUser?.name || null}
              isAuthenticated={!!session}
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
        ) : students.length === 0 && activeProgram ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] space-y-4">
            <div className="text-6xl">📭</div>
            <p className="text-gray-400 text-lg">
              No students found in this program.
            </p>
            <p className="text-gray-500 text-sm">
              Try selecting a different program from the sidebar.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[300px] space-y-4">
            <div className="text-6xl">👈</div>
            <p className="text-gray-400 text-lg">
              Select a program to view students.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
