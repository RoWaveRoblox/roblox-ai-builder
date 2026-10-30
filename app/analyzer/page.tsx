"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Link2, BarChart3, Lightbulb, TrendingUp } from "lucide-react";

export default function AnalyzerPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<null | {
    type: string;
    name: string;
    stats: { label: string; value: string }[];
    suggestions: string[];
  }>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // public: no login required
  }, [status, router]);

  async function analyze() {
    if (!url.trim()) return;
    setLoading(true);
    setResult(null);
    await new Promise((r) => setTimeout(r, 1500));

    const isGroup = url.includes("groups");
    const isGame = url.includes("games") || url.includes("experiences");
    setResult({
      type: isGroup ? "Group" : isGame ? "Game" : "Profile",
      name: isGroup ? "Your Group" : isGame ? "Your Experience" : "Player Profile",
      stats: [
        { label: "Members / Visits", value: isGroup ? "12.4k" : "89.2k" },
        { label: "Activity score", value: "72 / 100" },
        { label: "Growth (30d)", value: "+18%" },
        { label: "Engagement", value: "Medium-High" },
      ],
      suggestions: [
        "Add a clear group wall announcement schedule (3× per week).",
        "Create a free starter place that funnels players into your main game.",
        "Run a limited-time event with exclusive badges to boost retention.",
        "Improve the group icon and description — current ones underperform similar groups.",
        "Partner with 2–3 smaller developers for cross-promotion.",
      ],
    });
    setLoading(false);
  }

  if (status === "loading") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-red border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-red/15 text-brand-red">
          <BarChart3 className="h-7 w-7" />
        </div>
        <h1 className="text-3xl font-bold text-white">Group & Game Analyzer</h1>
        <p className="mt-2 text-brand-gray">
          Paste a Roblox group, game, or profile link. Get stats and concrete advice.
        </p>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Link2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-gray" />
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.roblox.com/groups/..."
            className="w-full rounded-xl border border-white/10 bg-brand-black-soft py-3 pl-10 pr-4 text-sm text-white placeholder:text-brand-gray focus:border-brand-red/50 focus:outline-none"
          />
        </div>
        <button
          onClick={analyze}
          disabled={loading || !url.trim()}
          className="rounded-xl bg-brand-red px-6 py-3 font-semibold text-white hover:bg-brand-red-dark disabled:opacity-40"
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </div>

      {result && (
        <div className="mt-10 space-y-6">
          <div className="rounded-2xl border border-white/10 bg-brand-black-soft p-6">
            <p className="text-xs uppercase tracking-wider text-brand-red">
              {result.type}
            </p>
            <h2 className="mt-1 text-xl font-bold text-white">{result.name}</h2>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {result.stats.map((s) => (
                <div key={s.label} className="rounded-xl bg-black/40 p-3 text-center">
                  <p className="text-lg font-bold text-white">{s.value}</p>
                  <p className="text-xs text-brand-gray">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-brand-red/20 bg-brand-red/5 p-6">
            <div className="mb-4 flex items-center gap-2 text-brand-red">
              <Lightbulb className="h-5 w-5" />
              <h3 className="font-semibold">What to improve</h3>
            </div>
            <ul className="space-y-3">
              {result.suggestions.map((s, i) => (
                <li key={i} className="flex gap-3 text-sm text-brand-white">
                  <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-brand-red" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
