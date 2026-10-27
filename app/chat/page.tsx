"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Send, Sparkles, Code2, Box, Layout, Copy, Check } from "lucide-react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  type?: "code" | "text" | "model";
};

const QUICK = [
  { label: "Make a GUI", prompt: "Create a modern shop GUI for my Roblox game with currency display and buy buttons." },
  { label: "Obby system", prompt: "Write a complete stage system for an obby with checkpoints and a finish leaderboard." },
  { label: "Blender model", prompt: "Describe how to model a futuristic sword in Blender that I can export to Roblox." },
  { label: "Datastore", prompt: "Give me a secure DataStore script that saves player coins and inventory." },
];

export default function ChatPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hey! I'm your RoWave AI Builder.\n\nI can generate full Roblox Lua code, design GUIs, help with Blender models, and walk you through building an entire game.\n\nWhat do you want to create today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/");
  }, [status, router]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(text?: string) {
    const content = (text || input).trim();
    if (!content || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800));

    const reply = generateDemoReply(content);
    setMessages((m) => [
      ...m,
      {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: reply,
        type: content.toLowerCase().includes("code") || content.toLowerCase().includes("script") || content.toLowerCase().includes("gui") ? "code" : "text",
      },
    ]);
    setLoading(false);
  }

  function copy(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  if (status === "loading") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-red border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-64px)] max-w-5xl flex-col">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-brand-red" />
          <h1 className="font-semibold text-white">AI Builder</h1>
        </div>
        <div className="flex gap-2 text-xs text-brand-gray">
          <span className="flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-1">
            <Code2 className="h-3 w-3" /> Code
          </span>
          <span className="flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-1">
            <Layout className="h-3 w-3" /> GUI
          </span>
          <span className="flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-1">
            <Box className="h-3 w-3" /> Models
          </span>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-6">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-brand-red text-white"
                  : "border border-white/10 bg-brand-black-soft text-brand-white"
              }`}
            >
              <pre className="whitespace-pre-wrap font-sans">{m.content}</pre>
              {m.role === "assistant" && m.content.includes("```") && (
                <button
                  onClick={() => copy(m.content, m.id)}
                  className="mt-2 flex items-center gap-1 text-xs text-brand-gray hover:text-brand-red"
                >
                  {copied === m.id ? (
                    <>
                      <Check className="h-3 w-3" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" /> Copy
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="rounded-2xl border border-white/10 bg-brand-black-soft px-4 py-3">
              <div className="flex gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-brand-red [animation-delay:-0.3s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-brand-red [animation-delay:-0.15s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-brand-red" />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2 overflow-x-auto px-4 pb-2">
        {QUICK.map((q) => (
          <button
            key={q.label}
            onClick={() => send(q.prompt)}
            className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-brand-gray transition hover:border-brand-red/40 hover:text-white"
          >
            {q.label}
          </button>
        ))}
      </div>

      <div className="border-t border-white/10 p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="flex gap-3"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe the system, GUI, or model you need..."
            className="flex-1 rounded-xl border border-white/10 bg-brand-black-soft px-4 py-3 text-sm text-white placeholder:text-brand-gray focus:border-brand-red/50 focus:outline-none"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-red text-white transition hover:bg-brand-red-dark disabled:opacity-40"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
        <p className="mt-2 text-center text-[11px] text-brand-gray">
          Demo mode — responses are simulated. Connect a real AI backend later.
        </p>
      </div>
    </div>
  );
}

function generateDemoReply(prompt: string): string {
  const lower = prompt.toLowerCase();
  if (lower.includes("gui") || lower.includes("shop")) {
    return `Here's a clean shop GUI starter script:\n\n\\`\\`\\`lua\n-- ShopGUI.lua (LocalScript inside ScreenGui)\nlocal Players = game:GetService(\"Players\")\nlocal player = Players.LocalPlayer\nlocal gui = script.Parent\n\nlocal frame = Instance.new(\"Frame\")\nframe.Size = UDim2.new(0, 420, 0, 320)\nframe.Position = UDim2.new(0.5, -210, 0.5, -160)\nframe.BackgroundColor3 = Color3.fromRGB(20, 20, 20)\nframe.BorderSizePixel = 0\nframe.Parent = gui\n\nlocal corner = Instance.new(\"UICorner\")\ncorner.CornerRadius = UDim.new(0, 12)\ncorner.Parent = frame\n\nlocal title = Instance.new(\"TextLabel\")\ntitle.Size = UDim2.new(1, 0, 0, 40)\ntitle.BackgroundTransparency = 1\ntitle.Text = \"SHOP\"\ntitle.TextColor3 = Color3.fromRGB(225, 29, 72)\ntitle.Font = Enum.Font.GothamBold\ntitle.TextSize = 22\ntitle.Parent = frame\n\nprint(\"Shop GUI ready!\")\n\\`\\`\\`\n\nWant me to expand this with real items and a DataStore backend?`;
  }
  if (lower.includes("obby") || lower.includes("stage")) {
    return `Here's a solid stage + checkpoint system:\n\n\\`\\`\\`lua\n-- StageSystem (ServerScript)\nlocal Players = game:GetService(\"Players\")\n\nPlayers.PlayerAdded:Connect(function(player)\n  player:SetAttribute(\"Stage\", 1)\nend)\n\\`\\`\\`\n\nI can also add a finish leaderboard and save progress. Just say the word.`;
  }
  if (lower.includes("blender") || lower.includes("model") || lower.includes("sword")) {
    return `Blender workflow for a Roblox-ready futuristic sword:\n\n1. Start with a cube → scale into blade shape\n2. Use Mirror modifier for symmetry\n3. Add bevels + subdivision surface\n4. Create emissive material for the energy edge\n5. UV unwrap → Export as .fbx\n6. Import into Roblox Studio → MeshPart\n\nKeep poly count reasonable (< 5k for mobile). Want a more detailed step-by-step?`;
  }
  if (lower.includes("datastore") || lower.includes("save")) {
    return `Secure DataStore example:\n\n\\`\\`\\`lua\nlocal DataStoreService = game:GetService(\"DataStoreService\")\nlocal store = DataStoreService:GetDataStore(\"PlayerData_v1\")\n\nlocal function load(player)\n  local key = \"p_\" .. player.UserId\n  local success, data = pcall(function()\n    return store:GetAsync(key)\n  end)\n  if success and data then return data end\n  return { coins = 0, inventory = {} }\nend\n\\`\\`\\`\n\nAlways wrap in pcall. Need the full player-added version?`;
  }
  return `Got it! Here's how I'd approach that:\n\n1. Break the feature into clear systems\n2. Write clean, commented Lua\n3. Add client-server separation\n4. Suggest UI and monetization hooks\n\nTell me more details and I'll generate the full scripts next.`;
}
