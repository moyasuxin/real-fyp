// src/app/studentmanager/components/StudentChart.tsx
"use client";
import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { Student } from "../types/student";
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
      legend: { position: "bottom" as const },
      title: {
        display: true,
        text: `Performance Overview — Avg CGPA (Overall: ${overallCgpa.toFixed(
          2
        )})`,
      },
      subtitle: {
        display: true,
        text: cgpaSummary,
      },
    },
    scales: {
      x: { ticks: { color: "#ffffff" } },
      y: { ticks: { color: "#ffffff" }, beginAtZero: true },
    },
  };

  return (
    <div className="bg-zinc-800 p-6 rounded-2xl shadow-md space-y-4">
      <h2 className="text-xl font-semibold">Student Performance by Program</h2>
      <div className="h-[350px]">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}
