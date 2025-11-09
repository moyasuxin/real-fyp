// src/app/studentmanager/hooks/useStudents.ts
"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/services/supabaseClient";
import { Student } from "../types/student";

export function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStudents() {
      setLoading(true);
      const { data, error } = await supabase.from("students").select("*");
      if (error) console.error(error);
      else setStudents(data as Student[]);
      setLoading(false);
    }

    fetchStudents();
  }, []);

  async function addStudent(newStudent: Partial<Student>) {
    const { data, error } = await supabase.from("students").insert(newStudent).select("*");
    if (!error && data) setStudents([...students, ...data]);
  }

  async function deleteStudent(id: number) {
    const { error } = await supabase.from("students").delete().eq("id", id);
    if (!error) setStudents(students.filter((s) => s.id !== id));
  }

  return { students, loading, addStudent, deleteStudent };
}
