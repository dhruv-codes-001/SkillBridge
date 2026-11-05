
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL = "http://127.0.0.1:8000";

type UserProfile = {
  user_id: number;
  name: string;
  email: string;
};

type Subject = {
  subject_id: number;
  subject_name: string;
  description?: string | null;
};

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      const token = sessionStorage.getItem("skillbridge_token");

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const [profileResponse, subjectsResponse] = await Promise.all([
          fetch(`${API_URL}/api/users/me`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/api/subjects`),
        ]);

        if (profileResponse.status === 401) {
          sessionStorage.removeItem("skillbridge_token");
          router.replace("/login");
          return;
        }

        if (!profileResponse.ok) {
          throw new Error("Could not load your profile.");
        }

        const profile: UserProfile = await profileResponse.json();

        if (!cancelled) {
          setUser(profile);
        }

        if (subjectsResponse.ok) {
          const subjectData: Subject[] = await subjectsResponse.json();

          if (!cancelled) {
            setSubjects(subjectData);
          }
        }
      } catch {
        if (!cancelled) {
          setError(
            "Unable to connect to SkillBridge. Check that the backend is running."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, [router]);

  function handleLogout() {
    sessionStorage.removeItem("skillbridge_token");
    router.replace("/login");
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="font-medium text-indigo-700">Loading your dashboard...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-2xl font-black text-indigo-700">
            SkillBridge.
          </Link>

          <button
            onClick={handleLogout}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold hover:bg-slate-100"
          >
            Log out
          </button>
        </nav>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-12">
        {error && (
          <div role="alert" className="mb-6 rounded-xl bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        <section className="rounded-3xl bg-indigo-700 p-8 text-white sm:p-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-200">
            Student dashboard
          </p>

          <h1 className="mt-4 text-3xl font-black sm:text-4xl">
            {user ? `Welcome back, ${user.name}!` : "Welcome to SkillBridge!"}
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-indigo-100">
            Your learning journey starts here. Explore subjects, connect with
            fellow students, and discover new ways to learn together.
          </p>

          {user && (
            <div className="mt-7 inline-block rounded-xl bg-white/10 px-4 py-3">
              <p className="text-sm text-indigo-200">Signed in as</p>
              <p className="mt-1 font-medium">{user.email}</p>
            </div>
          )}
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-black">Explore subjects</h2>
          <p className="mt-2 text-slate-600">
            Discover what you can learn with your peers.
          </p>

          {subjects.length > 0 ? (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {subjects.map((subject) => (
                <article
                  key={subject.subject_id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-xl text-indigo-700">
                    ◈
                  </div>

                  <h3 className="mt-4 text-lg font-bold">
                    {subject.subject_name}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {subject.description || "Explore this subject with SkillBridge."}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
              <h3 className="font-bold">Your learning space is ready</h3>
              <p className="mt-2 text-sm text-slate-600">
                No subjects are available yet. Add subjects through the backend
                to display them here.
              </p>
            </div>
          )}
        </section>

        <section className="mt-10 grid gap-5 md:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="text-lg font-bold">Find a tutor</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Tutor discovery and session requests are coming next.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="text-lg font-bold">Share your knowledge</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Tutor offerings will let you help other students learn.
            </p>
          </article>
        </section>
      </div>
    </main>
  );
}
