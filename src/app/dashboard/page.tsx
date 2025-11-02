"use client";

import React, { useState, useEffect, useRef } from "react";
import StudentSidebar from "./DashboardSidebar";
import StudentSelector from "./StudentSelector";
import StudentProfileDisplay from "./StudentProfileDisplay";
import { supabase } from "@/services/supabaseClient";
import { Session } from "@supabase/supabase-js";

export interface Student {
  id: number;
  name: string | null;
  gender: string | null;
  dob: string | null;
  image_url: string | null;
  description: string | null;
  analysis: { [key: string]: number } | null;
  program: string | null;
  cgpa?: number | null;
  programming_score?: number | null;
  design_score?: number | null;
  it_infrastructure_score?: number | null;
  co_curricular_points?: number | null;
  recommended_career?: string | null;
  last_summary_updated?: string | null;
  last_hash?: string | null;
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

  // ✅ Check session once (for lecturer tools visibility)
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
  }, []);

  // ✅ Program change logic
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
            if (typeof student.analysis === "string")
              student.analysis = JSON.parse(student.analysis);
          } catch {}
          return student;
        });

        setStudents(parsedData);
        const firstStudent = parsedData[0];
        setSelectedStudent(firstStudent);

        if (!firstStudent) return;

        const coreDataHash = JSON.stringify({
          cgpa: firstStudent.cgpa,
          programming_score: firstStudent.programming_score,
          design_score: firstStudent.design_score,
          it_infrastructure_score: firstStudent.it_infrastructure_score,
          co_curricular_points: firstStudent.co_curricular_points,
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

        setLoading(true);
        setAiSummary("Generating AI summary...");
        setRecommendedCareer("Analyzing career path...");

        const aiRes = await fetch("/api/gemini-summary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ student: firstStudent }),
        });

        const aiData = await aiRes.json();
        const summary = aiData.summary || "No summary generated.";
        const career = aiData.recommendedCareer || "No career generated.";

        setAiSummary(summary);
        setRecommendedCareer(career);

        await supabase
          .from("students")
          .update({
            description: summary,
            recommended_career: career,
            last_summary_updated: now.toISOString(),
            last_hash: coreDataHash,
          })
          .eq("id", firstStudent.id);

        prevProgram.current = activeProgram;
        prevHash.current = coreDataHash;
      } catch (error) {
        console.error("Dashboard unified error:", error);
        setAiSummary("❌ Failed to load AI summary.");
        setRecommendedCareer("❌ Failed to load career prediction.");
      } finally {
        setLoading(false);
      }
    };

    fetchAndAnalyze();
  }, [activeProgram]);

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
            <StudentProfileDisplay
              student={selectedStudent}
              aiSummary={aiSummary}
              recommendedCareer={recommendedCareer}
              loading={loading}
            />
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
