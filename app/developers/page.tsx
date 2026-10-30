"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { User, MessageSquare } from "lucide-react";

const DEVS = [
  { name: "ScriptMaster", skills: "Lua, Systems, Datastores", rate: "R$ 50/hr" },
  { name: "UIQueen", skills: "GUIs, UX, Icons", rate: "R$ 40/hr" },
  { name: "ModelKing", skills: "Blender, Mesh, Texturing", rate: "R$ 60/hr" },
  { name: "GameArchitect", skills: "Full game design, monetization", rate: "R$ 80/hr" },
];

export default function DevelopersPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // public: no login required
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
      <h1 className="mb-2 text-3xl font-bold text-white">Find Developers</h1>
      <p className="mb-8 text-brand-gray">
        Connect with scripters, designers and modelers. (Demo list — real profiles coming soon.)
      </p>

      <div className="space-y-4">
        {DEVS.map((d) => (
          <div
            key={d.name}
            className="flex items-center justify-between rounded-2xl border border-white/10 bg-brand-black-soft p-5"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-red/15 text-brand-red">
                <User className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-white">{d.name}</h3>
                <p className="text-sm text-brand-gray">{d.skills}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-brand-red">{d.rate}</span>
              <button className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-sm text-white hover:border-brand-red/40">
                <MessageSquare className="h-3.5 w-3.5" /> Contact
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
