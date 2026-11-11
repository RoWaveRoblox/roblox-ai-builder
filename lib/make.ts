export type Build = {
  kind: "script" | "gui" | "model";
  title: string;
  summary: string;
  source: string;
  name: string;
  className?: "Script" | "LocalScript" | "ModuleScript";
  location?: "ServerScriptService" | "StarterPlayerScripts" | "StarterCharacterScripts" | "Workspace" | "ReplicatedStorage";
};

function buttonsFrom(prompt: string): string[] {
  const cleaned = prompt
    .replace(/make|create|build|add|a|an|the|simple|gui|ui|menu|screen|with|button|buttons|for|my|game|please|called|named/gi, " ")
    .replace(/[^a-z0-9, ]/gi, " ");
  const parts = cleaned
    .split(/,| and /i)
    .map((part) => part.trim())
    .filter((part) => part.length > 1 && part.length < 22);
  const unique = [...new Set(parts)].slice(0, 6);
  if (unique.length > 0) return unique.map((part) => part.toUpperCase());
  return ["PLAY", "SHOP", "SETTINGS"];
}

function panel(title: string, buttons: string[], extra = ""): string {
  const lines = buttons.map((label) => `  addButton("${label.replace(/"/g, "")}")`).join("\n");
  return `local TweenService = game:GetService("TweenService")
local gui = script.Parent
gui.ResetOnSpawn = false
gui.IgnoreGuiInset = true

local frame = Instance.new("Frame")
frame.Name = "Panel"
frame.AnchorPoint = Vector2.new(0.5, 0.5)
frame.Size = UDim2.fromOffset(440, 380)
frame.Position = UDim2.fromScale(0.5, 0.5)
frame.BackgroundColor3 = Color3.fromRGB(14, 14, 14)
frame.BorderSizePixel = 0
frame.Parent = gui

local corner = Instance.new("UICorner")
corner.CornerRadius = UDim.new(0, 16)
corner.Parent = frame

local stroke = Instance.new("UIStroke")
stroke.Color = Color3.fromRGB(225, 29, 72)
stroke.Thickness = 1.5
stroke.Parent = frame

local title = Instance.new("TextLabel")
title.BackgroundTransparency = 1
title.Size = UDim2.new(1, -24, 0, 46)
title.Position = UDim2.fromOffset(16, 10)
title.Font = Enum.Font.GothamBold
title.TextSize = 24
title.TextXAlignment = Enum.TextXAlignment.Left
title.TextColor3 = Color3.new(1, 1, 1)
title.Text = "${title.replace(/"/g, "")}"
title.Parent = frame

local close = Instance.new("TextButton")
close.Size = UDim2.fromOffset(32, 32)
close.Position = UDim2.new(1, -42, 0, 12)
close.BackgroundColor3 = Color3.fromRGB(32, 32, 32)
close.Font = Enum.Font.GothamBold
close.TextSize = 16
close.TextColor3 = Color3.new(1, 1, 1)
close.Text = "X"
close.Parent = frame
local closeCorner = Instance.new("UICorner")
closeCorner.CornerRadius = UDim.new(1, 0)
closeCorner.Parent = close
close.MouseButton1Click:Connect(function()
  frame.Visible = not frame.Visible
end)

local list = Instance.new("Frame")
list.Name = "List"
list.BackgroundTransparency = 1
list.Size = UDim2.new(1, -32, 1, -84)
list.Position = UDim2.fromOffset(16, 64)
list.Parent = frame

local layout = Instance.new("UIListLayout")
layout.Padding = UDim.new(0, 10)
layout.Parent = list

local function addButton(text)
  local button = Instance.new("TextButton")
  button.Size = UDim2.new(1, 0, 0, 46)
  button.BackgroundColor3 = Color3.fromRGB(225, 29, 72)
  button.Font = Enum.Font.GothamBold
  button.TextSize = 18
  button.TextColor3 = Color3.new(1, 1, 1)
  button.Text = text
  button.AutoButtonColor = true
  button.Parent = list
  local buttonCorner = Instance.new("UICorner")
  buttonCorner.CornerRadius = UDim.new(0, 10)
  buttonCorner.Parent = button
  button.MouseButton1Click:Connect(function()
    local shrink = TweenService:Create(button, TweenInfo.new(0.08), { Size = UDim2.new(1, 0, 0, 42) })
    shrink:Play()
    print("Ro_Create clicked " .. text)
  end)
end

${lines}
${extra}`;
}

