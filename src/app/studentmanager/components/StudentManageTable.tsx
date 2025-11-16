// src/app/studentmanager/components/StudentManageTable.tsx
"use client";
import React from "react";
import { Student } from "../types/student";

interface Props {
  students: Student[];
  loading: boolean;
  onDelete: (id: number) => void;
  onEdit: (student: Student | null) => void; // ✅ allow null
  onAdd: () => void; // ⭐ NEW
}

export default function StudentManageTable({
  students,
  loading,
  onDelete,
  onEdit,
  onAdd, // ⭐ NEW
}: Props) {
  if (loading) return <p>Loading...</p>;

  return (
    <div className="bg-zinc-800 p-6 rounded-2xl shadow-lg w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">All Students</h2>
        <button
          onClick={onAdd}
          className="bg-lime-400 text-black px-4 py-2 rounded-lg font-semibold hover:bg-lime-500 transition-colors"
        >
          + Add Student
        </button>
      </div>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-lime-300 border-b border-gray-700">
            <th className="py-2">Name</th>
            <th>Program</th>
            <th>CGPA</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr
              key={s.id}
              className="border-b border-gray-700 hover:bg-gray-800/50 cursor-pointer"
            >
              <td
                className="py-2 text-blue-400 hover:underline"
                onClick={() => onEdit(s)}
              >
                {s.name}
              </td>
              <td>{s.program}</td>
              <td>{s.cgpa ? parseFloat(s.cgpa.toString()).toFixed(2) : "-"}</td>
              <td>
                <button
                  onClick={() => onDelete(s.id)}
                  className="text-red-400 hover:text-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
