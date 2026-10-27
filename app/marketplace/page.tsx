"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ShoppingBag, Tag } from "lucide-react";

const ITEMS = [
  { title: "Complete Obby Kit", price: "R$ 250", tag: "Systems" },
  { title: "Modern Shop GUI Pack", price: "R$ 150", tag: "UI" },
  { title: "Pet Simulator Framework", price: "R$ 800", tag: "Full Game" },
  { title: "Sword Combat System", price: "R$ 300", tag: "Combat" },
];

export default function MarketplacePage() {
  const { status } = useSession();
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

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Marketplace</h1>
          <p className="mt-1 text-brand-gray">Buy and sell games, systems and assets.</p>
        </div>
        <button className="rounded-xl bg-brand-red px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-red-dark">
          List an Item
        </button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {ITEMS.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-white/10 bg-brand-black-soft p-5 transition hover:border-brand-red/40"
          >
            <div className="mb-4 flex h-32 items-center justify-center rounded-xl bg-gradient-to-br from-brand-red/20 to-black">
              <ShoppingBag className="h-10 w-10 text-brand-red/60" />
            </div>
            <div className="mb-1 flex items-center gap-2">
              <Tag className="h-3.5 w-3.5 text-brand-red" />
              <span className="text-xs text-brand-red">{item.tag}</span>
            </div>
            <h3 className="font-semibold text-white">{item.title}</h3>
            <p className="mt-2 text-lg font-bold text-brand-red">{item.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
