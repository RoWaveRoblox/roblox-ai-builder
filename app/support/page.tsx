"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Send, LifeBuoy } from "lucide-react";

export default function SupportPage() {
  const status: string = "authenticated";
  const session = { user: { name: "Guest", role: "member", credits: 100, image: "" } };
  const router = { push: (_path: string) => {} };

  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    {
      role: "assistant" as const,
      content:
        "Hi! I'm the Support AI. Ask me anything about scripting, group management, monetization, or how to use RoWave AI.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // public: no login required
  }, [status, router]);

  async function send() {
    if (!input.trim() || loading) return;
    const q = input.trim();
    setMessages((m) => [...m, { role: "user", content: q }]);
    setInput("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setMessages((m) => [
      ...m,
      {
        role: "assistant",
        content:
          "Thanks for the question! In the full version this will be powered by a real support model trained on Roblox best practices. For now, try the AI Builder for code help or the Analyzer for group/game advice.",
      },
    ]);
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
    <div className="mx-auto flex h-[calc(100vh-64px)] max-w-3xl flex-col">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <LifeBuoy className="h-5 w-5 text-brand-red" />
        <h1 className="font-semibold text-white">Support AI</h1>
      </div>
      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-6">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                m.role === "user"
                  ? "bg-brand-red text-white"
                  : "border border-white/10 bg-brand-black-soft"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="rounded-2xl border border-white/10 bg-brand-black-soft px-4 py-3">
              <div className="flex gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-brand-red [animation-delay:-0.3s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-brand-red [animation-delay:-0.15s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-brand-red" />
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="border-t border-white/10 p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="flex gap-3"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask for help..."
            className="flex-1 rounded-xl border border-white/10 bg-brand-black-soft px-4 py-3 text-sm text-white placeholder:text-brand-gray focus:border-brand-red/50 focus:outline-none"
          />
          <button
            type="submit"
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-red text-white hover:bg-brand-red-dark"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
