"use client";
import React from "react";
import Image from "next/image";

export interface Student {
  id: number;
  name: string | null;
  alias?: string | null;
  image_url: string | null;
  bgColor?: string; // optional background accent
}

interface StudentCardProps {
  student: Student;
  isSelected: boolean;
  onSelect: () => void;
}

const StudentCard: React.FC<StudentCardProps> = ({
  student,
  isSelected,
  onSelect,
}) => {
  const borderClass = isSelected
    ? "border-lime-400 shadow-[0_0_10px_#a3e635]"
    : "border-[#4A4B50] hover:border-lime-400/50";

  return (
    <button
      onClick={onSelect}
      className={`flex-shrink-0 w-40 p-1 bg-[#D1D5DB] rounded-xl border-2 transition-all duration-200 focus:outline-none ${borderClass}`}
    >
      <div className="bg-[#D1D5DB] rounded-lg overflow-hidden flex flex-col h-full">
        {/* Image Section */}
        <div
          className={`relative w-full aspect-[3/2] ${
            student.bgColor || "bg-zinc-700"
          }`}
        >
          {student.image_url ? (
            student.image_url.startsWith("/") ? (
              <Image
                src={student.image_url}
                alt={student.name || "Student"}
                fill
                className="object-cover object-center"
              />
            ) : (
              // Fallback for external images like randomuser.me
              <img
                src={student.image_url}
                alt={student.name || "Student"}
                className="object-cover object-center w-full h-full"
              />
            )
          ) : (
            <div className="flex items-center justify-center w-full h-full text-zinc-400 text-sm">
              No Image
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="flex-grow flex items-center justify-between p-2 bg-[#D1D5DB]">
          {/* Left Info Block */}
          <div className="flex flex-col items-start h-full self-stretch">
            <span className="font-bold text-sm text-zinc-600 tracking-tighter">
              INFO
            </span>
            <span className="text-xs text-zinc-400">EDIT</span>
            <div className="flex-grow" />
            <span className="text-[10px] text-zinc-400 leading-none">
              AGENT FILE
            </span>
          </div>

          {/* Right Name Block */}
          <div className="flex flex-col items-end text-right">
            <span className="font-bold text-zinc-800 text-lg leading-tight whitespace-nowrap">
              {student.name || "UNNAMED"}
            </span>
            {student.alias && (
              <span className="text-sm text-zinc-500">{student.alias}</span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
};

export default StudentCard;
