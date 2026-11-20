"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { clearToken } from "@/lib/api";
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
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Google দিয়ে sign in: Google consent page-এ redirect করে
  async function handleGoogle() {
    setIsGoogleLoading(true);
    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
      if (error) {
        toast.error(error.message || "Could not start Google sign in");
        setIsGoogleLoading(false);
      }
      // success হলে browser নিজে Google-এ redirect করে
    } catch {
      toast.error("Something went wrong");
      setIsGoogleLoading(false);
    }
  }

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
      clearToken(); // drop any cached API token so the new account's token is fetched fresh
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

              {/* Google sign in */}
              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">or</span>
                </div>
              </div>
              <Button type="button" variant="outline" className="w-full" disabled={isGoogleLoading}
                onClick={handleGoogle}>
                <svg viewBox="0 0 24 24" aria-hidden="true" className="mr-2 h-4 w-4">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                {isGoogleLoading ? "Redirecting..." : "Continue with Google"}
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
