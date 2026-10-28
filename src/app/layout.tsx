import type { Metadata } from "next";
import React from "react";
import "./globals.css";
import { DemoBanner } from "@/components/layout/DemoBanner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Intelligence Hub — Verified Intelligence & Opportunity Discovery",
  description:
    "Organizing verified news, AI and technology breakthroughs, scholarships, internships, grants, and government schemes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased">
        <DemoBanner />
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
