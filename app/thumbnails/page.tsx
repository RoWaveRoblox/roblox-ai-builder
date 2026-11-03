"use client";

import { useEffect, useRef, useState } from "react";

type Mode = "thumbnail" | "logo";
type Chat = { role: "you" | "assistant"; text: string };

const art = {
  before: "/gfx/before-after.jpg",
  cine: "/gfx/cinematic.jpg",
  logo: "/gfx/front-logo.jpg",
};

function plan(prompt: string, mode: Mode) {
  const text = prompt.toLowerCase();
  const title = prompt.replace(/[.!?]/g, "").trim().split(/\s+/).slice(0, 4).join(" ") || (mode === "logo" ? "RO CREATE" : "NEW UPDATE");
  let bg = mode === "logo" ? art.logo : art.cine;
  let look = mode === "logo" ? "square front logo" : "cinematic thumbnail";
  if (text.match(/before|after|sled|update|versus|vs/)) {
    bg = art.before;
    look = "before / after thumbnail";
  } else if (text.match(/fight|prison|cinematic|action/)) {
    bg = art.cine;
    look = "cinematic thumbnail";
  } else if (mode === "logo" || text.match(/logo|icon|front/)) {
    bg = art.logo;
    look = "square front logo";
  }
  const subtitle = mode === "logo" ? "GAME ICON" : "RO_CREATE GFX";
  return { title: title.slice(0, 22).toUpperCase(), subtitle, bg, look };
}

export default function ThumbnailsPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<Mode>("thumbnail");
  const [prompt, setPrompt] = useState("");
  const [title, setTitle] = useState("NEW UPDATE");
  const [subtitle, setSubtitle] = useState("RO_CREATE GFX");
  const [bg, setBg] = useState(art.cine);
  const [chat, setChat] = useState<Chat[]>([
    { role: "assistant", text: "Tell me the thumbnail or front logo you want. Example: a snowy before-and-after update thumbnail that says WINTER DROP." },
  ]);
  const [ready, setReady] = useState(false);

  function paint(nextTitle: string, nextSub: string, src: string, nextMode: Mode) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = nextMode === "logo" ? 1024 : 1280;
    const h = nextMode === "logo" ? 1024 : 720;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, w, h);
      if (nextMode === "logo") {
        ctx.fillStyle = "rgba(0,0,0,0.35)";
        ctx.fillRect(0, h - 180, w, 180);
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.font = "900 72px Arial";
        ctx.fillText(nextTitle, w / 2, h - 90);
        ctx.fillStyle = "#ff2a4a";
        ctx.font = "700 28px Arial";
        ctx.fillText(nextSub, w / 2, h - 46);
      } else {
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillRect(0, 560, 1280, 160);
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.font = "900 78px Arial";
        ctx.fillText(nextTitle, 640, 640);
        ctx.fillStyle = "#ff2a4a";
        ctx.font = "700 32px Arial";
        ctx.fillText(nextSub, 640, 688);
      }
      setReady(true);
    };
    img.src = src;
  }

  useEffect(() => {
    paint(title, subtitle, bg, mode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, subtitle, bg, mode]);

  function ask() {
    const text = prompt.trim();
    if (!text) return;
    const next = plan(text, mode);
    setTitle(next.title);
    setSubtitle(next.subtitle);
    setBg(next.bg);
    setChat((c) => [
      ...c,
      { role: "you", text },
      { role: "assistant", text: `Making a ${next.look} titled "${next.title}". Change the mode if you wanted the other format.` },
    ]);
    setPrompt("");
  }

  function download() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = mode === "logo" ? "ro-create-logo.png" : "ro-create-thumbnail.png";
    link.click();
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 lg:grid-cols-[340px_1fr]">
      <section className="rounded-2xl border border-white/10 bg-[#141414] p-4">
        <p className="text-xs uppercase tracking-widest text-brand-red">GFX assistant</p>
        <h1 className="mb-3 text-2xl font-black text-white">What should I make?</h1>
        <div className="mb-3 flex gap-2">
          {(["thumbnail", "logo"] as Mode[]).map((item) => (
            <button
              key={item}
              onClick={() => setMode(item)}
              className={`rounded-full px-3 py-1.5 text-sm ${mode === item ? "bg-brand-red text-white" : "border border-white/15 text-zinc-300"}`}
            >
              {item === "logo" ? "Front logo" : "Thumbnail"}
            </button>
          ))}
        </div>
        <div className="mb-3 h-72 space-y-2 overflow-y-auto pr-1">
          {chat.map((line, i) => (
            <p key={i} className={`rounded-xl px-3 py-2 text-sm ${line.role === "you" ? "bg-brand-red text-white" : "bg-white/5 text-zinc-200"}`}>
              {line.text}
            </p>
          ))}
        </div>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="A cinematic prison fight thumbnail that says JAILBREAK"
          className="h-24 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none"
        />
        <button onClick={ask} className="mt-3 w-full rounded-xl bg-brand-red py-2.5 font-semibold text-white">Make it</button>
      </section>
      <section>
        <canvas ref={canvasRef} width={1280} height={720} className="w-full rounded-2xl border border-white/10 bg-black" />
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <input value={title} onChange={(e) => setTitle(e.target.value.toUpperCase())} className="rounded-xl border border-white/10 bg-brand-black-soft px-4 py-3 text-white" />
          <input value={subtitle} onChange={(e) => setSubtitle(e.target.value.toUpperCase())} className="rounded-xl border border-white/10 bg-brand-black-soft px-4 py-3 text-white" />
        </div>
        <button onClick={download} disabled={!ready} className="mt-3 rounded-xl bg-white px-5 py-3 font-semibold text-black disabled:opacity-40">
          Download {mode === "logo" ? "logo" : "thumbnail"}
        </button>
      </section>
    </div>
  );
}
