"use client";

import { useEffect, useRef, useState } from "react";

const templates = [
  { id: "before", name: "Before / After", src: "/gfx/before-after.jpg" },
  { id: "cine", name: "Cinematic GFX", src: "/gfx/cinematic.jpg" },
];

export default function ThumbnailsPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [template, setTemplate] = useState(templates[0]);
  const [title, setTitle] = useState("NEW UPDATE");
  const [subtitle, setSubtitle] = useState("WITH RO_CREATE");
  const [ready, setReady] = useState(false);

  function draw() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, 1280, 720);
      ctx.fillStyle = "rgba(0,0,0,0.45)";
      ctx.fillRect(0, 560, 1280, 160);
      ctx.fillStyle = "#ffffff";
      ctx.font = "900 84px Arial";
      ctx.textAlign = "center";
      ctx.fillText(title.slice(0, 22).toUpperCase(), 640, 640);
      ctx.fillStyle = "#ff2a4a";
      ctx.font = "700 36px Arial";
      ctx.fillText(subtitle.slice(0, 32).toUpperCase(), 640, 690);
      setReady(true);
    };
    img.src = template.src;
  }

  useEffect(() => {
    draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [template, title, subtitle]);

  function download() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `ro-create-${template.id}.png`;
    link.click();
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <p className="text-sm uppercase tracking-widest text-brand-red">GFX studio</p>
      <h1 className="mb-2 text-4xl font-black text-white">Thumbnail generator</h1>
      <p className="mb-6 text-brand-gray">Pick a custom GFX layout, add your own text, then download a 1280×720 thumbnail.</p>
      <div className="mb-4 flex flex-wrap gap-2">
        {templates.map((item) => (
          <button
            key={item.id}
            onClick={() => setTemplate(item)}
            className={`rounded-full px-4 py-2 text-sm ${template.id === item.id ? "bg-brand-red text-white" : "border border-white/15 text-zinc-300"}`}
          >
            {item.name}
          </button>
        ))}
      </div>
      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="rounded-xl border border-white/10 bg-brand-black-soft px-4 py-3 text-white" placeholder="Main text" />
        <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className="rounded-xl border border-white/10 bg-brand-black-soft px-4 py-3 text-white" placeholder="Small text" />
      </div>
      <canvas ref={canvasRef} width={1280} height={720} className="w-full rounded-2xl border border-white/10" />
      <button onClick={download} disabled={!ready} className="mt-4 rounded-xl bg-brand-red px-5 py-3 font-semibold text-white disabled:opacity-40">
        Download PNG
      </button>
    </div>
  );
}
