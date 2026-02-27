"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  RefreshCw,
  Users,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  MessageSquare,
  Plus,
  ChevronDown,
  Zap,
} from "lucide-react";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { getRemainingCredits } from "@/lib/credits";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Generate", href: "/dashboard/generate", icon: RefreshCw },
  { label: "History", href: "/dashboard/history", icon: Users },
  { label: "Pricing", href: "/dashboard/pricing", icon: CreditCard },
  { label: "Settings", href: "/dashboard/profile", icon: Settings },
];

const chatItems = [
  { id: "1", label: "Fashion Saree Model" },
  { id: "2", label: "Casual Shirt Photo" },
  { id: "3", label: "Kids Ethnic Wear" },
];

function DashboardShell({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatsExpanded, setChatsExpanded] = useState(true);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f1117]">
        <div className="flex items-center gap-3 text-white/60">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-[#22c55e]" />
          Loading...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f1117]">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold text-white">
            Please log in to continue
          </h2>
          <Link
            href="/login"
            className="inline-block rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-3 text-sm font-medium text-white hover:from-green-600 hover:to-emerald-600 shadow-lg shadow-green-500/20"
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
        {/* Logo */}
        <div className="px-5 py-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#22c55e]/15">
              <Zap className="h-5 w-5 text-[#22c55e]" />
            </div>
            <span className="text-lg font-semibold text-white tracking-tight">
              Iconic<span className="text-[#22c55e]">AI</span>
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-1 space-y-0.5 px-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all",
                  isActive
                    ? "bg-[#22c55e]/10 text-[#22c55e] glow-green-sm"
                    : "text-white/50 hover:bg-white/5 hover:text-white/80"
                )}
              >
                <item.icon className="h-[18px] w-[18px]" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Chats Section */}
        <div className="mt-6 px-3">
          <button
            onClick={() => setChatsExpanded(!chatsExpanded)}
            className="flex w-full items-center justify-between px-3 py-2 text-xs font-medium uppercase tracking-wider text-white/30"
          >
            Chats
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 transition-transform",
                chatsExpanded && "rotate-180"
              )}
            />
          </button>
          {chatsExpanded && (
            <div className="mt-1 space-y-0.5">
              {chatItems.map((chat) => (
                <button
                  key={chat.id}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] text-white/40 transition-colors hover:bg-white/5 hover:text-white/70"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span className="truncate">{chat.label}</span>
                </button>
              ))}
              <button className="flex w-full items-center gap-2.5 rounded-xl border border-dashed border-white/10 px-3 py-2 text-[13px] text-white/30 transition-colors hover:border-[#22c55e]/30 hover:text-[#22c55e]/70">
                <Plus className="h-3.5 w-3.5" />
                New Chat
              </button>
            </div>
          )}
        </div>
      </div>

      {/* User Profile Card at Bottom */}
      <div className="px-3 pb-4">
        <div className="rounded-2xl bg-[#1a1f2e] p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-sm font-semibold text-white">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">{user.name}</p>
              <p className="truncate text-xs text-white/40">{user.email}</p>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <Link
              href="/dashboard/pricing"
              className="flex-1 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 px-3 py-1.5 text-center text-xs font-medium text-white hover:from-green-600 hover:to-emerald-600"
            >
              Upgrade
            </Link>
            <button
              onClick={logout}
              className="rounded-lg bg-white/5 px-3 py-1.5 text-xs text-white/50 hover:bg-white/10 hover:text-white"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f1117]">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[260px] border-r border-white/[0.06] bg-[#0f1117] md:block">
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
          "fixed inset-y-0 left-0 z-50 w-[260px] border-r border-white/[0.06] bg-[#0f1117] transition-transform md:hidden",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute right-3 top-5 text-white/40 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
        {sidebar}
      </aside>

      {/* Main content */}
      <div className="md:ml-[260px]">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-white/[0.06] bg-[#0f1117]/90 px-4 py-3 backdrop-blur-xl md:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-white/40 hover:text-white md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h2 className="text-sm font-medium text-white/80">Project 1</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 rounded-lg bg-[#151922] px-3 py-1.5 text-xs">
              <Zap className="h-3.5 w-3.5 text-[#22c55e]" />
              <span className="text-white/60">{remaining}</span>
              <span className="text-white/30">tokens</span>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-xs font-semibold text-white">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <main className="p-4 md:p-6">{children}</main>
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
