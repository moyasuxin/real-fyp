"use client";
import React, { useState, useRef, useEffect } from "react";
import { Session } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { supabase } from "@/services/supabaseClient";

interface HeaderProps {
  session: Session | null;
  onLogout: () => void;
  onNavigate?: (view: string) => void;
  userRole?: string | null;
}

const DashboardHeader: React.FC<HeaderProps> = ({
  session,
  onLogout,
  onNavigate,
  userRole = null,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Handle logout + redirect
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      onLogout?.(); // still call the parent handler if needed
      router.push("/dashboard"); // redirect to dashboard after logout
      window.location.reload(); // Force page refresh to clear admin state
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="relative z-30 bg-black/30 backdrop-blur-sm p-3 border-b-2 border-lime-400 transition-all duration-300">
      <div className="container mx-auto flex justify-between items-center">
        {/* 🔹 Logo + Title */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              router.push("/dashboard");
              onNavigate?.("dashboard");
            }}
            className="p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </button>

          <div className="px-4 py-1 bg-gray-800/70 rounded-md">
            <span className="font-bold text-white text-lg">
              Nilai University | Computing Student
            </span>
          </div>
        </div>

        {/* 🔹 Account Section */}
        <div className="relative" ref={menuRef}>
          {session ? (
            <>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-black font-bold rounded-md hover:bg-yellow-500 transition-colors"
              >
                Admin
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 transition-transform ${
                    menuOpen ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white text-black rounded-lg shadow-lg overflow-hidden z-50 border border-gray-200">
                  <ul className="text-sm font-medium">
                    <li>
                      <button
                        onClick={() => {
                          router.push("/studentmanager");
                          onNavigate?.("studentmanager");
                          setMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        🎓 Student Manager
                      </button>
                    </li>
                    {/* Only show Create Account for admins */}
                    {userRole === "admin" && (
                      <li>
                        <button
                          onClick={() => {
                            router.push("/create-account");
                            onNavigate?.("create-account");
                            setMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          ➕ Create Account
                        </button>
                      </li>
                    )}
                    <li>
                      <button
                        onClick={() => {
                          router.push("/profile");
                          onNavigate?.("profile");
                          setMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        👤 Profile
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                      >
                        🚪 Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </>
          ) : (
            <button
              onClick={() => router.push("/login")}
              className="px-4 py-2 bg-yellow-400 text-black font-bold rounded-md hover:bg-yellow-500 transition"
            >
              Lecturer Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
