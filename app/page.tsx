"use client";

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
    desc: "Scripts, systems, and full game code from one chat.",
  },
  {
    icon: Box,
    title: "Blender Models",
    desc: "Models, builds, and animation notes you can drop into Studio.",
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

const shots = [
  { name: "Adopt Me", src: "https://tr.rbxcdn.com/180DAY-bf4a477b337402d1b203d72748283772/768/432/Image/Png/noFilter" },
  { name: "Blox Fruits", src: "https://tr.rbxcdn.com/180DAY-09e621f1df2e404a391adf389d2bea47/768/432/Image/Png/noFilter" },
  { name: "Adopt Me icon", src: "https://tr.rbxcdn.com/180DAY-8332f0d11c0fe1d27428ee91d920a118/512/512/Image/Png/noFilter" },
  { name: "Blox Fruits icon", src: "https://tr.rbxcdn.com/180DAY-774ec14539b264f85fdb6e8a34dfa344/512/512/Image/Png/noFilter" },
  { name: "Tower of Hell", src: "https://t7.rbxcdn.com/180DAY-88edbd4c22e4a1b7ef17bb94d78ebde1" },
];

export default function HomePage() {

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
          with <span className="text-brand-red">Ro_Create</span>
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-lg text-brand-gray">
          One AI for a full Roblox game: Lua code, GUIs, animations, building,
          modeling, and systems. No account needed.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-red px-8 py-3.5 text-base font-semibold text-white transition hover:bg-brand-red-dark glow-red"
          >
            <Sparkles className="h-5 w-5" />
            Build a game — no login
          </Link>
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

      <section className="relative mx-auto max-w-6xl px-4 pb-16">
        <h2 className="mb-6 text-center text-2xl font-bold text-white">Real Roblox games</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shots.map((s) => (
            <figure key={s.name} className="overflow-hidden rounded-2xl border border-white/10 bg-brand-black-soft">
              <img src={s.src} alt={s.name} className="h-44 w-full object-cover" />
              <figcaption className="px-3 py-2 text-sm text-white">{s.name}</figcaption>
            </figure>
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
          <Link
            href="/chat"
            className="inline-flex rounded-xl bg-brand-red px-8 py-3.5 font-semibold text-white hover:bg-brand-red-dark glow-red"
          >
            Start building
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/5 py-8 text-center text-xs text-brand-gray">
        © {new Date().getFullYear()} Ro_Create · Red · White · Black
      </footer>
    </div>
  );
}
