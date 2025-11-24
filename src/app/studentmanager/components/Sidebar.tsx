"use client";
import React from "react";
import { BarChart3, Users } from "lucide-react";
import { Card } from "@/components/ui/Card";

interface SidebarProps {
  activeTab: "chart" | "manage";
  setActiveTab: (tab: "chart" | "manage") => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <aside className="flex-shrink-0 w-64 p-4">
      <Card className="h-full glass border-white/20" padding="md">
        <h2 className="text-xl font-bold mb-8 text-white flex items-center gap-2">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          Student Manager
        </h2>
        <nav className="space-y-3">
          <button
            onClick={() => setActiveTab("chart")}
            className={`flex items-center w-full text-left space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              activeTab === "chart"
                ? "bg-white text-primary shadow-md font-medium"
                : "text-white hover:bg-white/10 border border-white/20"
            }`}
          >
            <BarChart3 size={20} />
            <span>Overview Chart</span>
          </button>

          <button
            onClick={() => setActiveTab("manage")}
            className={`flex items-center w-full text-left space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              activeTab === "manage"
                ? "bg-white text-primary shadow-md font-medium"
                : "text-white hover:bg-white/10 border border-white/20"
            }`}
          >
            <Users size={20} />
            <span>Manage Students</span>
          </button>
        </nav>
      </Card>
    </aside>
  );
};

export default Sidebar;
