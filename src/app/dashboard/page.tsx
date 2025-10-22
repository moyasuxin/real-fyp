// src/app/dashboard/page.tsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import StudentSidebar from "./DashboardSidebar";
import StudentRadarChart from "./StudentRadarChart";
import { Card, CardContent } from "@/components/card";
import { supabase } from "@/services/supabaseClient";

interface Comment {
  commenter: string;
  content: string;
  created_at: string;
}

interface Student {
  id: number;
  name: string | null;
  gender: string | null;
  dob: string | null;
  image_url: string | null;
  description: string | null; // AI Summary
  analysis: { [key: string]: number } | null;
  program: string | null;
  cgpa?: number | null;
  cocu?: string | null;
  feedback?: string | null;
  social_media?: string | null;
  programming_score?: string | null;
  design_score?: string | null;
  it_infrastructure_score?: string | null;
  co_curricular_points?: string | null;
  github_url?: string | null;
  linkedin_url?: string | null;
  portfolio_url?: string | null;
}

export default function DashboardPage() {
  const [activeGroup, setActiveGroup] = useState("Degree");
  const [activeProgram, setActiveProgram] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [aiSummary, setAiSummary] = useState<string>("Loading AI summary...");
  const [recommendedCareer, setRecommendedCareer] =
    useState<string>("Loading...");
  const [comments, setComments] = useState<Comment[]>([]);
  const prevStudentData = useRef<Student | null>(null);

  // 🟢 Fetch students for selected program
  useEffect(() => {
    if (!activeProgram) return;
    async function fetchStudents() {
      try {
        const res = await fetch(`/api/students?program=${activeProgram}`);
        if (!res.ok) throw new Error("Failed to fetch students");
        const data: Student[] = await res.json();

        const parsedData = data.map((student) => {
          let analysisObj = null;
          try {
            analysisObj =
              typeof student.analysis === "string"
                ? JSON.parse(student.analysis)
                : student.analysis;
          } catch (e) {
            console.error("Failed to parse analysis for", student.name, e);
          }
          return { ...student, analysis: analysisObj };
        });

        setStudents(parsedData);
        setSelectedStudent(parsedData[0] || null);
      } catch (error) {
        console.error(error);
      }
    }
    fetchStudents();
  }, [activeProgram]);

  // 🧠 AI Summary
  useEffect(() => {
    async function fetchSummary() {
      if (!selectedStudent) return;
      setAiSummary("Loading AI summary...");

      try {
        const res = await fetch("/api/gemini-summary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(selectedStudent),
        });

        const data = await res.json();
        const summary = data.summary || "No summary generated.";
        setAiSummary(summary);

        await supabase
          .from("students")
          .update({ description: summary })
          .eq("id", selectedStudent.id);
      } catch (err) {
        console.error("AI Summary Error:", err);
        setAiSummary("Failed to load AI summary.");
      }
    }

    if (
      !prevStudentData.current ||
      prevStudentData.current.id !== selectedStudent?.id
    ) {
      fetchSummary();
      prevStudentData.current = selectedStudent;
    }
  }, [selectedStudent]);

  // 🧩 AI Career Recommendation
  useEffect(() => {
    async function fetchCareerRecommendation() {
      if (!selectedStudent) return;
      setRecommendedCareer("Analyzing data...");

      try {
        const res = await fetch("/api/gemini-career", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            student: selectedStudent,
            comments, // future unstructured input
          }),
        });

        const data = await res.json();
        const recommendation =
          data.recommendation || "No career recommendation generated.";
        setRecommendedCareer(recommendation);

        // Save to Supabase (optional if you have a column for it)
        await supabase
          .from("students")
          .update({ recommended_career: recommendation })
          .eq("id", selectedStudent.id);
      } catch (err) {
        console.error("Career Recommendation Error:", err);
        setRecommendedCareer("Failed to generate career recommendation.");
      }
    }

    fetchCareerRecommendation();
  }, [selectedStudent, comments]);

  // 🟢 UI
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
            {/* Student Info */}
            <Card className="bg-zinc-800 border border-zinc-700 rounded-2xl">
              <CardContent className="p-6 text-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">
                      {selectedStudent.name}
                    </h2>
                    <p className="text-gray-400">
                      {selectedStudent.gender} • {selectedStudent.dob}
                    </p>
                    <p className="text-gray-400">{selectedStudent.program}</p>
                  </div>
                  {selectedStudent.image_url && (
                    <img
                      src={selectedStudent.image_url}
                      alt={selectedStudent.name || ""}
                      className="w-24 h-24 rounded-full border-4 border-zinc-700 object-cover"
                    />
                  )}
                </div>
              </CardContent>
            </Card>

            {/* AI Summary */}
            <Card className="bg-zinc-800 border border-zinc-700 rounded-2xl">
              <CardContent className="p-6 text-gray-100">
                <h3 className="text-lime-400 font-semibold mb-3">
                  AI Student Summary
                </h3>
                <p className="whitespace-pre-line">{aiSummary}</p>
              </CardContent>
            </Card>

            {/* Radar Chart + AI Career */}
            {selectedStudent.analysis && (
              <Card className="bg-zinc-800 border border-zinc-700 rounded-2xl">
                <CardContent className="p-6">
                  <StudentRadarChart data={selectedStudent.analysis} />
                  <div className="mt-4 text-center">
                    <h4 className="text-lime-400 font-semibold mb-1">
                      Recommended Career Path (AI Analysis):
                    </h4>
                    <p className="text-white whitespace-pre-line">
                      {recommendedCareer}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <p className="text-gray-400">Select a course to view students.</p>
        )}
      </div>
    </div>
  );
}
