"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/lib/auth-context";
import { ShieldAlert, Users, CreditCard } from "lucide-react";

const MOCK_USERS = [
  { id: "u1", name: "Alice Johnson", email: "alice@example.com", credits: 25, status: "active" as const },
  { id: "u2", name: "Bob Smith", email: "bob@example.com", credits: 3, status: "active" as const },
  { id: "u3", name: "Carol White", email: "carol@example.com", credits: 0, status: "disabled" as const },
  { id: "u4", name: "Dave Brown", email: "dave@example.com", credits: 50, status: "active" as const },
];

const MOCK_TRANSACTIONS = [
  { id: "t1", user: "alice@example.com", amount: 29.99, credits: 50, provider: "stripe", status: "completed", date: "2024-12-01" },
  { id: "t2", user: "bob@example.com", amount: 9.99, credits: 10, provider: "razorpay", status: "completed", date: "2024-12-03" },
  { id: "t3", user: "dave@example.com", amount: 49.99, credits: 100, provider: "stripe", status: "pending", date: "2024-12-05" },
  { id: "t4", user: "carol@example.com", amount: 9.99, credits: 10, provider: "razorpay", status: "failed", date: "2024-12-06" },
];

type Tab = "users" | "transactions";

function AdminPanel() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<Tab>("users");
  const [users, setUsers] = useState(MOCK_USERS);

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f]">
        <div className="text-center space-y-3">
          <ShieldAlert className="mx-auto h-12 w-12 text-red-400" />
          <h2 className="text-xl font-semibold text-white">Admin access required</h2>
          <p className="text-white/50">Please log in with an admin account.</p>
        </div>
      </div>
    );
  }

  const handleAdjustCredits = (userId: string, userName: string) => {
    const input = window.prompt(`Enter new credit amount for ${userName}:`);
    if (input === null) return;
    const newCredits = parseInt(input, 10);
    if (isNaN(newCredits) || newCredits < 0) {
      toast({ title: "Invalid amount", description: "Please enter a valid number.", variant: "destructive" });
      return;
    }
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, credits: newCredits } : u)));
    toast({ title: "Credits updated", description: `${userName} now has ${newCredits} credits.` });
  };

  const handleToggleStatus = (userId: string, userName: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, status: u.status === "active" ? ("disabled" as const) : ("active" as const) } : u
      )
    );
    const updated = users.find((u) => u.id === userId);
    const newStatus = updated?.status === "active" ? "disabled" : "active";
    toast({ title: "Status changed", description: `${userName} is now ${newStatus}.` });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-6 text-3xl font-bold text-[#D4AF37]">Admin Dashboard</h1>

        {/* Tabs */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setActiveTab("users")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "users" ? "bg-[#D4AF37]/20 text-[#D4AF37]" : "text-white/60 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Users className="h-4 w-4" />
            Users
          </button>
          <button
            onClick={() => setActiveTab("transactions")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "transactions" ? "bg-[#D4AF37]/20 text-[#D4AF37]" : "text-white/60 hover:bg-white/5 hover:text-white"
            }`}
          >
            <CreditCard className="h-4 w-4" />
            Transactions
          </button>
        </div>

        {/* Users Table */}
        {activeTab === "users" && (
          <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#12121a]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-white/50">
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Credits</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="px-4 py-3 text-white">{u.name}</td>
                    <td className="px-4 py-3 text-white/70">{u.email}</td>
                    <td className="px-4 py-3 text-[#D4AF37]">{u.credits}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                          u.status === "active" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAdjustCredits(u.id, u.name)}
                          className="rounded-md bg-[#D4AF37]/10 px-3 py-1 text-xs font-medium text-[#D4AF37] hover:bg-[#D4AF37]/20 transition-colors"
                        >
                          Adjust Credits
                        </button>
                        <button
                          onClick={() => handleToggleStatus(u.id, u.name)}
                          className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                            u.status === "active"
                              ? "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                              : "bg-green-500/10 text-green-400 hover:bg-green-500/20"
                          }`}
                        >
                          {u.status === "active" ? "Disable" : "Enable"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Transactions Table */}
        {activeTab === "transactions" && (
          <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#12121a]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-white/50">
                  <th className="px-4 py-3 font-medium">ID</th>
                  <th className="px-4 py-3 font-medium">User</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Credits</th>
                  <th className="px-4 py-3 font-medium">Provider</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_TRANSACTIONS.map((t) => (
                  <tr key={t.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="px-4 py-3 font-mono text-white/50">{t.id}</td>
                    <td className="px-4 py-3 text-white/70">{t.user}</td>
                    <td className="px-4 py-3 text-white">${t.amount.toFixed(2)}</td>
                    <td className="px-4 py-3 text-[#D4AF37]">{t.credits}</td>
                    <td className="px-4 py-3 capitalize text-white/70">{t.provider}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                          t.status === "completed"
                            ? "bg-green-500/20 text-green-400"
                            : t.status === "pending"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white/50">{t.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Toaster />
    </div>
  );
}

export default function AdminPage() {
  return (
    <AuthProvider>
      <AdminPanel />
    </AuthProvider>
  );
}
