// src/app/studentmanager/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/services/supabaseClient";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Student {
  id: number;
  name: string;
  program: string;
  cgpa: number;
  programming_score: number;
  design_score: number;
  it_infrastructure_score: number;
  co_curricular_points: number;
  github_url?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  course_id?: string;
  course_name?: string;
  course_title?: string;
  course_description?: string;
  unit?: number;
  social_media?: string | null;
}

export default function StudentManagerPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: "",
    program: "",
    cgpa: "",
    programming_score: "",
    design_score: "",
    it_infrastructure_score: "",
    co_curricular_points: "",
    github_url: "",
    linkedin_url: "",
    portfolio_url: "",
    course_id: "",
    course_name: "",
    course_title: "",
    course_description: "",
    unit: "",
    social_media: "",
  });

  // 🧠 Fetch students
  const fetchStudents = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("students").select("*");
    if (error) console.error("Error fetching students:", error);
    else setStudents(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // ➕ Add student
  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("students").insert([
      {
        name: newStudent.name,
        program: newStudent.program,
        cgpa: parseFloat(newStudent.cgpa),
        programming_score: parseInt(newStudent.programming_score),
        design_score: parseInt(newStudent.design_score),
        it_infrastructure_score: parseInt(newStudent.it_infrastructure_score),
        co_curricular_points: parseInt(newStudent.co_curricular_points),
        github_url: newStudent.github_url || null,
        linkedin_url: newStudent.linkedin_url || null,
        portfolio_url: newStudent.portfolio_url || null,
        course_id: newStudent.course_id || null,
        course_name: newStudent.course_name || null,
        course_title: newStudent.course_title || null,
        course_description: newStudent.course_description || null,
        unit: newStudent.unit ? parseFloat(newStudent.unit) : 3.0,
        social_media: newStudent.social_media || null,
      },
    ]);

    if (error) console.error("Insert error:", error);
    else {
      fetchStudents();
      setFormOpen(false);
      setNewStudent({
        name: "",
        program: "",
        cgpa: "",
        programming_score: "",
        design_score: "",
        it_infrastructure_score: "",
        co_curricular_points: "",
        github_url: "",
        linkedin_url: "",
        portfolio_url: "",
        course_id: "",
        course_name: "",
        course_title: "",
        course_description: "",
        unit: "",
        social_media: "",
      });
    }

    setLoading(false);
  };

  // 🗑️ Delete student
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this student?")) return;
    const { error } = await supabase.from("students").delete().eq("id", id);
    if (error) console.error("Delete error:", error);
    else fetchStudents();
  };

  // 📊 Chart Data
  const chartData = {
    labels: students.map((s) => s.name),
    datasets: [
      {
        label: "CGPA",
        data: students.map((s) => s.cgpa),
        backgroundColor: "rgba(255, 206, 86, 0.5)",
      },
      {
        label: "Programming",
        data: students.map((s) => s.programming_score),
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
      {
        label: "Design",
        data: students.map((s) => s.design_score),
        backgroundColor: "rgba(153, 102, 255, 0.5)",
      },
      {
        label: "IT Infrastructure",
        data: students.map((s) => s.it_infrastructure_score),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

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

      {/* Chart Section */}
      <div className="bg-zinc-800 p-6 rounded-2xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">
          Student Performance Overview
        </h2>
        <Bar data={chartData} />
      </div>

      {/* Add Student Form */}
      {formOpen && (
        <form
          onSubmit={handleAddStudent}
          className="bg-zinc-800 p-6 rounded-2xl shadow-lg space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Name"
              value={newStudent.name}
              onChange={(e) =>
                setNewStudent({ ...newStudent, name: e.target.value })
              }
              required
              className="bg-zinc-700 p-2 rounded-md text-white"
            />
            <input
              type="text"
              placeholder="Program"
              value={newStudent.program}
              onChange={(e) =>
                setNewStudent({ ...newStudent, program: e.target.value })
              }
              required
              className="bg-zinc-700 p-2 rounded-md text-white"
            />
            <input
              type="number"
              step="0.01"
              placeholder="CGPA"
              value={newStudent.cgpa}
              onChange={(e) =>
                setNewStudent({ ...newStudent, cgpa: e.target.value })
              }
              className="bg-zinc-700 p-2 rounded-md text-white"
            />
            <input
              type="number"
              placeholder="Programming Score"
              value={newStudent.programming_score}
              onChange={(e) =>
                setNewStudent({
                  ...newStudent,
                  programming_score: e.target.value,
                })
              }
              className="bg-zinc-700 p-2 rounded-md text-white"
            />
            <input
              type="number"
              placeholder="Design Score"
              value={newStudent.design_score}
              onChange={(e) =>
                setNewStudent({ ...newStudent, design_score: e.target.value })
              }
              className="bg-zinc-700 p-2 rounded-md text-white"
            />
            <input
              type="number"
              placeholder="IT Infrastructure Score"
              value={newStudent.it_infrastructure_score}
              onChange={(e) =>
                setNewStudent({
                  ...newStudent,
                  it_infrastructure_score: e.target.value,
                })
              }
              className="bg-zinc-700 p-2 rounded-md text-white"
            />
            <input
              type="number"
              placeholder="Co-Curricular Points"
              value={newStudent.co_curricular_points}
              onChange={(e) =>
                setNewStudent({
                  ...newStudent,
                  co_curricular_points: e.target.value,
                })
              }
              className="bg-zinc-700 p-2 rounded-md text-white"
            />
            <input
              type="text"
              placeholder="GitHub URL"
              value={newStudent.github_url}
              onChange={(e) =>
                setNewStudent({ ...newStudent, github_url: e.target.value })
              }
              className="bg-zinc-700 p-2 rounded-md text-white"
            />
            <input
              type="text"
              placeholder="LinkedIn URL"
              value={newStudent.linkedin_url}
              onChange={(e) =>
                setNewStudent({ ...newStudent, linkedin_url: e.target.value })
              }
              className="bg-zinc-700 p-2 rounded-md text-white"
            />
            <input
              type="text"
              placeholder="Portfolio URL"
              value={newStudent.portfolio_url}
              onChange={(e) =>
                setNewStudent({ ...newStudent, portfolio_url: e.target.value })
              }
              className="bg-zinc-700 p-2 rounded-md text-white"
            />
          </div>

          {/* Structured course data */}
          <h3 className="text-lg font-semibold mt-4">
            Course Information (Optional)
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Course ID (e.g., EC3323)"
              value={newStudent.course_id}
              onChange={(e) =>
                setNewStudent({ ...newStudent, course_id: e.target.value })
              }
              className="bg-zinc-700 p-2 rounded-md text-white"
            />
            <input
              type="text"
              placeholder="Course Name"
              value={newStudent.course_name}
              onChange={(e) =>
                setNewStudent({ ...newStudent, course_name: e.target.value })
              }
              className="bg-zinc-700 p-2 rounded-md text-white"
            />
            <input
              type="text"
              placeholder="Course Title"
              value={newStudent.course_title}
              onChange={(e) =>
                setNewStudent({ ...newStudent, course_title: e.target.value })
              }
              className="bg-zinc-700 p-2 rounded-md text-white"
            />
            <input
              type="text"
              placeholder="Course Description"
              value={newStudent.course_description}
              onChange={(e) =>
                setNewStudent({
                  ...newStudent,
                  course_description: e.target.value,
                })
              }
              className="bg-zinc-700 p-2 rounded-md text-white"
            />
            <input
              type="number"
              placeholder="Unit (default 3.0)"
              value={newStudent.unit}
              onChange={(e) =>
                setNewStudent({ ...newStudent, unit: e.target.value })
              }
              className="bg-zinc-700 p-2 rounded-md text-white"
            />
          </div>

          {/* Unstructured data */}
          <h3 className="text-lg font-semibold mt-4">
            Unstructured Data (Optional)
          </h3>
          <textarea
            placeholder="Insert social media / activity link (for ML clarity)"
            value={newStudent.social_media}
            onChange={(e) =>
              setNewStudent({ ...newStudent, social_media: e.target.value })
            }
            className="bg-zinc-700 p-2 rounded-md text-white w-full"
          ></textarea>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-2 bg-lime-400 text-black font-semibold rounded-md hover:bg-lime-500 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Add Student"}
          </button>
        </form>
      )}

      {/* Table Section */}
      <div className="bg-zinc-800 p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4">All Students</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
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
                  <td>{s.cgpa?.toFixed(2)}</td>
                  <td>{s.course_id || "-"}</td>
                  <td>{s.unit || 3.0}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="text-red-400 hover:text-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
