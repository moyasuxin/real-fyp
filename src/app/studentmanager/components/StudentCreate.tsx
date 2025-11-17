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

type CourseInput = {
  course_name: string;
  course_code: string;
  grade: string;
  credit_hour: number;
  description: string;
};

export default function StudentCreate({ onClose }: Props) {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    gender: "Male",
    dob: "",
    image_url: "",
    level: "Degree",
    program: "",
    cgpa: "",
    description: "",
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null); // ⭐ NEW

  const [addProgramMode, setAddProgramMode] = useState(false);
  const [newProgram, setNewProgram] = useState({
    group_name: "Degree",
    program_short: "",
    program_long: "",
  });

  const [courses, setCourses] = useState<CourseInput[]>([
    {
      course_name: "",
      course_code: "",
      grade: "",
      credit_hour: 3,
      description: "",
    },
  ]);

  useEffect(() => {
    loadPrograms();
  }, []);

  const loadPrograms = async () => {
    const { data } = await supabase.from("programs").select("*");

    if (data) {
      const sorted = [...data].sort((a, b) =>
        a.program_long.localeCompare(b.program_long)
      );
      setPrograms(sorted);
    } else {
      setPrograms([]);
    }
  };

  // ⭐ NEW — Upload Image to Supabase Storage
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImagePreview(URL.createObjectURL(file)); // Preview

    const fileName = `${Date.now()}-${file.name}`;

    const { data, error } = await supabase.storage
      .from("student-images") // MAKE SURE BUCKET EXISTS
      .upload(fileName, file);

    if (error) {
      alert("Image upload failed: " + error.message);
      return;
    }

    const { data: publicURL } = supabase.storage
      .from("student-images")
      .getPublicUrl(fileName);

    setForm({ ...form, image_url: publicURL.publicUrl });
  };

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

  const removeCourseRow = (index: number) => {
    const temp = [...courses];
    temp.splice(index, 1);
    setCourses(temp);
  };

  const updateCourseField = (
    index: number,
    field: keyof CourseInput,
    value: string | number
  ) => {
    setCourses((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: insertedStudents, error } = await supabase
      .from("students")
      .insert({
        name: form.name.toUpperCase(),
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

    await fetch(`/api/ml/retrain?studentId=${studentId}`, { method: "POST" });

    setLoading(false);
    onClose();
  };

  const handleSaveProgram = async () => {
    const { data, error } = await supabase
      .from("programs")
      .insert({
        group_name: form.level,
        program_short: newProgram.program_short.toUpperCase(),
        program_long: newProgram.program_long,
      })
      .select("*");

    if (error) {
      alert("Cannot add program: " + error.message);
      return;
    }

    await loadPrograms();

    setForm({
      ...form,
      program: data?.[0]?.program_long || "",
    });

    setNewProgram({
      group_name: form.level,
      program_short: "",
      program_long: "",
    });

    setAddProgramMode(false);
  };

  return (
    <div className="bg-zinc-800 p-6 rounded-xl w-[700px] space-y-4">
      <h2 className="text-xl font-semibold mb-4">Add New Student</h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Name */}
        <label className="block text-sm text-gray-300">Name</label>
        <input
          className="w-full bg-zinc-700 p-2 rounded-md"
          placeholder="Enter student name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value.toUpperCase() })
          }
        />

        {/* ⭐ NEW — Upload Image */}
        <label className="block text-sm text-gray-300">Student Image</label>
        <input
          type="file"
          accept="image/*"
          className="w-full bg-zinc-700 p-2 rounded-md"
          onChange={handleImageUpload}
        />

        {/* Preview */}
        {imagePreview && (
          <img
            src={imagePreview}
            className="w-32 h-32 object-cover mt-2 rounded-md"
          />
        )}

        {/* Gender */}
        <label className="block text-sm text-gray-300">Gender</label>
        <select
          className="w-full bg-zinc-700 p-2 rounded-md"
          value={form.gender}
          onChange={(e) => setForm({ ...form, gender: e.target.value })}
        >
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>

        {/* DOB */}
        <label className="block text-sm text-gray-300">Date of Birth</label>
        <input
          className="w-full bg-zinc-700 p-2 rounded-md"
          type="date"
          value={form.dob}
          onChange={(e) => setForm({ ...form, dob: e.target.value })}
        />

        {/* Program */}
        <label className="block text-sm text-gray-300">Program</label>
        <select
          className="w-full bg-zinc-700 p-2 rounded-md"
          value={form.program}
          onChange={(e) => {
            const value = e.target.value;

            if (value === "__add_new__") {
              setAddProgramMode(true);
              return;
            }

            setAddProgramMode(false);
            setForm({ ...form, program: value });
          }}
        >
          <option value="">-- Select Program --</option>
          {programs.map((p) => (
            <option key={p.id} value={p.program_long}>
              {p.program_long}
            </option>
          ))}
          <option value="__add_new__" className="text-yellow-400">
            + Add New Program
          </option>
        </select>

        {/* Add Program Mode */}
        {addProgramMode && (
          <div className="bg-zinc-900 p-4 rounded-md space-y-3">
            <h3 className="text-lg font-semibold">Add New Program</h3>

            <label className="text-sm text-gray-300">Program Short Name</label>
            <input
              className="w-full bg-zinc-700 p-2 rounded-md"
              value={newProgram.program_short}
              onChange={(e) =>
                setNewProgram({
                  ...newProgram,
                  program_short: e.target.value.toUpperCase(),
                })
              }
            />

            <label className="text-sm text-gray-300">Program Long Name</label>
            <input
              className="w-full bg-zinc-700 p-2 rounded-md"
              value={newProgram.program_long}
              onChange={(e) =>
                setNewProgram({
                  ...newProgram,
                  program_long: e.target.value,
                })
              }
            />

            <button
              type="button"
              className="w-full bg-blue-600 p-2 rounded-md"
              onClick={handleSaveProgram}
            >
              Save Program
            </button>
          </div>
        )}

        {/* Courses */}
        <div className="bg-zinc-900 p-4 rounded-md">
          <h3 className="text-lg font-semibold mb-3">Courses</h3>

          {courses.map((c, index) => (
            <div
              key={index}
              className="border border-gray-700 p-3 rounded-md mb-3"
            >
              <label className="block text-sm text-gray-300 mb-1">
                Course Name
              </label>
              <input
                className="w-full bg-zinc-700 p-2 rounded-md mb-2"
                value={c.course_name}
                onChange={(e) =>
                  updateCourseField(index, "course_name", e.target.value)
                }
              />

              <label className="block text-sm text-gray-300 mb-1">
                Course Code
              </label>
              <input
                className="w-full bg-zinc-700 p-2 rounded-md mb-2"
                value={c.course_code}
                onChange={(e) =>
                  updateCourseField(index, "course_code", e.target.value)
                }
              />

              <label className="block text-sm text-gray-300 mb-1">Grade</label>
              <input
                className="w-full bg-zinc-700 p-2 rounded-md mb-2"
                value={c.grade}
                onChange={
                  (e) =>
                    updateCourseField(
                      index,
                      "grade",
                      e.target.value.toUpperCase()
                    ) // ⭐ NEW
                }
              />

              <label className="block text-sm text-gray-300 mb-1">
                Credit Hour
              </label>
              <input
                type="number"
                className="w-full bg-zinc-700 p-2 rounded-md mb-2"
                value={isNaN(c.credit_hour) ? "" : c.credit_hour}
                onChange={(e) =>
                  updateCourseField(
                    index,
                    "credit_hour",
                    e.target.value === "" ? 0 : parseFloat(e.target.value)
                  )
                }
              />

              <label className="block text-sm text-gray-300 mb-1">
                Description
              </label>
              <input
                className="w-full bg-zinc-700 p-2 rounded-md"
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
