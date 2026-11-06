export type Job = { cost: number; kind: "script" | "gui" | "model"; label: string };

export function jobFor(prompt: string): Job {
  const text = prompt.toLowerCase();
  if (text.includes("full game") || text.includes("entire game")) return { cost: 40, kind: "script", label: "full game" };
  if (text.includes("blender") || text.includes("model")) return { cost: 25, kind: "model", label: "Blender model" };
  if (text.includes("anim")) return { cost: 20, kind: "script", label: "animation" };
  if (text.includes("build") || text.includes("obby") || text.includes("map")) return { cost: 15, kind: "model", label: "build" };
  if (text.includes("sprint") || text.includes("shift") || text.includes("walkspeed")) return { cost: 8, kind: "gui", label: "sprint" };
  if (text.includes("shop")) return { cost: 10, kind: "gui", label: "shop GUI" };
  if (text.includes("gui") || text.includes("ui")) return { cost: 10, kind: "gui", label: "GUI" };
  return { cost: 5, kind: "script", label: "script" };
}

export function infiniteCredits() {
  return typeof window !== "undefined" && localStorage.getItem("rocreate_infinite") === "1";
}

export function creditsLeft() {
  if (typeof window === "undefined") return 100;
  const raw = localStorage.getItem("rocreate_credits");
  if (raw === null) {
    localStorage.setItem("rocreate_credits", "100");
    return 100;
  }
  return Number(raw) || 0;
}

export function spend(cost: number) {
  if (infiniteCredits()) return true;
  const left = creditsLeft();
  if (left < cost) return false;
  localStorage.setItem("rocreate_credits", String(left - cost));
  return true;
}

export function addCredits(amount: number) {
  if (infiniteCredits()) return;
  localStorage.setItem("rocreate_credits", String(creditsLeft() + amount));
}

export function grantInfinite() {
  localStorage.setItem("rocreate_infinite", "1");
}
