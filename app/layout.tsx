import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "TaskPilot — Minimalist Task Management SaaS",
  description:
    "A clean, professional, and scalable task management application built with Next.js, PostgreSQL, and Prisma.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-background text-foreground">
        <div className="flex min-h-screen">
          {/* Desktop Left Sidebar */}
          <div className="hidden md:flex">
            <Sidebar />
          </div>

          {/* Main Area */}
          <div className="flex flex-1 flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto p-6 md:p-8">
              <div className="mx-auto max-w-[1200px] space-y-6">
                {children}
              </div>
            </main>
          </div>
        </div>

        {/* Global Toast Notifications */}
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
