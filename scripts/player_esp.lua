-- @name: Player ESP
-- @desc: Draws a name tag over every other player using the native Drawing API.

local Players = game:GetService("Players")
local RunService = game:GetService("RunService")
local camera = workspace.CurrentCamera
local localPlayer = Players.LocalPlayer

local tags = {}

local function addTag(player)
	if player == localPlayer or tags[player] then
		return
	end
	local tag = Drawing.new("Text")
	tag.Size = 15
	tag.Center = true
	tag.Outline = true
	tag.Color = Color3.fromRGB(216, 180, 254)
	tag.Visible = false
	tags[player] = tag
end

for _, player in ipairs(Players:GetPlayers()) do
	addTag(player)
end

Players.PlayerAdded:Connect(addTag)

Players.PlayerRemoving:Connect(function(player)
	local tag = tags[player]
	if tag then
		tag:Remove()
		tags[player] = nil
	end
end)

RunService.RenderStepped:Connect(function()
	for player, tag in pairs(tags) do
		local character = player.Character
		local head = character and character:FindFirstChild("Head")
		if head then
			local screenPos, onScreen = camera:WorldToViewportPoint(head.Position + Vector3.new(0, 2.5, 0))
			if onScreen then
				tag.Position = Vector2.new(screenPos.X, screenPos.Y)
				tag.Text = player.Name
				tag.Visible = true
			else
				tag.Visible = false
			end
		else
			tag.Visible = false
		end
	end
end)

print("Player ESP enabled for", #Players:GetPlayers() - 1, "players")
