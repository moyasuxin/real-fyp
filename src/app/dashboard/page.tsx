// src/app/dashboard/page.tsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import StudentSidebar from "./DashboardSidebar";
import StudentRadarChart from "./StudentRadarChart";
import { Card, CardContent } from "@/components/card";
import { supabase } from "@/services/supabaseClient";

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
}

export default function DashboardPage() {
  const [activeGroup, setActiveGroup] = useState("Degree");
  const [activeProgram, setActiveProgram] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [aiSummary, setAiSummary] = useState<string>("Loading AI summary...");
  const [recommendedCareer, setRecommendedCareer] = useState<string>("");
  const prevStudentData = useRef<Student | null>(null);

  // 🟢 Fetch students for selected program
  useEffect(() => {
    if (!activeProgram) return;
    async function fetchStudents() {
      try {
        const res = await fetch(`/api/students?program=${activeProgram}`);
        if (!res.ok) throw new Error("Failed to fetch students");
        const data: Student[] = await res.json();

        // Safely parse JSON analysis
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

  // 🧠 Handle AI Summary (uses stored description first)
  useEffect(() => {
    async function fetchSummary() {
      if (!selectedStudent) return;

      // Use description from DB if exists
      if (
        selectedStudent.description &&
        selectedStudent.description.trim() !== "" &&
        selectedStudent.description.trim() !== "No summary generated."
      ) {
        setAiSummary(selectedStudent.description);
      } else {
        setAiSummary("Loading AI summary...");
      }

      // ✅ Only generate a new summary if there’s new student data (e.g., feedback/cocu/social changes)
      try {
        const res = await fetch("/api/gemini-summary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ student: selectedStudent }),
        });

        if (!res.ok) throw new Error("Failed to get AI summary");
        const data = await res.json();
        console.log("Gemini response:", data);

        const summary = data.summary || "No summary generated.";
        setAiSummary(summary);

        // 📝 Update the database description if it's different
        if (summary !== selectedStudent.description) {
          await supabase
            .from("students")
            .update({ description: summary })
            .eq("id", selectedStudent.id);
        }
      } catch (err) {
        console.error("AI Summary Error:", err);
        setAiSummary(
          selectedStudent.description || "Failed to load AI summary."
        );
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

  // 🎯 Generate Recommended Career based on radar data
  useEffect(() => {
    if (!selectedStudent?.analysis) {
      setRecommendedCareer("");
      return;
    }

    const analysis = selectedStudent.analysis;
    const topSkill = Object.keys(analysis).reduce((a, b) =>
      analysis[a] > analysis[b] ? a : b
    );

    const recommendations: Record<string, string> = {
      programming: "Software Engineer / Full Stack Developer",
      design: "UI/UX Designer / Graphic Designer",
      it_infrastructure: "Network Engineer / DevOps Specialist",
      communication: "Project Manager / Team Lead",
      research: "Data Analyst / Research Scientist",
    };

    setRecommendedCareer(
      recommendations[topSkill.toLowerCase()] || "General IT Professional"
    );
  }, [selectedStudent]);

  // 🟢 Main UI
  return (
    <div className="flex flex-col lg:flex-row gap-4 animate-fade-in">
      {/* Sidebar */}
      <StudentSidebar
        activeGroup={activeGroup}
        activeProgram={activeProgram}
        onSelectGroup={setActiveGroup}
        onSelectProgram={setActiveProgram}
      />

      {/* Main Dashboard */}
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

            {/* Radar Chart */}
            {selectedStudent.analysis && (
              <Card className="bg-zinc-800 border border-zinc-700 rounded-2xl">
                <CardContent className="p-6">
                  <StudentRadarChart data={selectedStudent.analysis} />
                  {recommendedCareer && (
                    <div className="mt-4 text-center">
                      <h4 className="text-lime-400 font-semibold mb-1">
                        Recommended Career Path:
                      </h4>
                      <p className="text-white">{recommendedCareer}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Other Students */}
            <Card className="bg-zinc-800 border border-zinc-700 rounded-2xl">
              <CardContent className="p-6 text-gray-100">
                <h3 className="font-semibold text-lime-400 mb-3">
                  Other Students in {activeProgram}
                </h3>

                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {students.map((s) => {
                    const isSelected = s.id === selectedStudent?.id;
                    return (
                      <button
                        key={s.id}
                        onClick={() => setSelectedStudent(s)}
                        className={`flex flex-col items-center p-3 rounded-lg transition border
                          ${
                            isSelected
                              ? "bg-lime-600/30 border-lime-400"
                              : "bg-zinc-900 border-zinc-700 hover:bg-zinc-700"
                          }`}
                      >
                        {s.image_url && (
                          <img
                            src={s.image_url}
                            alt={s.name || ""}
                            className={`w-16 h-16 rounded-full object-cover border 
                              ${
                                isSelected
                                  ? "border-lime-400"
                                  : "border-zinc-700"
                              }`}
                          />
                        )}
                        <p
                          className={`mt-2 font-semibold text-sm ${
                            isSelected ? "text-lime-300" : "text-white"
                          }`}
                        >
                          {s.name}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </>
        ) : students.length === 0 && activeProgram ? (
          <p className="text-gray-400">
            No students found for {activeProgram}.
          </p>
        ) : (
          <p className="text-gray-400">Select a course to view students.</p>
        )}
      </div>
    </div>
  );
}
