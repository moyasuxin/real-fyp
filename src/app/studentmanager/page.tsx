// src/app/studentmanager/page.tsx
"use client";
import React, { useState } from "react";
import { useStudents } from "./hooks/useStudents";
import Sidebar from "./components/Sidebar";
import ChartView from "./components/StudentChart";
import ManageView from "./components/StudentManageTable";
import StudentEdit from "./components/StudentEdit";
import StudentCreate from "./components/StudentCreate";
import { Student } from "./types/student";

export default function StudentManagerPage() {
  const { students, loading, deleteStudent, refetchStudents } = useStudents();

  const [activeTab, setActiveTab] = useState<"chart" | "manage">("manage");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [createMode, setCreateMode] = useState(false);

  return (
    <div className="flex h-screen">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {activeTab === "chart" && <ChartView students={students} />}

          {activeTab === "manage" && (
            <>
              {createMode && (
                <StudentCreate
                  onClose={() => {
                    setCreateMode(false);
                    refetchStudents();
                  }}
                />
              )}

              {!createMode && selectedStudent && (
                <StudentEdit
                  student={selectedStudent}
                  onClose={() => setSelectedStudent(null)}
                />
              )}

              {!createMode && !selectedStudent && (
                <ManageView
                  students={students}
                  loading={loading}
                  onDelete={deleteStudent}
                  onAdd={() => setCreateMode(true)}
                  onEdit={(student) => setSelectedStudent(student)}
                />
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
