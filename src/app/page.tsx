"use client";
import React, { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../services/supabaseClient";
import DashboardHeader from "../components/Header";
import DashboardPage from "./dashboard/page";
import LoginPage from "./login/page"; // ✅ replace Auth

export default function Home() {
  const [session, setSession] = useState<Session | null>(null);
  const [view, setView] = useState<"dashboard" | "login">("dashboard");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (session) setView("dashboard");
        else setView("dashboard");
      }
    );
    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setView("dashboard");
  };

  const renderView = () => {
    if (view === "login") return <LoginPage />; // ✅ use login page here
    return <DashboardPage />;
  };

  return (
    <div className="min-h-screen text-gray-100 font-sans antialiased">
      <DashboardHeader
        session={session}
        onNavigate={setView}
        onLogout={handleLogout}
      />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">{renderView()}</div>
      </main>
    </div>
  );
}
