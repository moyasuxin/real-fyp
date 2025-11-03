"use client";
import React, { useState, ChangeEvent } from "react";

export interface StudentFormData {
  name: string;
  gender: string; // ✅ Added this
  program: string;
  cgpa: number;
  programming_score: number;
  design_score: number;
  it_infrastructure_score: number;
  co_curricular_points: number;
  github_url: string;
  linkedin_url: string;
  portfolio_url: string;
  course_id: string;
  course_name: string;
  course_title: string;
  course_description: string;
  unit: number;
  social_media: string;
}

interface Props {
  onSubmit: (data: StudentFormData) => void;
  loading: boolean;
}

type FormState = Record<
  keyof Omit<
    StudentFormData,
    | "cgpa"
    | "programming_score"
    | "design_score"
    | "it_infrastructure_score"
    | "co_curricular_points"
    | "unit"
  >,
  string
> & {
  cgpa: string;
  programming_score: string;
  design_score: string;
  it_infrastructure_score: string;
  co_curricular_points: string;
  unit: string;
};

export default function StudentForm({ onSubmit, loading }: Props) {
  const [form, setForm] = useState<FormState>({
    name: "",
    gender: "", // ✅ Added
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

  const handleChange = <K extends keyof FormState>(
    key: K,
    value: string
  ): void => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...form,
      cgpa: parseFloat(form.cgpa),
      programming_score: parseInt(form.programming_score),
      design_score: parseInt(form.design_score),
      it_infrastructure_score: parseInt(form.it_infrastructure_score),
      co_curricular_points: parseInt(form.co_curricular_points),
      unit: form.unit ? parseFloat(form.unit) : 3.0,
    });
    setForm({
      name: "",
      gender: "",
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
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-zinc-800 p-6 rounded-2xl shadow-lg space-y-4"
    >
      <div className="grid grid-cols-2 gap-4">
        {(
          Object.keys(form).filter((key) => key !== "social_media") as Array<
            keyof FormState
          >
        ).map((key) => (
          <input
            key={key}
            type="text"
            placeholder={key.replace(/_/g, " ").toUpperCase()}
            value={form[key]}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleChange(key, e.target.value)
            }
            className="bg-zinc-700 p-2 rounded-md text-white"
          />
        ))}
      </div>

      <textarea
        placeholder="Social Media / Activity Links"
        value={form.social_media}
        onChange={(e) => handleChange("social_media", e.target.value)}
        className="bg-zinc-700 p-2 rounded-md text-white w-full"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full mt-4 py-2 bg-lime-400 text-black font-semibold rounded-md hover:bg-lime-500 disabled:opacity-50"
      >
        {loading ? "Saving..." : "Add Student"}
      </button>
    </form>
  );
}
