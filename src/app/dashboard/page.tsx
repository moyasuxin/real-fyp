"use client";

import React, { useState, useEffect } from "react";
import {
  DashboardSidebar,
  StudentSelector,
  StudentProfileDisplay,
} from "./components";
import { useDashboard } from "./hooks";
import { supabase } from "@/services/supabaseClient";
import { Session } from "@supabase/supabase-js";

export default function DashboardPage() {
  const [activeGroup, setActiveGroup] = useState("Degree");
  const [activeProgram, setActiveProgram] = useState("");
  const [session, setSession] = useState<Session | null>(null);
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    name: string;
    role: string;
  } | null>(null);

  // Use custom hook for dashboard logic
  const {
    students,
    selectedStudent,
    aiSummary,
    recommendedCareer,
    loading,
    pageLoading,
    showUpdateToast,
    setSelectedStudent,
    regenerateSummary,
  } = useDashboard({ activeProgram });

  // ✅ Check session once (for lecturer/admin tool visibility)
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session?.user) {
        // Fetch user details from admin_users table
        supabase
          .from("admin_users")
          .select("id, username, email, role")
          .eq("id", data.session.user.id)
          .single()
          .then(({ data: userData }) => {
            if (userData) {
              setCurrentUser({
                id: userData.id,
                name: userData.username || userData.email || "Admin",
                role: userData.role || "lecturer",
              });
            }
          });
      }
    });
  }, []);

  // ✅ Manual refresh handler
  const handleManualRefresh = async () => {
    await regenerateSummary();
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 animate-fade-in">
      {/* Toast Notification */}
      {showUpdateToast && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in">
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg shadow-2xl flex items-center gap-3">
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
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="font-medium">✅ Scores updated successfully</span>
          </div>
        </div>
      )}

      <DashboardSidebar
        activeGroup={activeGroup}
        activeProgram={activeProgram}
        onSelectGroup={setActiveGroup}
        onSelectProgram={setActiveProgram}
      />

      <div className="flex-grow min-w-0 space-y-6">
        {pageLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[500px] space-y-4">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-white/80 animate-pulse">
              Loading student data...
            </p>
          </div>
        ) : selectedStudent ? (
          <>
            {/* ✅ Display student info */}
            <StudentProfileDisplay
              student={selectedStudent}
              aiSummary={aiSummary}
              recommendedCareer={recommendedCareer}
              loading={loading}
              currentUserId={currentUser?.id || null}
              currentUserName={currentUser?.name || null}
              isAuthenticated={!!session}
            />

            {/* ✅ Refresh button visible only to admins */}
            {session && currentUser?.role === "admin" && (
              <div className="flex justify-end">
                <button
                  onClick={handleManualRefresh}
                  disabled={loading}
                  className="px-4 py-2.5 bg-white text-primary hover:bg-white/90 font-medium rounded-lg shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 interactive"
                >
                  <svg
                    className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  {loading
                    ? "Retraining & Refreshing..."
                    : "Refresh AI Summary & Scores"}
                </button>
              </div>
            )}

            {/* ✅ Student selector */}
            <StudentSelector
              students={students}
              selectedStudentId={selectedStudent?.id || null}
              onSelectStudent={(id) => {
                const found = students.find((s) => s.id === id) || null;
                setSelectedStudent(found);
              }}
            />
          </>
        ) : students.length === 0 && activeProgram ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] space-y-4 glass border-white/20 rounded-2xl p-12">
            <svg
              className="w-24 h-24 text-white/40"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <p className="text-white text-lg font-medium">
              No students found in this program.
            </p>
            <p className="text-white/60 text-sm">
              Try selecting a different program from the sidebar.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[300px] space-y-4 glass border-white/20 rounded-2xl p-12">
            <svg
              className="w-24 h-24 text-white/40"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <p className="text-white text-lg font-medium">
              Select a program to view students.
            </p>
            <p className="text-white/60 text-sm">
              Choose a program from the sidebar to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
