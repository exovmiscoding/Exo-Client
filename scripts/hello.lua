-- @name: Hello Velocity
-- @desc: Prints executor identity, HWID and thread identity to the console.

local name, version = identifyexecutor()

rconsolecreate()
rconsoleclear()
rconsoletitle("Velocity - Hello")
rconsoleprint("==============================\n")
rconsoleprint(("  %s  %s\n"):format(name, version))
rconsoleprint("==============================\n")
rconsoleinfo(("HWID:     %s"):format(gethwid()))
rconsoleinfo(("Identity: %d"):format(getidentity()))
rconsoleinfo(("Caller:   %s"):format(tostring(checkcaller())))
