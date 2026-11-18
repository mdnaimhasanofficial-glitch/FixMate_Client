"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

// Check every field and return the error messages
function validate(fields: { name: string; email: string; password: string }) {
  const errors: Record<string, string> = {};
  if (!fields.name.trim()) errors.name = "Full name is required";
  if (!fields.email.trim()) errors.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) errors.email = "Enter a valid email";
  if (!fields.password) errors.password = "Password is required";
  else if (fields.password.length < 6 || !/[A-Z]/.test(fields.password) || !/[a-z]/.test(fields.password))
    errors.password = "Min 6 chars with one uppercase and one lowercase letter";
  return errors;
}

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"customer" | "technician">("customer");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Create the account with BetterAuth, then go to the dashboard
  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const found = validate({ name, email, password });
    setErrors(found);
    if (Object.keys(found).length > 0) return; // invalid -> do not submit
    setIsLoading(true);
    try {
      // role is an extra field: better-auth saves it at runtime
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await authClient.signUp.email({ name, email, password, role } as any);
      if (error) {
        toast.error(error.message || "Could not create the account");
        return;
      }
      toast.success("Account created successfully");
      router.push("/dashboard");
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
          src="https://picsum.photos/seed/fixmate-signup/900/1200"
          alt="Technician repairing a device"
          className="absolute inset-0 h-full w-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-navy/60" />
        <div className="relative flex h-full flex-col justify-end p-10 text-white">
          <h1 className="text-3xl font-bold">FixMate</h1>
          <p className="mt-2 max-w-sm text-white/80">
            Book trusted technicians for smartphone, laptop, AC and home appliance repair.
          </p>
        </div>
      </div>

      {/* Form side */}
      <div className="flex items-center justify-center px-4 py-10">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-xl">Create your account</CardTitle>
            <CardDescription>Join FixMate in less than a minute</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full name */}
              <div className="space-y-1.5">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={name} placeholder="John Doe"
                  onChange={(e) => { setName(e.target.value); setErrors({ ...errors, name: "" }); }} />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
              </div>

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

              {/* Role selection: two cards, no admin */}
              <div className="grid grid-cols-2 gap-3">
                {([["customer", "Customer", "Book repairs"], ["technician", "Technician", "Offer services"]] as const).map(
                  ([value, label, hint]) => (
                    <Card key={value} onClick={() => setRole(value)} aria-pressed={role === value}
                      className={`cursor-pointer transition ${role === value ? "ring-2 ring-primary" : "hover:ring-1 hover:ring-border"}`}>
                      <CardHeader className="py-2">
                        <CardTitle className="text-sm">{label}</CardTitle>
                        <CardDescription className="text-xs">{hint}</CardDescription>
                      </CardHeader>
                    </Card>
                  )
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Sign Up"}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/sign-in" className="font-medium text-primary underline-offset-4 hover:underline">
                  Sign in
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
