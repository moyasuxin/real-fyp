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

type CocurricularInput = {
  organization_name: string;
  organization_type: string;
  position: string;
  responsibilities: string;
  start_date: string;
  end_date: string;
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
    github_url: "",
    linkedin_url: "",
    portfolio_url: "",
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

  const [cocurricular, setCocurricular] = useState<CocurricularInput[]>([
    {
      organization_name: "",
      organization_type: "Computing Club",
      position: "",
      responsibilities: "",
      start_date: "",
      end_date: "",
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

  const addCocurricularRow = () => {
    setCocurricular([
      ...cocurricular,
      {
        organization_name: "",
        organization_type: "Computing Club",
        position: "",
        responsibilities: "",
        start_date: "",
        end_date: "",
      },
    ]);
  };

  const removeCocurricularRow = (index: number) => {
    const temp = [...cocurricular];
    temp.splice(index, 1);
    setCocurricular(temp);
  };

  const updateCocurricularField = (
    index: number,
    field: keyof CocurricularInput,
    value: string | number
  ) => {
    setCocurricular((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
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
        github_url: form.github_url || null,
        linkedin_url: form.linkedin_url || null,
        portfolio_url: form.portfolio_url || null,
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

    // Insert co-curricular activities
    for (const a of cocurricular) {
      if (!a.organization_name || !a.responsibilities) continue;

      // Format activity period from dates
      let activity_period = null;
      if (a.start_date) {
        const startFormatted = new Date(a.start_date).toLocaleDateString(
          "en-US",
          { month: "short", year: "numeric" }
        );
        if (a.end_date && a.end_date !== a.start_date) {
          const endFormatted = new Date(a.end_date).toLocaleDateString(
            "en-US",
            { month: "short", year: "numeric" }
          );
          activity_period = `${startFormatted} - ${endFormatted}`;
        } else {
          activity_period = startFormatted;
        }
      }

      // Analyze with AI
      const analysisRes = await fetch("/api/analyze-cocurricular", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...a, activity_period }),
      });

      if (analysisRes.ok) {
        const aiScores = await analysisRes.json();
        console.log("AI analysis for activity:", a.organization_name, aiScores);
        await supabase.from("cocurricular_activities").insert({
          student_id: studentId,
          organization_name: a.organization_name,
          organization_type: a.organization_type || null,
          position: a.position || null,
          responsibilities: a.responsibilities || null,
          activity_period: activity_period,
          ai_impact_score: aiScores.impact_score,
          ai_leadership_score: aiScores.leadership_score,
          ai_relevance_score: aiScores.relevance_score,
          ai_summary: aiScores.summary,
        });
      }
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

        {/* Profile URLs */}
        <div className="bg-zinc-900 p-4 rounded-md space-y-3">
          <h3 className="text-lg font-semibold">Online Profiles (Optional)</h3>
          <p className="text-xs text-gray-400">
            Profile data will be automatically analyzed when you submit
          </p>

          <div>
            <label className="block text-sm text-gray-300 mb-1">
              GitHub URL
            </label>
            <input
              className="w-full bg-zinc-700 p-2 rounded-md text-sm"
              placeholder="https://github.com/username"
              value={form.github_url}
              onChange={(e) => setForm({ ...form, github_url: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">
              LinkedIn URL
            </label>
            <input
              className="w-full bg-zinc-700 p-2 rounded-md text-sm"
              placeholder="https://linkedin.com/in/username"
              value={form.linkedin_url}
              onChange={(e) =>
                setForm({ ...form, linkedin_url: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Portfolio URL
            </label>
            <input
              className="w-full bg-zinc-700 p-2 rounded-md text-sm"
              placeholder="https://yourportfolio.com"
              value={form.portfolio_url}
              onChange={(e) =>
                setForm({ ...form, portfolio_url: e.target.value })
              }
            />
          </div>
        </div>

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

        {/* Co-curricular Activities */}
        <div className="bg-zinc-900 p-4 rounded-md">
          <h3 className="text-lg font-semibold mb-3">
            Co-curricular Activities (Optional)
          </h3>
          <p className="text-xs text-gray-400 mb-3">
            ℹ️ AI will analyze your activities and score their impact,
            leadership, and relevance
          </p>

          {cocurricular.map((a, index) => (
            <div
              key={index}
              className="border border-gray-700 p-4 rounded-md mb-3"
            >
              <label className="block text-sm text-gray-300 mb-1">
                Organization/Club Name *
              </label>
              <input
                className="w-full bg-zinc-700 p-2 rounded-md mb-2"
                placeholder="e.g. Computing Club, School Basketball Team"
                value={a.organization_name}
                onChange={(e) =>
                  updateCocurricularField(
                    index,
                    "organization_name",
                    e.target.value
                  )
                }
              />

              <div className="grid grid-cols-2 gap-2 mb-2">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">
                    Organization Type
                  </label>
                  <select
                    className="w-full bg-zinc-700 p-2 rounded-md"
                    value={a.organization_type}
                    onChange={(e) =>
                      updateCocurricularField(
                        index,
                        "organization_type",
                        e.target.value
                      )
                    }
                  >
                    <option value="Computing Club">Computing Club</option>
                    <option value="School Club">School Club</option>
                    <option value="Outside Organization">
                      Outside Organization
                    </option>
                    <option value="Sports Team">Sports Team</option>
                    <option value="NGO/Charity">NGO/Charity</option>
                    <option value="Competition Team">Competition Team</option>
                    <option value="Student Society">Student Society</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-1">
                    Your Position
                  </label>
                  <input
                    className="w-full bg-zinc-700 p-2 rounded-md"
                    placeholder="e.g. President, Member"
                    value={a.position}
                    onChange={(e) =>
                      updateCocurricularField(index, "position", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-2">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    className="w-full bg-zinc-700 p-2 rounded-md"
                    value={a.start_date}
                    onChange={(e) =>
                      updateCocurricularField(
                        index,
                        "start_date",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-1">
                    End Date (optional)
                  </label>
                  <input
                    type="date"
                    className="w-full bg-zinc-700 p-2 rounded-md"
                    value={a.end_date}
                    min={a.start_date}
                    onChange={(e) =>
                      updateCocurricularField(index, "end_date", e.target.value)
                    }
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Leave empty for single day event
                  </p>
                </div>
              </div>

              <label className="block text-sm text-gray-300 mb-1">
                Responsibilities & Achievements *
              </label>
              <textarea
                className="w-full bg-zinc-700 p-2 rounded-md mb-2"
                rows={3}
                placeholder="Describe what you did, your contributions, and achievements. Be specific!&#10;Example: Led 10 members, organized 3 workshops with 100+ participants, won 1st place in hackathon"
                value={a.responsibilities}
                onChange={(e) =>
                  updateCocurricularField(
                    index,
                    "responsibilities",
                    e.target.value
                  )
                }
              />

              <button
                type="button"
                className="mt-2 text-red-400 hover:text-red-600"
                onClick={() => removeCocurricularRow(index)}
              >
                Remove Activity
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addCocurricularRow}
            className="w-full bg-blue-600 p-2 rounded-md"
          >
            + Add Another Activity
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-lime-400 text-black font-semibold py-2 rounded-md"
        >
          {loading ? "Processing..." : "Create Student & Analyze"}
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
