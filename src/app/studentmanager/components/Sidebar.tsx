"use client";
import React from "react";
import { BarChart3, Users } from "lucide-react";

interface SidebarProps {
  activeTab: "chart" | "manage";
  setActiveTab: (tab: "chart" | "manage") => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <aside className="flex-shrink-0 w-64 bg-gray-800 text-white p-4 rounded-2xl shadow-lg">
      <h2 className="text-xl font-bold mb-8 text-white">Student Manager</h2>
      <nav className="space-y-3">
        <button
          onClick={() => setActiveTab("chart")}
          className={`flex items-center w-full text-left space-x-2 px-3 py-2 rounded-lg transition ${
            activeTab === "chart"
              ? "bg-blue-600"
              : "hover:text-white text-gray-300"
          }`}
        >
          <BarChart3 size={18} />
          <span>Overview Chart</span>
        </button>

        <button
          onClick={() => setActiveTab("manage")}
          className={`flex items-center w-full text-left space-x-2 px-3 py-2 rounded-lg transition ${
            activeTab === "manage"
              ? "bg-blue-600"
              : "hover:text-white text-gray-300"
          }`}
        >
          <Users size={18} />
          <span>Manage Students</span>
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
