"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/services/supabaseClient";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const redirectToDashboard = async () => {
      // Check session
      await supabase.auth.getSession();

      // ✅ Whether logged in or not, just go to dashboard
      router.replace("/dashboard");
    };

    redirectToDashboard();
  }, [router]);

  return null; // ✅ Nothing to render, just redirect
}
