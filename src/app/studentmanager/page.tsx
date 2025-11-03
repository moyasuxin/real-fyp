"use client";
import React, { useState } from "react";
import { useStudents } from "./hooks/useStudents";
import StudentChart from "./components/StudentChart";
import StudentForm from "./components/StudentForm";
import StudentTable from "./components/StudentTable";

export default function StudentManagerPage() {
  const { students, loading, addStudent, deleteStudent } = useStudents();
  const [formOpen, setFormOpen] = useState(false);

  return (
    <div className="text-white space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Student Manager</h1>
        <button
          onClick={() => setFormOpen(!formOpen)}
          className="bg-lime-400 text-black px-4 py-2 rounded-lg font-semibold hover:bg-lime-500 transition-colors"
        >
          {formOpen ? "Close Form" : "Add Student"}
        </button>
      </div>

      <StudentChart students={students} />

      {formOpen && <StudentForm onSubmit={addStudent} loading={loading} />}

      <StudentTable
        students={students}
        loading={loading}
        onDelete={deleteStudent}
      />
    </div>
  );
}
