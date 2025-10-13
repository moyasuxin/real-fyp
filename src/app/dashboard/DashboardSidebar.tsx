// src/app/dashboard/StudentSidebar.tsx
import React from "react";

interface Program {
  short: string;
  long: string;
}

interface Group {
  name: string;
  programs: Program[];
}

interface SidebarProps {
  groups: Group[];
  activeGroup: string;
  activeProgram: string;
  onSelectGroup: (group: string) => void;
  onSelectProgram: (program: string) => void;
}

const StudentSidebar: React.FC<SidebarProps> = ({
  groups,
  activeGroup,
  activeProgram,
  onSelectGroup,
  onSelectProgram,
}) => {
  return (
    <aside className="flex-shrink-0 w-64 bg-gray-800 text-white p-4 rounded-2xl shadow-lg">
      {groups.map((group) => (
        <div key={group.name} className="mb-4">
          {/* Level 1: Group */}
          <button
            onClick={() => onSelectGroup(group.name)}
            className={`w-full px-4 py-2 text-left font-bold rounded-lg mb-2 transition-colors
              ${
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
                  key={p.short}
                  onClick={() => onSelectProgram(p.short)}
                  className={`w-full px-3 py-1 text-left rounded-md transition-colors
                    ${
                      activeProgram === p.short
                        ? "border-l-4 border-lime-400 text-lime-300"
                        : "hover:text-white text-gray-300"
                    }`}
                >
                  {p.long}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </aside>
  );
};

export default StudentSidebar;
