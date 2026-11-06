"use client";

import { useEffect, useState } from "react";
import { pair } from "@/lib/studio";

type Item = { id: string; title: string; model: string; source: string };

export default function ScriptsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    pair("list-scripts")
      .then((data) => setItems(data.items || []))
      .catch(() => setItems([]));
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-2 text-4xl font-black text-white">Published scripts</h1>
      <p className="mb-6 text-sm text-zinc-400">Builds you publish from the AI Builder show up here.</p>
      <div className="space-y-3">
        {items.length === 0 && <p className="text-sm text-zinc-500">Nothing published yet.</p>}
        {items.map((item) => (
          <article key={item.id} className="rounded-2xl border border-white/10 bg-black/40 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="font-bold text-white">{item.title}</h2>
                <p className="text-xs text-zinc-500">{item.model}</p>
              </div>
              <button onClick={() => setOpen(open === item.id ? null : item.id)} className="text-sm text-brand-red">
                {open === item.id ? "Hide" : "View"}
              </button>
            </div>
            {open === item.id && (
              <pre className="mt-3 overflow-x-auto whitespace-pre-wrap text-xs text-zinc-300">{item.source}</pre>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
