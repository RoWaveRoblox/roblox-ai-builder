"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import {
  Coins,
  MessageSquare,
  BarChart3,
  Users,
  ShoppingBag,
  Code2,
  Shield,
} from "lucide-react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

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

  const user = session?.user as any;
  const role = user?.role || "member";
  const credits = user?.credits ?? 0;

  const cards = [
    {
      href: "/chat",
      icon: Code2,
      title: "AI Builder",
      desc: "Generate code, GUIs & models",
      color: "bg-brand-red",
    },
    {
      href: "/support",
      icon: MessageSquare,
      title: "Support AI",
      desc: "Get help anytime",
      color: "bg-rose-600",
    },
    {
      href: "/analyzer",
      icon: BarChart3,
      title: "Analyzer",
      desc: "Group / game insights",
      color: "bg-red-700",
    },
    {
      href: "/servers",
      icon: Users,
      title: "Servers",
      desc: "Community spaces",
      color: "bg-red-800",
    },
    {
      href: "/marketplace",
      icon: ShoppingBag,
      title: "Marketplace",
      desc: "Sell your games",
      color: "bg-rose-800",
    },
    {
      href: "/developers",
      icon: Shield,
      title: "Find Devs",
      desc: "Hire talent",
      color: "bg-red-900",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Welcome back, {user?.name?.split(" ")[0] || "Creator"}
          </h1>
          <p className="mt-1 text-brand-gray">
            Role:{" "}
            <span className="font-medium uppercase text-brand-red">{role}</span>
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-brand-red/30 bg-brand-black-soft px-5 py-3">
          <Coins className="h-6 w-6 text-brand-red" />
          <div>
            <p className="text-xs text-brand-gray">Daily Credits</p>
            <p className="text-xl font-bold text-white">
              {credits >= 999999 ? "Unlimited" : credits}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="group flex items-start gap-4 rounded-2xl border border-white/10 bg-brand-black-soft p-5 transition hover:border-brand-red/40 hover:bg-brand-red/5"
          >
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${c.color} text-white`}
            >
              <c.icon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-white group-hover:text-brand-red">
                {c.title}
              </h3>
              <p className="mt-1 text-sm text-brand-gray">{c.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
