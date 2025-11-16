// src/app/studentmanager/components/StudentCreate.tsx
"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/services/supabaseClient";

interface Program {
  id: number;
  group_name: string;
  program_short: string;
  program_long: string;
}

interface Props {
  onClose: () => void;
}

export default function StudentCreate({ onClose }: Props) {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    gender: "Male",
    dob: "",
    image_url: "",
    program: "",
    level: "Degree",
    cgpa: "",
    description: "",
  });

  const [addProgramMode, setAddProgramMode] = useState(false);
  const [newProgram, setNewProgram] = useState({
    group_name: "Degree",
    program_short: "",
    program_long: "",
  });

  // 🆕 Course list (before student exists)
  const [courses, setCourses] = useState([
    {
      course_name: "",
      course_code: "",
      grade: "",
      credit_hour: 3,
      description: "",
    },
  ]);

  // Load programs
  useEffect(() => {
    loadPrograms();
  }, []);

  const loadPrograms = async () => {
    const { data } = await supabase.from("programs").select("*");
    setPrograms(data || []);
  };

  // ➕ Add empty course row
  const addCourseRow = () => {
    setCourses([
      ...courses,
      {
        course_name: "",
        course_code: "",
        grade: "",
        credit_hour: 3,
        description: "",
      },
    ]);
  };

  // 🗑 Remove course row
  const removeCourseRow = (index: number) => {
    const temp = [...courses];
    temp.splice(index, 1);
    setCourses(temp);
  };

  const updateCourseField = (index: number, field: string, value: any) => {
    const updated = [...courses];
    updated[index][field] = value;
    setCourses(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 1️⃣ Create student first
    const { data: insertedStudents, error } = await supabase
      .from("students")
      .insert({
        name: form.name,
        gender: form.gender,
        dob: form.dob,
        image_url: form.image_url || "https://placehold.co/200",
        analysis: {},
        level: form.level,
        program: form.program,
        cgpa: null,
        description: form.description || null,
      })
      .select("id");

    if (error || !insertedStudents || insertedStudents.length === 0) {
      alert("Error creating student: " + error?.message);
      setLoading(false);
      return;
    }

    const studentId = insertedStudents[0].id;

    // 2️⃣ Insert courses for this student
    for (const c of courses) {
      if (!c.course_name) continue;

      await supabase.from("courses").insert({
        student_id: studentId,
        course_name: c.course_name,
        course_code: c.course_code || null,
        grade: c.grade || null,
        credit_hour: c.credit_hour,
        description: c.description || null,
      });
    }

    // 3️⃣ Trigger ML retrain
    await fetch(`/api/ml/retrain?studentId=${studentId}`, { method: "POST" });

    setLoading(false);
    onClose();
  };

  const handleAddProgram = async () => {
    const { error } = await supabase.from("programs").insert(newProgram);
    if (error) return alert("Cannot create program: " + error.message);

    await loadPrograms();
    setAddProgramMode(false);
  };

  return (
    <div className="bg-zinc-800 p-6 rounded-xl w-[700px] space-y-4">
      <h2 className="text-xl font-semibold mb-4">Add New Student</h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Student Basic Info */}
        <input
          className="w-full bg-zinc-700 p-2 rounded-md"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <select
          className="w-full bg-zinc-700 p-2 rounded-md"
          value={form.gender}
          onChange={(e) => setForm({ ...form, gender: e.target.value })}
        >
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>

        <input
          className="w-full bg-zinc-700 p-2 rounded-md"
          type="date"
          value={form.dob}
          onChange={(e) => setForm({ ...form, dob: e.target.value })}
        />

        {/* Program */}
        <select
          className="w-full bg-zinc-700 p-2 rounded-md"
          value={form.program}
          onChange={(e) => setForm({ ...form, program: e.target.value })}
        >
          <option value="">-- Select Program --</option>
          {programs.map((p) => (
            <option key={p.id} value={p.program_long}>
              {p.program_long}
            </option>
          ))}
        </select>

        {/* 🆕 Course List Section */}
        <div className="bg-zinc-900 p-4 rounded-md">
          <h3 className="text-lg font-semibold mb-3">Courses</h3>

          {courses.map((c, index) => (
            <div
              key={index}
              className="border border-gray-700 p-3 rounded-md mb-3"
            >
              <input
                className="w-full bg-zinc-700 p-2 rounded-md mb-2"
                placeholder="Course Name"
                value={c.course_name}
                onChange={(e) =>
                  updateCourseField(index, "course_name", e.target.value)
                }
              />

              <input
                className="w-full bg-zinc-700 p-2 rounded-md mb-2"
                placeholder="Course Code"
                value={c.course_code}
                onChange={(e) =>
                  updateCourseField(index, "course_code", e.target.value)
                }
              />

              <input
                className="w-full bg-zinc-700 p-2 rounded-md mb-2"
                placeholder="Grade (A, B+, CR...)"
                value={c.grade}
                onChange={(e) =>
                  updateCourseField(index, "grade", e.target.value)
                }
              />

              <input
                type="number"
                className="w-full bg-zinc-700 p-2 rounded-md mb-2"
                placeholder="Credit Hour"
                value={c.credit_hour}
                onChange={(e) =>
                  updateCourseField(
                    index,
                    "credit_hour",
                    parseFloat(e.target.value)
                  )
                }
              />

              <input
                className="w-full bg-zinc-700 p-2 rounded-md"
                placeholder="Description (optional)"
                value={c.description}
                onChange={(e) =>
                  updateCourseField(index, "description", e.target.value)
                }
              />

              <button
                type="button"
                className="mt-2 text-red-400"
                onClick={() => removeCourseRow(index)}
              >
                Remove
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addCourseRow}
            className="w-full bg-blue-600 p-2 rounded-md"
          >
            + Add Another Course
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-lime-400 text-black font-semibold py-2 rounded-md"
        >
          {loading ? "Saving..." : "Create Student"}
        </button>

        <button
          type="button"
          onClick={onClose}
          className="w-full mt-2 bg-gray-600 p-2 rounded-md"
        >
          Cancel
        </button>
      </form>
    </div>
  );
}
