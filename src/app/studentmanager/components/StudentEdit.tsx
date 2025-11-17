// src/app/studentmanager/components/StudentEdit.tsx
"use client";
import React, { useState } from "react";
import { Student } from "../types/student";
import CourseSection from "./CourseSection";
import CocurricularSection from "./CocurricularSection";
import { supabase } from "@/services/supabaseClient";

interface Props {
  student: Student | null;
  onClose: () => void;
}

export default function StudentEdit({ student, onClose }: Props) {
  const [profileUrls, setProfileUrls] = useState({
    github_url: student?.github_url || "",
    linkedin_url: student?.linkedin_url || "",
    portfolio_url: student?.portfolio_url || "",
  });
  const [saving, setSaving] = useState(false);

  if (!student) return null;

  const saveProfileUrls = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("students")
        .update(profileUrls)
        .eq("id", student.id);

      if (error) throw error;
      alert("Profile URLs saved successfully!");
    } catch (error) {
      console.error("Failed to save URLs:", error);
      alert("Failed to save profile URLs.");
    } finally {
      setSaving(false);
    }
  };

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

      <div className="space-y-1 text-gray-300">
        <p>
          <strong>Program:</strong> {student.program}
        </p>
        <p>
          <strong>CGPA:</strong>{" "}
          {student.cgpa ? parseFloat(student.cgpa.toString()).toFixed(2) : "-"}
        </p>
      </div>

      {/* Profile URLs Section */}
      <div className="bg-zinc-900 p-4 rounded-lg space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">Online Profiles</h3>
            <p className="text-xs text-gray-400 mt-1">
              Profile analysis runs automatically when courses are added/updated
            </p>
          </div>
          <button
            onClick={saveProfileUrls}
            disabled={saving}
            className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition disabled:opacity-50"
          >
            {saving ? "Saving..." : "💾 Save URLs"}
          </button>
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">GitHub URL</label>
          <input
            className="w-full bg-zinc-700 p-2 rounded-md text-sm"
            placeholder="https://github.com/username"
            value={profileUrls.github_url}
            onChange={(e) =>
              setProfileUrls({ ...profileUrls, github_url: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">
            LinkedIn URL
          </label>
          <input
            className="w-full bg-zinc-700 p-2 rounded-md text-sm"
            placeholder="https://linkedin.com/in/username"
            value={profileUrls.linkedin_url}
            onChange={(e) =>
              setProfileUrls({ ...profileUrls, linkedin_url: e.target.value })
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
            value={profileUrls.portfolio_url}
            onChange={(e) =>
              setProfileUrls({ ...profileUrls, portfolio_url: e.target.value })
            }
          />
        </div>
      </div>

      <CourseSection studentId={student.id} />
      <CocurricularSection studentId={student.id} />
    </div>
  );
}
