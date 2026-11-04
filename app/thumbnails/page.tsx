"use client";

import { useState } from "react";

type Mode = "thumbnail" | "logo";
type Chat = { role: "you" | "assistant"; text: string };

export default function ThumbnailsPage() {
  const [mode, setMode] = useState<Mode>("thumbnail");
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState("");
  const [busy, setBusy] = useState(false);
  const [chat, setChat] = useState<Chat[]>([
    {
      role: "assistant",
      text: "Describe the image. I will generate a new picture, not a template. Pick Thumbnail for 1280×720 or Front logo for a square icon.",
    },
  ]);

  function ask() {
    const text = prompt.trim();
    if (!text || busy) return;
    const width = mode === "logo" ? 1024 : 1280;
    const height = mode === "logo" ? 1024 : 720;
    const style =
      mode === "logo"
        ? "square game front logo, bold icon, centered symbol, high contrast, no watermark, no tiny unreadable text"
        : "16:9 game thumbnail concept art, dramatic lighting, blocky stylized characters, high contrast, polished like a real Roblox experience thumbnail, no watermark, no logos of other games";
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(`${text}. ${style}`)}?width=${width}&height=${height}&nologo=true&model=flux&seed=${Date.now()}`;
    setBusy(true);
    setImage(url);
    setChat((c) => [
      ...c,
      { role: "you", text },
      { role: "assistant", text: `Generating a new ${width}×${height} ${mode === "logo" ? "front logo" : "thumbnail"}.` },
    ]);
    setPrompt("");
  }

  async function download() {
    if (!image) return;
    const res = await fetch(image);
    const blob = await res.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = mode === "logo" ? "ro-create-logo.png" : "ro-create-thumbnail.png";
    link.click();
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 lg:grid-cols-[340px_1fr]">
      <section className="rounded-2xl border border-white/10 bg-[#141414] p-4">
        <p className="text-xs uppercase tracking-widest text-brand-red">GFX assistant</p>
        <h1 className="mb-3 text-2xl font-black text-white">Describe the image</h1>
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
        <div className="mb-3 h-64 space-y-2 overflow-y-auto">
          {chat.map((line, i) => (
            <p key={i} className={`rounded-xl px-3 py-2 text-sm ${line.role === "you" ? "bg-brand-red text-white" : "bg-white/5 text-zinc-200"}`}>
              {line.text}
            </p>
          ))}
        </div>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Snowy before-and-after thumbnail, shocked character, big red arrow"
          className="h-24 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none"
        />
        <button onClick={ask} disabled={busy} className="mt-3 w-full rounded-xl bg-brand-red py-2.5 font-semibold text-white disabled:opacity-50">
          {busy ? "Generating..." : "Generate"}
        </button>
      </section>
      <section>
        <div className="flex min-h-[320px] items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-black">
          {image ? (
            <img
              src={image}
              alt="Generated thumbnail"
              onLoad={() => setBusy(false)}
              onError={() => setBusy(false)}
              className="max-h-[70vh] w-full object-contain"
            />
          ) : (
            <p className="text-sm text-zinc-500">Your generated image shows up here.</p>
          )}
        </div>
        <p className="mt-2 text-xs text-zinc-500">{mode === "logo" ? "1024×1024 front logo" : "1280×720 thumbnail"}</p>
        <button onClick={download} disabled={!image || busy} className="mt-3 rounded-xl bg-white px-5 py-3 font-semibold text-black disabled:opacity-40">
          Download
        </button>
      </section>
    </div>
  );
}
