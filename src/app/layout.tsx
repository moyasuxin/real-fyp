import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Student Dashboard",
  description: "FYP Dashboard using Next.js + Tailwind",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#1a1b1e] text-gray-100 font-sans antialiased transition-all duration-300">
        {children}
      </body>
    </html>
  );
}
