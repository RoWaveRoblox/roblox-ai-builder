"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Sparkles,
  Code2,
  Box,
  BarChart3,
  Users,
  MessageSquare,
  ShoppingBag,
  Zap,
} from "lucide-react";

const ideas = ["Menu GUI", "Shop GUI", "Inventory", "Sprint button", "Obby", "Simulator", "Tycoon", "Door"];

const features = [
  { icon: Code2, title: "Scripts", desc: "Describe a system. It is written and placed in the open Studio place." },
  { icon: Sparkles, title: "GUIs", desc: "Menus, shops, and HUDs show up in StarterGui as real frames and buttons." },
  { icon: Box, title: "Builds", desc: "Ask for a map piece, door, or model and it is created in Workspace." },
  { icon: BarChart3, title: "Analyzer", desc: "Paste a game, group, or profile link and get what to change." },
  { icon: MessageSquare, title: "Support", desc: "A second chat for help while you build." },
  { icon: Users, title: "Creators", desc: "Find developers, publish scripts, and spin for credits." },
  { icon: ShoppingBag, title: "Marketplace", desc: "Browse games and assets from other creators." },
];

export default function HomePage() {
  const router = useRouter();
  const [idea, setIdea] = useState("");

  function go(text?: string) {
    const next = (text || idea).trim();
    router.push(next ? `/chat?prompt=${encodeURIComponent(next)}` : "/chat");
  }

  return (
    <div className="relative overflow-hidden">
      <section className="mx-auto max-w-3xl px-4 pb-16 pt-20 text-center">
        <p className="mb-4 text-sm font-medium text-brand-red">Ro_Create for Roblox Studio</p>
        <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl">Build the game you imagine</h1>
        <p className="mx-auto mt-4 max-w-xl text-zinc-400">Describe a GUI, script, or build. Connect the plugin once. It shows up in the open place.</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            go();
          }}
          className="mx-auto mt-8 flex items-center gap-2 rounded-2xl border border-white/10 bg-[#141414] p-2 shadow-2xl"
        >
          <input
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="Make a shop GUI with swords and potions"
            className="h-12 flex-1 bg-transparent px-3 text-white outline-none placeholder:text-zinc-500"
          />
          <button type="submit" className="rounded-xl bg-brand-red px-5 py-3 text-sm font-bold text-white">
            Generate
          </button>
        </form>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {ideas.map((item) => (
            <button key={item} onClick={() => go(item)} className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-zinc-300 hover:border-brand-red">
              {item}
            </button>
          ))}
        </div>
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-zinc-500">
          <Zap className="h-3.5 w-3.5 text-brand-red" />
          100 credits a day · plugin code connects Studio
          <Link href="/connect" className="text-white underline">Connect</Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-4 px-4 pb-20 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <article key={feature.title} className="rounded-2xl border border-white/10 bg-[#121212] p-5 text-left">
            <feature.icon className="mb-3 h-5 w-5 text-brand-red" />
            <h2 className="font-bold text-white">{feature.title}</h2>
            <p className="mt-1 text-sm text-zinc-400">{feature.desc}</p>
          </article>
        ))}
      </section>
    </div>
  );
}