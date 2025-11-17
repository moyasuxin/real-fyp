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
  credit_hour?: number | null;
  course_description?: string | null;
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
    // Accept both `unit` and `credit_hour` in the payload to be tolerant
    const cWithUnit = course as Omit<Course, "id"> & { unit?: number | null };
    const creditHourValue = cWithUnit.unit ?? course.credit_hour ?? null;

    const insertPayload = {
      student_id: course.student_id,
      course_name: course.course_name,
      course_code: course.course_code ?? null,
      grade: course.grade ?? null,
      credit_hour: creditHourValue,
      course_description: course.course_description ?? null,
    };

    const { data, error } = await supabase
      .from("courses")
      .insert([insertPayload])
      .select("*");

    if (error) {
      try {
        console.error("Error adding course:", JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
      } catch (err) {
        console.error("Error adding course (non-serializable):", error, err);
      }
    } else if (data?.[0]) {
      setCourses((prev) => [...prev, data[0]]);
    }

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
