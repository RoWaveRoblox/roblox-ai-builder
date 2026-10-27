"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { Menu, X, Coins, User, LogOut, Shield } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

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
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-red font-bold text-white glow-red-sm">
            R
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            RoWave <span className="text-brand-red">AI</span>
          </span>
        </Link>

        {/* Desktop links */}
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
                  {credits >= 999999 ? "∞" : credits}
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
            <button
              onClick={() => signIn("google")}
              className="rounded-lg bg-brand-red px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-red-dark glow-red-sm"
            >
              Sign in with Google
            </button>
          )}

          <button
            className="rounded-md p-2 text-white md:hidden"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
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
