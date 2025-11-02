// src/app/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { Session } from "@supabase/supabase-js";
import DashboardHeader from "../components/Header";
import DashboardPage from "./dashboard/page"; // ✅ Show dashboard even for visitors

export default function HomePage() {
  const [session, setSession] = useState<Session | null>(null);

  // 🔁 Keep Supabase session in sync
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => setSession(session)
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  // 🚪 Handle logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  return (
    <div className="min-h-screen bg-[#1a1b1e] text-gray-100 font-sans antialiased transition-all duration-300">
      {/* ✅ Header is always shown */}
      <DashboardHeader session={session} onLogout={handleLogout} />

      {/* ✅ Public dashboard content visible to everyone */}
      <main className="container mx-auto px-4 py-8">
        <DashboardPage session={session} />
      </main>
    </div>
  );
}
