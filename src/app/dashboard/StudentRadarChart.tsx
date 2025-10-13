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

// Register Chart.js components
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface StudentRadarChartProps {
  data: number[]; // array of 6 metric values [prog, design, infra, cocu, feedback, professional]
}

const StudentRadarChart: React.FC<StudentRadarChartProps> = ({ data }) => {
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
        data,
        backgroundColor: "rgba(34,197,94,0.2)",
        borderColor: "rgba(34,197,94,1)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(34,197,94,1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(34,197,94,1)",
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
    <div className="w-full h-full bg-zinc-800/50 rounded-xl p-2">
      <Radar data={chartData} options={options} />
    </div>
  );
};

export default StudentRadarChart;
