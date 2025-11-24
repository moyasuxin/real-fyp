// src/app/studentmanager/components/StudentManageTable.tsx
"use client";
import React from "react";
import { Student } from "../types/student";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Loader } from "@/components/ui/Loader";

interface Props {
  students: Student[];
  loading: boolean;
  onDelete: (id: number) => void;
  onEdit: (student: Student | null) => void;
  onAdd: () => void;
}

export default function StudentManageTable({
  students,
  loading,
  onDelete,
  onEdit,
  onAdd,
}: Props) {
  if (loading) {
    return (
      <Card className="glass border-white/20 w-full">
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader variant="spinner" size="lg" className="text-white" />
            <p className="text-white/80 animate-pulse">Loading students...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass border-white/20 w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="text-white flex items-center gap-2">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            All Students
            <Badge variant="primary" size="sm" className="ml-2">
              {students.length}
            </Badge>
          </CardTitle>
          <Button
            onClick={onAdd}
            className="bg-white text-primary hover:bg-white/90"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Add Student
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {students.length === 0 ? (
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
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <p className="text-lg font-medium">No students found</p>
            <p className="text-sm mt-1">
              Click &quot;Add Student&quot; to create your first entry
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="py-3 px-4 text-white/80 font-semibold">
                    Name
                  </th>
                  <th className="py-3 px-4 text-white/80 font-semibold">
                    Program
                  </th>
                  <th className="py-3 px-4 text-white/80 font-semibold">
                    CGPA
                  </th>
                  <th className="py-3 px-4 text-white/80 font-semibold text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {students.map((s, index) => (
                  <tr
                    key={s.id}
                    className={`border-b border-white/10 hover:bg-white/5 transition-colors ${
                      index % 2 === 0 ? "bg-white/[0.02]" : ""
                    }`}
                  >
                    <td className="py-3 px-4">
                      <button
                        onClick={() => onEdit(s)}
                        className="text-primary hover:text-primary/80 font-medium hover:underline flex items-center gap-2"
                      >
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
                        {s.name}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-white/80">{s.program}</td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          parseFloat(s.cgpa?.toString() || "0") >= 3.5
                            ? "success"
                            : parseFloat(s.cgpa?.toString() || "0") >= 3.0
                            ? "primary"
                            : parseFloat(s.cgpa?.toString() || "0") >= 2.5
                            ? "warning"
                            : "error"
                        }
                        size="sm"
                      >
                        {s.cgpa
                          ? parseFloat(s.cgpa.toString()).toFixed(2)
                          : "-"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          if (
                            confirm(
                              `Are you sure you want to delete ${s.name}?`
                            )
                          ) {
                            onDelete(s.id);
                          }
                        }}
                        className="text-red-300 hover:text-red-200 transition-colors inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-red-500/10"
                      >
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
