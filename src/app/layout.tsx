// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";
import ClientLayout from "@/components/ClientLayout";

export const metadata: Metadata = {
  title: "Student Dashboard",
  description: "FYP Dashboard using Next.js + Tailwind",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white font-sans antialiased transition-all duration-300">
        {/* ✅ Client logic (session + conditional header) goes here */}
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
