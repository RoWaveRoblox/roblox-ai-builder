"use client";

import { useEffect, useState, useRef } from "react";
import { Send, Sparkles, Code2, Box, Layout } from "lucide-react";
import { pair, saveCode, savedCode } from "@/lib/studio";
import { creditsLeft, infiniteCredits, jobFor, spend, addCredits } from "@/lib/credits";
import { planBuild } from "@/lib/make";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  source?: string;
  title?: string;
};

const MODELS = ["Gemini", "ChatGPT", "Grok", "Claude", "DeepSeek"];

const QUICK = [
  { label: "Make a GUI", prompt: "Create a modern shop GUI for my Roblox game with currency display and buy buttons." },
  { label: "Obby system", prompt: "Write a complete stage system for an obby with checkpoints and a finish leaderboard." },
  { label: "Blender model", prompt: "Describe how to model a futuristic sword in Blender that I can export to Roblox." },
  { label: "Datastore", prompt: "Give me a secure DataStore script that saves player coins and inventory." },
];

const FENCE = "```";

function lua(code: string): string {
  return FENCE + "lua\n" + code + "\n" + FENCE;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Tell me what to build. I drop it into Studio without pasting the code here.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [linked, setLinked] = useState("");
  const [pairCode, setPairCode] = useState("");
  const [credits, setCredits] = useState(100);
  const [infinite, setInfinite] = useState(false);
  const [pairNote, setPairNote] = useState("");
  const [model, setModel] = useState("Grok");
  const [spinText, setSpinText] = useState("");
  const [spinning, setSpinning] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLinked(savedCode());
    setCredits(creditsLeft());
    setInfinite(infiniteCredits());
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(text?: string) {
    const content = (text || input).trim();
    if (!content || loading) return;
    const job = jobFor(content);
    if (!spend(job.cost)) {
      setMessages((m) => [
        ...m,
        { id: Date.now().toString(), role: "assistant", content: `Not enough credits. This ${job.label} costs ${job.cost}. You have ${creditsLeft()}.` },
      ]);
      return;
    }
    setCredits(creditsLeft());
    setInfinite(infiniteCredits());

    setMessages((m) => [
      ...m,
      { id: Date.now().toString(), role: "user", content },
    ]);
    setInput("");
    setLoading(true);

    await new Promise((r) => setTimeout(r, 900));

    const built = planBuild(content);
    let imported = "Connect the plugin and this will be placed in the game.";
    if (savedCode()) {
      try {
        await pushBuild(built);
        imported = "Imported into Studio.";
      } catch {
        imported = "Studio did not accept it. Leave the plugin open and press Connect again.";
      }
    }
    setMessages((m) => [
      ...m,
      {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        title: built.title,
        source: built.source,
        content: `Created ${built.title}. ${built.summary} ${imported}`,
      },
    ]);
    setLoading(false);
  }

  async function pushBuild(built: { kind: "script" | "gui" | "model"; source: string; name: string }) {
    const code = savedCode();
    if (!code) throw new Error("Not connected");
    await pair("push", {
      code,
      job: { kind: built.kind, name: built.name, source: built.source },
    });
  }

  async function connectHere() {
    const next = pairCode.trim().toLowerCase();
    if (next.length < 4) return;
    try {
      await pair("claim", { code: next });
      saveCode(next);
      setLinked(next);
      setPairNote("Connected. Scripts, GUIs, builds, and models can import into Studio.");
    } catch (error) {
      setPairNote(error instanceof Error ? error.message : "Code not found.");
    }
  }

  async function publish(item: Message) {
    if (!item.source) return;
    await pair("publish", { title: item.title || "Script", source: item.source, model });
    setCopied(item.id);
    setTimeout(() => setCopied(null), 2000);
  }

  async function spin() {
    if (infiniteCredits()) {
      setSpinText("Credits are already infinite.");
      return;
    }
    setSpinning(true);
    await new Promise((r) => setTimeout(r, 700));
    const prize = [5, 10, 15, 25, 50, 100][Math.floor(Math.random() * 6)];
    addCredits(prize);
    setCredits(creditsLeft());
    setSpinText(`+${prize}`);
    setSpinning(false);
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-64px)] max-w-5xl flex-col">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-brand-red" />
          <h1 className="font-semibold text-white">AI Builder</h1>
          <span className="rounded-full bg-white/5 px-2 py-1 text-xs text-zinc-300">
            {infinite ? "∞ credits" : `${credits} credits`}
          </span>
          <button onClick={spin} disabled={spinning} className="rounded-full bg-brand-red px-3 py-1 text-xs font-bold text-white">
            {spinning ? "Spinning" : "Spin"}
          </button>
          {spinText && <span className="text-xs text-zinc-400">{spinText}</span>}
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="rounded-lg border border-white/10 bg-black px-2 py-1 text-xs text-white"
          >
            {MODELS.map((name) => (
              <option key={name}>{name}</option>
            ))}
          </select>
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

      {!linked && (
        <div className="border-b border-white/10 bg-black/40 px-4 py-3">
          <p className="mb-2 text-sm text-white">Paste connect code here</p>
          <div className="flex gap-2">
            <input
              value={pairCode}
              onChange={(e) => setPairCode(e.target.value)}
              placeholder="00687jhg"
              className="flex-1 rounded-lg border border-white/10 bg-black px-3 py-2 font-mono text-white outline-none"
            />
            <button onClick={connectHere} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white">
              Connect
            </button>
          </div>
          {pairNote && <p className="mt-2 text-xs text-zinc-400">{pairNote}</p>}
        </div>
      )}
      {linked && (
        <div className="border-b border-emerald-700/40 bg-emerald-950/40 px-4 py-2 text-sm text-emerald-200">
          Connected as {linked}. New scripts, GUIs, and builds import into Studio on their own.
        </div>
      )}

      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-6">
        {messages.map((m) => (
          <div
            key={m.id}
            className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
          >
            <div
              className={
                m.role === "user"
                  ? "max-w-[85%] rounded-2xl bg-brand-red px-4 py-3 text-sm leading-relaxed text-white"
                  : "max-w-[85%] rounded-2xl border border-white/10 bg-brand-black-soft px-4 py-3 text-sm leading-relaxed text-brand-white"
              }
            >
              <p className="whitespace-pre-wrap text-sm">{m.content}</p>
              {m.role === "assistant" && m.source && (
                <button onClick={() => publish(m)} className="mt-2 text-xs text-brand-red">
                  {copied === m.id ? "Published" : "Publish"}
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
      </div>
    </div>
  );
}

function generateDemoReply(prompt: string): string {
  const lower = prompt.toLowerCase();
  if (lower.includes("sprint") || lower.includes("shift") || lower.includes("walkspeed")) {
    const asked = lower.match(/(?:to|speed)\s*(\d{1,3})/);
    const sprintSpeed = asked ? Math.min(200, Math.max(10, Number(asked[1]))) : 28;
    return [
      "Sprint script with Shift on keyboard and a Sprint button for mobile:",
      "",
      lua([
        "-- Sprint.client.lua (LocalScript inside ScreenGui)",
        "local Players = game:GetService(\"Players\")",
        "local UserInputService = game:GetService(\"UserInputService\")",
        "local player = Players.LocalPlayer",
        "local gui = script.Parent",
        "",
        "local NORMAL = 16",
        "local SPRINT = " + sprintSpeed,
        "local sprinting = false",
        "",
        "local function humanoid()",
        "  local character = player.Character",
        "  return character and character:FindFirstChildOfClass(\"Humanoid\")",
        "end",
        "",
        "local function setSprint(on)",
        "  sprinting = on",
        "  local hum = humanoid()",
        "  if hum then",
        "    hum.WalkSpeed = on and SPRINT or NORMAL",
        "  end",
        "end",
        "",
        "UserInputService.InputBegan:Connect(function(input, processed)",
        "  if processed then return end",
        "  if input.KeyCode == Enum.KeyCode.LeftShift or input.KeyCode == Enum.KeyCode.RightShift then",
        "    setSprint(true)",
        "  end",
        "end)",
        "",
        "UserInputService.InputEnded:Connect(function(input)",
        "  if input.KeyCode == Enum.KeyCode.LeftShift or input.KeyCode == Enum.KeyCode.RightShift then",
        "    setSprint(false)",
        "  end",
        "end)",
        "",
        "local button = Instance.new(\"TextButton\")",
        "button.Name = \"SprintButton\"",
        "button.AnchorPoint = Vector2.new(1, 1)",
        "button.Size = UDim2.new(0, 120, 0, 56)",
        "button.Position = UDim2.new(1, -24, 1, -24)",
        "button.BackgroundColor3 = Color3.fromRGB(225, 29, 72)",
        "button.Text = \"SPRINT\"",
        "button.TextColor3 = Color3.new(1, 1, 1)",
        "button.Font = Enum.Font.GothamBold",
        "button.TextSize = 18",
        "button.Visible = UserInputService.TouchEnabled",
        "button.Parent = gui",
        "",
        "local corner = Instance.new(\"UICorner\")",
        "corner.CornerRadius = UDim.new(0, 12)",
        "corner.Parent = button",
        "",
        "button.MouseButton1Down:Connect(function()",
        "  setSprint(true)",
        "end)",
        "button.MouseButton1Up:Connect(function()",
        "  setSprint(false)",
        "end)",
        "",
        "player.CharacterAdded:Connect(function()",
        "  task.wait(0.2)",
        "  setSprint(sprinting)",
        "end)",
      ].join("\n")),
      "",
      "Hold Shift on keyboard. On mobile, hold the Sprint button. It sets WalkSpeed to " + sprintSpeed + ", then back to 16.",
    ].join("\n");
  }
  if (lower.includes("shop")) {
    return [
      "Here is a shop GUI starter script:",
      "",
      lua([
        "-- ShopGUI.lua (LocalScript inside ScreenGui)",
        "local Players = game:GetService(\"Players\")",
        "local player = Players.LocalPlayer",
        "local gui = script.Parent",
        "",
        "local frame = Instance.new(\"Frame\")",
        "frame.Size = UDim2.new(0, 420, 0, 320)",
        "frame.Position = UDim2.new(0.5, -210, 0.5, -160)",
        "frame.BackgroundColor3 = Color3.fromRGB(20, 20, 20)",
        "frame.BorderSizePixel = 0",
        "frame.Parent = gui",
        "",
        "local corner = Instance.new(\"UICorner\")",
        "corner.CornerRadius = UDim.new(0, 12)",
        "corner.Parent = frame",
        "",
        "local title = Instance.new(\"TextLabel\")",
        "title.Size = UDim2.new(1, 0, 0, 40)",
        "title.BackgroundTransparency = 1",
        "title.Text = \"SHOP\"",
        "title.TextColor3 = Color3.fromRGB(225, 29, 72)",
        "title.Font = Enum.Font.GothamBold",
        "title.TextSize = 22",
        "title.Parent = frame",
        "",
        "print(\"Shop GUI ready!\")",
      ].join("\n")),
      "",
      "Want this expanded with items and a DataStore backend?",
    ].join("\n");
  }
  if (lower.includes("anim")) {
    return [
      "Animation imported.",
      "",
      lua([
        "-- AnimateBuild (ServerScript)",
        "local model = Instance.new(\"Model\")",
        "model.Name = \"RoCreateAnim\"",
        "model.Parent = workspace",
        "local part = Instance.new(\"Part\")",
        "part.Name = \"Spinner\"",
        "part.Size = Vector3.new(4, 1, 4)",
        "part.Anchored = true",
        "part.Position = Vector3.new(0, 4, 0)",
        "part.Color = Color3.fromRGB(225, 29, 72)",
        "part.Parent = model",
        "task.spawn(function()",
        "  while part.Parent do",
        "    part.CFrame = part.CFrame * CFrame.Angles(0, math.rad(4), 0)",
        "    task.wait(0.03)",
        "  end",
        "end)",
      ].join("\n")),
    ].join("\n");
  }
  if (lower.includes("build") || lower.includes("house") || lower.includes("map")) {
    return [
      "Build imported.",
      "",
      lua([
        "-- Build (ServerScript)",
        "local model = Instance.new(\"Model\")",
        "model.Name = \"RoCreateBuild\"",
        "model.Parent = workspace",
        "local function block(name, size, pos, color)",
        "  local part = Instance.new(\"Part\")",
        "  part.Name = name",
        "  part.Anchored = true",
        "  part.Size = size",
        "  part.Position = pos",
        "  part.Color = color",
        "  part.Parent = model",
        "end",
        "block(\"Floor\", Vector3.new(24, 1, 24), Vector3.new(0, 1, 0), Color3.fromRGB(30, 30, 30))",
        "block(\"WallA\", Vector3.new(24, 8, 1), Vector3.new(0, 5, -12), Color3.fromRGB(225, 29, 72))",
        "block(\"WallB\", Vector3.new(1, 8, 24), Vector3.new(12, 5, 0), Color3.fromRGB(20, 20, 20))",
        "block(\"Roof\", Vector3.new(26, 1, 26), Vector3.new(0, 10, 0), Color3.fromRGB(40, 40, 40))",
      ].join("\n")),
    ].join("\n");
  }
  if (lower.includes("obby") || lower.includes("stage")) {
    return [
      "Here is a stage and checkpoint starter:",
      "",
      lua([
        "-- StageSystem (ServerScript)",
        "local Players = game:GetService(\"Players\")",
        "",
        "Players.PlayerAdded:Connect(function(player)",
        "  player:SetAttribute(\"Stage\", 1)",
        "end)",
      ].join("\n")),
      "",
      "I can add a finish leaderboard and save progress next.",
    ].join("\n");
  }
  if (lower.includes("blender") || lower.includes("model") || lower.includes("sword")) {
    return [
      "Blender workflow for a Roblox-ready sword:",
      "",
      "1. Start with a cube and scale it into a blade.",
      "2. Add a Mirror modifier.",
      "3. Bevel the edges, then add a Subdivision Surface.",
      "4. Use an emission material for the energy edge.",
      "5. UV unwrap and export FBX with transforms applied.",
      "6. Import into Studio as a MeshPart.",
      "",
      "Keep it under about 5k triangles for mobile.",
    ].join("\n");
  }
  if (lower.includes("datastore") || lower.includes("save")) {
    return [
      "Secure DataStore example:",
      "",
      lua([
        "local DataStoreService = game:GetService(\"DataStoreService\")",
        "local store = DataStoreService:GetDataStore(\"PlayerData_v1\")",
        "",
        "local function load(player)",
        "  local key = \"p_\" .. player.UserId",
        "  local success, data = pcall(function()",
        "    return store:GetAsync(key)",
        "  end)",
        "  if success and data then return data end",
        "  return { coins = 0, inventory = {} }",
        "end",
      ].join("\n")),
      "",
      "Always wrap DataStore calls in pcall.",
    ].join("\n");
  }
  return [
    "Got it. I would build that like this:",
    "",
    "1. Split it into small systems.",
    "2. Write commented Lua with client and server separated.",
    "3. Add a simple GUI and a save path.",
    "",
    "Tell me the game genre and the exact systems you need.",
  ].join("\n");
}
