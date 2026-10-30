"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/chat", label: "AI Builder" },
  { href: "/support", label: "Support AI" },
  { href: "/analyzer", label: "Analyzer" },
  { href: "/servers", label: "Servers" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/developers", label: "Find Devs" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-brand-red/20 bg-brand-black/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-red font-black text-white glow-red-sm tracking-tighter">
            <span className="text-lg leading-none">RO</span>
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-lg font-black tracking-tight text-white">
              RO<span className="text-brand-red">_</span>CREATE
            </span>
            <span className="text-[10px] font-medium uppercase tracking-widest text-brand-gray">
              AI Game Builder
            </span>
          </div>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-md px-3 py-2 text-sm text-brand-gray transition hover:bg-brand-red/10 hover:text-white"
            >
              {l.label}
            </Link>
          ))}
          <Link href="/chat" className="rounded-lg bg-brand-red px-3 py-2 text-sm font-semibold text-white">
            Open builder
          </Link>
        </div>

        <button className="rounded-md p-2 text-white md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-brand-red/20 bg-brand-black px-4 py-3 md:hidden">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block rounded-md px-3 py-2.5 text-sm text-brand-gray hover:bg-brand-red/10 hover:text-white"
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
