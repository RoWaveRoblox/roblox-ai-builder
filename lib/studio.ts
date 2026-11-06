export const PAIR_URL = "/.netlify/functions/pair";

export function savedCode() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("rocreate_code") || "";
}

export function saveCode(code: string) {
  localStorage.setItem("rocreate_code", code.toLowerCase());
}

export async function pair(action: string, extra: Record<string, unknown> = {}) {
  const res = await fetch(PAIR_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, ...extra }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Pair request failed");
  return data as { ok?: boolean; code?: string; error?: string; items?: { id: string; title: string; model: string; source: string }[] };
}
