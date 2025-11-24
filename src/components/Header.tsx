"use client";
import React, { useState, useRef, useEffect } from "react";
import { Session } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { supabase } from "@/services/supabaseClient";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";

interface HeaderProps {
  session: Session | null;
  onLogout: () => void;
  onNavigate?: (view: string) => void;
  userRole?: string | null;
  username?: string | null;
}

const DashboardHeader: React.FC<HeaderProps> = ({
  session,
  onLogout,
  onNavigate,
  userRole = null,
  username = null,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle logout + redirect
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      onLogout?.();
      router.push("/dashboard");
      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 glass border-b border-white/20 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo + Title */}
          <button
            onClick={() => {
              router.push("/dashboard");
              onNavigate?.("dashboard");
            }}
            className="flex items-center gap-3 group"
          >
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary to-accent shadow-glow group-hover:scale-105 transition-transform">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <div className="hidden md:block">
              <h1 className="font-bold text-white text-lg leading-tight">
                Nilai University
              </h1>
              <p className="text-xs text-white/70">Computing Student Portal</p>
            </div>
          </button>

          {/* Desktop Account Section */}
          <div className="hidden md:flex items-center gap-4">
            {session ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-3 px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/30 rounded-xl transition-all group"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-sm font-bold">
                    {getInitials(username || "U")}
                  </div>
                  <div className="text-left">
                    <p className="text-white text-sm font-medium leading-tight">
                      {username || "User"}
                    </p>
                    {userRole === "admin" && (
                      <Badge variant="warning" size="sm" className="mt-0.5">
                        Admin
                      </Badge>
                    )}
                  </div>
                  <svg
                    className={`w-4 h-4 text-white transition-transform ${
                      menuOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-gray-900/95 backdrop-blur-xl border border-white/30 rounded-xl shadow-2xl overflow-hidden animate-slide-down">
                    <div className="p-3 border-b border-white/20">
                      <p className="text-white text-sm font-medium">
                        {username || "User"}
                      </p>
                      <p className="text-white/60 text-xs">
                        {userRole === "admin" ? "Administrator" : "Lecturer"}
                      </p>
                    </div>
                    <ul className="p-2">
                      <li>
                        <button
                          onClick={() => {
                            router.push("/studentmanager");
                            onNavigate?.("studentmanager");
                            setMenuOpen(false);
                          }}
                          className="w-full text-left px-3 py-2.5 text-white hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2.5"
                        >
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
                              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                            />
                          </svg>
                          Student Manager
                        </button>
                      </li>
                      {userRole === "admin" && (
                        <li>
                          <button
                            onClick={() => {
                              router.push("/create-account");
                              onNavigate?.("create-account");
                              setMenuOpen(false);
                            }}
                            className="w-full text-left px-3 py-2.5 text-white hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2.5"
                          >
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
                                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                              />
                            </svg>
                            Create Account
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
                          className="w-full text-left px-3 py-2.5 text-white hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2.5"
                        >
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
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          Profile
                        </button>
                      </li>
                      <li className="border-t border-white/20 mt-2 pt-2">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-3 py-2.5 text-red-300 hover:bg-red-500/10 rounded-lg transition-colors flex items-center gap-2.5"
                        >
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
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <Button
                onClick={() => router.push("/login")}
                className="bg-white text-primary hover:bg-white/90"
              >
                Lecturer Login
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 glass border border-white/30 rounded-xl p-4 animate-slide-down">
            {session ? (
              <>
                <div className="pb-4 border-b border-white/20 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                      {getInitials(username || "U")}
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        {username || "User"}
                      </p>
                      <p className="text-white/60 text-sm">
                        {userRole === "admin" ? "Administrator" : "Lecturer"}
                      </p>
                    </div>
                  </div>
                </div>
                <ul className="space-y-2">
                  <li>
                    <button
                      onClick={() => {
                        router.push("/studentmanager");
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2.5 text-white hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2.5"
                    >
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
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                      Student Manager
                    </button>
                  </li>
                  {userRole === "admin" && (
                    <li>
                      <button
                        onClick={() => {
                          router.push("/create-account");
                          setMobileMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2.5 text-white hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2.5"
                      >
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
                            d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                          />
                        </svg>
                        Create Account
                      </button>
                    </li>
                  )}
                  <li>
                    <button
                      onClick={() => {
                        router.push("/profile");
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2.5 text-white hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2.5"
                    >
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
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      Profile
                    </button>
                  </li>
                  <li className="border-t border-white/20 pt-2">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2.5 text-red-300 hover:bg-red-500/10 rounded-lg transition-colors flex items-center gap-2.5"
                    >
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
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Logout
                    </button>
                  </li>
                </ul>
              </>
            ) : (
              <Button
                onClick={() => router.push("/login")}
                className="w-full bg-white text-primary hover:bg-white/90"
              >
                Lecturer Login
              </Button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default DashboardHeader;
