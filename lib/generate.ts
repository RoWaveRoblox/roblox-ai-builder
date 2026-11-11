import { planBuild, type Build } from "@/lib/make";

const SYSTEM = `Return only JSON. No markdown.
If the request is a menu, HUD, shop, inventory, button, popup, logo, or any interface, use kind gui and elements. Do not include code for a gui.
Each element uses scale numbers from 0 to 1: {"type":"frame"|"label"|"button"|"logo","name":"Panel","text":"PLAY","x":0.3,"y":0.2,"w":0.4,"h":0.5,"color":[225,29,72]}
A gui must include one dark frame, a logo mark, a title label, and the buttons the user asked for. Give frames and buttons different colors.
If the request is gameplay, use kind script and put working code in source.
Also set className to Script, LocalScript, or ModuleScript, and location to ServerScriptService, StarterPlayerScripts, StarterCharacterScripts, Workspace, or ReplicatedStorage.
Player input and cameras are LocalScript in StarterPlayerScripts. Shared data is ModuleScript in ReplicatedStorage. Server gameplay is Script in ServerScriptService.
If they need both a screen and gameplay, return a JSON array of two objects.
Shape: {"kind":"gui","title":"Menu","summary":"short sentence","elements":[]}
or {"kind":"script","title":"System","summary":"short sentence","className":"Script","location":"ServerScriptService","source":"code"}`;

function guiFallback(prompt: string): Build {
  const words = prompt
    .replace(/make|create|build|a|an|the|simple|gui|ui|menu|with|button|buttons|for|my|game|please/gi, " ")
    .split(/,| and /i)
    .map((part) => part.trim())
    .filter((part) => part.length > 1 && part.length < 18);
  const labels = (words.length ? words : ["Play", "Shop", "Settings"]).slice(0, 5);
  const elements = [
    { type: "frame", name: "Panel", text: "", x: 0.3, y: 0.16, w: 0.4, h: 0.22 + labels.length * 0.1, color: [14, 14, 14] },
    { type: "logo", name: "Logo", text: "RO", x: 0.46, y: 0.19, w: 0.08, h: 0.08, color: [225, 29, 72] },
    { type: "label", name: "Title", text: labels[0].toUpperCase(), x: 0.33, y: 0.28, w: 0.34, h: 0.06, color: [14, 14, 14] },
    ...labels.map((label, index) => ({
      type: "button",
      name: label,
      text: label.toUpperCase(),
      x: 0.34,
      y: 0.36 + index * 0.1,
      w: 0.32,
      h: 0.08,
      color: index % 2 === 0 ? [225, 29, 72] : [32, 32, 32],
    })),
  ];
  return {
    kind: "gui",
    name: "RoCreateGui",
    title: "GUI",
    summary: `A panel with ${labels.join(", ")}.`,
    source: JSON.stringify({ elements }),
  };
}

function fromJson(value: unknown): Build[] {
  const items = Array.isArray(value) ? value : [value];
  const builds: Build[] = [];
  for (const item of items) {
    if (!item || typeof item !== "object") continue;
    const row = item as {
      kind?: string;
      title?: string;
      summary?: string;
      source?: string;
      elements?: unknown[];
      className?: string;
      location?: string;
    };
    const title = String(row.title || "Build");
    const summary = String(row.summary || "Added to your place.").replace(/\blua\b/gi, "").trim();
    const className = row.className === "LocalScript" || row.className === "ModuleScript" ? row.className : "Script";
    const allowed = ["ServerScriptService", "StarterPlayerScripts", "StarterCharacterScripts", "Workspace", "ReplicatedStorage"];
    const location = allowed.includes(String(row.location)) ? (row.location as Build["location"]) : "ServerScriptService";
    if (row.kind === "gui" && Array.isArray(row.elements) && row.elements.length > 0) {
      builds.push({ kind: "gui", name: "RoCreateGui", title, summary, source: JSON.stringify({ elements: row.elements }) });
    } else if (typeof row.source === "string" && row.source.length > 20) {
      builds.push({ kind: "script", name: "RoCreateScript", title, summary, source: row.source, className, location });
    }
  }
  return builds.slice(0, 2);
}

export async function generateBuilds(prompt: string): Promise<Build[]> {
  const wantsGui = /gui|ui|menu|button|frame|hud|shop|inventory|settings|panel|screen|display|interface|popup|hotbar/i.test(prompt);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 25000);
  try {
    const res = await fetch("https://text.pollinations.ai/openai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        model: "openai",
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: prompt },
        ],
      }),
    });
    if (!res.ok) throw new Error("busy");
    const data = await res.json();
    const text = String(data?.choices?.[0]?.message?.content || "");
    const jsonStart = text.indexOf("{") >= 0 && (text.indexOf("[") < 0 || text.indexOf("{") < text.indexOf("[")) ? text.indexOf("{") : text.indexOf("[");
    const jsonEnd = Math.max(text.lastIndexOf("}"), text.lastIndexOf("]"));
    if (jsonStart >= 0 && jsonEnd > jsonStart) {
      const builds = fromJson(JSON.parse(text.slice(jsonStart, jsonEnd + 1)));
      if (builds.length) return builds;
    }
  } catch {
    // Fall through to a local build.
  } finally {
    clearTimeout(timer);
  }
  return [wantsGui ? guiFallback(prompt) : planBuild(prompt)];
}
