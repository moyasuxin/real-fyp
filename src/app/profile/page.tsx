"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/services/supabaseClient";

const ProfilePage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>("");

  const [formData, setFormData] = useState({
    username: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch current user data
  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      setUser(session.user);

      // Fetch username and role from admin_users table
      const { data: userData } = await supabase
        .from("admin_users")
        .select("username, role")
        .eq("id", session.user.id)
        .single();

      if (userData) {
        setFormData((prev) => ({ ...prev, username: userData.username }));
        setUserRole(userData.role);
      }
    };

    fetchUserData();
  }, [router]);

  const handleUpdateUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (!formData.username.trim()) {
        throw new Error("Username cannot be empty");
      }

      const { error } = await supabase
        .from("admin_users")
        .update({ username: formData.username })
        .eq("id", user.id);

      if (error) throw error;

      setSuccess("✅ Username updated successfully!");

      // Refresh the page after 1 second to update header
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err: any) {
      setError(`❌ ${err.message || "Failed to update username"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (!formData.newPassword || !formData.confirmPassword) {
        throw new Error("Please fill in all password fields");
      }

      if (formData.newPassword.length < 6) {
        throw new Error("New password must be at least 6 characters");
      }

      if (formData.newPassword !== formData.confirmPassword) {
        throw new Error("New passwords do not match");
      }

      // Update password
      const { error } = await supabase.auth.updateUser({
        password: formData.newPassword,
      });

      if (error) throw error;

      setSuccess("✅ Password updated successfully!");

      // Clear password fields
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (err: any) {
      setError(`❌ ${err.message || "Failed to update password"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-zinc-800 border border-zinc-700 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-lime-400 mb-2">
            Profile Settings
          </h1>
          <p className="text-gray-400">Manage your account information</p>
        </div>

        {/* User Info Section */}
        <div className="mb-6 p-4 bg-zinc-700/50 rounded-lg">
          <div className="text-sm text-gray-400 mb-1">Email</div>
          <div className="text-white font-medium">{user.email}</div>
          <div className="text-sm text-gray-400 mt-3 mb-1">Role</div>
          <div className="text-lime-400 font-semibold capitalize">
            {userRole}
          </div>
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

        {/* Update Username Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Update Username</h2>
          <form onSubmit={handleUpdateUsername} className="space-y-4">
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
                placeholder="Enter new username"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-lime-400 hover:bg-lime-500 text-black font-bold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Updating..." : "Update Username"}
            </button>
          </form>
        </div>

        <div className="border-t border-zinc-700 my-8"></div>

        {/* Update Password Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Change Password</h2>
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">
                New Password <span className="text-red-400">*</span>
              </label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
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
                Confirm New Password <span className="text-red-400">*</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full bg-zinc-700 text-white p-3 rounded-lg border border-zinc-600 focus:border-lime-400 focus:outline-none"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-lime-400 hover:bg-lime-500 text-black font-bold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Updating..." : "Change Password"}
            </button>
          </form>
        </div>

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

export default ProfilePage;
