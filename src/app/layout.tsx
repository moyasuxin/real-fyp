// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";
import { SessionProvider } from "@/contexts/SessionContext";
import DashboardHeader from "@/components/Header";

export const metadata: Metadata = {
  title: "Student Dashboard",
  description: "FYP Dashboard using Next.js + Tailwind",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#1a1b1e] text-gray-100 font-sans antialiased transition-all duration-300">
        <SessionProvider>
          <DashboardHeader />
          <main className="container mx-auto px-4 py-8">{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
