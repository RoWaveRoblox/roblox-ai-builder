"use client";

import { useEffect, useState } from "react";
import { pair, saveCode, savedCode } from "@/lib/studio";

export default function ConnectPage() {
  const [code, setCode] = useState("");
  const [linked, setLinked] = useState("");
  const [message, setMessage] = useState("Open the Ro_Create plugin in Studio and press Connect.");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const existing = savedCode();
    if (existing) {
      setLinked(existing);
      setCode(existing);
      setMessage("This browser is paired. The plugin imports whatever you send from AI Builder.");
    }
  }, []);

  async function connect() {
    const next = code.trim().toLowerCase();
    if (next.length < 4) return;
    setBusy(true);
    try {
      await pair("claim", { code: next });
      saveCode(next);
      setLinked(next);
      setMessage("Connected. Go to AI Builder and send a script, GUI, or model into Studio.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "That code was not found. Press Connect in the plugin again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <p className="mb-2 text-sm uppercase tracking-widest text-brand-red">Studio plugin</p>
      <h1 className="mb-3 text-4xl font-black text-white">Connect Ro_Create</h1>
      <p className="mb-8 text-brand-gray">
        Press Connect in the Studio plugin. It shows a code like 00687jhg. Paste that code here.
        After that, AI Builder can drop scripts, GUIs, and models straight into the open place.
      </p>
      <label className="mb-2 block text-sm text-white">Connector code</label>
      <input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="00687jhg"
        className="mb-4 w-full rounded-xl border border-white/10 bg-brand-black-soft px-4 py-3 font-mono text-2xl tracking-widest text-white outline-none focus:border-brand-red"
      />
      <button
        onClick={connect}
        disabled={busy}
        className="rounded-xl bg-brand-red px-6 py-3 font-semibold text-white disabled:opacity-50"
      >
        {busy ? "Checking..." : "Connect"}
      </button>
      {linked && <p className="mt-4 text-sm text-white">Paired as {linked}</p>}
      <p className="mt-4 text-sm text-brand-gray">{message}</p>
      <ol className="mt-8 list-decimal space-y-2 pl-5 text-sm text-brand-gray">
        <li>In Studio, save plugin/RoCreate.plugin.lua as a local plugin.</li>
        <li>Allow HTTP requests in Game Settings, Security.</li>
        <li>Press Connect, copy the code, paste it here.</li>
      </ol>
    </div>
  );
}
