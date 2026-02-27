"use client";

import Link from "next/link";
import { Wand2, Clock, CreditCard, ImageIcon, Sparkles } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { getRemainingCredits } from "@/lib/credits";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) return null;

  const remaining = getRemainingCredits(user.total_credits, user.used_credits);
  const creditPercent =
    user.total_credits > 0
      ? (remaining / user.total_credits) * 100
      : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-playfair text-3xl font-bold text-white">
          Welcome back, {user.name}
        </h1>
        <p className="mt-1 text-white/60">
          Here&apos;s an overview of your account
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/60">
              Credits Remaining
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-[#D4AF37]">
              {remaining}{" "}
              <span className="text-sm font-normal text-white/40">
                / {user.total_credits}
              </span>
            </p>
            <Progress value={creditPercent} className="mt-3 h-2" />
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/60">
              Total Generations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-white">0</p>
            <p className="mt-1 text-xs text-white/40">Lifetime</p>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/60">
              Images This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-white">0</p>
            <p className="mt-1 text-xs text-white/40">
              {new Date().toLocaleString("default", { month: "long" })}
            </p>
          </CardContent>
        </Card>
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

      {/* Recent generations */}
      <div>
        <h2 className="mb-4 text-xl font-semibold text-white">
          Recent Generations
        </h2>
        <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
              <ImageIcon className="h-8 w-8 text-white/20" />
            </div>
            <p className="text-white/60">No generations yet</p>
            <p className="mt-1 text-sm text-white/40">
              Start creating stunning AI fashion images
            </p>
            <Link href="/dashboard/generate" className="mt-4">
              <Button size="sm" className="gap-2">
                <Sparkles className="h-4 w-4" />
                Get Started
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
