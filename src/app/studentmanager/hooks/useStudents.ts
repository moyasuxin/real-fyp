// src/app/studentmanager/hooks/useStudents.ts
"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/services/supabaseClient";
import { StudentFormData } from "../components/StudentForm";

export interface Student {
  id: number;
  name: string;
  gender: string;
  dob: string;
  image_url: string;
  description: string | null;
  analysis: { [key: string]: number } | null;
  level: string;
  program: string;
  cgpa: number | null;
  programming_score: number | null;
  design_score: number | null;
  it_infrastructure_score: number | null;
  co_curricular_points: number | null;
  github_url: string | null;
  linkedin_url: string | null;
  portfolio_url: string | null;
  recommended_career: string | null;
  feedback: string | null;
  social_media: string | null;
  created_at: string | null;
}

export function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch students from Supabase
  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .order("id", { ascending: true });

      if (error) console.error("Error fetching students:", error);
      else setStudents(data || []);
      setLoading(false);
    };

    fetchStudents();
  }, []);

  // 🔹 Add student
  const addStudent = async (data: StudentFormData) => {
    setLoading(true);
    try {
      const newStudent = {
        ...data,
        dob: new Date().toISOString().split("T")[0],
        image_url: "",
        description: "",
        analysis: {},
        level: "Undergraduate",
        feedback: null,
        recommended_career: null,
      };

      const { data: inserted, error } = await supabase
        .from("students")
        .insert([newStudent])
        .select();

      if (error) throw error;
      if (inserted && inserted.length > 0) {
        setStudents((prev) => [...prev, inserted[0]]);
      }
    } catch (err) {
      console.error("Error adding student:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Delete student
  const deleteStudent = async (id: number) => {
    setLoading(true);
    try {
      const { error } = await supabase.from("students").delete().eq("id", id);
      if (error) throw error;
      setStudents((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Error deleting student:", err);
    } finally {
      setLoading(false);
    }
  };

  return { students, loading, addStudent, deleteStudent };
}
