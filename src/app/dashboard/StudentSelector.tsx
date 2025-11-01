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
    className="absolute top-1/2 -translate-y-1/2 bg-[#313236] p-2 rounded-md z-10 hover:bg-zinc-600 transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
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
    <div className="relative w-full max-w-5xl items-center justify-center">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-8 z-20">
        <ArrowButton direction="left" onClick={() => scroll("left")} />
      </div>

      <div
        ref={scrollContainerRef}
        className="bg-[#313236] border-2 border-zinc-700/50 rounded-2xl p-4 flex items-center gap-4 overflow-x-auto scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {/* Hide scrollbar for WebKit browsers */}
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

      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-8 z-20">
        <ArrowButton direction="right" onClick={() => scroll("right")} />
      </div>
    </div>
  );
};

export default StudentSelector;
