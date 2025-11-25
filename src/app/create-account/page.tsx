"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

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
      // Call server-side API to create account (bypasses RLS)
      const response = await fetch("/api/create-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create account");
      }

      console.log("✅ Account created successfully:", data);

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

      let errorMessage = "Failed to create account. Please try again.";

      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (err && typeof err === "object" && "message" in err) {
        errorMessage = String(err.message);
      }

      setError(`❌ ${errorMessage}`);
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-accent to-primary/90 p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-accent/30 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-pulse-glow [animation-delay:1s]" />

      <Card
        className="w-full max-w-md relative z-10 animate-scale-in glass border-white/30"
        padding="lg"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent mb-4 shadow-glow">
            <svg
              className="w-8 h-8 text-white"
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
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-white/80">
            Create a new lecturer or admin account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg animate-slide-down">
              <p className="text-red-200 text-sm text-center">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg animate-slide-down">
              <p className="text-green-200 text-sm text-center">{success}</p>
            </div>
          )}

          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="lecturer@nilai.edu.my"
            label="Email"
            required
            className="glass text-white placeholder-white/60 border-white/30 focus:border-white focus:ring-white/30"
            icon={
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
                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                />
              </svg>
            }
          />

          <Input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Dr. John Doe"
            label="Username"
            required
            className="glass text-white placeholder-white/60 border-white/30 focus:border-white focus:ring-white/30"
            icon={
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
            }
          />

          <div className="space-y-2">
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              label="Password"
              required
              minLength={6}
              className="glass text-white placeholder-white/60 border-white/30 focus:border-white focus:ring-white/30"
              icon={
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
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              }
            />
            <p className="text-xs text-white/60">Minimum 6 characters</p>
          </div>

          <div className="space-y-2">
            <label className="block text-white font-medium text-sm">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full glass text-white placeholder-white/60 border-white/30 focus:border-white focus:ring-2 focus:ring-white/30 px-4 py-2.5 rounded-lg outline-none transition-all"
            >
              <option value="lecturer" className="bg-zinc-800 text-white">
                Lecturer
              </option>
              <option value="admin" className="bg-zinc-800 text-white">
                Admin
              </option>
            </select>
          </div>

          <Button
            type="submit"
            loading={loading}
            className="w-full bg-white text-primary hover:bg-white/90"
            size="lg"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default CreateAccountPage;
