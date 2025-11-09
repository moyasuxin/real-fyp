// src/app/studentmanager/components/StudentEdit.tsx
"use client";
import React from "react";
import { Student } from "../types/student";

interface Props {
  student: Student | null;
  onClose: () => void;
}

export default function StudentEdit({ student, onClose }: Props) {
  if (!student) {
    return (
      <div className="bg-zinc-800 p-6 rounded-2xl shadow-md w-full">
        <h2 className="text-xl font-semibold mb-4">Add New Student</h2>
        <p>Coming soon: student creation form here...</p>
        <button
          onClick={onClose}
          className="mt-4 bg-gray-700 px-4 py-2 rounded-lg"
        >
          Back
        </button>
      </div>
    );
  }

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

      <div className="space-y-2">
        <p>
          <strong>Program:</strong> {student.program}
        </p>
        <p>
          <strong>CGPA:</strong>{" "}
          {student.cgpa ? parseFloat(student.cgpa.toString()).toFixed(2) : "-"}
        </p>
      </div>

      <hr className="border-gray-600" />

      <div>
        <h3 className="text-lg font-semibold mb-2">Course History</h3>
        <ul className="space-y-1">
          {/* Placeholder for future Supabase course data */}
          <li className="text-gray-400 italic">
            No course data yet (coming soon)
          </li>
        </ul>
      </div>
    </div>
  );
}
