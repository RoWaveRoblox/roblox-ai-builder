"use client";

import { useEffect, useState } from "react";
import { pair, saveCode, savedCode } from "@/lib/studio";

export default function ConnectPage() {
  const [code, setCode] = useState("");
  const [linked, setLinked] = useState("");
  const [message, setMessage] = useState("Open a place in Studio, press Connect on the plugin, then paste the code here.");
  const [busy, setBusy] = useState(false);
  const [logs, setLogs] = useState(false);

  useEffect(() => {
    const existing = savedCode();
    if (existing) {
      setLinked(existing);
      setCode(existing);
      setMessage("Studio is paired. Send scripts, GUIs, and models from AI Builder.");
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
      setMessage("Connected. Imports will land in the open Studio place.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Code not found. Press Connect in the plugin again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center px-4 py-16">
      <div className="w-full rounded-2xl border border-white/10 bg-[#1a1a1a] p-6 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-red text-sm font-black text-white">RO</div>
          <div>
            <p className="text-sm text-zinc-300">v1.0.0</p>
            <p className="text-lg font-bold text-white">Ro_Create</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={connect}
              disabled={busy}
              className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-bold text-white disabled:opacity-50"
            >
              {busy ? "..." : linked ? "Connected" : "Connect"}
            </button>
            <span className={`h-3.5 w-3.5 rounded-full ${linked ? "bg-emerald-500" : "bg-red-700"}`} />
          </div>
        </div>
        <p className="mt-5 max-w-md text-sm text-zinc-300">{message}</p>
        <label className="mt-6 block text-xs uppercase tracking-widest text-zinc-500">Connector code</label>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="00687jhg"
          className="mt-2 w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 font-mono text-xl tracking-[0.3em] text-white outline-none focus:border-emerald-600"
        />
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => setLogs((v) => !v)}
            className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-300"
          >
            {logs ? "Logs On" : "Logs Off"}
          </button>
        </div>
        {logs && (
          <pre className="mt-3 rounded-lg bg-black/50 p-3 text-xs text-zinc-400">
            {linked ? `paired ${linked}\nwaiting for AI Builder jobs` : "idle — waiting for a plugin code"}
          </pre>
        )}
      </div>
    </div>
  );
}
