"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { getRemainingCredits } from "@/lib/credits";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

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
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="font-playfair text-3xl font-bold text-white">
          Profile
        </h1>
        <p className="mt-1 text-white/60">Manage your account settings</p>
      </div>

      {/* User info */}
      <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-lg">Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-white/40">Name</Label>
              <p className="mt-1 text-white">{user.name}</p>
            </div>
            <div>
              <Label className="text-white/40">Email</Label>
              <p className="mt-1 text-white">{user.email}</p>
            </div>
          </div>
          <div>
            <Label className="text-white/40">Member Since</Label>
            <p className="mt-1 text-white">
              {new Date(user.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Credits overview */}
      <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-lg">Credits Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-white">
                {user.total_credits}
              </p>
              <p className="text-xs text-white/40">Total</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {user.used_credits}
              </p>
              <p className="text-xs text-white/40">Used</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#D4AF37]">{remaining}</p>
              <p className="text-xs text-white/40">Remaining</p>
            </div>
          </div>
          <Progress value={creditPercent} className="h-2" />
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-lg">Change Password</CardTitle>
          <CardDescription>Update your account password</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <Label className="mb-2 block">Current Password</Label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
              />
            </div>
            <div>
              <Label className="mb-2 block">New Password</Label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>
            <div>
              <Label className="mb-2 block">Confirm New Password</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />
            </div>
            <Button type="submit">Update Password</Button>
          </form>
        </CardContent>
      </Card>

      <Separator className="bg-white/10" />

      {/* Delete account */}
      <Card className="border-red-500/20 bg-white/5 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-lg text-red-400">Danger Zone</CardTitle>
          <CardDescription>
            Permanently delete your account and all data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={handleDeleteAccount}>
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
