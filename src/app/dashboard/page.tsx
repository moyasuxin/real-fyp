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
    <div className="flex flex-col lg:flex-row gap-4 animate-fade-in">
      <DashboardSidebar
        activeGroup={activeGroup}
        activeProgram={activeProgram}
        onSelectGroup={setActiveGroup}
        onSelectProgram={setActiveProgram}
      />

      <div className="flex-grow min-w-0 space-y-6">
        {pageLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[500px] space-y-4">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400 animate-pulse">
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
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Refreshing..." : "🔄 Refresh AI Summary"}
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
          <div className="flex flex-col items-center justify-center min-h-[300px] space-y-4">
            <div className="text-6xl">📭</div>
            <p className="text-gray-400 text-lg">
              No students found in this program.
            </p>
            <p className="text-gray-500 text-sm">
              Try selecting a different program from the sidebar.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[300px] space-y-4">
            <div className="text-6xl">👈</div>
            <p className="text-gray-400 text-lg">
              Select a program to view students.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
