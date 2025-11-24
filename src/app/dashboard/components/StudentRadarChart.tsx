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
import type { StudentChartData } from "../types";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface StudentRadarChartProps {
  student: StudentChartData;
}

const StudentRadarChart: React.FC<StudentRadarChartProps> = ({ student }) => {
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
        backgroundColor: "rgba(14, 165, 233, 0.2)",
        borderColor: "rgba(14, 165, 233, 1)",
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
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: { color: "rgba(255,255,255,0.2)" },
        grid: { color: "rgba(255,255,255,0.15)" },
        suggestedMin: 0,
        suggestedMax: 100,
        ticks: {
          stepSize: 20,
          color: "rgba(255,255,255,0.7)",
          backdropColor: "transparent",
          font: { size: 11 },
        },
        pointLabels: {
          color: "rgba(255,255,255,0.9)",
          font: { size: 12, weight: "bold" },
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "rgba(14, 165, 233, 0.5)",
        borderWidth: 1,
      },
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
