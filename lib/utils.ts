import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCreditsForRole(role: string): number {
  if (role === "founder" || role === "owner" || role === "admin") return 999999;
  return 100;
}

/** Returns true if credits should be reset (new day in America/New_York) */
export function shouldResetCredits(lastResetIso: string): boolean {
  const last = new Date(lastResetIso);
  const now = new Date();
  // Convert both to EST/EDT date string YYYY-MM-DD
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return fmt.format(last) !== fmt.format(now);
}
