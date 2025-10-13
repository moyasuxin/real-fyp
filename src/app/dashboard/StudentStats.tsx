// src/app/dashboard/StudentStats.tsx
"use client";
import React from "react";
import { Card, CardContent } from "@/components/card";

// 🧩 Match Supabase fields (no more mismatch)
interface Student {
  id: number;
  name: string | null;
  program: string | null;
  cgpa: string | null; // stored as text in DB
  co_curricular_points: string | null; // also text
}

interface StudentStatsProps {
  students: Student[];
}

const StudentStats: React.FC<StudentStatsProps> = ({ students }) => {
  // Convert safely to numbers (since DB stores them as text)
  const parsedStudents = students.map((s) => ({
    ...s,
    cgpa: parseFloat(s.cgpa || "0"),
    co_curricular_points: parseFloat(s.co_curricular_points || "0"),
  }));

  const stats = [
    { label: "Active Students", value: parsedStudents.length },
    {
      label: "Graduates",
      value: parsedStudents.filter((s) => s.cgpa >= 2.5).length,
    },
    {
      label: "Average Performance",
      value:
        parsedStudents.length > 0
          ? (
              parsedStudents.reduce((acc, s) => acc + s.cgpa, 0) /
              parsedStudents.length
            ).toFixed(2)
          : "0",
    },
    {
      label: "Engagement Rate",
      value:
        parsedStudents.length > 0
          ? `${(
              (parsedStudents.filter((s) => s.co_curricular_points > 0).length /
                parsedStudents.length) *
              100
            ).toFixed(0)}%`
          : "0%",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {stats.map((s, i) => (
        <Card key={i} className="shadow-md hover:shadow-lg transition">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-gray-500">{s.label}</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">{s.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StudentStats;
