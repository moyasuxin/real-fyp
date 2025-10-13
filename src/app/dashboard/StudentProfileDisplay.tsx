// src/app/dashboard/StudentProfileDisplay.tsx
import React from "react";
import StudentRadarChart from "./StudentRadarChart";

// StudentProfile type (replace with real type when available)
interface StudentProfile {
  id: number;
  name: string;
  program: string;
  gender: string;
  imageUrl: string;
  description: string;
  cgpa: number;
  coCurricularPoints: number;
  analysis: {
    recommendedCareer: string;
    chartData: number[];
  };
}

interface StudentProfileDisplayProps {
  student: StudentProfile;
  onViewReport: (student: StudentProfile) => void;
}

// Reusable small info chip
const InfoChip: React.FC<{ icon?: React.ReactNode; text: string }> = ({
  icon,
  text,
}) => (
  <div className="flex items-center gap-2 bg-black/50 text-white px-3 py-1 rounded-md text-sm font-semibold">
    {icon}
    <span>{text}</span>
  </div>
);

const StudentProfileDisplay: React.FC<StudentProfileDisplayProps> = ({
  student,
  onViewReport,
}) => {
  return (
    <div className="relative flex flex-col gap-4">
      {/* Header with name, gender, program, and avatar */}
      <div className="bg-zinc-700/50 p-4 rounded-t-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black tracking-tighter text-white">
              {student.name}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <InfoChip text={student.gender} />
              <InfoChip text={student.program.toUpperCase()} />
            </div>
          </div>
          <img
            src={student.imageUrl}
            alt={student.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-zinc-800 shadow-lg"
          />
        </div>
      </div>

      {/* Main content: narrative, recommended careers, radar chart */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 p-4 items-start">
        <div className="xl:col-span-3 space-y-4">
          <section className="p-4 bg-black/30 text-gray-300 rounded-lg h-64 overflow-y-auto custom-scrollbar">
            <h3 className="font-bold text-lime-400 mb-2">
              AI-Generated Narrative Summary
            </h3>
            <p className="leading-relaxed whitespace-pre-wrap">
              {student.description}
            </p>
          </section>

          <section className="p-4 bg-black/30 text-gray-300 rounded-lg">
            <h3 className="font-bold text-lime-400 mb-2">
              Recommended Career Paths
            </h3>
            <p>{student.analysis.recommendedCareer}</p>
          </section>
        </div>

        <div className="xl:col-span-2 w-full h-96">
          <StudentRadarChart data={student.analysis.chartData} />
        </div>
      </div>

      {/* View full report button */}
      <div className="px-4 pb-2 flex justify-end">
        <button
          onClick={() => onViewReport(student)}
          className="px-6 py-2 bg-black text-yellow-400 font-bold rounded-full border-2 border-yellow-400/50 hover:bg-yellow-400 hover:text-black transition-all"
        >
          View Full Report
        </button>
      </div>
    </div>
  );
};

export default StudentProfileDisplay;
