"use client";

import { useState } from "react";

type Mode = "thumbnail" | "logo";
type Chat = { role: "you" | "assistant"; text: string };

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function ThumbnailsPage() {
  const [mode, setMode] = useState<Mode>("thumbnail");
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState("");
  const [busy, setBusy] = useState(false);
  const [chat, setChat] = useState<Chat[]>([
    {
      role: "assistant",
      text: "Describe the picture. Thumbnail is 1280×720. Front logo is 1024×1024. I generate a new image, then you can download it.",
    },
  ]);

  async function ask() {
    const text = prompt.trim();
    if (!text || busy) return;
    const width = mode === "logo" ? 1024 : 1280;
    const height = mode === "logo" ? 1024 : 720;
    const style =
      mode === "logo"
        ? "square game front logo, bold centered icon, high contrast, no watermark"
        : "16:9 Roblox-style game thumbnail concept art, dramatic lighting, blocky stylized characters, high contrast, no watermark, no other game logos";
    setBusy(true);
    setPrompt("");
    setChat((c) => [...c, { role: "you", text }, { role: "assistant", text: `Generating ${width}×${height}...` }]);

    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(`${text}. ${style}`)}?width=${width}&height=${height}&nologo=true&seed=${Date.now()}`;
    try {
      let blob: Blob | null = null;
      for (let attempt = 0; attempt < 3; attempt++) {
        const res = await fetch(url);
        const type = res.headers.get("content-type") || "";
        if (type.includes("image")) {
          blob = await res.blob();
          break;
        }
        const data = await res.json().catch(() => null);
        const wait = Number(String(data?.error?.message || "").match(/(\d+)s/)?.[1] || 20);
        setChat((c) => [...c, { role: "assistant", text: `The image service is busy. Trying again in ${wait} seconds.` }]);
        await sleep(Math.min(wait, 45) * 1000);
      }
      if (!blob) throw new Error("No image came back. Try again in a minute.");
      setImage(URL.createObjectURL(blob));
      setChat((c) => [...c, { role: "assistant", text: "Done. Download it or describe another one." }]);
    } catch (error) {
      setChat((c) => [...c, { role: "assistant", text: error instanceof Error ? error.message : "Could not generate that image." }]);
    } finally {
      setBusy(false);
    }
  }

  function download() {
    if (!image) return;
    const link = document.createElement("a");
    link.href = image;
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
          placeholder="Snowy before-and-after thumbnail with a big red arrow"
          className="h-24 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none"
        />
        <button onClick={ask} disabled={busy} className="mt-3 w-full rounded-xl bg-brand-red py-2.5 font-semibold text-white disabled:opacity-50">
          {busy ? "Generating..." : "Generate"}
        </button>
      </section>
      <section>
        <div className="flex min-h-[320px] items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-black">
          {image ? (
            <img src={image} alt="Generated thumbnail" className="max-h-[70vh] w-full object-contain" />
          ) : (
            <p className="px-6 text-center text-sm text-zinc-500">Your generated image shows up here. The first try can take about a minute.</p>
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
