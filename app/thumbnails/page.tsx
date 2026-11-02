"use client";

import { useRef, useState } from "react";
import { pair, savedCode } from "@/lib/studio";

export default function ThumbnailsPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [title, setTitle] = useState("RO CREATE");
  const [subtitle, setSubtitle] = useState("NEW UPDATE");
  const [note, setNote] = useState("");

  function draw() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#e11d48";
    ctx.fillRect(0, 0, 1280, 720);
    ctx.fillStyle = "#0a0a0a";
    ctx.beginPath();
    ctx.moveTo(0, 520);
    ctx.lineTo(1280, 420);
    ctx.lineTo(1280, 720);
    ctx.lineTo(0, 720);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 120px Arial";
    ctx.textAlign = "center";
    ctx.fillText(title.slice(0, 18).toUpperCase(), 640, 320);
    ctx.fillStyle = "#e11d48";
    ctx.font = "700 48px Arial";
    ctx.fillText(subtitle.slice(0, 28).toUpperCase(), 640, 400);
  }

  function download() {
    draw();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "ro-create-thumbnail.png";
    link.click();
  }

  async function sendBoard() {
    const code = savedCode();
    if (!code) {
      setNote("Connect Studio first, then send this title board into the place.");
      return;
    }
    const source = JSON.stringify({
      parts: [
        { name: "Board", size: [18, 10, 1], position: [0, 8, 0], color: [225, 29, 72] },
        { name: "Base", size: [20, 1, 3], position: [0, 2.5, 0], color: [10, 10, 10] },
      ],
    });
    try {
      await pair("push", { code, job: { kind: "model", name: "ThumbnailBoard", source } });
      setNote("Sent a thumbnail board into the connected place.");
    } catch (error) {
      setNote(error instanceof Error ? error.message : "Could not reach Studio.");
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-2 text-4xl font-black text-white">Thumbnail generator</h1>
      <p className="mb-6 text-brand-gray">Make a 1280x720 game thumbnail, download it, or drop a matching board into Studio.</p>
      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="rounded-xl border border-white/10 bg-brand-black-soft px-4 py-3 text-white" />
        <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className="rounded-xl border border-white/10 bg-brand-black-soft px-4 py-3 text-white" />
      </div>
      <canvas ref={canvasRef} width={1280} height={720} className="mb-4 w-full rounded-2xl border border-white/10" />
      <div className="flex flex-wrap gap-3">
        <button onClick={draw} className="rounded-xl border border-white/20 px-5 py-3 text-white">Preview</button>
        <button onClick={download} className="rounded-xl bg-brand-red px-5 py-3 font-semibold text-white">Download PNG</button>
        <button onClick={sendBoard} className="rounded-xl border border-brand-red px-5 py-3 text-white">Send board to Studio</button>
      </div>
      {note && <p className="mt-4 text-sm text-brand-gray">{note}</p>}
    </div>
  );
}
