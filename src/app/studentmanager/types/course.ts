// src/app/studentmanager/types/course.ts
export interface Course {
  id: number;
  student_id: number;
  course_name: string;
  course_code: string | null;
  grade: string | null;
  credit_hour: number | null;
  course_description: string | null;
  created_at: string;
}
