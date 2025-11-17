// src/app/api/ml/retrain/route.ts

import { NextResponse } from "next/server";
import { supabase } from "@/services/supabaseClient";
import { exec } from "child_process";
import { promisify } from "util";
import { existsSync } from "fs";
import path from "path";

const execAsync = promisify(exec);

// Define proper type for course data
interface Course {
  id: number;
  student_id: number;
  course_name: string;
  course_code?: string | null;
  grade?: string | null;
  credit_hour?: number | null;
  unit?: number | null;
  course_description?: string | null;
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
    const gpaResult = computeGPA(courses);

    // 3️⃣ Run Python ML prediction script
    const projectRoot = process.cwd();
    const pythonScript = path.join(projectRoot, "ml", "predict_student.py");
    const pythonPath = path.join(projectRoot, "ml", ".venv", "Scripts", "python.exe");

    let mlScores = null;
    let mlError = null;

    try {
      // Check if virtual environment exists, otherwise use system python
      const pythonCommand = existsSync(pythonPath)
        ? `"${pythonPath}"`
        : "python";

      const { stdout, stderr } = await execAsync(
        `${pythonCommand} "${pythonScript}" ${studentId}`,
        {
          cwd: projectRoot,
          timeout: 30000, // 30 second timeout
        }
      );

      if (stderr && !stderr.includes("Warning")) {
        console.error("Python stderr:", stderr);
      }

      const result = JSON.parse(stdout);

      if (result.success) {
        mlScores = result.scores;
      } else {
        mlError = result.error;
        console.error("ML prediction failed:", result.error);
      }
    } catch (err) {
      mlError = err instanceof Error ? err.message : "Unknown error";
      console.error("Error running ML prediction:", err);
    }

    // 4️⃣ Update student record with GPA and ML scores
    const updateData: Record<string, string> = {
      cgpa: gpaResult.gpa.toString(),
    };

    if (mlScores) {
      updateData.programming_score = mlScores.programming_score.toString();
      updateData.design_score = mlScores.design_score.toString();
      updateData.it_infrastructure_score = mlScores.it_infrastructure_score.toString();
      updateData.co_curricular_points = mlScores.co_curricular_points.toString();
      updateData.feedback_sentiment_score = mlScores.feedback_sentiment_score.toString();
      updateData.professional_engagement_score = mlScores.professional_engagement_score.toString();
    }

    const { error: updateError } = await supabase
      .from("students")
      .update(updateData)
      .eq("id", studentId);

    if (updateError) {
      console.error("Error updating student:", updateError);
      return NextResponse.json({ error: "Failed to update student" }, { status: 500 });
    }

    // 5️⃣ Return the result
    return NextResponse.json({
      message: "Student profile updated successfully",
      studentId,
      gpa: gpaResult,
      ml_scores: mlScores,
      ml_error: mlError,
    });
  } catch (err) {
    console.error("Error in retrain route:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
