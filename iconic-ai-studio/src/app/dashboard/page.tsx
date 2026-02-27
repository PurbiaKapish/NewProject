"use client";

import Link from "next/link";
import { Wand2, Clock, CreditCard, ImageIcon, Sparkles, Zap, TrendingUp } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { getRemainingCredits } from "@/lib/credits";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) return null;

  const remaining = getRemainingCredits(user.total_credits, user.used_credits);
  const creditPercent =
    user.total_credits > 0
      ? (remaining / user.total_credits) * 100
      : 0;

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-semibold text-white">
          Welcome back, {user.name}
        </h1>
        <p className="mt-1 text-sm text-white/40">
          Here&apos;s an overview of your account
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-white/[0.06] bg-[#151922] p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wider text-white/30">Credits</p>
            <Zap className="h-4 w-4 text-[#22c55e]" />
          </div>
          <p className="mt-3 text-3xl font-bold text-white">
            {remaining}
            <span className="ml-1 text-sm font-normal text-white/20">/ {user.total_credits}</span>
          </p>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400"
              style={{ width: `${creditPercent}%` }}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-[#151922] p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wider text-white/30">Generations</p>
            <TrendingUp className="h-4 w-4 text-white/20" />
          </div>
          <p className="mt-3 text-3xl font-bold text-white">0</p>
          <p className="mt-1 text-xs text-white/20">Lifetime</p>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-[#151922] p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wider text-white/30">This Month</p>
            <ImageIcon className="h-4 w-4 text-white/20" />
          </div>
          <p className="mt-3 text-3xl font-bold text-white">0</p>
          <p className="mt-1 text-xs text-white/20">
            {new Date().toLocaleString("default", { month: "long" })}
          </p>
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3">
        <Link href="/dashboard/generate">
          <Button className="gap-2">
            <Wand2 className="h-4 w-4" />
            Generate New Image
          </Button>
        </Link>
        <Link href="/dashboard/history">
          <Button variant="secondary" className="gap-2">
            <Clock className="h-4 w-4" />
            View History
          </Button>
        </Link>
        <Link href="/dashboard/pricing">
          <Button variant="outline" className="gap-2">
            <CreditCard className="h-4 w-4" />
            Buy Credits
          </Button>
        </Link>
      </div>

      {/* Recent generations - Image Grid Preview */}
      <div>
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-white/30">
          Recent Generations
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Empty state cards */}
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="group relative aspect-square overflow-hidden rounded-2xl border border-white/[0.06] bg-[#151922] transition-all hover:border-white/10"
            >
              <div className="flex h-full flex-col items-center justify-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5">
                  <ImageIcon className="h-6 w-6 text-white/10" />
                </div>
                {i === 1 && (
                  <>
                    <p className="text-sm text-white/20">No images yet</p>
                    <Link href="/dashboard/generate">
                      <Button size="sm" className="gap-1.5 text-xs">
                        <Sparkles className="h-3.5 w-3.5" />
                        Generate
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
