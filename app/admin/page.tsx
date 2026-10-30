"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Shield, UserCog } from "lucide-react";
import type { Role } from "@/types";

const ROLES: Role[] = ["member", "mod", "admin", "owner", "founder"];

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const user = session?.user as any;
  const role = user?.role as Role | undefined;

  const [email, setEmail] = useState("");
  const [newRole, setNewRole] = useState<Role>("member");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    // public: no login required
    if (status === "authenticated" && role !== "founder" && role !== "owner" && role !== "admin") {
      router.push("/dashboard");
    }
  }, [status, role, router]);

  function rank() {
    if (!email.trim()) return;
    setMsg(`Demo: would set ${email} → ${newRole}. Real ranking needs a database.`);
  }

  if (status === "loading" || !role) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-red border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-8 flex items-center gap-3">
        <Shield className="h-8 w-8 text-brand-red" />
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
          <p className="text-brand-gray">Rank users · Founder tools</p>
        </div>
      </div>

      <div className="rounded-2xl border border-brand-red/30 bg-brand-black-soft p-6">
        <div className="mb-4 flex items-center gap-2 text-brand-red">
          <UserCog className="h-5 w-5" />
          <h2 className="font-semibold">Change User Role</h2>
        </div>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="user@email.com"
          className="mb-3 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white focus:border-brand-red/50 focus:outline-none"
        />
        <select
          value={newRole}
          onChange={(e) => setNewRole(e.target.value as Role)}
          className="mb-4 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white focus:border-brand-red/50 focus:outline-none"
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <button
          onClick={rank}
          className="w-full rounded-xl bg-brand-red py-2.5 font-semibold text-white hover:bg-brand-red-dark"
        >
          Apply Rank
        </button>
        {msg && <p className="mt-3 text-sm text-brand-gray">{msg}</p>}
      </div>

      <p className="mt-6 text-center text-xs text-brand-gray">
        Your role: <span className="text-brand-red uppercase">{role}</span>
      </p>
    </div>
  );
}
