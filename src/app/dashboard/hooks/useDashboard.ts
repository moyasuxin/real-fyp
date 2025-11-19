"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/services/supabaseClient";
import type { Student } from "../types";

interface UseDashboardProps {
  activeProgram: string;
}

interface UseDashboardReturn {
  students: Student[];
  selectedStudent: Student | null;
  aiSummary: string;
  recommendedCareer: string;
  loading: boolean;
  pageLoading: boolean;
  setSelectedStudent: (student: Student | null) => void;
  regenerateSummary: () => Promise<void>;
}

export function useDashboard({
  activeProgram,
}: UseDashboardProps): UseDashboardReturn {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [aiSummary, setAiSummary] = useState<string>("");
  const [recommendedCareer, setRecommendedCareer] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);

  const prevProgram = useRef<string>("");
  const prevHash = useRef<string>("");

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

        const parsedData = data.map((student) => student);
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
        await performSummaryRegeneration(firstStudent, coreDataHash);
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

  // ✅ Reusable function to refresh AI summary
  const performSummaryRegeneration = async (
    student: Student,
    coreDataHash: string
  ) => {
    try {
      setLoading(true);
      setAiSummary("Generating AI summary...");
      setRecommendedCareer("Analyzing career path...");

      const aiRes = await fetch("/api/gemini-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student }),
      });

      if (!aiRes.ok) {
        const errorData = await aiRes.json();
        throw new Error(
          errorData.details || errorData.error || "API request failed"
        );
      }

      const aiData = await aiRes.json();
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
      console.error("Summary regeneration error:", error);
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      setAiSummary(`❌ Failed to refresh AI summary: ${errorMsg}`);
      setRecommendedCareer("❌ Generation failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Manual refresh handler
  const regenerateSummary = async () => {
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
    await performSummaryRegeneration(selectedStudent, coreDataHash);
  };

  return {
    students,
    selectedStudent,
    aiSummary,
    recommendedCareer,
    loading,
    pageLoading,
    setSelectedStudent,
    regenerateSummary,
  };
}
