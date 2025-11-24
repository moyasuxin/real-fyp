"use client";
import React from "react";
import { usePrograms } from "../hooks";
import { Card } from "@/components/ui/Card";
import { Loader } from "@/components/ui/Loader";

interface SidebarProps {
  activeGroup: string;
  activeProgram: string;
  onSelectGroup: (group: string) => void;
  onSelectProgram: (program: string) => void;
}

const DashboardSidebar: React.FC<SidebarProps> = ({
  activeGroup,
  activeProgram,
  onSelectGroup,
  onSelectProgram,
}) => {
  const { groups, loading } = usePrograms();

  return (
    <aside className="flex-shrink-0 w-64">
      <Card className="h-full glass border-white/20" padding="md">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
            />
          </svg>
          Programs
        </h2>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader variant="spinner" size="lg" className="text-white" />
            <p className="text-white/60 text-sm animate-pulse">
              Loading programs...
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {groups.map((group) => (
              <div key={group.name} className="space-y-2">
                {/* Level 1: Group */}
                <button
                  onClick={() => onSelectGroup(group.name)}
                  className={`w-full px-4 py-2.5 text-left font-semibold rounded-lg transition-all duration-200 ${
                    activeGroup === group.name
                      ? "bg-white text-primary shadow-md"
                      : "bg-white/10 text-white hover:bg-white/20 border border-white/20"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{group.name}</span>
                    <svg
                      className={`w-4 h-4 transition-transform ${
                        activeGroup === group.name ? "rotate-90" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </button>

                {/* Level 2: Programs */}
                {activeGroup === group.name && (
                  <div className="ml-4 space-y-1 animate-slide-down">
                    {group.programs.map((p) => (
                      <button
                        key={p.program_short}
                        onClick={() => onSelectProgram(p.program_short)}
                        className={`w-full px-3 py-2 text-left text-sm rounded-md transition-all duration-200 ${
                          activeProgram === p.program_short
                            ? "bg-primary/20 text-white border-l-4 border-primary font-medium"
                            : "text-white/80 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        {p.program_long}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </aside>
  );
};

export default DashboardSidebar;
