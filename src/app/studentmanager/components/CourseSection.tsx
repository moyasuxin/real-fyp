// src/app/studentmanager/components/CourseSection.tsx
"use client";
import React, { useState } from "react";
import { useCourses } from "../types/course";
import MLLoadingModal from "./MLLoadingModal";

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

  return (
    <div className="bg-zinc-800 p-4 rounded-lg space-y-3">
      <h3 className="text-lg font-semibold">Course History</h3>

      {loading ? (
        <p>Loading...</p>
      ) : courses.length === 0 ? (
        <p className="text-gray-400 italic">No courses yet</p>
      ) : (
        <ul className="space-y-2">
          {courses.map((c) => (
            <li
              key={c.id}
              className="flex justify-between items-center border border-gray-700 p-3 rounded-md"
            >
              <span>
                <strong>{c.course_name}</strong>{" "}
                {c.course_code ? `(${c.course_code}) ` : ""}— {c.credit_hour}{" "}
                credit hours — Grade: {c.grade || "-"}
              </span>
              <button
                onClick={() => deleteCourse(c.id)}
                className="text-red-400 hover:text-red-600"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Add New Course */}
      <form onSubmit={handleAddCourse} className="space-y-2 pt-2">
        <div>
          <label className="block text-sm text-gray-300 mb-1">
            Course Name
          </label>
          <input
            className="w-full bg-gray-700 p-2 rounded-md"
            placeholder="e.g. Software Quality Assurance"
            value={newCourse.course_name}
            onChange={(e) =>
              setNewCourse({ ...newCourse, course_name: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">
            Course Code
          </label>
          <input
            className="w-full bg-gray-700 p-2 rounded-md"
            placeholder="e.g. CSC3014"
            value={newCourse.course_code}
            onChange={(e) =>
              setNewCourse({ ...newCourse, course_code: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">Grade</label>
          <input
            className="w-full bg-gray-700 p-2 rounded-md"
            placeholder="e.g. A, B+, CR"
            value={newCourse.grade}
            onChange={(e) =>
              setNewCourse({
                ...newCourse,
                grade: e.target.value.toUpperCase(),
              })
            }
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">
            Unit (Credit Hour)
          </label>
          <input
            type="number"
            step="0.1"
            className="w-full bg-gray-700 p-2 rounded-md"
            placeholder="e.g. 3"
            value={newCourse.credit_hour}
            onChange={(e) =>
              setNewCourse({
                ...newCourse,
                credit_hour: e.target.value ? parseFloat(e.target.value) : 0,
              })
            }
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">
            Description (Optional)
          </label>
          <input
            className="w-full bg-gray-700 p-2 rounded-md"
            placeholder="e.g. Software project-related subject"
            value={newCourse.course_description}
            onChange={(e) =>
              setNewCourse({ ...newCourse, course_description: e.target.value })
            }
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-md w-full"
        >
          Add Course
        </button>
      </form>
      <MLLoadingModal show={mlLoading} stage={mlStage} />
    </div>
  );
}
