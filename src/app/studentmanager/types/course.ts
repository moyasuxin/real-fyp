// src/app/studentmanager/types/course.ts
"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/services/supabaseClient";

export interface Course {
  id: number;
  student_id: number;
  course_name: string;
  course_code: string;
  grade: string;
  point: number;
  unit: number;
  description: string | null;
}

export function useCourses(studentId?: number) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch all or by student_id
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      let query = supabase.from("courses").select("*");
      if (studentId) query = query.eq("student_id", studentId);

      const { data, error } = await query.order("id", { ascending: true });
      if (error) console.error("Error fetching courses:", error);
      else setCourses(data || []);
      setLoading(false);
    };

    fetchCourses();
  }, [studentId]);

  // Add a course
  const addCourse = async (newCourse: Omit<Course, "id">) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("courses")
        .insert([newCourse])
        .select();
      if (error) throw error;
      if (data && data.length > 0)
        setCourses((prev) => [...prev, data[0]]);
    } catch (err) {
      console.error("Error adding course:", err);
    } finally {
      setLoading(false);
    }
  };

  // Delete a course
  const deleteCourse = async (id: number) => {
    setLoading(true);
    try {
      const { error } = await supabase.from("courses").delete().eq("id", id);
      if (error) throw error;
      setCourses((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Error deleting course:", err);
    } finally {
      setLoading(false);
    }
  };

  return { courses, loading, addCourse, deleteCourse };
}
