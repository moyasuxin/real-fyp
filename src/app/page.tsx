// src/app/page.tsx
"use client";
import DashboardPage from "./dashboard/page";
import DashboardHeader from "../components/Header";

export default function Home() {
  return (
    <div className="min-h-screen text-gray-100 font-sans antialiased">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <DashboardPage />
        </div>
      </main>
    </div>
  );
}
