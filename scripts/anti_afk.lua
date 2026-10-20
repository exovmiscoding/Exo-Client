-- @name: Anti AFK
-- @desc: Prevents Roblox's idle timeout. Run again to toggle off.

if getgenv().velocity_antiafk then
	getgenv().velocity_antiafk:Disconnect()
	getgenv().velocity_antiafk = nil
	print("Anti-AFK disabled")
	return
end

local VirtualUser = game:GetService("VirtualUser")
local player = game:GetService("Players").LocalPlayer

getgenv().velocity_antiafk = player.Idled:Connect(function()
	VirtualUser:CaptureController()
	VirtualUser:ClickButton2(Vector2.new())
end)

print("Anti-AFK enabled")
