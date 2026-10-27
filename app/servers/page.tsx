"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Plus, Users, MessageCircle } from "lucide-react";

const DEMO_SERVERS = [
  { id: 1, name: "Obby Creators Hub", members: 128, desc: "Share stages, tips and collab on obbies." },
  { id: 2, name: "Simulator Devs", members: 89, desc: "Pet sims, tycoons, and monetization talk." },
  { id: 3, name: "UI & Design", members: 54, desc: "GUIs, icons, and visual polish." },
];

export default function ServersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/");
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-red border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Servers</h1>
          <p className="mt-1 text-brand-gray">Community spaces to chat, collab and find help.</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 rounded-xl bg-brand-red px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-red-dark"
        >
          <Plus className="h-4 w-4" /> Create Server
        </button>
      </div>

      {showCreate && (
        <div className="mb-8 rounded-2xl border border-brand-red/30 bg-brand-black-soft p-5">
          <h3 className="mb-3 font-semibold text-white">New Server</h3>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Server name"
            className="mb-3 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:border-brand-red/50 focus:outline-none"
          />
          <div className="flex gap-2">
            <button
              onClick={() => {
                setShowCreate(false);
                setName("");
              }}
              className="rounded-lg bg-brand-red px-4 py-2 text-sm font-medium text-white"
            >
              Create (demo)
            </button>
            <button
              onClick={() => setShowCreate(false)}
              className="rounded-lg border border-white/10 px-4 py-2 text-sm text-brand-gray"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {DEMO_SERVERS.map((s) => (
          <div
            key={s.id}
            className="flex items-center justify-between rounded-2xl border border-white/10 bg-brand-black-soft p-5 transition hover:border-brand-red/30"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-red/15 text-brand-red">
                <MessageCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-white">{s.name}</h3>
                <p className="text-sm text-brand-gray">{s.desc}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm text-brand-gray">
              <Users className="h-4 w-4" />
              {s.members}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
