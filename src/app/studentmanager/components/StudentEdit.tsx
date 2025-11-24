"use client";
import React, { useState } from "react";
import { Student } from "../types/student";
import CourseSection from "./CourseSection";
import CocurricularSection from "./CocurricularSection";
import { supabase } from "@/services/supabaseClient";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";

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
    <Card className="glass border-white/20 w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
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
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Edit Student — {student.name}
          </CardTitle>
          <Button onClick={onClose} variant="secondary" size="sm">
            Back
          </Button>
        </div>
        <div className="flex gap-2 mt-3">
          <Badge variant="primary">{student.program}</Badge>
          {student.cgpa && (
            <Badge
              variant={
                parseFloat(student.cgpa.toString()) >= 3.5
                  ? "success"
                  : "primary"
              }
            >
              CGPA: {parseFloat(student.cgpa.toString()).toFixed(2)}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Profile Picture Section */}
        <div className="glass border border-white/20 p-4 rounded-lg space-y-3">
          <h3 className="text-lg font-semibold text-white">Profile Picture</h3>

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
                    : "bg-primary hover:bg-primary/90 text-white shadow-lg"
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
                  className="ml-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition"
                >
                  🗑️ Remove Picture
                </button>
              )}

              <p className="text-xs text-white/60">
                Recommended: Square image, max 5MB (JPG, PNG, GIF)
              </p>
            </div>
          </div>
        </div>

        {/* Profile URLs Section */}
        <div className="glass border border-white/20 p-4 rounded-lg space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-white">
                Online Profiles
              </h3>
              <p className="text-xs text-white/60 mt-1">
                Profile analysis runs automatically when courses are
                added/updated
              </p>
            </div>
            <Button
              onClick={saveProfileUrls}
              loading={saving}
              disabled={saving}
              variant="success"
              size="sm"
            >
              {saving ? "Saving..." : "💾 Save URLs"}
            </Button>
          </div>

          <Input
            label="GitHub URL"
            placeholder="https://github.com/username"
            value={profileUrls.github_url}
            onChange={(e) =>
              setProfileUrls({ ...profileUrls, github_url: e.target.value })
            }
            className="glass text-white border-white/30"
          />

          <Input
            label="LinkedIn URL"
            placeholder="https://linkedin.com/in/username"
            value={profileUrls.linkedin_url}
            onChange={(e) =>
              setProfileUrls({ ...profileUrls, linkedin_url: e.target.value })
            }
            className="glass text-white border-white/30"
          />

          <Input
            label="Portfolio URL"
            placeholder="https://yourportfolio.com"
            value={profileUrls.portfolio_url}
            onChange={(e) =>
              setProfileUrls({ ...profileUrls, portfolio_url: e.target.value })
            }
            className="glass text-white border-white/30"
          />
        </div>

        <CourseSection studentId={student.id} />
        <CocurricularSection studentId={student.id} />
      </CardContent>
    </Card>
  );
}
