export type Role = "member" | "mod" | "admin" | "owner" | "founder";

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  image?: string;
  role: Role;
  credits: number;
  lastCreditReset: string; // ISO date
  createdAt: string;
}

export const FOUNDER_EMAILS = [
  "shadyeliteyt@gmail.com",
  "devnofame@gmail.com",
  "adamjcocolin@gmail.com",
  "bixmail.es@gmail.com",
].map((e) => e.toLowerCase());

export const ROLE_HIERARCHY: Record<Role, number> = {
  member: 1,
  mod: 2,
  admin: 3,
  owner: 4,
  founder: 5,
};

export function isFounderEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return FOUNDER_EMAILS.includes(email.toLowerCase());
}

export function canManageRole(actor: Role, target: Role): boolean {
  return ROLE_HIERARCHY[actor] > ROLE_HIERARCHY[target];
}
