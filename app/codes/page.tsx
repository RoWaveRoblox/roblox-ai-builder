"use client";

import { useState } from "react";
import { grantInfinite, infiniteCredits } from "@/lib/credits";

export default function CodesPage() {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState(infiniteCredits() ? "Infinite credits are already on." : "Enter a code.");

  function redeem() {
    if (code.trim().toUpperCase() === "CREDITSNOMONEY") {
      grantInfinite();
      setMessage("Infinite credits are on. The builder will not charge you.");
      return;
    }
    setMessage("That code does not work.");
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <p className="text-xs uppercase tracking-widest text-brand-red">Codes</p>
      <h1 className="mb-3 text-4xl font-black text-white">Redeem a code</h1>
      <p className="mb-6 text-sm text-zinc-400">Codes change your credit balance. Harder builds still show a cost, but an infinite code skips the charge.</p>
      <input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter code"
        className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 font-mono text-white outline-none focus:border-brand-red"
      />
      <button onClick={redeem} className="mt-4 rounded-xl bg-brand-red px-5 py-3 font-semibold text-white">
        Redeem
      </button>
      <p className="mt-4 text-sm text-zinc-300">{message}</p>
    </div>
  );
}
