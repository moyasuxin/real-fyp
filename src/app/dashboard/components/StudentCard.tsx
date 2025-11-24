"use client";
import React from "react";
import Image from "next/image";
import type { StudentCardData } from "../types";
import { Card } from "@/components/ui/Card";

interface StudentCardProps {
  student: StudentCardData;
  isSelected: boolean;
  onSelect: () => void;
}

const StudentCard: React.FC<StudentCardProps> = ({
  student,
  isSelected,
  onSelect,
}) => {
  return (
    <button
      onClick={onSelect}
      className={`flex-shrink-0 w-40 transition-all duration-300 focus:outline-none group ${
        isSelected ? "scale-105" : "hover:scale-102"
      }`}
    >
      <Card
        className={`overflow-hidden transition-all duration-300 ${
          isSelected
            ? "border-2 border-primary shadow-glow ring-2 ring-primary/30"
            : "border border-gray-300 dark:border-gray-700 hover:border-primary/50 hover:shadow-lg"
        }`}
        padding="none"
      >
        {/* Image Section */}
        <div
          className={`relative w-full aspect-[3/2] ${
            student.bgColor || "bg-gradient-to-br from-primary/20 to-accent/20"
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
              <div className="relative w-full h-full">
                <Image
                  src={student.image_url}
                  alt={student.name || "Student"}
                  fill
                  className="object-cover object-center"
                  unoptimized
                />
              </div>
            )
          ) : (
            <div className="flex items-center justify-center w-full h-full text-gray-400">
              <svg
                className="w-12 h-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
          )}
          {isSelected && (
            <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center animate-scale-in">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="p-3 bg-white dark:bg-gray-800 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-tight truncate">
                {student.name || "UNNAMED"}
              </h3>
              {student.alias && (
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                  {student.alias}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <svg
              className="w-3.5 h-3.5"
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
            <span>Student Profile</span>
          </div>
        </div>
      </Card>
    </button>
  );
};

export default StudentCard;
