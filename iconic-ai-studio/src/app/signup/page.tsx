"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from "@/lib/auth-context";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { toast } = useToast();
  const { signup, loginWithGoogle } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please make sure both passwords are the same.",
        variant: "destructive",
      });
      return;
    }

    try {
      await signup(email, password, name);
      toast({ title: "Account created!", description: "Welcome to IconicAI Studio." });
      router.push("/dashboard");
    } catch {
      toast({ title: "Error", description: "Signup failed. Please try again." });
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      await loginWithGoogle();
      toast({ title: "Welcome!", description: "Signed in with Google." });
      router.push("/dashboard");
    } catch {
      toast({ title: "Error", description: "Google sign up failed." });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-dark px-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold/5 via-transparent to-transparent" />

      <Card className="relative w-full max-w-md border-white/10 bg-white/5 backdrop-blur-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="mb-2 font-heading text-2xl font-bold tracking-wide text-gold">
            IconicAI Studio
          </div>
          <CardTitle className="text-2xl text-white">Create Account</CardTitle>
          <CardDescription>Get started with IconicAI Studio</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-3">
            <Button type="submit" className="w-full" variant="default">
              Create Account
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleSignUp}
            >
              <span className="mr-2 flex h-5 w-5 items-center justify-center rounded-full border border-white/30 text-xs font-bold">
                G
              </span>
              Sign up with Google
            </Button>

            <p className="text-center text-sm text-white/60">
              Already have an account?{" "}
              <Link href="/login" className="text-gold hover:text-gold-light underline-offset-4 hover:underline">
                Sign In
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>

      <Toaster />
    </div>
  );
}
