// src/app/dashboard/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import StudentSidebar from "./DashboardSidebar";
import StudentStats from "./StudentStats";

// 🧩 Define the Student interface (matches Supabase 'students' table)
interface Student {
  id: number;
  name: string | null;
  gender: string | null;
  dob: string | null;
  image_url: string | null;
  description: string | null;
  analysis: Record<string, unknown> | null; // if it's JSONB, we use Record<string, unknown>
  level: string | null;
  program: string | null;
  cgpa: string | null;
  programming_score: string | null;
  design_score: string | null;
  it_infrastructure_score: string | null;
  co_curricular_points: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  portfolio_url: string | null;
  created_at: string | null;
}

export default function DashboardPage() {
  const [activeGroup, setActiveGroup] = useState("Degree");
  const [activeProgram, setActiveProgram] = useState(""); // default empty
  const [students, setStudents] = useState<Student[]>([]); // ✅ fixed type

  useEffect(() => {
    if (!activeProgram) return;

    async function fetchStudents() {
      try {
        const res = await fetch(`/api/students?program=${activeProgram}`);
        if (!res.ok) throw new Error("Failed to fetch students");
        const data: Student[] = await res.json();
        setStudents(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchStudents();
  }, [activeProgram]);

  return (
    <div className="flex flex-col lg:flex-row gap-4 animate-fade-in">
      <StudentSidebar
        activeGroup={activeGroup}
        activeProgram={activeProgram}
        onSelectGroup={setActiveGroup}
        onSelectProgram={setActiveProgram}
      />

      <div className="flex-grow min-w-0">
        <div className="bg-zinc-800/80 backdrop-blur-sm border border-zinc-700/80 rounded-2xl shadow-2xl p-px overflow-hidden">
          <div className="relative bg-zinc-900/80 rounded-2xl p-6">
            <StudentStats students={students} />
          </div>
        </div>
      </div>
    </div>
  );
}
