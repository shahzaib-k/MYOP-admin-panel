"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function LoginPage() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isLoading, isAuthenticated, router]);

  const validate = (): boolean => {
    const errors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = "Enter a valid email address";
    }

    if (!password) {
      errors.password = "Password is required";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setFormError(null);

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      await login(email.trim(), password);
      router.replace("/dashboard");
    } catch (error) {
      setFormError((error as Error).message || "Unable to log in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="text-4xl">🍽️</span>
          <h1 className="mt-3 text-xl font-bold text-slate-900">Make Your Own Platter</h1>
          <p className="text-sm text-slate-500">Sign in to the admin panel</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
          noValidate
        >
          {formError && (
            <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
              {formError}
            </div>
          )}

          <Input
            label="Email"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="admin@platter.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            error={fieldErrors.email}
            disabled={isSubmitting}
          />

          <Input
            label="Password"
            type="password"
            name="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            error={fieldErrors.password}
            disabled={isSubmitting}
          />

          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Login"}
          </Button>
        </form>
      </div>
    </div>
  );
}
