// src/app/dashboard/StudentRadarChart.tsx
"use client";
import React from "react";
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
  student: {
    programming_score?: string | number;
    design_score?: string | number;
    it_infrastructure_score?: string | number;
    co_curricular_points?: string | number;
    feedback_sentiment_score?: string | number;
    professional_engagement_score?: string | number;
  };
}

const StudentRadarChart: React.FC<StudentRadarChartProps> = ({ student }) => {
  // ✅ Pull from DB columns and default to 0 if missing
  const chartValues = [
    Number(student.programming_score) || 0,
    Number(student.design_score) || 0,
    Number(student.it_infrastructure_score) || 0,
    Number(student.co_curricular_points) || 0,
    Number(student.feedback_sentiment_score) || 0,
    Number(student.professional_engagement_score) || 0,
  ];

  const labels = [
    "Programming",
    "Design",
    "IT Infrastructure",
    "Co-curricular Activity",
    "Feedback Sentiment",
    "Professional Engagement",
  ];

  const chartData = {
    labels,
    datasets: [
      {
        label: "Student Performance",
        data: chartValues,
        backgroundColor: "rgba(34,197,94,0.2)",
        borderColor: "rgba(34,197,94,1)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(34,197,94,1)",
      },
    ],
  };

  const options: ChartOptions<"radar"> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: { color: "rgba(255,255,255,0.2)" },
        grid: { color: "rgba(255,255,255,0.1)" },
        suggestedMin: 0,
        suggestedMax: 100,
        ticks: { stepSize: 20, color: "#9ca3af", backdropColor: "transparent" },
        pointLabels: { color: "#f3f4f6", font: { size: 14, weight: "bold" } },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
  };

  return (
    <div className="w-full h-full bg-zinc-800/50 rounded-xl p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 h-[320px]">
        <Radar data={chartData} options={options} />
      </div>
      <div className="lg:col-span-1 space-y-2">
        <h3 className="text-lg font-semibold text-gray-200 mb-4">
          Performance Breakdown
        </h3>
        {labels.map((label, index) => (
          <div
            key={label}
            className="flex justify-between items-center p-2 bg-zinc-700/50 rounded"
          >
            <span className="text-gray-200">{label}</span>
            <span className="text-green-400 font-semibold">
              {chartValues[index]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentRadarChart;