export function planBuild(prompt: string): Build {
  const text = prompt.toLowerCase();
  const wantsGui = /gui|ui|menu|button|frame|hud|shop|inventory|settings|panel|screen|display|interface/.test(text);

  if (/sprint|shift|walkspeed/.test(text)) {
    const asked = text.match(/(?:to|speed)\s*(\d{1,3})/);
    const speed = asked ? Math.min(200, Math.max(10, Number(asked[1]))) : 24;
    return {
      kind: "gui",
      name: "SprintGui",
      title: "Sprint",
      summary: `Hold Shift, or the on-screen button, to run at ${speed}.`,
      source: panel("SPRINT", ["HOLD TO RUN"], `
local Players = game:GetService("Players")
local UserInputService = game:GetService("UserInputService")
local player = Players.LocalPlayer
local running = false
local function setRun(on)
  running = on
  local character = player.Character
  local humanoid = character and character:FindFirstChildOfClass("Humanoid")
  if humanoid then humanoid.WalkSpeed = on and ${speed} or 16 end
end
UserInputService.InputBegan:Connect(function(input, processed)
  if processed then return end
  if input.KeyCode == Enum.KeyCode.LeftShift or input.KeyCode == Enum.KeyCode.RightShift then setRun(true) end
end)
UserInputService.InputEnded:Connect(function(input)
  if input.KeyCode == Enum.KeyCode.LeftShift or input.KeyCode == Enum.KeyCode.RightShift then setRun(false) end
end)
list:FindFirstChildWhichIsA("TextButton").MouseButton1Down:Connect(function() setRun(true) end)
list:FindFirstChildWhichIsA("TextButton").MouseButton1Up:Connect(function() setRun(false) end)
`),
    };
  }

  if (wantsGui && /shop|store|buy/.test(text)) {
    return {
      kind: "gui",
      name: "ShopGui",
      title: "Shop GUI",
      summary: "A shop panel with coins and buy buttons.",
      source: panel("SHOP", ["SWORD  100", "POTION  50", "SPEED  75"], `
local coins = Instance.new("TextLabel")
coins.BackgroundTransparency = 1
coins.Size = UDim2.new(1, 0, 0, 24)
coins.Font = Enum.Font.Gotham
coins.TextSize = 16
coins.TextXAlignment = Enum.TextXAlignment.Left
coins.TextColor3 = Color3.fromRGB(255, 220, 120)
coins.Text = "Coins: 250"
coins.Parent = list
`),
    };
  }

  if (wantsGui && /inventory|backpack/.test(text)) {
    return {
      kind: "gui",
      name: "InventoryGui",
      title: "Inventory GUI",
      summary: "A 8-slot inventory panel.",
      source: `local gui = script.Parent
gui.ResetOnSpawn = false
local frame = Instance.new("Frame")
frame.AnchorPoint = Vector2.new(0.5, 0.5)
frame.Size = UDim2.fromOffset(420, 280)
frame.Position = UDim2.fromScale(0.5, 0.5)
frame.BackgroundColor3 = Color3.fromRGB(14, 14, 14)
frame.Parent = gui
local corner = Instance.new("UICorner")
corner.CornerRadius = UDim.new(0, 16)
corner.Parent = frame
local title = Instance.new("TextLabel")
title.BackgroundTransparency = 1
title.Size = UDim2.new(1, 0, 0, 40)
title.Font = Enum.Font.GothamBold
title.TextSize = 22
title.TextColor3 = Color3.new(1, 1, 1)
title.Text = "INVENTORY"
title.Parent = frame
local grid = Instance.new("Frame")
grid.BackgroundTransparency = 1
grid.Size = UDim2.new(1, -24, 1, -56)
grid.Position = UDim2.fromOffset(12, 44)
grid.Parent = frame
local layout = Instance.new("UIGridLayout")
layout.CellSize = UDim2.fromOffset(88, 88)
layout.CellPadding = UDim2.fromOffset(8, 8)
layout.Parent = grid
for i = 1, 8 do
  local slot = Instance.new("TextButton")
  slot.BackgroundColor3 = Color3.fromRGB(32, 32, 32)
  slot.Text = tostring(i)
  slot.Font = Enum.Font.GothamBold
  slot.TextSize = 18
  slot.TextColor3 = Color3.new(1, 1, 1)
  slot.Parent = grid
  local slotCorner = Instance.new("UICorner")
  slotCorner.CornerRadius = UDim.new(0, 10)
  slotCorner.Parent = slot
end`,
    };
  }

  if (wantsGui) {
    const buttons = buttonsFrom(prompt);
    const title = /setting/.test(text) ? "SETTINGS" : /menu/.test(text) ? "MENU" : buttons[0] || "MENU";
    return {
      kind: "gui",
      name: "RoCreateGui",
      title: title + " GUI",
      summary: `A panel with ${buttons.join(", ")}.`,
      source: panel(title, buttons),
    };
  }

  if (/build|house|map|obby|model|sword|door/.test(text)) {
    return {
      kind: "script",
      name: "RoCreateBuild",
      title: "Build",
      summary: "Parts were placed in the workspace.",
      source: `local model = Instance.new("Model")
model.Name = "RoCreateBuild"
model.Parent = workspace
local function block(name, size, pos, color)
  local part = Instance.new("Part")
  part.Name = name
  part.Anchored = true
  part.Size = size
  part.Position = pos
  part.Color = color
  part.Parent = model
  return part
end
block("Floor", Vector3.new(30, 1, 30), Vector3.new(0, 1, 0), Color3.fromRGB(25, 25, 25))
block("Wall", Vector3.new(30, 10, 1), Vector3.new(0, 6, -15), Color3.fromRGB(225, 29, 72))
local door = block("Door", Vector3.new(6, 9, 1), Vector3.new(0, 5.5, -15), Color3.fromRGB(80, 40, 40))
door.Touched:Connect(function()
  door.Transparency = 0.45
  door.CanCollide = false
end)
block("Roof", Vector3.new(32, 1, 32), Vector3.new(0, 12, 0), Color3.fromRGB(40, 40, 40))`,
    };
  }

  if (/anim/.test(text)) {
    return {
      kind: "script",
      name: "RoCreateAnim",
      title: "Animation",
      summary: "A spinning showcase part was added.",
      source: `local part = Instance.new("Part")
part.Name = "RoCreateSpin"
part.Anchored = true
part.Size = Vector3.new(4, 1, 6)
part.Position = Vector3.new(0, 5, 0)
part.Color = Color3.fromRGB(225, 29, 72)
part.Parent = workspace
task.spawn(function()
  while part.Parent do
    part.CFrame = part.CFrame * CFrame.Angles(0, math.rad(3), 0)
    task.wait(0.03)
  end
end)`,
    };
  }

  if (/coin|cash|leader|money|data|save/.test(text)) {
    return {
      kind: "script",
      name: "RoCreateStats",
      title: "Leaderstats",
      summary: "Players get a Coins leaderstat when they join.",
      source: `local Players = game:GetService("Players")
local function setup(player)
  local stats = Instance.new("Folder")
  stats.Name = "leaderstats"
  stats.Parent = player
  local coins = Instance.new("IntValue")
  coins.Name = "Coins"
  coins.Value = 0
  coins.Parent = stats
end
Players.PlayerAdded:Connect(setup)
for _, player in ipairs(Players:GetPlayers()) do setup(player) end`,
    };
  }

  return {
    kind: "script",
    name: "RoCreateScript",
    title: "Script",
    summary: "A starter system was added to ServerScriptService.",
    source: `local Players = game:GetService("Players")
print("Ro_Create system started")
Players.PlayerAdded:Connect(function(player)
  player:SetAttribute("RoCreateReady", true)
  print(player.Name .. " joined")
end)`,
  };
}
