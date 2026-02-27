"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Wand2,
  Clock,
  CreditCard,
  UserCircle,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { getRemainingCredits } from "@/lib/credits";
import { Badge } from "@/components/ui/badge";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Generate", href: "/dashboard/generate", icon: Wand2 },
  { label: "History", href: "/dashboard/history", icon: Clock },
  { label: "Pricing", href: "/dashboard/pricing", icon: CreditCard },
  { label: "Profile", href: "/dashboard/profile", icon: UserCircle },
];

function DashboardShell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f]">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold text-white">
            Please log in to continue
          </h2>
          <Link
            href="/login"
            className="inline-block rounded-md bg-gradient-to-r from-amber-500 to-yellow-500 px-6 py-3 text-sm font-medium text-black hover:from-amber-600 hover:to-yellow-600"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const remaining = getRemainingCredits(user.total_credits, user.used_credits);

  const sidebar = (
    <div className="flex h-full flex-col justify-between">
      <div>
        <div className="px-6 py-6">
          <h1 className="font-playfair text-2xl font-bold text-[#D4AF37]">
            IconicAI Studio
          </h1>
        </div>
        <nav className="mt-2 space-y-1 px-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-[#D4AF37]/15 text-[#D4AF37]"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="px-3 pb-6">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-white/10 bg-[#0a0a0f] md:block">
        {sidebar}
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 border-r border-white/10 bg-[#0a0a0f] transition-transform md:hidden",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute right-3 top-5 text-white/60 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
        {sidebar}
      </aside>

      {/* Main content */}
      <div className="md:ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-white/10 bg-[#0a0a0f]/80 px-4 py-3 backdrop-blur-lg md:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-white/60 hover:text-white md:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="hidden md:block" />
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="border-[#D4AF37]/40 text-[#D4AF37]">
              {remaining} credits
            </Badge>
            <span className="text-sm text-white/60">{user.name}</span>
          </div>
        </header>

        <main className="p-4 md:p-8">{children}</main>
      </div>

      <Toaster />
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <DashboardShell>{children}</DashboardShell>
    </AuthProvider>
  );
}
