// src/app/dashboard/Header.tsx
"use client";
import React, { useState, useRef, useEffect } from "react";
import { supabase } from "../../services/supabaseClient";
import { User } from "@supabase/supabase-js";

const DashboardHeader: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // fetch user session & subscribe to auth changes
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user) setUser(data.session.user);
    };
    fetchUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    );

    // cleanup listener
    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setMenuOpen(false);
  };

  // close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="relative z-30 bg-black/30 backdrop-blur-sm p-3 border-b-2 border-red-500/50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo / Title */}
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-colors">
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
                strokeWidth={2}
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

        {/* Session / Dropdown */}
        <div className="relative" ref={menuRef}>
          {user ? (
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-black font-bold rounded-md hover:bg-yellow-500 transition-colors"
            >
              Admin
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
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
          ) : (
            <button
              onClick={() =>
                supabase.auth.signInWithOtp({ email: "admin@example.com" })
              }
              className="px-4 py-2 bg-yellow-400 text-black font-bold rounded-md hover:bg-yellow-500 transition-colors"
            >
              Lecturer Login
            </button>
          )}

          {user && menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-800/90 backdrop-blur-md rounded-lg shadow-lg overflow-hidden z-50 animate-fade-in">
              <ul className="text-white">
                <li>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-700/80">
                    Dashboard
                  </button>
                </li>
                <li>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-700/80">
                    Student Management
                  </button>
                </li>
                <li>
                  <a href="#" className="block px-4 py-2 hover:bg-gray-700/80">
                    Profile
                  </a>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-700/80"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
