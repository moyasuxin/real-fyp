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
  const [userRole, setUserRole] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  // 🧠 Track Supabase session
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session?.user) {
        // Fetch user role from admin_users table
        supabase
          .from("admin_users")
          .select("role, username")
          .eq("id", data.session.user.id)
          .single()
          .then(({ data: userData }) => {
            if (userData) {
              setUserRole(userData.role);
              setUsername(userData.username);
            }
          });
      } else {
        setUserRole(null);
        setUsername(null);
      }
    });
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (session?.user) {
          supabase
            .from("admin_users")
            .select("role, username")
            .eq("id", session.user.id)
            .single()
            .then(({ data: userData }) => {
              if (userData) {
                setUserRole(userData.role);
                setUsername(userData.username);
              }
            });
        } else {
          setUserRole(null);
          setUsername(null);
        }
      }
    );
    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUserRole(null);
    setUsername(null);
  };

  return (
    <>
      {/* ✅ Header always visible */}
      <DashboardHeader
        session={session}
        onLogout={handleLogout}
        userRole={userRole}
        username={username}
      />

      {/* ✅ Pass session down via React context or props */}
      <main className="container mx-auto px-4 py-8">{children}</main>
    </>
  );
}
