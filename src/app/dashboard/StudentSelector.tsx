// src/app/dashboard/StudentSelector.tsx
"use client";
import React, { useRef } from "react";
import StudentCard, { Student } from "./StudentCard";

interface StudentSelectorProps {
  students: Student[];
  selectedStudentId: number | null;
  onSelectStudent: (studentId: number) => void;
}

const ArrowButton = ({
  direction,
  onClick,
}: {
  direction: "left" | "right";
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="bg-zinc-800/70 hover:bg-zinc-700/80 p-2 rounded-full backdrop-blur-sm shadow-md"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 text-zinc-400 group-hover:text-white"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      {direction === "left" ? (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={3}
          d="M15 19l-7-7 7-7"
        />
      ) : (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={3}
          d="M9 5l7 7-7 7"
        />
      )}
    </svg>
  </button>
);

const StudentSelector: React.FC<StudentSelectorProps> = ({
  students,
  selectedStudentId,
  onSelectStudent,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const cardWidth = 200; // Approx card width + gap
      const scrollAmount = direction === "left" ? -cardWidth : cardWidth;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (!students.length) return null;

  return (
    <div className="relative w-full max-w-5xl flex justify-center items-center">
      <div className="relative bg-[#313236] border-2 border-zinc-700/50 rounded-2xl px-3 py-2 w-full flex items-center overflow-hidden">
        {/* Left Arrow (slightly overlapping cards) */}
        <div className="z-10 -mr-2">
          <ArrowButton direction="left" onClick={() => scroll("left")} />
        </div>

        {/* Scrollable Cards */}
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-4 overflow-x-auto scroll-smooth flex-1 px-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <style>{`
        .overflow-x-auto::-webkit-scrollbar {
          display: none;
        }
      `}</style>

          {students.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              isSelected={selectedStudentId === student.id}
              onSelect={() => onSelectStudent(student.id)}
            />
          ))}
        </div>

        {/* Right Arrow (partly outside container) */}
        <div className="z-10 -ml-2 translate-x-2">
          <ArrowButton direction="right" onClick={() => scroll("right")} />
        </div>
      </div>
    </div>
  );
};

export default StudentSelector;
