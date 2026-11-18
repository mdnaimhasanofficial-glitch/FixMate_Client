"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

// Check the two fields and return the error messages
function validate(fields: { email: string; password: string }) {
  const errors: Record<string, string> = {};
  if (!fields.email.trim()) errors.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) errors.email = "Enter a valid email";
  if (!fields.password) errors.password = "Password is required";
  return errors;
}

// The form uses useSearchParams, so it must sit inside <Suspense>
function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Log in with BetterAuth, then go to ?redirect= or the dashboard
  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const found = validate({ email, password });
    setErrors(found);
    if (Object.keys(found).length > 0) return; // invalid -> do not submit
    setIsLoading(true);
    try {
      const { error } = await authClient.signIn.email({ email, password });
      if (error) {
        toast.error(error.message || "Wrong email or password");
        return;
      }
      toast.success("Signed in successfully");
      // Only follow local paths, never an external site
      const nextPath = searchParams.get("redirect");
      router.push(
        nextPath && nextPath.startsWith("/") && !nextPath.startsWith("//")
          ? nextPath
          : "/dashboard"
      );
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Illustration side (desktop only) */}
      <div className="relative hidden bg-navy lg:block">
        <img
          src="https://picsum.photos/seed/fixmate-signin/900/1200"
          alt="Technician repairing a device"
          className="absolute inset-0 h-full w-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-navy/60" />
        <div className="relative flex h-full flex-col justify-end p-10 text-white">
          <h1 className="text-3xl font-bold">FixMate</h1>
          <p className="mt-2 max-w-sm text-white/80">
            Welcome back. Book a repair or manage your services.
          </p>
        </div>
      </div>

      {/* Form side */}
      <div className="flex items-center justify-center px-4 py-10">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-xl">Sign in to your account</CardTitle>
            <CardDescription>Enter your email and password</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} placeholder="you@example.com"
                  onChange={(e) => { setEmail(e.target.value); setErrors({ ...errors, email: "" }); }} />
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} placeholder="••••••••"
                  onChange={(e) => { setPassword(e.target.value); setErrors({ ...errors, password: "" }); }} />
                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                No account yet?{" "}
                <Link href="/sign-up" className="font-medium text-primary underline-offset-4 hover:underline">
                  Sign up
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInForm />
    </Suspense>
  );
}
