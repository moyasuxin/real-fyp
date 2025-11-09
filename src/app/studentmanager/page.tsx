// src/app/studentmanager/page.tsx
"use client";
import React, { useState } from "react";
import { useStudents } from "./hooks/useStudents";
import Sidebar from "./components/Sidebar";
import ChartView from "./components/StudentChart";
import ManageView from "./components/StudentManageTable";
import StudentEdit from "./components/StudentEdit";
import { Student } from "./types/student";

export default function StudentManagerPage() {
  const { students, loading, deleteStudent } = useStudents();
  const [activeTab, setActiveTab] = useState<"chart" | "manage">("manage");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  return (
    <div className="flex text-gray-100 h-screen bg-[#1a1b1e]">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 p-8 overflow-y-auto flex justify-center items-start">
        {activeTab === "chart" && <ChartView students={students} />}

        {activeTab === "manage" &&
          (selectedStudent ? (
            <StudentEdit
              student={selectedStudent}
              onClose={() => setSelectedStudent(null)}
            />
          ) : (
            <ManageView
              students={students}
              loading={loading}
              onDelete={deleteStudent}
              onEdit={(student) => setSelectedStudent(student)}
            />
          ))}
      </main>
    </div>
  );
}
