// src/app/dashboard/page.tsx
"use client";
import React, { useState } from "react";
import DashboardHeader from "./Header";
import StudentSidebar from "./DashboardSidebar"; // Sidebar for Degree/Diploma programs
import StudentProfileDisplay from "./StudentProfileDisplay";

// Dummy student type (replace with real StudentProfile type later)
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

// Dummy student data (replace with real API data later)
const DUMMY_STUDENTS: StudentProfile[] = [
  {
    id: 1,
    name: "Alice",
    program: "bit",
    gender: "Female",
    imageUrl: "/dummy/alice.jpg",
    description: "Alice is a proactive student with strong programming skills.",
    cgpa: 3.2,
    coCurricularPoints: 10,
    analysis: {
      recommendedCareer: "Software Engineer",
      chartData: [4, 3, 5, 4, 3],
    },
  },
  {
    id: 2,
    name: "Bob",
    program: "bse",
    gender: "Male",
    imageUrl: "/dummy/bob.jpg",
    description: "Bob has shown consistent engagement in group projects.",
    cgpa: 2.8,
    coCurricularPoints: 5,
    analysis: {
      recommendedCareer: "System Analyst",
      chartData: [3, 4, 3, 2, 4],
    },
  },
  {
    id: 3,
    name: "Charlie",
    program: "dit",
    gender: "Male",
    imageUrl: "/dummy/charlie.jpg",
    description: "Charlie excels in practical IT tasks and networking.",
    cgpa: 3.0,
    coCurricularPoints: 0,
    analysis: {
      recommendedCareer: "Network Administrator",
      chartData: [4, 4, 4, 3, 3],
    },
  },
  {
    id: 4,
    name: "David",
    program: "dcs",
    gender: "Male",
    imageUrl: "/dummy/david.jpg",
    description: "David is detail-oriented with good database skills.",
    cgpa: 2.6,
    coCurricularPoints: 3,
    analysis: {
      recommendedCareer: "Database Administrator",
      chartData: [3, 3, 4, 3, 2],
    },
  },
];

const groups = [
  {
    name: "Degree",
    programs: [
      { short: "bit", long: "BIT" },
      { short: "bse", long: "BSE" },
    ],
  },
  {
    name: "Diploma",
    programs: [
      { short: "dit", long: "DIT" },
      { short: "dcs", long: "DCS" },
    ],
  },
];

export default function DashboardPage() {
  const [activeGroup, setActiveGroup] = useState("Degree");
  const [activeProgram, setActiveProgram] = useState("bit");
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(
    null
  );

  // Filter students by selected program
  const filteredStudents = DUMMY_STUDENTS.filter(
    (s) => s.program === activeProgram
  );
  const selectedStudent =
    filteredStudents.find((s) => s.id === selectedStudentId) || null;

  const handleSelectStudent = (id: number) => {
    setSelectedStudentId(id);
  };

  const handleViewReport = (student: StudentProfile) => {
    alert(`Viewing full report for ${student.name}`);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 p-4 gap-4">
      <DashboardHeader />

      <div className="flex flex-col lg:flex-row gap-4 flex-1 overflow-hidden">
        {/* Sidebar */}
        <StudentSidebar
          groups={groups}
          activeGroup={activeGroup}
          activeProgram={activeProgram}
          onSelectGroup={setActiveGroup}
          onSelectProgram={(program) => {
            setActiveProgram(program);
            setSelectedStudentId(null); // reset selected student when changing program
          }}
        />

        {/* Main Content */}
        <div className="flex-grow min-w-0 overflow-y-auto">
          {selectedStudent ? (
            <StudentProfileDisplay
              student={selectedStudent}
              onViewReport={handleViewReport}
            />
          ) : filteredStudents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredStudents.map((student) => (
                <div
                  key={student.id}
                  onClick={() => handleSelectStudent(student.id)}
                  className="cursor-pointer bg-white rounded-lg shadow p-4 hover:shadow-lg transition"
                >
                  <h3 className="font-bold text-lg">{student.name}</h3>
                  <p className="text-gray-500">
                    {student.program.toUpperCase()}
                  </p>
                  <p>CGPA: {student.cgpa}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center h-full text-gray-500 font-bold">
              No students found for this program.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
