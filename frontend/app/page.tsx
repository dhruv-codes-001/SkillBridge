
"use client";

import { useState } from "react";

const subjects = [
  { name: "Programming", detail: "Learn to code with confidence", icon: "</>" },
  { name: "Mathematics", detail: "Make difficult concepts simple", icon: "∑" },
  { name: "Database Systems", detail: "Master SQL and database design", icon: "▤" },
  { name: "Artificial Intelligence", detail: "Explore AI and machine learning", icon: "✳" },
];

export default function Home() {
  const [email, setEmail] = useState("");

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <a href="/" className="text-2xl font-black tracking-tight text-indigo-700">
            SkillBridge<span className="text-slate-900">.</span>
          </a>

          <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="#subjects" className="hover:text-indigo-700">Explore subjects</a>
            <a href="#how-it-works" className="hover:text-indigo-700">How it works</a>
          </div>

          <div className="flex items-center gap-3">
            <a href="/login" className="hidden rounded-xl px-4 py-2 text-sm font-semibold hover:bg-slate-100 sm:block">
              Log in
            </a>
            <a href="/register" className="rounded-xl bg-indigo-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-800">
              Get started
            </a>
          </div>
        </nav>
      </header>

      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:py-28">
          <div>
            <p className="mb-6 inline-flex rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700">
              Learn together. Grow together.
            </p>

            <h1 className="max-w-2xl text-5xl font-black leading-tight tracking-tight sm:text-6xl">
              Your next breakthrough starts with{" "}
              <span className="text-indigo-700">a helping hand.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Connect with fellow students, learn from their strengths, and
              share what you know. Great learning happens when students help
              each other succeed.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <a href="/register" className="rounded-xl bg-indigo-700 px-6 py-3.5 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-800">
                Find your learning partner →
              </a>
              <a href="#how-it-works" className="rounded-xl border border-slate-300 bg-white px-6 py-3.5 font-semibold text-slate-700 transition hover:border-indigo-300">
                See how it works
              </a>
            </div>

            <p className="mt-8 text-sm text-slate-500">
              Built for students, powered by students.
            </p>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-full bg-indigo-100/70 blur-3xl" />
            <div className="relative rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-200/70 sm:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Your learning space</p>
                  <h2 className="mt-1 text-2xl font-bold">Grow every day.</h2>
                </div>
                <div className="rounded-2xl bg-indigo-50 p-4 text-2xl">✦</div>
              </div>

              <div className="mt-7 space-y-4">
                <div className="rounded-2xl bg-indigo-50 p-5">
                  <p className="text-sm font-semibold text-indigo-700">Learn something new</p>
                  <p className="mt-2 text-lg font-bold">One concept at a time.</p>
                  <p className="mt-1 text-sm text-slate-600">Find someone who can explain it your way.</p>
                </div>
                <div className="flex items-center gap-4 rounded-2xl border border-slate-100 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-xl">↗</div>
                  <div>
                    <p className="font-semibold">Share your strengths</p>
                    <p className="mt-1 text-sm text-slate-500">Help another student move forward.</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 rounded-2xl border border-slate-100 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-xl">◎</div>
                  <div>
                    <p className="font-semibold">Build real connections</p>
                    <p className="mt-1 text-sm text-slate-500">Make campus learning collaborative.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="subjects" className="border-y border-slate-200 bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-widest text-indigo-700">Explore and learn</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Find help with what you&apos;re learning.
            </h2>
            <p className="mt-4 leading-7 text-slate-600">
              From programming to mathematics, connect with peers who understand your subjects.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {subjects.map((subject) => (
              <article key={subject.name} className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 font-bold text-indigo-700">
                  {subject.icon}
                </div>
                <h3 className="mt-5 text-lg font-bold">{subject.name}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{subject.detail}</p>
                <a href="/register" className="mt-5 inline-block text-sm font-bold text-indigo-700">
                  Start learning →
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-indigo-700">Simple by design</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Learning works better together.</h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { number: "01", title: "Find your subject", detail: "Explore subjects and find peers who can help." },
            { number: "02", title: "Connect with a tutor", detail: "Choose a learning partner and request a session." },
            { number: "03", title: "Learn and grow", detail: "Meet, learn, share feedback, and keep improving." },
          ].map((step) => (
            <div key={step.number} className="rounded-2xl border border-slate-200 bg-white p-7">
              <p className="text-sm font-black tracking-widest text-indigo-700">{step.number}</p>
              <h3 className="mt-4 text-xl font-bold">{step.title}</h3>
              <p className="mt-3 leading-7 text-slate-600">{step.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-indigo-700 px-6 py-16 text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-black">Your next step starts here.</h2>
            <p className="mt-3 max-w-xl leading-7 text-indigo-100">
              Join a community where every student has something to teach and something to learn.
            </p>
          </div>
          <a href="/register" className="shrink-0 rounded-xl bg-white px-6 py-3.5 font-bold text-indigo-700 transition hover:bg-indigo-50">
            Join SkillBridge →
          </a>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 text-sm text-slate-500 sm:flex-row">
          <p>© 2026 SkillBridge. Built for collaborative learning.</p>
          <p>Learn together. Grow together.</p>
        </div>
      </footer>
    </main>
  );
}
