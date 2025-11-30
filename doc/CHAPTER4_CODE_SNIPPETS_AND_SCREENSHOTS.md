# Chapter 4: Code Snippets & Screenshot Capture Guide

This document provides **ready-to-use code snippets** and **step-by-step screenshot instructions** for Chapter 4 of your FYP report.

---

## 📋 Quick Navigation

- [Code Snippets](#code-snippets)
  - [4.4.2 Database RLS Policy](#442-database-rls-policy)
  - [4.4.3 ML Prediction Endpoint](#443-ml-prediction-endpoint)
  - [4.4.4 Gemini API Integration](#444-gemini-api-integration)
  - [4.4.5 Radar Chart Implementation](#445-radar-chart-implementation)
  - [Additional: CSV Upload Handler](#additional-csv-upload-handler)
  - [Additional: ML Retrain API](#additional-ml-retrain-api)
- [Screenshot Checklist](#screenshot-checklist)

---

## 🔧 Code Snippets

### 4.4.2 Database RLS Policy

**Insert Location:** Section 4.4.2 after "Example RLS Policy:"

**Description:** Row-Level Security policy ensuring authenticated users can read student records.

**Code:**

```sql
-- Enable RLS on students table
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to read all student records
CREATE POLICY "Enable read access for authenticated users"
ON public.students
AS PERMISSIVE FOR SELECT
TO authenticated
USING (true);

-- Policy: Students can only view their own record
CREATE POLICY "Students view own record"
ON public.students
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Policy: Admins have full access
CREATE POLICY "Admins full access"
ON public.students
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.id = auth.uid()
    AND admin_users.role = 'admin'
  )
);
```

**Source File:** Database migrations or Supabase SQL Editor

---

### 4.4.3 ML Prediction Endpoint

**Insert Location:** Section 4.4.3 after "Prediction API Endpoint"

**Description:** FastAPI endpoint that loads the trained Random Forest model and returns six competency predictions.

**Code:**

```python
# ml/api_server.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import numpy as np
from typing import List

app = FastAPI()

# Load the trained model at startup
try:
    model = joblib.load("model.joblib")
    print("✅ Model loaded successfully")
except Exception as e:
    print(f"❌ Model loading failed: {e}")
    model = None

class StudentRequest(BaseModel):
    features: List[float]  # 14 features: 5 academic + 9 multimodal

class PredictionResponse(BaseModel):
    scores: List[float]  # 6 competency scores (0-100)
    model_version: str

@app.post("/predict", response_model=PredictionResponse)
async def predict_student(data: StudentRequest):
    """
    Predicts six competency scores for a student.

    Input: 14 features (CGPA, domain GPAs, sentiment, rubric scores, GitHub metrics, etc.)
    Output: 6 scores (Programming, Design, Infrastructure, Co-curricular, Feedback, Professional)
    """
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")

    try:
        # Reshape features for prediction
        features_array = np.array(data.features).reshape(1, -1)

        # Generate predictions
        predictions = model.predict(features_array)

        # Clip scores to valid range [0, 100]
        scores = np.clip(predictions[0], 0, 100).tolist()

        return PredictionResponse(
            scores=scores,
            model_version="v1.0_sha256_abc123"  # Use actual hash in production
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.get("/health")
async def health_check():
    """Health check endpoint for Railway deployment monitoring."""
    return {
        "status": "healthy",
        "model_loaded": model is not None
    }
```

**Source File:** `ml/api_server.py`

---

### 4.4.4 Gemini API Integration

**Insert Location:** Section 4.4.4 after "API Request Management"

**Description:** Server-side Gemini API call with retry logic for 429/503 errors.

**Code:**

```typescript
// src/app/api/gemini-summary/route.ts
import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`;

export async function POST(request: NextRequest) {
  try {
    const { studentData, githubProfile, activities } = await request.json();

    // Construct deterministic prompt
    const prompt = `
You are an expert Academic Career Counselor. Analyze the following student profile:

**Student:** ${studentData.name}
**CGPA:** ${studentData.cgpa}
**Program:** ${studentData.program}

**GitHub Activity:**
${
  githubProfile?.repos
    ?.map((r: any) => `- ${r.name} (${r.language})`)
    .join("\n") || "No GitHub data"
}

**Co-curricular Activities:**
${
  activities?.map((a: any) => `- ${a.activity_name} (${a.role})`).join("\n") ||
  "No activities"
}

**Task:** Generate a career summary highlighting:
1. Academic strengths and areas for improvement
2. Technical skills demonstrated through GitHub projects
3. Leadership and soft skills from co-curricular involvement
4. Three recommended career pathways aligned with MQF domains

**Constraints:**
- Do NOT reveal numeric competency scores
- Use qualitative descriptors (strong, moderate, developing)
- If data is missing, focus on available indicators
- Keep response under 300 words
`;

    // Retry logic for rate limits and server errors
    let attempts = 0;
    const maxAttempts = 3;
    let response;

    while (attempts < maxAttempts) {
      try {
        response = await fetch(GEMINI_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }],
              },
            ],
            generationConfig: {
              temperature: 0, // Deterministic output
              topP: 1,
              maxOutputTokens: 500,
            },
          }),
        });

        // Success case
        if (response.ok) {
          const data = await response.json();
          const generatedText =
            data.candidates?.[0]?.content?.parts?.[0]?.text || "";

          // Sanitize output (remove placeholders, incomplete tokens)
          const sanitized = generatedText.replace(/\[.*?\]/g, "").trim();

          return NextResponse.json({ summary: sanitized });
        }

        // Rate limit (429) or server error (503) - retry with backoff
        if (response.status === 429 || response.status === 503) {
          attempts++;
          const backoffDelay = 2000 * (attempts + 1); // Exponential backoff: 4s, 6s, 8s
          console.warn(
            `⚠️ Gemini API ${response.status}, retrying in ${backoffDelay}ms (attempt ${attempts}/${maxAttempts})`
          );
          await new Promise((resolve) => setTimeout(resolve, backoffDelay));
          continue;
        }

        // Other errors - fail immediately
        throw new Error(
          `Gemini API error: ${response.status} ${response.statusText}`
        );
      } catch (fetchError) {
        if (attempts >= maxAttempts - 1) throw fetchError;
        attempts++;
      }
    }

    throw new Error("Max retry attempts reached");
  } catch (error: any) {
    console.error("❌ Gemini API failed:", error);
    return NextResponse.json(
      { error: "Failed to generate summary", details: error.message },
      { status: 502 }
    );
  }
}
```

**Source File:** `src/app/api/gemini-summary/route.ts`

---

### 4.4.5 Radar Chart Implementation

**Insert Location:** Section 4.4.5 after "Radar Chart:"

**Description:** Chart.js radar component with six competency axes (0-100 scale).

**Code:**

```typescript
// src/app/dashboard/components/StudentRadarChart.tsx
"use client";

import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface StudentRadarChartProps {
  scores: {
    programming: number;
    design: number;
    infrastructure: number;
    cocurricular: number;
    feedback: number;
    professional: number;
  };
}

export default function StudentRadarChart({ scores }: StudentRadarChartProps) {
  const data = {
    labels: [
      "Programming",
      "Design/UI",
      "IT Infrastructure",
      "Co-curricular",
      "Feedback Sentiment",
      "Professional Engagement",
    ],
    datasets: [
      {
        label: "Competency Scores",
        data: [
          scores.programming,
          scores.design,
          scores.infrastructure,
          scores.cocurricular,
          scores.feedback,
          scores.professional,
        ],
        backgroundColor: "rgba(14, 165, 233, 0.2)", // Cyan with opacity
        borderColor: "rgba(14, 165, 233, 1)", // Solid cyan
        borderWidth: 2,
        pointBackgroundColor: "rgba(14, 165, 233, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(14, 165, 233, 1)",
      },
    ],
  };

  const options: ChartOptions<"radar"> = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      r: {
        min: 0,
        max: 100,
        ticks: {
          stepSize: 20,
          color: "#94a3b8", // Slate gray for readability
        },
        grid: {
          color: "rgba(148, 163, 184, 0.2)",
        },
        pointLabels: {
          color: "#e2e8f0", // Light gray for dark mode
          font: {
            size: 12,
          },
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: "#e2e8f0",
        },
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        titleColor: "#fff",
        bodyColor: "#cbd5e1",
        callbacks: {
          label: (context) => {
            return `${context.label}: ${context.parsed.r.toFixed(1)}`;
          },
        },
      },
    },
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Radar data={data} options={options} />
    </div>
  );
}
```

**Source File:** `src/app/dashboard/components/StudentRadarChart.tsx`

---

### Additional: CSV Upload Handler

**Insert Location:** Optional - can be added to Section 4.4.2 under "CSV Ingestion Workflow"

**Description:** Client-side CSV upload component with validation.

**Code:**

```typescript
// src/app/studentmanager/components/CourseCSVUpload.tsx
"use client";

