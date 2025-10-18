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
  description: string | null;
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
  const prevStudentData = useRef<Student | null>(null); // to track changes

  // 🟢 1. Fetch all students for selected program
  useEffect(() => {
    if (!activeProgram) return;
    if (!activeProgram) return;
    const interval = setInterval(() => {
      fetch(`/api/students?program=${activeProgram}`)
        .then((res) => res.json())
        .then((data: Student[]) => setStudents(data));
    }, 5000); // refresh every 5 seconds

    return () => clearInterval(interval);
  }, [activeProgram]);

  // 🟢 2. Check for missing or changed data → auto generate summary
  useEffect(() => {
    if (!selectedStudent) return;

    async function generateSummaryIfNeeded(student: Student) {
      const prev = prevStudentData.current;

      const dataChanged =
        !prev ||
        prev.cgpa !== student.cgpa ||
        prev.cocu !== student.cocu ||
        prev.feedback !== student.feedback ||
        prev.social_media !== student.social_media;

      if (
        !student.description ||
        student.description.trim() === "" ||
        dataChanged
      ) {
        console.log("🧠 Generating/updating AI summary for:", student.name);

        const res = await fetch("/api/gemini-summary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ student }),
        });

        const data = await res.json();

        if (data.summary) {
          setAiSummary(data.summary);

          await fetch("/api/update-summary", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: student.id,
              description: data.summary,
            }),
          });

          setSelectedStudent((prev) =>
            prev ? { ...prev, description: data.summary } : prev
          );
        } else {
          setAiSummary("No summary generated.");
        }
      } else {
        setAiSummary(student.description);
      }

      prevStudentData.current = student;
    }

    // Pass as parameter (so TS knows it’s non-null)
    generateSummaryIfNeeded(selectedStudent);
  }, [selectedStudent]);

  // 🟢 3. Main Dashboard UI
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
                  {students
                    .filter((s) => s.id !== selectedStudent.id)
                    .map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setSelectedStudent(s)}
                        className="flex flex-col items-center bg-zinc-900 p-3 rounded-lg hover:bg-zinc-700 transition"
                      >
                        {s.image_url && (
                          <img
                            src={s.image_url}
                            alt={s.name || ""}
                            className="w-16 h-16 rounded-full object-cover border border-zinc-700"
                          />
                        )}
                        <p className="mt-2 text-white font-semibold text-sm">
                          {s.name}
                        </p>
                      </button>
                    ))}
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <p className="text-gray-400">Select a course to view students.</p>
        )}
      </div>
    </div>
  );
}
