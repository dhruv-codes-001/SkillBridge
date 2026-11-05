"use client";

import { Suspense, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

const API_URL = "http://127.0.0.1:8000";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : "Login failed. Please check your details."
        );
      }

      if (typeof data.access_token !== "string") {
        throw new Error("The server did not return an access token.");
      }

      sessionStorage.setItem("skillbridge_token", data.access_token);
      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof TypeError
          ? "Cannot connect to SkillBridge. Check that the backend is running."
          : err instanceof Error
            ? err.message
            : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-12 text-slate-900">
      <div className="mx-auto grid min-h-[70vh] max-w-5xl overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-200/70 md:grid-cols-2">
        <section className="flex flex-col justify-between bg-indigo-700 p-8 text-white sm:p-12">
          <Link href="/" className="text-2xl font-black tracking-tight">
            SkillBridge<span className="text-indigo-200">.</span>
          </Link>

          <div className="py-12">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-200">
              Welcome back
            </p>
            <h1 className="mt-5 text-4xl font-black leading-tight sm:text-5xl">
              Your learning journey continues here.
            </h1>
            <p className="mt-5 leading-7 text-indigo-100">
              Connect with peers, share your knowledge, and keep moving
              forward together.
            </p>
          </div>

          <p className="text-sm text-indigo-200">
            Learn together. Grow together.
          </p>
        </section>

        <section className="p-8 sm:p-12">
          <p className="text-sm font-semibold text-indigo-700">YOUR ACCOUNT</p>
          <h2 className="mt-3 text-3xl font-black">
            Log in to SkillBridge
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Enter your account details to continue.
          </p>

          {searchParams.get("registered") === "true" && (
            <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
              Your account was created successfully. You can log in now.
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100"
              />
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-indigo-700 px-5 py-3.5 font-bold text-white transition hover:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-slate-600">
            New to SkillBridge?{" "}
            <Link
              href="/register"
              className="font-bold text-indigo-700 hover:text-indigo-900"
            >
              Create an account
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading login...</div>}>
      <LoginForm />
    </Suspense>
  );
}