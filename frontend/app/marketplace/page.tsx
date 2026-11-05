
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API_URL = "http://127.0.0.1:8000";

type TutorOffering = {
  offering_id: number;
  tutor_id: number;
  subject_id: number;
  description: string;
  availability: string | null;
  tutor_name: string;
  subject_name: string;
};

export default function MarketplacePage() {
  const [offerings, setOfferings] = useState<TutorOffering[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOfferings() {
      try {
        const response = await fetch(`${API_URL}/api/tutor-offerings`);

        if (!response.ok) {
          throw new Error("Unable to load tutoring offers.");
        }

        const data: TutorOffering[] = await response.json();
        setOfferings(data);
      } catch {
        setError(
          "Couldn't connect to the SkillBridge backend. Make sure it is running."
        );
      } finally {
        setLoading(false);
      }
    }

    loadOfferings();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
          <Link href="/" className="text-2xl font-black text-indigo-700">
            SkillBridge.
          </Link>

          <div className="flex items-center gap-5 text-sm font-semibold">
            <Link href="/dashboard" className="hover:text-indigo-700">
              Dashboard
            </Link>
            <Link
              href="/marketplace"
              className="text-indigo-700"
            >
              Marketplace
            </Link>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-700">
          Learn from your peers
        </p>

        <div className="mt-3 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
              Tutor marketplace
            </h1>
            <p className="mt-4 max-w-2xl leading-7 text-slate-600">
              Discover subjects, connect with fellow students, and learn
              from people who understand your journey.
            </p>
          </div>

          <Link
            href="/marketplace/create"
            className="inline-flex items-center justify-center rounded-xl bg-indigo-700 px-5 py-3 font-bold text-white transition hover:bg-indigo-800"
          >
            + Offer tutoring
          </Link>
        </div>

        <div className="mt-10">
          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-600">
              Loading tutoring offers...
            </div>
          ) : error ? (
            <div
              role="alert"
              className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700"
            >
              {error}
              <button
                onClick={() => window.location.reload()}
                className="ml-2 font-bold underline"
              >
                Try again
              </button>
            </div>
          ) : offerings.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
              <h2 className="text-xl font-bold">No tutors yet</h2>
              <p className="mt-2 text-slate-600">
                Be the first to share your knowledge with other students.
              </p>
              <Link
                href="/marketplace/create"
                className="mt-5 inline-block rounded-xl bg-indigo-700 px-5 py-3 font-bold text-white hover:bg-indigo-800"
              >
                Create your first offer
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-bold">Available tutors</h2>
                <span className="text-sm text-slate-500">
                  {offerings.length}{" "}
                  {offerings.length === 1 ? "offer" : "offers"}
                </span>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {offerings.map((offering) => (
                  <article
                    key={offering.offering_id}
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-lg font-black text-indigo-700">
                      {offering.subject_name.slice(0, 2).toUpperCase()}
                    </div>

                    <p className="mt-5 text-sm font-semibold text-indigo-700">
                      {offering.subject_name}
                    </p>

                    <h3 className="mt-2 text-xl font-bold">
                      {offering.tutor_name}
                    </h3>

                    <p className="mt-3 leading-6 text-slate-600">
                      {offering.description}
                    </p>

                    <div className="mt-5 border-t border-slate-100 pt-4">
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                        Availability
                      </p>
                      <p className="mt-1 text-sm text-slate-700">
                        {offering.availability || "Contact tutor for availability"}
                      </p>
                    </div>

                    <div className="mt-5 rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600">
                      Peer tutor · Offer #{offering.offering_id}
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
