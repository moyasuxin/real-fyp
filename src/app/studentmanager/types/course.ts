// src/app/studentmanager/types/course.ts
"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/services/supabaseClient";

export interface Course {
  id: number;
  student_id: number;
  course_name: string;
  course_code?: string | null;
  grade?: string | null;
  unit?: number | null;
  description?: string | null;
  created_at?: string;
}

export function useCourses(studentId?: number) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch courses for this student
  useEffect(() => {
    if (!studentId) return;
    const fetchCourses = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("student_id", studentId)
        .order("id", { ascending: true });

      if (error) console.error("Error fetching courses:", error);
      else if (data) setCourses(data);

      setLoading(false);
    };

    fetchCourses();
  }, [studentId]);

  // 🔹 Add a new course
  const addCourse = async (course: Omit<Course, "id">) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("courses")
      .insert([
        {
          student_id: course.student_id,
          course_name: course.course_name,
          course_code: course.course_code ?? null,
          grade: course.grade ?? null,
          unit: course.unit ?? null,
          description: course.description ?? null,
        },
      ])
      .select("*");

    if (error) console.error("Error adding course:", error);
    else if (data?.[0]) setCourses((prev) => [...prev, data[0]]);

    setLoading(false);
  };

  // 🔹 Delete a course
  const deleteCourse = async (id: number) => {
    setLoading(true);
    const { error } = await supabase.from("courses").delete().eq("id", id);
    if (error) console.error("Error deleting course:", error);
    else setCourses((prev) => prev.filter((c) => c.id !== id));
    setLoading(false);
  };

  return { courses, loading, addCourse, deleteCourse };
}
