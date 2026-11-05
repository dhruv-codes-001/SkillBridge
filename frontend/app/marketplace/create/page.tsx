
"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL = "http://127.0.0.1:8000";

type Subject = {
  subject_id: number;
  subject_name: string;
  description: string | null;
};

export default function CreateOfferingPage() {
  const router = useRouter();

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subjectId, setSubjectId] = useState("");
  const [description, setDescription] = useState("");
  const [availability, setAvailability] = useState("");
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadSubjects() {
      try {
        const response = await fetch(`${API_URL}/api/subjects`);

        if (!response.ok) {
          throw new Error("Unable to load subjects.");
        }

        const data: Subject[] = await response.json();
        setSubjects(data);

        if (data.length > 0) {
          setSubjectId(String(data[0].subject_id));
        }
      } catch {
        setError("Could not load subjects. Check that the backend is running.");
      } finally {
        setLoadingSubjects(false);
      }
    }

    loadSubjects();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const token = sessionStorage.getItem("skillbridge_token");

    if (!token) {
      router.push("/login");
      return;
    }

    if (!subjectId) {
      setError("Please select a subject.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/tutor-offerings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          subject_id: Number(subjectId),
          description: description.trim(),
          availability: availability.trim() || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          sessionStorage.removeItem("skillbridge_token");
          router.push("/login");
          return;
        }

        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : "Could not create your tutoring offer."
        );
      }

      setSuccess("Your tutoring offer was published successfully!");

      // Give the user a moment to see the success message.
      window.setTimeout(() => {
        router.push("/marketplace");
        router.refresh();
      }, 900);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
          <Link href="/" className="text-2xl font-black text-indigo-700">
            SkillBridge.
          </Link>
          <Link
            href="/marketplace"
            className="text-sm font-semibold text-slate-600 hover:text-indigo-700"
          >
            Back to marketplace
          </Link>
        </div>
      </nav>

      <section className="mx-auto max-w-3xl px-5 py-12 sm:py-16">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-700">
          Share what you know
        </p>
        <h1 className="mt-3 text-4xl font-black tracking-tight">
          Offer tutoring
        </h1>
        <p className="mt-4 leading-7 text-slate-600">
          Help your peers learn something new. Choose a subject, explain
          what you can teach, and tell them when you're available.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <div>
            <label
              htmlFor="subject"
              className="mb-2 block text-sm font-bold"
            >
              Subject
            </label>
            <select
              id="subject"
              required
              value={subjectId}
              onChange={(event) => setSubjectId(event.target.value)}
              disabled={loadingSubjects || subjects.length === 0}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 disabled:bg-slate-100"
            >
              {loadingSubjects ? (
                <option value="">Loading subjects...</option>
              ) : subjects.length === 0 ? (
                <option value="">No subjects available</option>
              ) : (
                subjects.map((subject) => (
                  <option
                    key={subject.subject_id}
                    value={subject.subject_id}
                  >
                    {subject.subject_name}
                  </option>
                ))
              )}
            </select>
            {subjects.length === 0 && !loadingSubjects && (
              <p className="mt-2 text-sm text-slate-500">
                Add a subject before publishing an offer.
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-bold"
            >
              What can you teach?
            </label>
            <textarea
              id="description"
              required
              minLength={10}
              maxLength={2000}
              rows={5}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe the topics you can explain and how you can help other students..."
              className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100"
            />
            <p className="mt-2 text-right text-xs text-slate-500">
              {description.length}/2000 characters
            </p>
          </div>

          <div>
            <label
              htmlFor="availability"
              className="mb-2 block text-sm font-bold"
            >
              Availability
            </label>
            <input
              id="availability"
              type="text"
              maxLength={255}
              value={availability}
              onChange={(event) => setAvailability(event.target.value)}
              placeholder="e.g. Weekdays, 5 PM to 7 PM"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100"
            />
            <p className="mt-2 text-sm text-slate-500">
              You can leave this blank if your schedule is flexible.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          {success && (
            <div
              role="status"
              className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
            >
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={
              submitting ||
              loadingSubjects ||
              subjects.length === 0
            }
            className="w-full rounded-xl bg-indigo-700 px-5 py-3.5 font-bold text-white transition hover:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Publishing..." : "Publish tutoring offer"}
          </button>
        </form>
      </section>
    </main>
  );
}
