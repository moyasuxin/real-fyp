// src/app/studentmanager/components/StudentChart.tsx
"use client";
import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { Student } from "../types/student";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Props {
  students: Student[];
}

export default function StudentChart({ students }: Props) {
  // --- Group by Program ---
  const groupedByProgram = useMemo(() => {
    const groups: Record<string, Student[]> = {};
    for (const student of students) {
      const program = student.program || "Unassigned";
      if (!groups[program]) groups[program] = [];
      groups[program].push(student);
    }
    return groups;
  }, [students]);

  // --- Compute Averages per Program ---
  const programAverages = useMemo(() => {
    return Object.entries(groupedByProgram).map(([program, list]) => {
      const avg = (key: keyof Student) =>
        list.reduce((sum, s) => sum + (Number(s[key]) || 0), 0) / list.length ||
        0;

      return {
        program,
        design: avg("design_score"),
        infra: avg("it_infrastructure_score"),
        cocu: avg("co_curricular_points"),
        feedback: avg("feedback_sentiment_score"),
        engagement: avg("professional_engagement_score"),
        cgpa: avg("cgpa"),
      };
    });
  }, [groupedByProgram]);

  // --- Chart Data ---
  const chartData = {
    labels: programAverages.map((p) => p.program),
    datasets: [
      {
        label: "Design",
        data: programAverages.map((p) => p.design),
        backgroundColor: "rgba(153,102,255,0.6)",
      },
      {
        label: "IT Infrastructure",
        data: programAverages.map((p) => p.infra),
        backgroundColor: "rgba(255,99,132,0.6)",
      },
      {
        label: "Co-curricular Activity",
        data: programAverages.map((p) => p.cocu),
        backgroundColor: "rgba(75,192,192,0.6)",
      },
      {
        label: "Feedback Sentiment",
        data: programAverages.map((p) => p.feedback),
        backgroundColor: "rgba(255,206,86,0.6)",
      },
      {
        label: "Professional Engagement",
        data: programAverages.map((p) => p.engagement),
        backgroundColor: "rgba(54,162,235,0.6)",
      },
      {
        label: "CGPA",
        data: programAverages.map((p) => p.cgpa),
        backgroundColor: "rgba(0,255,127,0.6)",
      },
    ],
  };

  // --- Overall & Per-Program CGPA Info ---
  const overallCgpa =
    students.length > 0
      ? students.reduce((sum, s) => sum + (Number(s.cgpa) || 0), 0) /
        students.length
      : 0;

  const cgpaSummary = programAverages
    .map((p) => `${p.program}: ${p.cgpa.toFixed(2)}`)
    .join(" | ");

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          color: "rgba(255, 255, 255, 0.9)",
          padding: 15,
          font: { size: 12 },
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "rgba(14, 165, 233, 0.5)",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: { color: "rgba(255, 255, 255, 0.7)" },
        grid: { color: "rgba(255, 255, 255, 0.1)" },
      },
      y: {
        ticks: { color: "rgba(255, 255, 255, 0.7)" },
        grid: { color: "rgba(255, 255, 255, 0.1)" },
        beginAtZero: true,
      },
    },
  };

  return (
    <Card className="glass border-white/20 w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <CardTitle className="text-white flex items-center gap-2">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            Student Performance by Program
          </CardTitle>
          <Badge variant="primary" size="md">
            Overall CGPA: {overallCgpa.toFixed(2)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-wrap gap-2">
          {programAverages.map((p) => (
            <Badge key={p.program} variant="gray" size="sm">
              {p.program}: {p.cgpa.toFixed(2)}
            </Badge>
          ))}
        </div>
        <div className="h-[400px]">
          <Bar data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}
