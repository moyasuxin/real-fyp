"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/services/supabaseClient";
import { Student } from "../types/student";

export function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchStudents = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("students").select("*");
    if (error) console.error("Error fetching students:", error);
    else setStudents(data || []);
    setLoading(false);
  };

  const addStudent = async (studentData: Omit<Student, "id">) => {
    setLoading(true);
    const { error } = await supabase.from("students").insert([studentData]);
    if (error) console.error("Insert error:", error);
    else await fetchStudents();
    setLoading(false);
  };

  const deleteStudent = async (id: number) => {
    const { error } = await supabase.from("students").delete().eq("id", id);
    if (error) console.error("Delete error:", error);
    else await fetchStudents();
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return { students, loading, addStudent, deleteStudent };
}
