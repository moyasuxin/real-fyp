// src/app/login/page.tsx
"use client";
import React, { useState } from "react";
import { supabase } from "@/services/supabaseClient";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // ✅ success
    router.push("/dashboard");
  };

  return (
    <div className="flex items-center justify-center min-h-screen  text-white">
      <form
        onSubmit={handleLogin}
        className="bg-zinc-800 p-8 rounded-2xl shadow-xl w-96 space-y-5"
      >
        <h2 className="text-2xl font-bold text-center mb-4">Lecturer Login</h2>

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

        <div>
          <label className="block mb-1 text-sm">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 rounded-md bg-zinc-700 text-white focus:outline-none"
            placeholder="Enter your email"
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-sm">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 rounded-md bg-zinc-700 text-white focus:outline-none"
            placeholder="Enter your password"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-yellow-400 text-black font-semibold rounded-md hover:bg-yellow-500 disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
