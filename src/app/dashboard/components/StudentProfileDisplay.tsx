"use client";
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Loader";
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
      <Card className="glass border-white/20">
        <CardContent>
          <div className="text-center py-12 text-white/60">
            <svg
              className="w-16 h-16 mx-auto mb-4 opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <p className="text-lg font-medium">No student selected</p>
            <p className="text-sm mt-1">
              Select a student to view their details
            </p>
          </div>
        </CardContent>
      </Card>
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
      <Card className="glass border-white/20 hover:border-white/30 transition-colors">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-3xl font-bold text-white">
                  {student.name}
                </h2>
                <Badge variant="primary" size="md">
                  {student.program}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-2 text-white/70">
                <div className="flex items-center gap-1.5">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  {student.gender}
                </div>
                <span className="text-white/30">•</span>
                <div className="flex items-center gap-1.5">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {student.dob}
                </div>
                {student.cgpa && (
                  <>
                    <span className="text-white/30">•</span>
                    <Badge
                      variant={
                        parseFloat(student.cgpa.toString()) >= 3.5
                          ? "success"
                          : parseFloat(student.cgpa.toString()) >= 3.0
                          ? "primary"
                          : "warning"
                      }
                    >
                      CGPA: {parseFloat(student.cgpa.toString()).toFixed(2)}
                    </Badge>
                  </>
                )}
              </div>
            </div>
            {student.image_url && (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-full blur-md opacity-50"></div>
                <Image
                  src={student.image_url}
                  alt={student.name || ""}
                  width={120}
                  height={120}
                  className="relative rounded-full border-4 border-white/30 object-cover shadow-xl"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* AI Summary & Lecturer Comments */}
      <Card className="glass border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            AI Student Summary
            {loading && (
              <div className="flex items-center gap-2 ml-auto">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span className="text-sm text-white/60">Updating...</span>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="max-h-[600px] overflow-y-auto scrollbar-custom">
          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : (
            <p className="whitespace-pre-line text-white/90 leading-relaxed">
              {aiSummary}
            </p>
          )}

          {isAuthenticated && (
            <div className="mt-6 pt-6 border-t border-white/20">
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
      <Card className="glass border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            Performance Analysis
            {loading && (
              <div className="flex items-center gap-2 ml-auto">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-white/60">Refreshing...</span>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <StudentRadarChart student={safeStudentData} />
          <div className="mt-6 p-4 glass rounded-xl border border-white/20">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-lg">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                  Recommended Career Path
                  <Badge variant="success" size="sm">
                    AI Generated
                  </Badge>
                </h4>
                <p className="text-white/80 whitespace-pre-line leading-relaxed">
                  {recommendedCareer}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default StudentProfileDisplay;
