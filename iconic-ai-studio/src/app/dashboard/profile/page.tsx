"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { getRemainingCredits } from "@/lib/credits";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  if (!user) return null;

  const remaining = getRemainingCredits(user.total_credits, user.used_credits);
  const creditPercent =
    user.total_credits > 0 ? (remaining / user.total_credits) * 100 : 0;

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Missing fields",
        description: "Please fill in all password fields.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirmation must match.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Password updated",
      description: "Your password has been changed successfully.",
    });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleDeleteAccount = () => {
    toast({
      title: "Delete Account",
      description:
        "Account deletion is irreversible. Contact support to proceed.",
      variant: "destructive",
    });
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Settings</h1>
        <p className="mt-1 text-sm text-white/40">Manage your account</p>
      </div>

      {/* User info */}
      <div className="rounded-2xl border border-white/[0.06] bg-[#151922] p-5">
        <h3 className="text-sm font-medium text-white/50 mb-4">Account Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] uppercase tracking-wider text-white/20">Name</label>
            <p className="mt-1 text-sm text-white">{user.name}</p>
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-white/20">Email</label>
            <p className="mt-1 text-sm text-white">{user.email}</p>
          </div>
        </div>
        <div className="mt-3">
          <label className="text-[10px] uppercase tracking-wider text-white/20">Member Since</label>
          <p className="mt-1 text-sm text-white">
            {new Date(user.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Credits overview */}
      <div className="rounded-2xl border border-white/[0.06] bg-[#151922] p-5">
        <h3 className="text-sm font-medium text-white/50 mb-4">Credits Overview</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-white">{user.total_credits}</p>
            <p className="text-[10px] text-white/20">Total</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{user.used_credits}</p>
            <p className="text-[10px] text-white/20">Used</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-[#22c55e]">{remaining}</p>
            <p className="text-[10px] text-white/20">Remaining</p>
          </div>
        </div>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400"
            style={{ width: `${creditPercent}%` }}
          />
        </div>
      </div>

      {/* Change Password */}
      <div className="rounded-2xl border border-white/[0.06] bg-[#151922] p-5">
        <h3 className="text-sm font-medium text-white/50 mb-1">Change Password</h3>
        <p className="text-xs text-white/20 mb-4">Update your account password</p>
        <form onSubmit={handleChangePassword} className="space-y-3">
          <div>
            <Label className="mb-1.5 block text-xs text-white/30">Current Password</Label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              className="rounded-xl border-white/[0.06] bg-white/[0.03]"
            />
          </div>
          <div>
            <Label className="mb-1.5 block text-xs text-white/30">New Password</Label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="rounded-xl border-white/[0.06] bg-white/[0.03]"
            />
          </div>
          <div>
            <Label className="mb-1.5 block text-xs text-white/30">Confirm New Password</Label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="rounded-xl border-white/[0.06] bg-white/[0.03]"
            />
          </div>
          <Button type="submit" className="text-xs">Update Password</Button>
        </form>
      </div>

      {/* Danger zone */}
      <div className="rounded-2xl border border-red-500/10 bg-[#151922] p-5">
        <h3 className="text-sm font-medium text-red-400 mb-1">Danger Zone</h3>
        <p className="text-xs text-white/20 mb-4">Permanently delete your account and all data</p>
        <Button variant="destructive" onClick={handleDeleteAccount} className="text-xs">
          Delete Account
        </Button>
      </div>
    </div>
  );
}
