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
bg.BackgroundColor3 = Color3.fromRGB(24, 24, 24)
bg.BorderSizePixel = 0
bg.Parent = widget

local logo = Instance.new("Frame")
logo.Size = UDim2.fromOffset(28, 28)
logo.Position = UDim2.fromOffset(12, 12)
logo.BackgroundColor3 = Color3.fromRGB(225, 29, 72)
logo.Parent = bg
local logoCorner = Instance.new("UICorner")
logoCorner.CornerRadius = UDim.new(1, 0)
logoCorner.Parent = logo
local logoText = Instance.new("TextLabel")
logoText.BackgroundTransparency = 1
logoText.Size = UDim2.fromScale(1, 1)
logoText.Font = Enum.Font.GothamBold
logoText.TextSize = 12
logoText.TextColor3 = Color3.new(1, 1, 1)
logoText.Text = "RO"
logoText.Parent = logo

local version = Instance.new("TextLabel")
version.BackgroundTransparency = 1
version.Position = UDim2.fromOffset(48, 16)
version.Size = UDim2.fromOffset(70, 20)
version.Font = Enum.Font.Gotham
version.TextSize = 14
version.TextXAlignment = Enum.TextXAlignment.Left
version.TextColor3 = Color3.fromRGB(200, 200, 200)
version.Text = "v1.0.0"
version.Parent = bg

local connect = Instance.new("TextButton")
connect.Size = UDim2.fromOffset(92, 32)
connect.Position = UDim2.new(1, -132, 0, 10)
connect.BackgroundColor3 = Color3.fromRGB(34, 160, 70)
connect.Font = Enum.Font.GothamBold
connect.TextSize = 15
connect.TextColor3 = Color3.new(1, 1, 1)
connect.Text = "Connect"
connect.AutoButtonColor = true
connect.Parent = bg
local connectCorner = Instance.new("UICorner")
connectCorner.CornerRadius = UDim.new(0, 8)
connectCorner.Parent = connect

local dot = Instance.new("Frame")
dot.Size = UDim2.fromOffset(18, 18)
dot.Position = UDim2.new(1, -30, 0, 17)
dot.BackgroundColor3 = Color3.fromRGB(180, 40, 40)
dot.Parent = bg
local dotCorner = Instance.new("UICorner")
dotCorner.CornerRadius = UDim.new(1, 0)
dotCorner.Parent = dot

local status = Instance.new("TextLabel")
status.BackgroundTransparency = 1
status.Size = UDim2.new(1, -24, 0, 40)
status.Position = UDim2.fromOffset(12, 52)
status.Font = Enum.Font.Gotham
status.TextSize = 14
status.TextWrapped = true
status.TextXAlignment = Enum.TextXAlignment.Left
status.TextColor3 = Color3.fromRGB(210, 210, 210)
status.Text = "Open Ro_Create in the browser, then press Connect."
status.Parent = bg

local codeLabel = Instance.new("TextLabel")
codeLabel.BackgroundTransparency = 1
codeLabel.Size = UDim2.new(1, -24, 0, 28)
codeLabel.Position = UDim2.fromOffset(12, 96)
codeLabel.Font = Enum.Font.Code
codeLabel.TextSize = 22
codeLabel.TextXAlignment = Enum.TextXAlignment.Left
codeLabel.TextColor3 = Color3.new(1, 1, 1)
codeLabel.Text = ""
codeLabel.Parent = bg

local logs = Instance.new("TextButton")
logs.Size = UDim2.fromOffset(78, 26)
logs.Position = UDim2.new(1, -90, 1, -38)
logs.BackgroundColor3 = Color3.fromRGB(48, 48, 48)
logs.Font = Enum.Font.Gotham
logs.TextSize = 13
logs.TextColor3 = Color3.fromRGB(220, 220, 220)
logs.Text = "Logs Off"
logs.Parent = bg
local logsCorner = Instance.new("UICorner")
logsCorner.CornerRadius = UDim.new(0, 8)
logsCorner.Parent = logs
local logsOn = false
logs.MouseButton1Click:Connect(function()
	logsOn = not logsOn
	logs.Text = logsOn and "Logs On" or "Logs Off"
end)

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
	status.Text = "Paste " .. activeCode .. " into Ro_Create, then send from AI Builder."
	dot.BackgroundColor3 = Color3.fromRGB(34, 160, 70)
	connect.Text = "Connected"
	connect.BackgroundColor3 = Color3.fromRGB(24, 110, 52)
	poll()
end)
