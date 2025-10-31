// src/app/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../services/supabaseClient";
import DashboardHeader from "../components/Header";
import DashboardPage from "./dashboard/page";
import LoginPage from "./login/page";

// 🧩 Optional future imports
// import StudentManagerPage from "./students/page";
// import ProfilePage from "./profile/page";

export default function Home() {
  const [session, setSession] = useState<Session | null>(null);
  const [view, setView] = useState<
    "dashboard" | "login" | "students" | "profile"
  >("dashboard");
  const [fade, setFade] = useState(false);

  // 🔁 Sync Supabase session
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setView(data.session ? "dashboard" : "login");
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setView(session ? "dashboard" : "login");
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  // 🚪 Handle Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setView("login");
  };

  // 🌈 Handle view transition (smooth fade)
  const handleNavigate = (nextView: typeof view) => {
    setFade(true);
    setTimeout(() => {
      setView(nextView);
      setFade(false);
    }, 200); // duration matches animation
  };

  // 🧠 Render logic
  const renderView = () => {
    switch (view) {
      case "login":
        return <LoginPage />;
      case "students":
        return (
          <div className="text-white">📘 Student Manager (Coming Soon)</div>
        );
      case "profile":
        return <div className="text-white">👤 Profile Page (Coming Soon)</div>;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen text-gray-100 font-sans antialiased transition-all duration-300">
      <DashboardHeader
        session={session}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />

      <main
        className={`container mx-auto px-4 py-8 transition-opacity duration-300 ${
          fade ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="max-w-7xl mx-auto">{renderView()}</div>
      </main>
    </div>
  );
}
