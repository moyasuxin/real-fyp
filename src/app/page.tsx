"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/services/supabaseClient";
import DashboardHeader from "@/components/Header";

export default function HomePage() {
  const router = useRouter();
  const [session, setSession] = useState(null);

  // Fetch Supabase session once when loading
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        // ✅ If logged in, redirect to dashboard
        router.push("/dashboard");
      } else {
        setSession(null);
      }
    });
  }, [router]);

  // ✅ Safe logout handler (required by Header)
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    router.push("/"); // optional: return to home
  };

  return (
    <div className="min-h-screen bg-[#1a1b1e] text-gray-100">
      <main className="container mx-auto py-12 text-center">
        <h1 className="text-4xl font-bold mb-4">
          Welcome to Student Dashboard
        </h1>
        <p className="text-gray-400 mb-6">
          Learn more about your performance and progress.
        </p>
      </main>
    </div>
  );
}
