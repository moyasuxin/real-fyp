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
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUrl, setImageUrl] = useState(student?.image_url || "");

  if (!student) return null;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    setUploadingImage(true);
    try {
      // Generate unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${student.id}-${Date.now()}.${fileExt}`;
      const filePath = `student-images/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("student-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("student-images").getPublicUrl(filePath);

      // Update student record with new image URL
      const { error: updateError } = await supabase
        .from("students")
        .update({ image_url: publicUrl })
        .eq("id", student.id);

      if (updateError) throw updateError;

      setImageUrl(publicUrl);
      alert("Profile picture updated successfully!");
    } catch (error) {
      console.error("Failed to upload image:", error);
      alert("Failed to upload profile picture. Please try again.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = async () => {
    if (!confirm("Are you sure you want to remove the profile picture?"))
      return;

    try {
      const { error } = await supabase
        .from("students")
        .update({ image_url: null })
        .eq("id", student.id);

      if (error) throw error;

      setImageUrl("");
      alert("Profile picture removed successfully!");
    } catch (error) {
      console.error("Failed to remove image:", error);
      alert("Failed to remove profile picture.");
    }
  };

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

      {/* Profile Picture Section */}
      <div className="bg-zinc-900 p-4 rounded-lg space-y-3">
        <h3 className="text-lg font-semibold">Profile Picture</h3>

        <div className="flex items-center gap-4">
          {/* Image Preview */}
          <div className="w-24 h-24 rounded-full overflow-hidden bg-zinc-700 flex items-center justify-center">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={student.name || "Student"}
                className="w-full h-full object-cover"
              />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            )}
          </div>

          {/* Upload/Remove Buttons */}
          <div className="flex-1 space-y-2">
            <label
              htmlFor="image-upload"
              className={`inline-block px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
                uploadingImage
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {uploadingImage ? "Uploading..." : "📤 Upload New Picture"}
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploadingImage}
              className="hidden"
            />

            {imageUrl && (
              <button
                onClick={handleRemoveImage}
                className="ml-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition"
              >
                🗑️ Remove Picture
              </button>
            )}

            <p className="text-xs text-gray-400">
              Recommended: Square image, max 5MB (JPG, PNG, GIF)
            </p>
          </div>
        </div>
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
