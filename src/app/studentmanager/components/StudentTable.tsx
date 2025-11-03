"use client";
import React from "react";
import { Student } from "../types/student";

interface Props {
  students: Student[];
  loading: boolean;
  onDelete: (id: number) => void;
}

export default function StudentTable({ students, loading, onDelete }: Props) {
  if (loading) return <p>Loading...</p>;

  return (
    <div className="bg-zinc-800 p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-semibold mb-4">All Students</h2>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-lime-300 border-b border-gray-700">
            <th className="py-2">Name</th>
            <th>Program</th>
            <th>CGPA</th>
            <th>Course ID</th>
            <th>Unit</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr
              key={s.id}
              className="border-b border-gray-700 hover:bg-gray-800/50"
            >
              <td className="py-2">{s.name}</td>
              <td>{s.program}</td>
              <td>{s.cgpa ? parseFloat(s.cgpa.toString()).toFixed(2) : "-"}</td>
              <td>{s.course_id || "-"}</td>
              <td>{s.unit || 3.0}</td>
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
