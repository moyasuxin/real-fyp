// src/app/studentmanager/components/CourseSection.tsx
"use client";
import React, { useState } from "react";
import { useCourses } from "../hooks/useCourses";
import MLLoadingModal from "./MLLoadingModal";
import CourseCSVUpload from "./CourseCSVUpload";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface Props {
  studentId: number;
}

export default function CourseSection({ studentId }: Props) {
  const { courses, loading, addCourse, deleteCourse } = useCourses(studentId);
  const [mlLoading, setMlLoading] = useState(false);
  const [mlStage, setMlStage] = useState("Initializing...");
  const [newCourse, setNewCourse] = useState({
    course_name: "",
    course_code: "",
    grade: "",
    credit_hour: 3,
    course_description: "",
  });

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourse.course_name) return alert("Enter course name!");

    // Start ML loading modal
    setMlLoading(true);
    setMlStage("Feeding data to ML...");

    try {
      await addCourse({
        student_id: studentId,
        course_name: newCourse.course_name,
        course_code: newCourse.course_code || null,
        grade: newCourse.grade,
        credit_hour: newCourse.credit_hour,
        course_description: newCourse.course_description || null,
      });

      setMlStage("Waiting for ML process...");
      await new Promise((r) => setTimeout(r, 1500));

      setMlStage("Processing and updating database...");
      const res = await fetch(`/api/ml/retrain?studentId=${studentId}`, {
        method: "POST",
      });

      setMlStage("Finalizing...");
      await new Promise((r) => setTimeout(r, 1000));

      if (!res.ok) throw new Error("ML failed");

      setMlStage("✅ Done!");
      await new Promise((r) => setTimeout(r, 800));
    } catch (err) {
      alert("Error during ML retraining.");
      console.error(err);
    } finally {
      setMlLoading(false);
      // Reset input
      setNewCourse({
        course_name: "",
        course_code: "",
        grade: "",
        credit_hour: 3,
        course_description: "",
      });
    }
  };

  const handleCSVImport = async (
    importedCourses: Array<{
      course_name: string;
      course_code: string;
      grade: string;
      credit_hour: number;
      course_description: string;
    }>
  ) => {
    setMlLoading(true);
    setMlStage("Importing courses from CSV...");

    try {
      for (const course of importedCourses) {
        await addCourse({
          student_id: studentId,
          course_name: course.course_name,
          course_code: course.course_code || null,
          grade: course.grade,
          credit_hour: course.credit_hour,
          course_description: course.course_description || null,
        });
      }

      setMlStage("Running ML prediction...");
      const res = await fetch(`/api/ml/retrain?studentId=${studentId}`, {
        method: "POST",
      });

      if (!res.ok) throw new Error("ML failed");

      setMlStage("✅ Done!");
      await new Promise((r) => setTimeout(r, 800));
      alert(`Successfully imported ${importedCourses.length} courses!`);
    } catch (err) {
      alert("Error during CSV import.");
      console.error(err);
    } finally {
      setMlLoading(false);
    }
  };

  return (
    <Card className="glass border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          Course History
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* CSV Upload Section */}
        <div className="mb-4">
          <CourseCSVUpload onCoursesImported={handleCSVImport} />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : courses.length === 0 ? (
          <p className="text-white/60 italic text-center py-6">
            No courses yet. Add your first course below.
          </p>
        ) : (
          <ul className="space-y-2">
            {courses.map((c) => (
              <li
                key={c.id}
                className="flex justify-between items-center glass border border-white/20 p-3 rounded-lg hover:border-white/30 transition-colors"
              >
                <span className="text-white">
                  <strong>{c.course_name}</strong>{" "}
                  {c.course_code ? `(${c.course_code}) ` : ""}— {c.credit_hour}{" "}
                  credit hours — Grade:{" "}
                  <span className="text-primary">{c.grade || "-"}</span>
                </span>
                <button
                  onClick={() => deleteCourse(c.id)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Add New Course */}
        <form
          onSubmit={handleAddCourse}
          className="space-y-3 pt-4 border-t border-white/20"
        >
          <Input
            label="Course Name"
            placeholder="e.g. Software Quality Assurance"
            value={newCourse.course_name}
            onChange={(e) =>
              setNewCourse({ ...newCourse, course_name: e.target.value })
            }
            className="glass text-white border-white/30"
          />
          <Input
            label="Course Code"
            placeholder="e.g. CSC3014"
            value={newCourse.course_code}
            onChange={(e) =>
              setNewCourse({ ...newCourse, course_code: e.target.value })
            }
            className="glass text-white border-white/30"
          />
          <div>
            <label className="block text-sm text-white/90 mb-2">Grade</label>
            <select
              className="w-full glass text-white border-white/30 bg-transparent p-2.5 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              value={newCourse.grade}
              onChange={(e) =>
                setNewCourse({
                  ...newCourse,
                  grade: e.target.value,
                })
              }
            >
              <option value="" className="bg-gray-800">
                -- Select Grade --
              </option>
              <option value="A+" className="bg-gray-800">
                A+
              </option>
              <option value="A" className="bg-gray-800">
                A
              </option>
              <option value="A-" className="bg-gray-800">
                A-
              </option>
              <option value="B+" className="bg-gray-800">
                B+
              </option>
              <option value="B" className="bg-gray-800">
                B
              </option>
              <option value="B-" className="bg-gray-800">
                B-
              </option>
              <option value="C+" className="bg-gray-800">
                C+
              </option>
              <option value="C" className="bg-gray-800">
                C
              </option>
              <option value="C-" className="bg-gray-800">
                C-
              </option>
              <option value="D+" className="bg-gray-800">
                D+
              </option>
              <option value="D" className="bg-gray-800">
                D
              </option>
              <option value="F" className="bg-gray-800">
                F
              </option>
              <option value="CR" className="bg-gray-800">
                CR (Credit)
              </option>
            </select>
          </div>{" "}
          <Input
            label="Unit (Credit Hour)"
            type="number"
            step="0.1"
            placeholder="e.g. 3"
            value={newCourse.credit_hour}
            onChange={(e) =>
              setNewCourse({
                ...newCourse,
                credit_hour: e.target.value ? parseFloat(e.target.value) : 0,
              })
            }
            className="glass text-white border-white/30"
          />
          <Input
            label="Description (Optional)"
            placeholder="e.g. Software project-related subject"
            value={newCourse.course_description}
            onChange={(e) =>
              setNewCourse({ ...newCourse, course_description: e.target.value })
            }
            className="glass text-white border-white/30"
          />
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-white"
          >
            + Add Course & Retrain ML
          </Button>
        </form>
        <MLLoadingModal show={mlLoading} stage={mlStage} />
      </CardContent>
    </Card>
  );
}
