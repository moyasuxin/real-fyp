// src/app/studentmanager/components/CourseCSVUpload.tsx
"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

interface CourseData {
  course_name: string;
  course_code: string;
  grade: string;
  credit_hour: number;
  course_description: string;
}

interface Props {
  onCoursesImported: (courses: CourseData[]) => void;
}

export default function CourseCSVUpload({ onCoursesImported }: Props) {
  const [showGuide, setShowGuide] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<CourseData[]>([]);
  const [error, setError] = useState<string>("");

  const parseCSV = (text: string): CourseData[] => {
    const lines = text.split("\n").filter((line) => line.trim());
    if (lines.length === 0) throw new Error("CSV file is empty");

    // Check if first line is header
    const firstLine = lines[0].toLowerCase();
    const hasHeader =
      firstLine.includes("course_name") ||
      firstLine.includes("course name") ||
      firstLine.includes("name");

    const dataLines = hasHeader ? lines.slice(1) : lines;

    const courses: CourseData[] = [];

    for (let i = 0; i < dataLines.length; i++) {
      const line = dataLines[i].trim();
      if (!line) continue;

      // Parse CSV line (handles quoted fields)
      const fields: string[] = [];
      let current = "";
      let inQuotes = false;

      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === "," && !inQuotes) {
          fields.push(current.trim());
          current = "";
        } else {
          current += char;
        }
      }
      fields.push(current.trim());

      // Validate minimum fields
      if (fields.length < 2) {
        throw new Error(
          `Line ${
            i + (hasHeader ? 2 : 1)
          }: At least course_name and grade are required`
        );
      }

      const [
        course_name,
        grade,
        course_code = "",
        credit_hour_str = "3",
        course_description = "",
      ] = fields;

      if (!course_name) {
        throw new Error(
          `Line ${i + (hasHeader ? 2 : 1)}: course_name cannot be empty`
        );
      }

      if (!grade) {
        throw new Error(
          `Line ${i + (hasHeader ? 2 : 1)}: grade cannot be empty`
        );
      }

      // Validate grade format
      const validGrades = [
        "A+",
        "A",
        "A-",
        "B+",
        "B",
        "B-",
        "C+",
        "C",
        "C-",
        "D+",
        "D",
        "F",
        "CR",
      ];
      if (!validGrades.includes(grade.toUpperCase())) {
        throw new Error(
          `Line ${
            i + (hasHeader ? 2 : 1)
          }: Invalid grade "${grade}". Must be one of: ${validGrades.join(
            ", "
          )}`
        );
      }

      const credit_hour = parseFloat(credit_hour_str) || 3;

      courses.push({
        course_name: course_name.trim(),
        course_code: course_code.trim(),
        grade: grade.toUpperCase(),
        credit_hour,
        course_description: course_description.trim(),
      });
    }

    return courses;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith(".csv")) {
      setError("Please select a CSV file");
      return;
    }

    setFile(selectedFile);
    setError("");

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = parseCSV(text);
        setPreview(parsed);
        setError("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to parse CSV");
        setPreview([]);
      }
    };
    reader.readAsText(selectedFile);
  };

  const handleImport = () => {
    if (preview.length === 0) {
      setError("No courses to import");
      return;
    }
    onCoursesImported(preview);
    // Reset
    setFile(null);
    setPreview([]);
    setError("");
  };

  const downloadTemplate = () => {
    const template = `course_name,grade,course_code,credit_hour,course_description
Software Quality Assurance,A,CSC3014,3,Software project-related subject
Web Development,B+,CSC2008,3,Frontend and backend web technologies
Database Systems,A-,CSC2014,4,Relational database design and SQL`;

    const blob = new Blob([template], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "course_template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="glass border-white/20">
      <CardContent className="space-y-4 pt-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            Import Courses from CSV
          </h3>
          <button
            onClick={() => setShowGuide(!showGuide)}
            className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
          >
            {showGuide ? "Hide" : "Show"} Format Guide
          </button>
        </div>

        {/* Format Guide */}
        {showGuide && (
          <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4 space-y-3">
            <h4 className="font-semibold text-blue-300">📋 CSV Format Guide</h4>
            <div className="text-sm text-white/80 space-y-2">
              <p>Your CSV file should have the following columns (in order):</p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>
                  <strong>course_name</strong> (required) - Name of the course
                </li>
                <li>
                  <strong>grade</strong> (required) - Grade received (A+, A, A-,
                  B+, B, B-, C+, C, C-, D+, D, F, CR)
                </li>
                <li>
                  <strong>course_code</strong> (optional) - Course code (e.g.,
                  CSC3014)
                </li>
                <li>
                  <strong>credit_hour</strong> (optional) - Credit hours
                  (default: 3)
                </li>
                <li>
                  <strong>course_description</strong> (optional) - Course
                  description
                </li>
              </ol>
              <div className="bg-black/40 p-3 rounded mt-2 font-mono text-xs overflow-x-auto">
                <div className="text-green-400">Example with header:</div>
                <div className="text-gray-300">
                  course_name,grade,course_code,credit_hour,course_description
                  <br />
                  Software Quality Assurance,A,CSC3014,3,Software project
                  subject
                  <br />
                  Web Development,B+,CSC2008,3,Web technologies
                </div>
                <div className="text-green-400 mt-2">
                  Example without header:
                </div>
                <div className="text-gray-300">
                  Database Systems,A-,CSC2014,4,Database design
                  <br />
                  Mobile App Development,B,CSC3016,3,Android and iOS
                </div>
              </div>
              <p className="text-yellow-300 text-xs">
                💡 Tip: You can include or omit the header row. The system will
                auto-detect it.
              </p>
            </div>
            <Button
              onClick={downloadTemplate}
              variant="secondary"
              size="sm"
              className="w-full"
            >
              📥 Download CSV Template
            </Button>
          </div>
        )}

        {/* File Upload */}
        <div className="space-y-3">
          <label className="block">
            <div className="border-2 border-dashed border-white/30 rounded-lg p-6 text-center hover:border-white/50 transition-colors cursor-pointer">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
              />
              <svg
                className="w-12 h-12 mx-auto mb-3 text-white/60"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-white/80 mb-1">
                {file ? file.name : "Click to select CSV file"}
              </p>
              <p className="text-white/60 text-sm">or drag and drop here</p>
            </div>
          </label>

          {/* Error Message */}
          {error && (
            <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-3 text-red-300 text-sm">
              <strong>Error:</strong> {error}
            </div>
          )}

          {/* Preview */}
          {preview.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-white">
                  Preview ({preview.length} courses)
                </h4>
                <Button onClick={handleImport} variant="success" size="sm">
                  ✅ Import {preview.length} Course
                  {preview.length > 1 ? "s" : ""}
                </Button>
              </div>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {preview.map((course, index) => (
                  <div
                    key={index}
                    className="bg-white/10 border border-white/20 rounded-lg p-3 text-sm"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-semibold text-white">
                          {course.course_name}
                        </div>
                        <div className="text-white/70 text-xs mt-1 space-x-3">
                          {course.course_code && (
                            <span>Code: {course.course_code}</span>
                          )}
                          <span>Grade: {course.grade}</span>
                          <span>Credits: {course.credit_hour}</span>
                        </div>
                        {course.course_description && (
                          <div className="text-white/60 text-xs mt-1">
                            {course.course_description}
                          </div>
                        )}
                      </div>
                      <div className="text-white/40 text-xs">#{index + 1}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
