// src/app/dashboard/DashboardSidebar.tsx
"use client";
import React, { useEffect, useState } from "react";

interface Program {
  id: number;
  group_name: string;
  program_short: string;
  program_long: string;
}

interface GroupedPrograms {
  name: string;
  programs: Program[];
}

interface SidebarProps {
  activeGroup: string;
  activeProgram: string;
  onSelectGroup: (group: string) => void;
  onSelectProgram: (program: string) => void;
}

const StudentSidebar: React.FC<SidebarProps> = ({
  activeGroup,
  activeProgram,
  onSelectGroup,
  onSelectProgram,
}) => {
  const [groups, setGroups] = useState<GroupedPrograms[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPrograms() {
      try {
        setLoading(true);
        const res = await fetch("/api/programs");
        if (!res.ok) {
          console.error("Failed to fetch programs:", res.statusText);
          return;
        }
        const programs: Program[] = await res.json();

        // Type-safe grouping
        const grouped = programs.reduce<GroupedPrograms[]>((acc, program) => {
          const existingGroup = acc.find((g) => g.name === program.group_name);
          if (existingGroup) {
            existingGroup.programs.push(program);
          } else {
            acc.push({ name: program.group_name, programs: [program] });
          }
          return acc;
        }, []);

        setGroups(grouped);
      } finally {
        setLoading(false);
      }
    }

    fetchPrograms();
  }, []);

  return (
    <aside className="flex-shrink-0 w-64 bg-gray-800 text-white p-4 rounded-2xl shadow-lg">
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 text-sm animate-pulse">
            Loading programs...
          </p>
        </div>
      ) : (
        groups.map((group) => (
          <div key={group.name} className="mb-4">
            {/* Level 1: Group */}
            <button
              onClick={() => onSelectGroup(group.name)}
              className={`w-full px-4 py-2 text-left font-bold rounded-lg mb-2 transition-colors ${
                activeGroup === group.name
                  ? "bg-blue-600"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              {group.name}
            </button>

            {/* Level 2: Programs */}
            {activeGroup === group.name && (
              <div className="ml-4 space-y-2">
                {group.programs.map((p) => (
                  <button
                    key={p.program_short}
                    onClick={() => onSelectProgram(p.program_short)}
                    className={`w-full px-3 py-1 text-left rounded-md transition-colors ${
                      activeProgram === p.program_short
                        ? "border-l-4 border-lime-400 text-lime-300"
                        : "hover:text-white text-gray-300"
                    }`}
                  >
                    {p.program_long}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </aside>
  );
};

export default StudentSidebar;
