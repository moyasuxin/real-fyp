// src/app/dashboard/StudentStats.tsx
"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

// Temporary interface for dummy data (replace with real type later)
interface StudentProfile {
  id: number;
  name: string;
  program: string;
  cgpa: number;
  coCurricularPoints: number;
}

interface StudentStatsProps {
  students: StudentProfile[];
}

const StudentStats: React.FC<StudentStatsProps> = ({ students }) => {
  const stats = [
    { label: "Active Students", value: students.length },
    { label: "Graduates", value: students.filter((s) => s.cgpa >= 2.5).length },
    {
      label: "Average Performance",
      value:
        students.length > 0
          ? (
              students.reduce((acc, s) => acc + (s.cgpa || 0), 0) /
              students.length
            ).toFixed(2)
          : "0",
    },
    {
      label: "Engagement Rate",
      value:
        students.length > 0
          ? `${(
              (students.filter((s) => s.coCurricularPoints > 0).length /
                students.length) *
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
