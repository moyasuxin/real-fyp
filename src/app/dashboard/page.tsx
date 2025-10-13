// src/app/dashboard/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import StudentSidebar from "./DashboardSidebar";
import StudentRadarChart from "./StudentRadarChart";
import { Card, CardContent } from "@/components/card";

interface Student {
  id: number;
  name: string | null;
  gender: string | null;
  dob: string | null;
  image_url: string | null;
  description: string | null;
  analysis: {
    [key: string]: number;
  } | null;
  program: string | null;
}

export default function DashboardPage() {
  const [activeGroup, setActiveGroup] = useState("Degree");
  const [activeProgram, setActiveProgram] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [aiSummary, setAiSummary] = useState<string>("Loading AI summary...");

  // Fetch all students for selected program
  useEffect(() => {
    if (!activeProgram) return;

    async function fetchStudents() {
      try {
        const res = await fetch(`/api/students?program=${activeProgram}`);
        if (!res.ok) throw new Error("Failed to fetch students");
        const data: Student[] = await res.json();
        setStudents(data);
        setSelectedStudent(data[0] || null); // auto-select first student
      } catch (error) {
        console.error(error);
      }
    }

    fetchStudents();
  }, [activeProgram]);

  // Fetch Gemini AI summary for selected student
  useEffect(() => {
    if (!selectedStudent) return;

    async function getAiSummary() {
      try {
        const res = await fetch("/api/gemini-summary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(selectedStudent),
        });
        const data = await res.json();
        setAiSummary(data.summary);
      } catch (error) {
        console.error("AI summary error:", error);
        setAiSummary("Failed to load AI summary.");
      }
    }

    getAiSummary();
  }, [selectedStudent]);

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
                <h3 className="font-semibold text-lime-400 mb-2">AI Summary</h3>
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
