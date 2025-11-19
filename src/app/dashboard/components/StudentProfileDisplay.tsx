"use client";
import React from "react";
import { Card, CardContent } from "@/components/card";
import StudentRadarChart from "./StudentRadarChart";
import LecturerComments from "./LecturerComments";
import Image from "next/image";
import type { Student } from "../types";

interface StudentProfileDisplayProps {
  student: Student | null;
  aiSummary: string;
  recommendedCareer: string;
  loading: boolean;
  currentUserId?: string | null;
  currentUserName?: string | null;
  isAuthenticated?: boolean;
}

const StudentProfileDisplay: React.FC<StudentProfileDisplayProps> = ({
  student,
  aiSummary,
  recommendedCareer,
  loading,
  currentUserId = null,
  currentUserName = null,
  isAuthenticated = false,
}) => {
  if (!student) {
    return (
      <p className="text-gray-400">Select a student to view their details.</p>
    );
  }

  const safeStudentData = {
    programming_score: student.programming_score ?? undefined,
    design_score: student.design_score ?? undefined,
    it_infrastructure_score: student.it_infrastructure_score ?? undefined,
    co_curricular_points: student.co_curricular_points ?? undefined,
    feedback_sentiment_score: student.feedback_sentiment_score ?? undefined,
    professional_engagement_score:
      student.professional_engagement_score ?? undefined,
  };

  return (
    <>
      {/* Student Basic Info */}
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

      {/* AI Summary & Lecturer Comments */}
      <Card className="bg-zinc-800 border border-zinc-700 rounded-2xl">
        <CardContent className="p-6 text-gray-100 max-h-[600px] overflow-y-auto">
          <h3 className="text-lime-400 font-semibold mb-3">
            AI Student Summary{" "}
            {loading && <span className="text-gray-400">(Updating...)</span>}
          </h3>
          <p className="whitespace-pre-line mb-6">{aiSummary}</p>

          {isAuthenticated && (
            <div className="mt-6 pt-6 border-t border-zinc-700">
              <LecturerComments
                studentId={student.id}
                currentUserId={currentUserId}
                currentUserName={currentUserName}
                isAuthenticated={isAuthenticated}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Radar Chart & Career Recommendation */}
      <Card className="bg-zinc-800 border border-zinc-700 rounded-2xl">
        <CardContent className="p-4">
          <StudentRadarChart student={safeStudentData} />
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
    </>
  );
};

export default StudentProfileDisplay;
