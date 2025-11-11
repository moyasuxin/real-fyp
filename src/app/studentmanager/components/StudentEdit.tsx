// src/app/studentmanager/components/StudentEdit.tsx
"use client";
import React from "react";
import { Student } from "../types/student";
import CourseSection from "./CourseSection";

interface Props {
  student: Student | null;
  onClose: () => void;
}

export default function StudentEdit({ student, onClose }: Props) {
  if (!student) return null;

  return (
    <div className="bg-zinc-800 p-6 rounded-2xl shadow-md w-full space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Edit Student — {student.name}</h2>
        <button
          onClick={onClose}
          className="bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600 transition"
        >
          Back
        </button>
      </div>

      <div className="space-y-1 text-gray-300">
        <p>
          <strong>Program:</strong> {student.program}
        </p>
        <p>
          <strong>CGPA:</strong>{" "}
          {student.cgpa ? parseFloat(student.cgpa.toString()).toFixed(2) : "-"}
        </p>
      </div>

      <CourseSection studentId={student.id} />
    </div>
  );
}