import { useState } from "react";

export default function CourseCSVUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<{
    success: number;
    failed: number;
    errors: string[];
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/courses/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Upload failed:", error);
      setResult({ success: 0, failed: 0, errors: ["Upload failed"] });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 bg-slate-800 rounded-lg">
      <h3 className="text-xl font-semibold mb-4">CSV Bulk Upload</h3>

      <div className="mb-4">
        <a
          href="/course_template.csv"
          download
          className="text-cyan-400 hover:underline"
        >
          📥 Download Template
        </a>
      </div>

      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="mb-4 text-white"
      />

      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-500 px-4 py-2 rounded"
      >
        {uploading ? "Uploading..." : "Upload CSV"}
      </button>

      {result && (
        <div className="mt-4 p-4 bg-slate-700 rounded">
          <p className="text-green-400">✅ Success: {result.success} rows</p>
          <p className="text-red-400">❌ Failed: {result.failed} rows</p>
          {result.errors.length > 0 && (
            <ul className="mt-2 text-sm text-red-300">
              {result.errors.map((err, i) => (
                <li key={i}>• {err}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
```

**Source File:** `src/app/studentmanager/components/CourseCSVUpload.tsx`

---

### Additional: ML Retrain API

**Insert Location:** Optional - can be added to Section 4.4.3 after "Deployment"

**Description:** API route to trigger model retraining.

**Code:**

```typescript
// src/app/api/ml/retrain/route.ts
import { NextResponse } from "next/server";

const ML_SERVICE_URL =
  process.env.ML_SERVICE_URL || "https://your-railway-app.railway.app";

export async function POST() {
  try {
    const response = await fetch(`${ML_SERVICE_URL}/retrain`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`ML service returned ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      modelVersion: data.model_version,
      trainedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Retraining failed", details: error.message },
      { status: 500 }
    );
  }
}
```

**Source File:** `src/app/api/ml/retrain/route.ts`

---

## 📸 Screenshot Checklist

### Pre-requisites

- ✅ Start development server: `npm run dev` (in project root)
- ✅ Ensure database has sample student data
- ✅ Have test accounts ready:
  - Admin: `admin@test.com` / `password123`
  - Lecturer: `lecturer@test.com` / `password123`
  - Student: `student@test.com` / `password123`

---

### Figure 12: Agile Development Cycle

**Status:** ✅ Already inserted (diagram from Word)

---

### Figure 13: System Use Case Diagram

**Status:** ✅ Already inserted (diagram from Word)

---

### Figure 14: High-Level System Architecture

**Status:** ✅ Already inserted (diagram from Word)

---

### Figure 15: Entity Relationship Diagram

**Status:** ✅ Already inserted (diagram from Word)

---

### Figure 16: Login Page Wireframe

**Screenshot Steps:**

1. Navigate to: `http://localhost:3000/login`
2. Ensure page shows:
   - Email input field
   - Password input field
   - "Login" button
   - Clean, dark-themed UI
3. **Capture:** Full browser window at 1920×1080
4. **Tool:** Windows Snipping Tool (Win + Shift + S) or browser dev tools screenshot
5. **Save as:** `figure_16_login_page.png`

**Status:** ⬜ Pending screenshot capture

---

### Figure 17: Account Creation Page Wireframe

**Screenshot Steps:**

1. Log in as **Admin** first
2. Navigate to: `http://localhost:3000/create-account`
3. Ensure page shows:
   - Email input
   - Password input
   - Role dropdown (Student/Lecturer/Admin)
   - "Create Account" button
4. **Capture:** Full page view
5. **Save as:** `figure_17_create_account.png`

**Status:** ⬜ Pending screenshot capture

---

### Figure 18: Dashboard Page Wireframe

**Screenshot Steps:**

1. Log in as **Lecturer**
2. Navigate to: `http://localhost:3000/dashboard`
3. Ensure visible:
   - **Left panel:** Student list with names, CGPA, program
   - **Center panel:** Selected student profile with:
     - Biodata (name, CGPA, program)
     - Six-axis radar chart
     - AI-generated narrative summary
     - Career recommendations
   - **Right panel:** Lecturer comments section
4. **Capture:** Full three-panel layout at 1920×1080
5. **Save as:** `figure_18_dashboard.png`

**Status:** ⬜ Pending screenshot capture

---

### Figure 19: Student Management Tab Wireframe

**Screenshot Steps:**

1. Log in as **Admin**
2. Navigate to: `http://localhost:3000/studentmanager`
3. Click **"Students"** tab
4. Ensure visible:
   - Table with columns: Name, Program, CGPA, 6 competency scores
   - "Create Student" button (top-right)
   - Edit/Delete buttons per row
5. **Capture:** Full table view
6. **Save as:** `figure_19_student_management.png`

**Status:** ⬜ Pending screenshot capture

---

### Figure 20: Course Management Tab with CSV Upload

**Screenshot Steps:**

1. Still in `/studentmanager` as Admin
2. Click **"Courses"** tab
3. Ensure visible:
   - CSV file input selector
   - "Download Template" link
   - Upload button
   - Course data table below
4. **Optional:** Trigger an upload to show progress/errors
5. **Capture:** Full tab view showing upload interface
6. **Save as:** `figure_20_course_csv_upload.png`

**Status:** ⬜ Pending screenshot capture

---

### Figure 21: Co-curricular Management Tab

**Screenshot Steps:**

1. Still in `/studentmanager` as Admin
2. Click **"Co-curricular"** tab
3. Ensure visible:
   - Activity entry form:
     - Student selector dropdown
     - Activity name input
     - Role input
     - Description textarea
     - "Analyze" button (triggers AI scoring)
   - Activity table below showing:
     - Activity name, organization, role
     - AI scores (Impact, Leadership, Relevance)
4. **Capture:** Full tab view
5. **Save as:** `figure_21_cocurricular_management.png`

**Status:** ⬜ Pending screenshot capture

---

### Figure 22: ML Model Retraining Tab

**Screenshot Steps:**

1. Still in `/studentmanager` as Admin
2. Click **"ML Retraining"** tab
3. Ensure visible:
   - "Retrain Model" button
   - Model metadata display:
     - Current model version (SHA256 hash)
     - Last training date
     - Feature count
   - Status indicator (e.g., "Model loaded successfully")
4. **Optional:** Click retrain to show progress modal
5. **Capture:** Full tab view with metadata
6. **Save as:** `figure_22_ml_retraining.png`

**Status:** ⬜ Pending screenshot capture

---

### Figure 23: Student Profile Page

**Screenshot Steps:**

1. Log out and log in as **Student**
2. Navigate to: `http://localhost:3000/profile`
3. Ensure visible:
   - Student name and biodata
   - Six-axis radar chart (same as dashboard but read-only)
   - AI-generated narrative summary
   - Footer with GitHub/LinkedIn/Portfolio links
4. **Capture:** Full page view
5. **Save as:** `figure_23_student_profile.png`

**Status:** ⬜ Pending screenshot capture

---

## ✅ Post-Capture Checklist

Once all screenshots are captured:

1. ⬜ Rename files with consistent naming (e.g., `figure_16_login_page.png`)
2. ⬜ Place all images in `doc/figures/` folder
3. ⬜ Insert images into report at appropriate locations
4. ⬜ Add figure captions below each image
5. ⬜ Verify all figures are referenced in text (e.g., "as shown in Figure 16")
6. ⬜ Check image resolution (minimum 1920×1080 for UI screenshots)
7. ⬜ Ensure consistent styling (same zoom level, same browser window size)

---

## 🎯 Quick Reference: What Goes Where

| Item                       | Report Section   | Status     |
| -------------------------- | ---------------- | ---------- |
| RLS Policy Code            | 4.4.2            | ⬜ Insert  |
| ML Prediction Code         | 4.4.3            | ⬜ Insert  |
| Gemini API Code            | 4.4.4            | ⬜ Insert  |
| Radar Chart Code           | 4.4.5            | ⬜ Insert  |
| CSV Upload Code            | 4.4.2 (optional) | ⬜ Insert  |
| Retrain API Code           | 4.4.3 (optional) | ⬜ Insert  |
| Figure 16 (Login)          | 4.3.4 UI Design  | ⬜ Capture |
| Figure 17 (Create Account) | 4.3.4 UI Design  | ⬜ Capture |
| Figure 18 (Dashboard)      | 4.3.4 UI Design  | ⬜ Capture |
| Figure 19 (Student Tab)    | 4.3.4 UI Design  | ⬜ Capture |
| Figure 20 (CSV Upload)     | 4.3.4 UI Design  | ⬜ Capture |
| Figure 21 (Co-curricular)  | 4.3.4 UI Design  | ⬜ Capture |
| Figure 22 (ML Retrain)     | 4.3.4 UI Design  | ⬜ Capture |
| Figure 23 (Profile)        | 4.3.4 UI Design  | ⬜ Capture |

---

## 💡 Tips

- **Screenshot Consistency:** Use the same browser window size (1920×1080) for all UI captures
- **Code Formatting:** Use proper syntax highlighting when pasting into Word (VS Code → Copy with Syntax Highlighting)
- **File Organization:** Create a `doc/figures/chapter4/` folder to keep everything organized
- **Version Control:** Commit screenshots to Git with descriptive names
- **Testing First:** Ensure all features work before capturing screenshots (no error states unless intentional)

---

**Last Updated:** November 30, 2025  
**Document Version:** 1.0
