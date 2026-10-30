"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { Menu, X, Coins, LogOut } from "lucide-react";
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
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const user = session?.user as any;
  const role = user?.role || "member";
  const credits = user?.credits ?? 0;

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
          {(role === "founder" || role === "owner" || role === "admin") && (
            <Link
              href="/admin"
              className="rounded-md px-3 py-2 text-sm text-brand-red transition hover:bg-brand-red/10"
            >
              Admin
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3">
          {status === "authenticated" ? (
            <>
              <div className="hidden items-center gap-1.5 rounded-full border border-brand-red/30 bg-brand-black-soft px-3 py-1.5 text-sm sm:flex">
                <Coins className="h-4 w-4 text-brand-red" />
                <span className="font-medium text-white">
                  {credits >= 999999 ? "\u221e" : credits}
                </span>
              </div>
              <div className="hidden items-center gap-2 sm:flex">
                {user?.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.image}
                    alt=""
                    className="h-8 w-8 rounded-full border border-brand-red/40"
                  />
                )}
                <div className="text-right">
                  <p className="text-xs font-medium text-white">{user?.name}</p>
                  <p className="text-[10px] uppercase tracking-wider text-brand-red">
                    {role}
                  </p>
                </div>
              </div>
              <button
                onClick={() => signOut()}
                className="rounded-md p-2 text-brand-gray hover:bg-brand-red/10 hover:text-white"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <a
              href="/chat"
              className="rounded-lg bg-brand-red px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-red-dark glow-red-sm"
            >
              Open builder
            </a>
          )}

          <button
            className="rounded-md p-2 text-white md:hidden"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
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
          {(role === "founder" || role === "owner" || role === "admin") && (
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="block rounded-md px-3 py-2.5 text-sm text-brand-red"
            >
              Admin Panel
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
