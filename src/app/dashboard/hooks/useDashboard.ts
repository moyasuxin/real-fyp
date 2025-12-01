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
  showUpdateToast: boolean;
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
  const [showUpdateToast, setShowUpdateToast] = useState(false);

  const prevProgram = useRef<string>("");
  const prevHash = useRef<string>("");
  const prevStudentId = useRef<number | null>(null);

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
        prevStudentId.current = firstStudent.id;

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

  // ✅ Load/refresh AI summary when the selected student's data changes
  useEffect(() => {
    if (!selectedStudent) return;

    const loadStudentSummary = async () => {
      try {
        setLoading(true);
        // Track current student id
        prevStudentId.current = selectedStudent.id;

        // ✅ Core data for hash check
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

        const now = new Date();
        const lastUpdated = selectedStudent.last_summary_updated
          ? new Date(selectedStudent.last_summary_updated)
          : null;
        const hoursSinceLast = lastUpdated
          ? (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60)
          : Infinity;

        const hasChanged = coreDataHash !== selectedStudent.last_hash;
        const needsRefresh = hasChanged || hoursSinceLast >= 6;

        if (!needsRefresh && selectedStudent.description) {
          setAiSummary(selectedStudent.description || "No summary available.");
          setRecommendedCareer(
            selectedStudent.recommended_career || "Not available."
          );
          prevHash.current = coreDataHash;
          return;
        }

        // ✅ Auto regenerate if needed or missing
        await performSummaryRegeneration(selectedStudent, coreDataHash);
        prevHash.current = coreDataHash;
      } catch (error) {
        console.error("Student summary load error:", error);
        setAiSummary("❌ Failed to load AI summary.");
        setRecommendedCareer("❌ Failed to load career prediction.");
      } finally {
        setLoading(false);
      }
    };

    loadStudentSummary();
  }, [selectedStudent]);

  // ✅ Realtime: Update the selected student when their row changes in Supabase
  useEffect(() => {
    const id = selectedStudent?.id;
    if (!id) return;

    const channel = supabase
      .channel(`students-updates-${id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'students',
          filter: `id=eq.${id}`,
        },
        (payload) => {
          const newStudent = payload.new as Student;
          // Replace selected student with the updated values
          setSelectedStudent(newStudent);
          
          // Show toast notification
          setShowUpdateToast(true);
          setTimeout(() => setShowUpdateToast(false), 3000);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedStudent?.id]);

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

  // ✅ Manual refresh handler (now also triggers ML retrain)
  const regenerateSummary = async () => {
    if (!selectedStudent) return;
    
    try {
      setLoading(true);
      setAiSummary("Waking up ML service and retraining model...");
      
      // Wake up Render service if it's asleep (can take 30-50 seconds on free tier)
      try {
        await fetch(process.env.NEXT_PUBLIC_ML_API_URL || "https://real-fyp.onrender.com/health", {
          method: "GET",
        });
      } catch {
        // Ignore wake-up errors, main request will handle it
      }
      
      setAiSummary("Retraining ML model with latest data...");
      
      // First, retrain the ML model to update all scores
      const mlRes = await fetch(`/api/ml/retrain?studentId=${selectedStudent.id}`, {
        method: "POST",
      });
      
      if (!mlRes.ok) {
        const errorText = await mlRes.text();
        console.error("ML retrain failed:", errorText);
        throw new Error("ML retrain failed - check console for details");
      }
      
      const mlResult = await mlRes.json();
      console.log("ML retrain result:", mlResult);
      
      if (mlResult.ml_error) {
        console.warn("ML prediction had errors:", mlResult.ml_error);
        // Continue anyway - we might still have updated GPA
      }
      
      // Wait a moment for database to update
      await new Promise(r => setTimeout(r, 500));
      
      // Fetch the updated student data with new ML scores (force fresh query)
      const { data: updatedStudent, error: fetchError } = await supabase
        .from("students")
        .select("*")
        .eq("id", selectedStudent.id)
        .single();
      
      if (fetchError || !updatedStudent) {
        console.error("Failed to fetch updated student:", fetchError);
        throw new Error("Failed to fetch updated student data");
      }
      
      console.log("Updated student scores:", {
        programming: updatedStudent.programming_score,
        design: updatedStudent.design_score,
        infrastructure: updatedStudent.it_infrastructure_score,
        cocurricular: updatedStudent.co_curricular_points,
        feedback: updatedStudent.feedback_sentiment_score,
        professional: updatedStudent.professional_engagement_score,
      });
      
      // Update local state with fresh data
      setSelectedStudent(updatedStudent);
      
      // Now regenerate AI summary with updated scores
      const coreDataHash = JSON.stringify({
        cgpa: updatedStudent.cgpa ?? "0",
        programming_score: updatedStudent.programming_score ?? "0",
        design_score: updatedStudent.design_score ?? "0",
        it_infrastructure_score: updatedStudent.it_infrastructure_score ?? "0",
        co_curricular_points: updatedStudent.co_curricular_points ?? "0",
        feedback_sentiment_score: updatedStudent.feedback_sentiment_score ?? 0,
        professional_engagement_score:
          updatedStudent.professional_engagement_score ?? 0,
      });
      
      await performSummaryRegeneration(updatedStudent, coreDataHash);
    } catch (error) {
      console.error("Refresh error:", error);
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      setAiSummary(`❌ Failed to refresh: ${errorMsg}`);
      setLoading(false);
    }
  };

  return {
    students,
    selectedStudent,
    aiSummary,
    recommendedCareer,
    loading,
    pageLoading,
    showUpdateToast,
    setSelectedStudent,
    regenerateSummary,
  };
}
