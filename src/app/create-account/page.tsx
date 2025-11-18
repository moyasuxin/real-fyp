"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/services/supabaseClient";

const CreateAccountPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    role: "lecturer", // default to lecturer
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // 1. Create auth user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error("Failed to create user");
      }

      // 2. Create admin_users record
      const { error: dbError } = await supabase.from("admin_users").insert({
        id: authData.user.id,
        email: formData.email,
        username: formData.username,
        role: formData.role,
      });

      if (dbError) throw dbError;

      setSuccess(
        `✅ ${
          formData.role === "admin" ? "Admin" : "Lecturer"
        } account created successfully! Email: ${formData.email}`
      );

      // Reset form
      setFormData({
        email: "",
        password: "",
        username: "",
        role: "lecturer",
      });

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err: unknown) {
      console.error("Account creation error:", err);
      if (err instanceof Error) {
        setError(`❌ Failed to create account: ${err.message}`);
      } else {
        setError("❌ Failed to create account. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-800 border border-zinc-700 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-lime-400 mb-2">
            Create Account
          </h1>
          <p className="text-gray-400">
            Create a new lecturer or admin account
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-500 rounded-lg text-red-300 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-900/30 border border-green-500 rounded-lg text-green-300 text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              Email <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full bg-zinc-700 text-white p-3 rounded-lg border border-zinc-600 focus:border-lime-400 focus:outline-none"
              placeholder="lecturer@nilai.edu.my"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              Username <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full bg-zinc-700 text-white p-3 rounded-lg border border-zinc-600 focus:border-lime-400 focus:outline-none"
              placeholder="Dr. John Doe"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              Password <span className="text-red-400">*</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full bg-zinc-700 text-white p-3 rounded-lg border border-zinc-600 focus:border-lime-400 focus:outline-none"
              placeholder="••••••••"
            />
            <p className="text-xs text-gray-400 mt-1">Minimum 6 characters</p>
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              Role <span className="text-red-400">*</span>
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full bg-zinc-700 text-white p-3 rounded-lg border border-zinc-600 focus:border-lime-400 focus:outline-none"
            >
              <option value="lecturer">Lecturer</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-lime-400 hover:bg-lime-500 text-black font-bold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push("/dashboard")}
            className="text-gray-400 hover:text-lime-400 transition text-sm"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateAccountPage;
