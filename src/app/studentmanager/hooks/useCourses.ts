// src/app/studentmanager/hooks/useCourses.ts
"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/services/supabaseClient";
import { Course } from "../types/course";

export function useCourses(studentId?: number) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!studentId) return;

    const fetchCourses = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("student_id", studentId)
        .order("id", { ascending: true });

      if (error) {
        console.error("Error fetching courses:", error);
      } else if (data) {
        setCourses(data);
      }

      setLoading(false);
    };

    fetchCourses();
  }, [studentId]);

  const addCourse = async (course: Omit<Course, "id" | "created_at">) => {
    setLoading(true);

    const { data, error } = await supabase
      .from("courses")
      .insert([course])
      .select("*");

    if (error) {
      console.error("Error adding course:", error);
    } else if (data?.[0]) {
      setCourses((prev) => [...prev, data[0]]);
    }

    setLoading(false);
  };

  const deleteCourse = async (id: number) => {
    setLoading(true);
    const { error } = await supabase.from("courses").delete().eq("id", id);

    if (error) {
      console.error("Error deleting course:", error);
    } else {
      setCourses((prev) => prev.filter((c) => c.id !== id));
    }

    setLoading(false);
  };

  return { courses, loading, addCourse, deleteCourse };
}
