"use client";

import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import {
  Sparkles,
  Code2,
  Box,
  BarChart3,
  Users,
  MessageSquare,
  ShoppingBag,
  Shield,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Code2,
    title: "AI Game Builder",
    desc: "Chat with AI to generate full Roblox Lua scripts, GUIs, and systems.",
  },
  {
    icon: Box,
    title: "Blender Models",
    desc: "Describe a model and get Blender-ready assets for your game.",
  },
  {
    icon: BarChart3,
    title: "Group & Game Analyzer",
    desc: "Paste any Roblox group, game or profile link. Get stats + improvement ideas.",
  },
  {
    icon: MessageSquare,
    title: "Support AI",
    desc: "24/7 help for scripting, monetization, and group management.",
  },
  {
    icon: Users,
    title: "Servers & Community",
    desc: "Create servers, chat, find collaborators and hire developers.",
  },
  {
    icon: ShoppingBag,
    title: "Marketplace",
    desc: "Sell your finished games and assets directly to other creators.",
  },
];

export default function HomePage() {
  const { data: session, status } = useSession();

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-brand-red/10 blur-3xl" />
        <div className="absolute -right-40 top-60 h-80 w-80 rounded-full bg-brand-red/5 blur-3xl" />
      </div>

      <section className="relative mx-auto max-w-6xl px-4 pb-20 pt-16 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-red/30 bg-brand-red/10 px-4 py-1.5 text-sm text-brand-red">
          <Zap className="h-4 w-4" />
          100 free credits every day · Resets 12 AM EST
        </div>

        <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
          Build complete{" "}
          <span className="text-brand-red">Roblox games</span>
          <br />
          with AI
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-lg text-brand-gray">
          Chat with an AI that writes code, designs GUIs, creates Blender models,
          analyzes your groups & games, and helps you grow a successful community.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          {status === "authenticated" ? (
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-red px-8 py-3.5 text-base font-semibold text-white transition hover:bg-brand-red-dark glow-red"
            >
              <Sparkles className="h-5 w-5" />
              Open AI Builder
            </Link>
          ) : (
            <button
              onClick={() => signIn("google")}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-red px-8 py-3.5 text-base font-semibold text-white transition hover:bg-brand-red-dark glow-red"
            >
              <Sparkles className="h-5 w-5" />
              Start Free with Google
            </button>
          )}
          <Link
            href="/analyzer"
            className="rounded-xl border border-white/20 px-8 py-3.5 text-base font-medium text-white transition hover:border-brand-red/50 hover:bg-brand-red/5"
          >
            Try Analyzer
          </Link>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-3 text-xs text-brand-gray">
          <span className="flex items-center gap-1">
            <Shield className="h-3.5 w-3.5 text-brand-red" /> Roles:
          </span>
          {["Member", "Mod", "Admin", "Owner", "Founder"].map((r) => (
            <span
              key={r}
              className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5"
            >
              {r}
            </span>
          ))}
        </div>
      </section>

      <section className="relative mx-auto max-w-6xl px-4 pb-24">
        <h2 className="mb-10 text-center text-2xl font-bold text-white">
          Everything you need to ship
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-white/10 bg-brand-black-soft p-6 transition hover:border-brand-red/40 hover:bg-brand-red/5"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-red/15 text-brand-red transition group-hover:bg-brand-red group-hover:text-white">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">{f.title}</h3>
              <p className="text-sm leading-relaxed text-brand-gray">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-white/10 bg-brand-black-soft py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">
            Ready to build your next hit?
          </h2>
          <p className="mb-8 text-brand-gray">
            Join free. 100 credits every day. Founders get unlimited access.
          </p>
          {status !== "authenticated" && (
            <button
              onClick={() => signIn("google")}
              className="rounded-xl bg-brand-red px-8 py-3.5 font-semibold text-white hover:bg-brand-red-dark glow-red"
            >
              Sign in with Google
            </button>
          )}
        </div>
      </section>

      <footer className="border-t border-white/5 py-8 text-center text-xs text-brand-gray">
        © {new Date().getFullYear()} RoWave AI · Red · White · Black
      </footer>
    </div>
  );
}
