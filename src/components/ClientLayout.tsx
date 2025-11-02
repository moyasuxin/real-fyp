// src/components/ClientLayout.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/services/supabaseClient";
import { Session } from "@supabase/supabase-js";
import DashboardHeader from "@/components/Header";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, setSession] = useState<Session | null>(null);

  // 🧠 Track Supabase session
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => setSession(session)
    );
    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  return (
    <>
      {/* ✅ Header always visible */}
      <DashboardHeader session={session} onLogout={handleLogout} />

      {/* ✅ Pass session down via React context or props */}
      <main className="container mx-auto px-4 py-8">{children}</main>
    </>
  );
}
