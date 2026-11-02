-- Ro_Create Studio plugin
-- In Studio: Plugins folder -> save this file as a local plugin named RoCreate.lua
-- Then enable Game Settings -> Security -> Allow HTTP Requests

local HttpService = game:GetService("HttpService")
local ChangeHistory = game:GetService("ChangeHistoryService")
local API = "https://ro-create.netlify.app/.netlify/functions/pair"

local widgetInfo = DockWidgetPluginGuiInfo.new(Enum.InitialDockState.Right, false, false, 320, 420, 280, 360)
local widget = plugin:CreateDockWidgetPluginGui("RoCreateConnect", widgetInfo)
widget.Title = "Ro_Create"

local button = plugin:CreateToolbar("Ro_Create"):CreateButton("Ro_Create", "Connect Studio to Ro_Create", "")
button.Click:Connect(function()
	widget.Enabled = not widget.Enabled
end)

local bg = Instance.new("Frame")
bg.Size = UDim2.fromScale(1, 1)
bg.BackgroundColor3 = Color3.fromRGB(12, 12, 12)
bg.BorderSizePixel = 0
bg.Parent = widget

local title = Instance.new("TextLabel")
title.BackgroundTransparency = 1
title.Size = UDim2.new(1, -16, 0, 28)
title.Position = UDim2.fromOffset(8, 8)
title.Font = Enum.Font.GothamBold
title.TextSize = 18
title.TextXAlignment = Enum.TextXAlignment.Left
title.TextColor3 = Color3.fromRGB(255, 255, 255)
title.Text = "Ro_Create"
title.Parent = bg

local codeLabel = Instance.new("TextLabel")
codeLabel.BackgroundColor3 = Color3.fromRGB(225, 29, 72)
codeLabel.Size = UDim2.new(1, -16, 0, 48)
codeLabel.Position = UDim2.fromOffset(8, 44)
codeLabel.Font = Enum.Font.Code
codeLabel.TextSize = 28
codeLabel.TextColor3 = Color3.new(1, 1, 1)
codeLabel.Text = "--------"
codeLabel.Parent = bg

local status = Instance.new("TextLabel")
status.BackgroundTransparency = 1
status.Size = UDim2.new(1, -16, 0, 48)
status.Position = UDim2.fromOffset(8, 100)
status.Font = Enum.Font.Gotham
status.TextSize = 14
status.TextWrapped = true
status.TextXAlignment = Enum.TextXAlignment.Left
status.TextYAlignment = Enum.TextYAlignment.Top
status.TextColor3 = Color3.fromRGB(180, 180, 180)
status.Text = "Press Connect, then paste the code into Ro_Create."
status.Parent = bg

local connect = Instance.new("TextButton")
connect.Size = UDim2.new(1, -16, 0, 36)
connect.Position = UDim2.fromOffset(8, 156)
connect.BackgroundColor3 = Color3.fromRGB(225, 29, 72)
connect.Font = Enum.Font.GothamBold
connect.TextSize = 16
connect.TextColor3 = Color3.new(1, 1, 1)
connect.Text = "Connect"
connect.Parent = bg

local activeCode = ""
local polling = false

local function post(payload)
	local response = HttpService:RequestAsync({
		Url = API,
		Method = "POST",
		Headers = { ["Content-Type"] = "application/json" },
		Body = HttpService:JSONEncode(payload),
	})
	if response.StatusCode < 200 or response.StatusCode >= 300 then
		error(response.Body)
	end
	return HttpService:JSONDecode(response.Body)
end

local function insertScript(parent, className, name, source)
	local existing = parent:FindFirstChild(name)
	if existing then existing:Destroy() end
	local scriptObj = Instance.new(className)
	scriptObj.Name = name
	scriptObj.Source = source
	scriptObj.Parent = parent
	return scriptObj
end

local function apply(job)
	ChangeHistory:SetWaypoint("Ro_Create before " .. (job.name or "job"))
	local kind = job.kind or "script"
	local name = job.name or "RoCreateItem"
	local source = job.source or ""

	if kind == "gui" then
		local gui = Instance.new("ScreenGui")
		gui.Name = name
		gui.ResetOnSpawn = false
		gui.Parent = game:GetService("StarterGui")
		insertScript(gui, "LocalScript", name .. "Script", source)
	elseif kind == "model" then
		local ok, data = pcall(function()
			return HttpService:JSONDecode(source)
		end)
		local model = Instance.new("Model")
		model.Name = name
		model.Parent = workspace
		if ok and type(data) == "table" and type(data.parts) == "table" then
			for _, partInfo in ipairs(data.parts) do
				local part = Instance.new("Part")
				part.Name = partInfo.name or "Part"
				part.Anchored = true
				local size = partInfo.size or {4, 1, 4}
				local pos = partInfo.position or {0, 5, 0}
				local color = partInfo.color or {225, 29, 72}
				part.Size = Vector3.new(size[1], size[2], size[3])
				part.Position = Vector3.new(pos[1], pos[2], pos[3])
				part.Color = Color3.fromRGB(color[1], color[2], color[3])
				part.Parent = model
			end
		else
			local part = Instance.new("Part")
			part.Name = name
			part.Anchored = true
			part.Size = Vector3.new(4, 1, 8)
			part.Color = Color3.fromRGB(225, 29, 72)
			part.Parent = model
		end
		model.PrimaryPart = model:FindFirstChildWhichIsA("BasePart")
	else
		insertScript(game:GetService("ServerScriptService"), "Script", name, source)
	end
	ChangeHistory:SetWaypoint("Ro_Create imported " .. name)
end

local function poll()
	if polling or activeCode == "" then return end
	polling = true
	task.spawn(function()
		while activeCode ~= "" and widget.Parent do
			local ok, result = pcall(function()
				return post({ action = "pull", code = activeCode })
			end)
			if ok and result and result.jobs then
				for _, job in ipairs(result.jobs) do
					local applied, err = pcall(apply, job)
					status.Text = applied and ("Imported " .. (job.name or "item")) or tostring(err)
				end
			end
			task.wait(2)
		end
		polling = false
	end)
end

connect.MouseButton1Click:Connect(function()
	connect.Text = "Connecting..."
	local ok, result = pcall(function()
		return post({ action = "create" })
	end)
	if not ok then
		status.Text = "Could not reach Ro_Create. Turn on Allow HTTP Requests, then press Connect again."
		connect.Text = "Connect"
		return
	end
	activeCode = string.lower(result.code)
	codeLabel.Text = activeCode
	status.Text = "Paste " .. activeCode .. " into Ro_Create. This plugin will import scripts, GUIs, and models."
	connect.Text = "Connected"
	poll()
end)
