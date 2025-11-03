// src/app/dashboard/StudentProfileDisplay.tsx
"use client";
import React from "react";
import { Card, CardContent } from "@/components/card";
import StudentRadarChart from "./StudentRadarChart";
import Image from "next/image";

interface Student {
  id: number;
  name: string | null;
  gender: string | null;
  dob: string | null;
  image_url: string | null;
  description: string | null;
  program: string | null;
  analysis: { [key: string]: number } | null;
}

interface StudentProfileDisplayProps {
  student: Student | null;
  aiSummary: string;
  recommendedCareer: string;
  loading: boolean;
}

const StudentProfileDisplay: React.FC<StudentProfileDisplayProps> = ({
  student,
  aiSummary,
  recommendedCareer,
  loading,
}) => {
  if (!student) {
    return (
      <p className="text-gray-400">Select a student to view their details.</p>
    );
  }

  return (
    <>
      {/* 🔹 Student Basic Info */}
      <Card className="bg-zinc-800 border border-zinc-700 rounded-2xl">
        <CardContent className="p-4 text-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{student.name}</h2>
              <p className="text-gray-400">
                {student.gender} • {student.dob}
              </p>
              <p className="text-gray-400">{student.program}</p>
            </div>
            {student.image_url && (
              <Image
                src={student.image_url}
                alt={student.name || ""}
                width={96}
                height={96}
                className="rounded-full border-4 border-zinc-700 object-cover"
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* 🔹 AI Summary */}
      <Card className="bg-zinc-800 border border-zinc-700 rounded-2xl">
        <CardContent className="p-6 text-gray-100">
          <h3 className="text-lime-400 font-semibold mb-3">
            AI Student Summary{" "}
            {loading && <span className="text-gray-400">(Updating...)</span>}
          </h3>
          <p className="whitespace-pre-line">{aiSummary}</p>
        </CardContent>
      </Card>

      {/* 🔹 Radar Chart & Career Recommendation */}
      {student.analysis && (
        <Card className="bg-zinc-800 border border-zinc-700 rounded-2xl">
          <CardContent className="p-4">
            <StudentRadarChart student={student.analysis} />{" "}
            {/* ✅ changed data → student */}
            <div className="mt-4 text-center">
              <h4 className="text-lime-400 font-semibold mb-1">
                Recommended Career Path:
              </h4>
              <p className="text-white whitespace-pre-line">
                {recommendedCareer}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default StudentProfileDisplay;
