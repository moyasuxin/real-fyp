import { NextResponse } from "next/server";
import { supabase } from "@/services/supabaseClient";

// Define proper type for course data
interface Course {
  id: number;
  student_id: number;
  course_name: string;
  course_code?: string | null;
  grade?: string | null;
  credit_hour?: number | null;
  unit?: number | null;
  description?: string | null;
  created_at?: string | null;
}

const gradePoints: Record<string, number> = {
  "A+": 4.0,
  A: 4.0,
  "A-": 3.67,
  "B+": 3.33,
  B: 3.0,
  "B-": 2.67,
  "C+": 2.33,
  C: 2.0,
  "D+": 1.33,
  D: 1.0,
  F: 0.0,
};

// 🎓 Compute GPA (ignore CR and invalid grades)
function computeGPA(courses: Course[]) {
  let totalUnits = 0;
  let totalWeighted = 0;
  let gradedUnits = 0;

  for (const c of courses) {
    const grade = (c.grade || "").toUpperCase().trim();
    const unit = parseFloat(String(c.credit_hour ?? c.unit ?? 0));

    if (!unit || grade === "CR" || !(grade in gradePoints)) continue;

    gradedUnits += unit;
    totalUnits += unit;
    totalWeighted += gradePoints[grade] * unit;
  }

  const gpa = gradedUnits > 0 ? totalWeighted / gradedUnits : 0;
  return {
    total_courses: courses.length,
    total_units: parseFloat(totalUnits.toFixed(3)),
    total_graded_units: parseFloat(gradedUnits.toFixed(3)),
    total_weighted_points: parseFloat(totalWeighted.toFixed(3)),
    gpa: parseFloat(gpa.toFixed(3)),
  };
}

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId");

    if (!studentId) {
      return NextResponse.json({ error: "Missing studentId" }, { status: 400 });
    }

    // 1️⃣ Fetch all courses for this student
    const { data: courses, error } = await supabase
      .from("courses")
      .select("*")
      .eq("student_id", studentId);

    if (error || !courses) {
      console.error("Error fetching courses:", error);
      return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
    }

    // 2️⃣ Compute GPA
    const result = computeGPA(courses);

    // 3️⃣ Save CGPA to students table
    const { error: updateError } = await supabase
      .from("students")
      .update({ cgpa: result.gpa.toString() })
      .eq("id", studentId);

    if (updateError) {
      console.error("Error updating student CGPA:", updateError);
      return NextResponse.json({ error: "Failed to update CGPA" }, { status: 500 });
    }

    // 4️⃣ Return the result (for ML or logging)
    return NextResponse.json({
      message: "GPA computed successfully",
      studentId,
      ...result,
    });
  } catch (err) {
    console.error("Error in retrain route:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
