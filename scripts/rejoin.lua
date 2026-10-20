-- @name: Rejoin Server
-- @desc: Teleports you back into the same server after the next join.

local TeleportService = game:GetService("TeleportService")
local Players = game:GetService("Players")

queue_on_teleport([[
	print("Rejoined", game.PlaceId, "on", game.JobId)
]])

print("Rejoining", game.PlaceId, "instance", game.JobId)
TeleportService:TeleportToPlaceInstance(game.PlaceId, game.JobId, Players.LocalPlayer)
