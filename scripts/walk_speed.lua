-- @name: Walk Speed
-- @desc: Sets WalkSpeed and JumpPower and re-applies them on respawn.

local SPEED = 60
local JUMP = 75

local player = game:GetService("Players").LocalPlayer

local function apply(character)
	local humanoid = character:WaitForChild("Humanoid")
	humanoid.WalkSpeed = SPEED
	humanoid.UseJumpPower = true
	humanoid.JumpPower = JUMP
end

if player.Character then
	task.spawn(apply, player.Character)
end

player.CharacterAdded:Connect(function(character)
	task.spawn(apply, character)
end)

print(("WalkSpeed = %d, JumpPower = %d"):format(SPEED, JUMP))
