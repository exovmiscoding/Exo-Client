// Velocity API completion database.
// Sourced verbatim from https://getvelocity.llc/docs (v1.3.6).
//
// Entry shape:
//   n  name
//   s  signature string (shown as completion detail)
//   r  return type ("" when nothing is returned)
//   k  kind: f = function, c = constructor, m = method, t = table,
//            p = property, g = signal
//   d  description
//   a  aliases (optional array of extra global names)
//   p  parent namespace (optional; absent means a top-level global)
(function () {
  const sections = [
    {
      name: 'Environment',
      url: 'https://getvelocity.llc/docs/environment',
      entries: [
        { n: 'identifyexecutor', s: 'identifyexecutor()', r: 'string, string', k: 'f', d: 'Returns executor name and version. Both branded Velocity.', a: ['getexecutorname'] },
        { n: 'gethwid', s: 'gethwid()', r: 'string', k: 'f', d: 'Machine HWID used for license binding.' },
        { n: 'getidentity', s: 'getidentity()', r: 'number', k: 'f', d: 'Current thread identity (Roblox capability level 1-8).', a: ['getthreadidentity', 'getthreadcontext'] },
        { n: 'setidentity', s: 'setidentity(level: number)', r: '', k: 'f', d: 'Sets current thread identity and rewrites the capability mask. Level 8 is the executor default.', a: ['setthreadidentity', 'setthreadcontext'] },
        { n: 'getfflag', s: 'getfflag(name: string)', r: 'any', k: 'f', d: 'Read a Roblox fast-flag by name.' },
        { n: 'setfflag', s: 'setfflag(name: string, value: any)', r: '', k: 'f', d: 'Write a Roblox fast-flag by name.' },
        { n: 'checkcaller', s: 'checkcaller()', r: 'boolean', k: 'f', d: 'true if the calling thread is the executor VM (not a game script).' },
        { n: 'cloneref', s: 'cloneref(instance: Instance)', r: 'Instance', k: 'f', d: 'Returns a fresh userdata pointing at the same Instance. Bypasses __eq-based hidden-service detection.', a: ['clonereference'] },
        { n: 'getgenv', s: 'getgenv()', r: 'table', k: 'f', d: 'Executor shared global environment. Persists across script loads.' },
        { n: 'getreg', s: 'getreg()', r: 'table', k: 'f', d: 'Lua registry table.' },
        { n: 'getrenv', s: 'getrenv()', r: 'table', k: 'f', d: 'Roblox game-side global environment.' },
        { n: 'gettenv', s: 'gettenv(thread: thread)', r: 'table', k: 'f', d: 'Environment table of the given thread.' },
        { n: 'loadstring', s: 'loadstring(source: string, chunkname: string?)', r: 'function | nil, string?', k: 'f', d: 'Compile a Lua string. Returns the loaded closure or nil, err.', a: ['executescript'] },
        { n: 'getscriptfromthread', s: 'getscriptfromthread(thread: thread)', r: 'Instance?', k: 'f', d: 'The LocalScript or ModuleScript that spawned the thread, if any.' },
        { n: 'getobjects', s: 'getobjects(assetId: string | number)', r: '{Instance}', k: 'f', d: 'Roblox GetObjects - loads an asset and returns its top-level Instances.' },
        { n: 'firetouchinterest', s: 'firetouchinterest(part: BasePart, humanoidPart: BasePart, action: number)', r: '', k: 'f', d: 'Fake a touch event. action is 0 (touch) or 1 (untouch).' },
        { n: 'queue_on_teleport', s: 'queue_on_teleport(source: string)', r: '', k: 'f', d: 'Queues a script to run after the next teleport / place change.', a: ['queueonteleport'] },
        { n: 'clearqueueonteleport', s: 'clearqueueonteleport()', r: '', k: 'f', d: 'Drop everything queued by queue_on_teleport.', a: ['clearteleportqueue'] }
      ]
    },
    {
      name: 'File system',
      url: 'https://getvelocity.llc/docs/file-system',
      entries: [
        { n: 'readfile', s: 'readfile(path: string)', r: 'string', k: 'f', d: 'Read the whole file. Binary-safe.' },
        { n: 'writefile', s: 'writefile(path: string, contents: string)', r: '', k: 'f', d: 'Overwrite (or create) the file. Binary-safe.' },
        { n: 'appendfile', s: 'appendfile(path: string, contents: string)', r: '', k: 'f', d: 'Append bytes to a file, creating it if absent.' },
        { n: 'isfile', s: 'isfile(path: string)', r: 'boolean', k: 'f', d: 'Whether the path is a readable file.' },
        { n: 'isfolder', s: 'isfolder(path: string)', r: 'boolean', k: 'f', d: 'Whether the path is a directory.' },
        { n: 'delfile', s: 'delfile(path: string)', r: '', k: 'f', d: 'Delete a file.' },
        { n: 'delfolder', s: 'delfolder(path: string)', r: '', k: 'f', d: 'Delete a directory and its contents.' },
        { n: 'makefolder', s: 'makefolder(path: string)', r: '', k: 'f', d: 'Create a directory (nested - parent dirs are created as needed).' },
        { n: 'listfiles', s: 'listfiles(path: string)', r: '{string}', k: 'f', d: 'List all entries (files and folders) directly inside path.' },
        { n: 'loadfile', s: 'loadfile(path: string, chunkname: string?)', r: 'function | nil, string?', k: 'f', d: 'Compile a file contents into a closure.' },
        { n: 'getcustomasset', s: 'getcustomasset(path: string)', r: 'string', k: 'f', d: 'Returns an rbxasset:// style URL your game can use as an asset.' },
        { n: 'setclipboard', s: 'setclipboard(text: string)', r: '', k: 'f', d: 'Set the OS clipboard contents.', a: ['setrbxclipboard', 'toclipboard'] }
      ]
    },
    {
      name: 'File dialogs',
      url: 'https://getvelocity.llc/docs/file-dialogs',
      entries: [
        { n: 'openfiledialog', s: 'openfiledialog(filter: string?, title: string?)', r: 'string?', k: 'f', d: 'Prompt to select a single file. Yields.' },
        { n: 'openfilesdialog', s: 'openfilesdialog(filter: string?, title: string?)', r: '{string}?', k: 'f', d: 'Multi-select variant. Returns an array of paths. Yields.' },
        { n: 'savefiledialog', s: 'savefiledialog(filter: string?, defaultName: string?, title: string?)', r: 'string?', k: 'f', d: 'Save as prompt. Returns the chosen destination path. Yields.' },
        { n: 'openfolderdialog', s: 'openfolderdialog(title: string?)', r: 'string?', k: 'f', d: 'Prompt to select a directory. Yields.' }
      ]
    },
    {
      name: 'Console',
      url: 'https://getvelocity.llc/docs/console',
      entries: [
        { n: 'rconsolecreate', s: 'rconsolecreate()', r: '', k: 'f', d: 'Show the console window.', a: ['consolecreate', 'rconsoleshow', 'consoleshow'] },
        { n: 'rconsoledestroy', s: 'rconsoledestroy()', r: '', k: 'f', d: 'Hide the console window.', a: ['consoledestroy', 'rconsolehide', 'consolehide'] },
        { n: 'rconsolesettitle', s: 'rconsolesettitle(title: string)', r: '', k: 'f', d: 'Set the console window title.', a: ['rconsolename', 'consolesettitle', 'consolename'] },
        { n: 'rconsoleclear', s: 'rconsoleclear()', r: '', k: 'f', d: 'Clear the console buffer.', a: ['consoleclear'] },
        { n: 'rconsoleprint', s: 'rconsoleprint(text: string)', r: '', k: 'f', d: 'Print without a trailing newline. Supports color codes via prefix.', a: ['consoleprint'] },
        { n: 'rconsoleinput', s: 'rconsoleinput()', r: 'string', k: 'f', d: 'Read one line of input from the console. Yields.', a: ['consoleinput'] },
        { n: 'rconsoleinfo', s: 'rconsoleinfo(text: string)', r: '', k: 'f', d: 'Print an info-tagged line.', a: ['consoleinfo'] },
        { n: 'rconsolewarn', s: 'rconsolewarn(text: string)', r: '', k: 'f', d: 'Print a warning-tagged line (yellow).', a: ['consolewarn'] },
        { n: 'rconsoleerr', s: 'rconsoleerr(text: string)', r: '', k: 'f', d: 'Print an error-tagged line (red).', a: ['rconsoleerror', 'consoleerr', 'consoleerror'] },
        { n: 'messagebox', s: 'messagebox(text: string, title: string, buttons: number)', r: 'number', k: 'f', d: 'Native Win32 MessageBoxW. Returns the button pressed. Yields.' }
      ]
    },
    {
      name: 'Debug',
      url: 'https://getvelocity.llc/docs/debug',
      entries: [
        { n: 'getconstant', s: 'debug.getconstant(f: function | number, idx: number)', r: 'any', k: 'f', d: 'Constant at index idx from the function constant table.', p: 'debug', a: ['debug.getconstant'] },
        { n: 'getconstants', s: 'debug.getconstants(f: function | number)', r: '{any}', k: 'f', d: 'All constants in the function proto.', p: 'debug', a: ['debug.getconstants'] },
        { n: 'setconstant', s: 'debug.setconstant(f, idx: number, value: any)', r: '', k: 'f', d: 'Overwrite a constant. Type must match the original slot type.', p: 'debug', a: ['debug.setconstant'] },
        { n: 'getproto', s: 'debug.getproto(f, idx: number, active: boolean?)', r: 'function | {function}', k: 'f', d: 'Get a child proto by index. If active=true, returns all live closures.', p: 'debug', a: ['debug.getproto'] },
        { n: 'getprotos', s: 'debug.getprotos(f)', r: '{function}', k: 'f', d: 'All child protos of the function.', p: 'debug', a: ['debug.getprotos'] },
        { n: 'getupvalue', s: 'debug.getupvalue(f, idx: number)', r: 'any', k: 'f', d: 'Read an upvalue by index (1-based).', p: 'debug', a: ['debug.getupvalue'] },
        { n: 'getupvalues', s: 'debug.getupvalues(f)', r: '{any}', k: 'f', d: 'All upvalues of a closure.', p: 'debug', a: ['debug.getupvalues'] },
        { n: 'setupvalue', s: 'debug.setupvalue(f, idx: number, value: any)', r: '', k: 'f', d: 'Overwrite an upvalue.', p: 'debug', a: ['debug.setupvalue'] },
        { n: 'getstack', s: 'debug.getstack(level: number, idx: number?)', r: 'any | {any}', k: 'f', d: 'Read a stack value at frame level. Without idx returns the whole stack.', p: 'debug', a: ['debug.getstack'] },
        { n: 'setstack', s: 'debug.setstack(level: number, idx: number, value: any)', r: '', k: 'f', d: 'Write a stack slot.', p: 'debug', a: ['debug.setstack'] },
        { n: 'getinfo', s: 'debug.getinfo(f | level: number, what: string?)', r: 'table', k: 'f', d: 'Debug info about a function or stack frame - source, currentline, nups, numparams.', p: 'debug', a: ['debug.getinfo'] },
        { n: 'getregistry', s: 'debug.getregistry()', r: 'table', k: 'f', d: 'Direct access to the Lua registry.', p: 'debug', a: ['debug.getregistry'] },
        { n: 'getmetatable', s: 'debug.getmetatable(value: any)', r: 'table?', k: 'f', d: 'Raw metatable read - ignores __metatable.', p: 'debug' },
        { n: 'setmetatable', s: 'debug.setmetatable(value: any, mt: table)', r: 'any', k: 'f', d: 'Raw metatable write - ignores __metatable.', p: 'debug' }
      ]
    },
    {
      name: 'Closures',
      url: 'https://getvelocity.llc/docs/closures',
      entries: [
        { n: 'newcclosure', s: 'newcclosure(f: function)', r: 'function', k: 'f', d: 'Wraps a Lua function in a C closure - iscclosure returns true. Preferred for anti-tamper detection.' },
        { n: 'newlclosure', s: 'newlclosure(f: function)', r: 'function', k: 'f', d: 'Wraps in a Lua closure.' },
        { n: 'wrapclosure', s: 'wrapclosure(f: function)', r: 'function', k: 'f', d: 'Generic wrap - picks the appropriate closure type for the input.' },
        { n: 'clonefunction', s: 'clonefunction(f: function)', r: 'function', k: 'f', d: 'Structurally identical clone with a distinct identity.' },
        { n: 'hookfunction', s: 'hookfunction(target: function, hook: function)', r: 'function', k: 'f', d: 'Redirects all calls to target through hook. Returns the original for chained calls.', a: ['hookfunc', 'replacefunction', 'replaceclosure'] },
        { n: 'hookmetamethod', s: 'hookmetamethod(object: any, method: string, hook: function)', r: 'function', k: 'f', d: 'Hooks a metamethod (__index, __namecall) on the object metatable.' },
        { n: 'iscclosure', s: 'iscclosure(f)', r: 'boolean', k: 'f', d: 'true if f is a C function.' },
        { n: 'islclosure', s: 'islclosure(f)', r: 'boolean', k: 'f', d: 'true if f is a Lua function.' },
        { n: 'isnewcclosure', s: 'isnewcclosure(f)', r: 'boolean', k: 'f', d: 'true if f came from newcclosure.' },
        { n: 'isexecutorclosure', s: 'isexecutorclosure(f)', r: 'boolean', k: 'f', d: 'true if f is a closure created or wrapped by Velocity.', a: ['checkclosure', 'isourclosure', 'iscustomcclosure', 'istempleclosure'] },
        { n: 'comparefunctions', s: 'comparefunctions(a: function, b: function)', r: 'boolean', k: 'f', d: 'true if both functions ultimately dispatch to the same target (unwraps clones).' },
        { n: 'getfunctionhash', s: 'getfunctionhash(f: function)', r: 'string', k: 'f', d: 'Stable hash of the function bytecode.' },
        { n: 'isfunctionhooked', s: 'isfunctionhooked(f: function)', r: 'boolean', k: 'f', d: 'true if f currently has an active hookfunction installed.' },
        { n: 'restorefunction', s: 'restorefunction(f: function)', r: '', k: 'f', d: 'Removes any hook installed on f.', a: ['restorefunc'] },
        { n: 'getcallbackvalue', s: 'getcallbackvalue(object: any, memberName: string)', r: 'function?', k: 'f', d: 'Read the current Lua callback assigned to a callback member.', a: ['getcallbackmember'] },
        { n: 'getcallstack', s: 'getcallstack()', r: '{table}', k: 'f', d: 'Full callstack - each entry has source, func, currentline, name, what.' }
      ]
    },
    {
      name: 'Instance',
      url: 'https://getvelocity.llc/docs/instance',
      entries: [
        { n: 'getinstances', s: 'getinstances()', r: '{Instance}', k: 'f', d: 'Every Instance in the current DataModel, including unreachable ones.', a: ['getinstancelist'] },
        { n: 'getnilinstances', s: 'getnilinstances()', r: '{Instance}', k: 'f', d: 'Instances with no Parent.' },
        { n: 'gethui', s: 'gethui()', r: 'Instance', k: 'f', d: 'A hidden GUI container that game scripts cannot enumerate.', a: ['get_hidden_gui'] },
        { n: 'compareinstances', s: 'compareinstances(a: Instance, b: Instance)', r: 'boolean', k: 'f', d: 'true if both userdata point at the same underlying Instance (unwraps cloneref).' }
      ]
    },
    {
      name: 'Script',
      url: 'https://getvelocity.llc/docs/script',
      entries: [
        { n: 'getscriptbytecode', s: 'getscriptbytecode(script: Instance)', r: 'string', k: 'f', d: 'Raw compiled Luau bytecode for a Script/LocalScript/ModuleScript.', a: ['dumpstring'] },
        { n: 'getscripthash', s: 'getscripthash(script: Instance)', r: 'string?', k: 'f', d: 'Hash of the script bytecode.' },
        { n: 'getscriptclosure', s: 'getscriptclosure(script: Instance)', r: 'function', k: 'f', d: 'Compile and return the script top-level closure without running it.', a: ['getscriptfunction'] },
        { n: 'getcallingscript', s: 'getcallingscript()', r: 'Instance?', k: 'f', d: 'The script that spawned the currently-running thread.' },
        { n: 'getscripts', s: 'getscripts()', r: '{Instance}', k: 'f', d: 'All Scripts, LocalScripts, and ModuleScripts in the DataModel.' },
        { n: 'getloadedmodules', s: 'getloadedmodules()', r: '{Instance}', k: 'f', d: 'Only ModuleScripts that have been require()d.' },
        { n: 'getrunningscripts', s: 'getrunningscripts()', r: '{Instance}', k: 'f', d: 'Scripts whose top-level thread is still alive.' },
        { n: 'getsenv', s: 'getsenv(script: Instance)', r: 'table', k: 'f', d: 'The environment table of a Script/LocalScript.' },
        { n: 'getmenv', s: 'getmenv(module: ModuleScript)', r: 'table', k: 'f', d: 'The environment table of a require()d ModuleScript.' },
        { n: 'decompile', s: 'decompile(script: Instance)', r: 'string', k: 'f', d: 'Best-effort decompilation of a script bytecode.' },
        { n: 'setscriptable', s: 'setscriptable(instance: Instance, property: string, scriptable: boolean)', r: 'boolean', k: 'f', d: 'Flip a property Scriptable flag in-memory. Returns the previous value.' },
        { n: 'isscriptable', s: 'isscriptable(instance: Instance, property: string)', r: 'boolean', k: 'f', d: 'Whether a property is currently marked Scriptable.' },
        { n: 'gethiddenproperty', s: 'gethiddenproperty(instance: Instance, property: string)', r: 'any, boolean', k: 'f', d: 'Read a property regardless of Scriptable flag. Returns (value, isHidden).' },
        { n: 'sethiddenproperty', s: 'sethiddenproperty(instance: Instance, property: string, value: any)', r: 'boolean', k: 'f', d: 'Write a property regardless of Scriptable flag. Handles complex types.' }
      ]
    },
    {
      name: 'Metatable',
      url: 'https://getvelocity.llc/docs/metatable',
      entries: [
        { n: 'getrawmetatable', s: 'getrawmetatable(value: any)', r: 'table?', k: 'f', d: 'Metatable ignoring the __metatable field.' },
        { n: 'setrawmetatable', s: 'setrawmetatable(value: any, mt: table)', r: 'any', k: 'f', d: 'Replace the metatable (bypasses __metatable protection).' },
        { n: 'setreadonly', s: 'setreadonly(t: table, readonly: boolean)', r: '', k: 'f', d: 'Set the readonly flag on a Luau table.' },
        { n: 'isreadonly', s: 'isreadonly(t: table)', r: 'boolean', k: 'f', d: 'Whether the table is currently readonly.' },
        { n: 'makewriteable', s: 'makewriteable(t: table)', r: '', k: 'f', d: 'Shorthand for setreadonly(t, false).' },
        { n: 'makereadonly', s: 'makereadonly(t: table)', r: '', k: 'f', d: 'Shorthand for setreadonly(t, true).' },
        { n: 'getnamecallmethod', s: 'getnamecallmethod()', r: 'string?', k: 'f', d: 'Inside a __namecall handler, the method name being invoked.' },
        { n: 'setnamecallmethod', s: 'setnamecallmethod(name: string)', r: '', k: 'f', d: 'Rewrite the namecall method name.' }
      ]
    },
    {
      name: 'Signal',
      url: 'https://getvelocity.llc/docs/signal',
      entries: [
        { n: 'firesignal', s: 'firesignal(signal: RBXScriptSignal, ...args)', r: '', k: 'f', d: 'Invoke every Connect/Once handler and resume every Wait handler.' },
        { n: 'defersignal', s: 'defersignal(signal: RBXScriptSignal, ...args)', r: '', k: 'f', d: 'Same as firesignal but dispatches via task.defer.' },
        { n: 'replicatesignal', s: 'replicatesignal(signal: RBXScriptSignal, ...args)', r: '', k: 'f', d: 'Fire a signal AND replicate it to the server (for allowlisted events).' },
        { n: 'cansignalreplicate', s: 'cansignalreplicate(signal: RBXScriptSignal)', r: 'boolean', k: 'f', d: 'Whether replicatesignal is allowed on this event.' },
        { n: 'getconnections', s: 'getconnections(signal: RBXScriptSignal)', r: '{Connection}', k: 'f', d: 'All connections on the signal - each exposes Function, Thread, Enabled, ForeignState, plus Fire, Defer, Disconnect, Disable, Enable.' },
        { n: 'fireclickdetector', s: 'fireclickdetector(clickDetector: ClickDetector, distance: number?)', r: '', k: 'f', d: 'Simulate a click at the given distance.' },
        { n: 'fireproximityprompt', s: 'fireproximityprompt(prompt: ProximityPrompt)', r: '', k: 'f', d: 'Trigger a proximity prompt as if the local player held it.' },
        { n: 'getsignalarguments', s: 'getsignalarguments(signal: RBXScriptSignal)', r: '{string}', k: 'f', d: 'Type names of each argument the signal fires with.' },
        { n: 'getsignalargumentsinfo', s: 'getsignalargumentsinfo(signal: RBXScriptSignal)', r: '{{Name, Type}}', k: 'f', d: 'Full argument info - name and type per parameter.' },
        { n: 'getsignalwhitelist', s: 'getsignalwhitelist()', r: '{{Event, Parent}}', k: 'f', d: 'Events on which replicatesignal is permitted.' },
        { n: 'new', s: 'Signal.new()', r: 'Signal', k: 'c', d: 'Creates a fresh userland signal object.', p: 'Signal' },
        { n: 'Connect', s: 'sig:Connect(handler: function)', r: 'Connection', k: 'm', d: 'Register a handler. Returns a Connection with :Disconnect().', p: 'Signal' },
        { n: 'Once', s: 'sig:Once(handler: function)', r: 'Connection', k: 'm', d: 'Register a one-shot handler - auto-disconnects after the first Fire.', p: 'Signal' },
        { n: 'Wait', s: 'sig:Wait()', r: '...', k: 'm', d: 'Yield until the next Fire; returns its args.', p: 'Signal' },
        { n: 'Fire', s: 'sig:Fire(...args)', r: '', k: 'm', d: 'Dispatch to every connected handler and resume every waiting thread.', p: 'Signal' },
        { n: 'Disconnect', s: 'conn:Disconnect()', r: '', k: 'm', d: 'Release the callback ref and unlink from the parent signal.', p: 'Connection' }
      ]
    },
    {
      name: 'Actor',
      url: 'https://getvelocity.llc/docs/actor',
      entries: [
        { n: 'getactors', s: 'getactors()', r: '{Instance}', k: 'f', d: 'All Actor Instances that currently have a live Lua VM.', a: ['get_actors'] },
        { n: 'getactorthreads', s: 'getactorthreads()', r: '{thread}', k: 'f', d: 'Mainthreads of every live Actor VM. Do not resume or xmove them.', a: ['get_actor_threads'] },
        { n: 'isparallel', s: 'isparallel()', r: 'boolean', k: 'f', d: 'true if the current thread is running in a desynchronized (parallel) state.', a: ['checkparallel', 'inparallel'] },
        { n: 'run_on_actor', s: 'run_on_actor(actor: Instance, source: string, ...args)', r: '', k: 'f', d: 'Compile and run a script on the target Actor VM. Args are deep-marshaled.', a: ['runonactor'] },
        { n: 'run_on_thread', s: 'run_on_thread(thread: thread, source: string, ...args)', r: '', k: 'f', d: 'Same dispatch semantics as run_on_actor but takes a raw actor-mainthread pointer.', a: ['runonthread'] },
        { n: 'create_comm_channel', s: 'create_comm_channel()', r: 'number, BindableEvent', k: 'f', d: 'Allocate a new comm channel. Returns (id, event); the id is portable across VMs.' },
        { n: 'get_comm_channel', s: 'get_comm_channel(id: number)', r: 'BindableEvent?', k: 'f', d: 'Resolve a channel id to its BindableEvent on the caller VM.' }
      ]
    },
    {
      name: 'Garbage collector',
      url: 'https://getvelocity.llc/docs/gc',
      entries: [
        { n: 'getgc', s: 'getgc(includeTables: boolean?)', r: '{any}', k: 'f', d: 'Every live collectable value on the heap. Passing true includes tables.' },
        { n: 'filtergc', s: 'filtergc(kind: "function" | "table", filter: table, findFirst: boolean?)', r: 'any | {any}', k: 'f', d: 'Filter GC objects by predicate (Name, IgnoreExecutor, Constants, Upvalues, Hash for functions; Keys, Values, KeyValuePairs, Metatable for tables).' }
      ]
    },
    {
      name: 'Crypt',
      url: 'https://getvelocity.llc/docs/crypt',
      entries: [
        { n: 'random', s: 'crypt.random(size: number)', r: 'string', k: 'f', d: 'Cryptographically-random bytes via BCryptGenRandom.', p: 'crypt' },
        { n: 'generatebytes', s: 'crypt.generatebytes(size: number)', r: 'string', k: 'f', d: 'Random bytes returned as base64.', p: 'crypt' },
        { n: 'generatekey', s: 'crypt.generatekey()', r: 'string', k: 'f', d: '32-byte base64-encoded AES key.', p: 'crypt' },
        { n: 'hash', s: 'crypt.hash(data: string, algorithm: string)', r: 'string', k: 'f', d: 'Hex digest. Algorithms: md5, sha1, sha256, sha384, sha512.', p: 'crypt' },
        { n: 'hmac', s: 'crypt.hmac(data: string, key: string, algorithm: string)', r: 'string', k: 'f', d: 'HMAC hex digest (RFC 2104). Key may be raw or hex.', p: 'crypt' },
        { n: 'encrypt', s: 'crypt.encrypt(data: string, key: string, iv: string?, mode: string?)', r: 'string, string', k: 'f', d: 'AES-256 encrypt. Returns (ciphertext, iv).', p: 'crypt' },
        { n: 'decrypt', s: 'crypt.decrypt(data: string, key: string, iv: string, mode: string?)', r: 'string', k: 'f', d: 'AES-256 decrypt.', p: 'crypt' },
        { n: 'base64encode', s: 'crypt.base64encode(data: string)', r: 'string', k: 'f', d: 'Base64 encode.', p: 'crypt', a: ['base64encode', 'base64_encode'] },
        { n: 'base64decode', s: 'crypt.base64decode(data: string)', r: 'string', k: 'f', d: 'Base64 decode.', p: 'crypt', a: ['base64decode', 'base64_decode'] },
        { n: 'lz4compress', s: 'crypt.lz4compress(data: string)', r: 'string', k: 'f', d: 'LZ4 compress. Also exposed as top-level lz4compress.', p: 'crypt' },
        { n: 'lz4decompress', s: 'crypt.lz4decompress(data: string, decompressedSize: number)', r: 'string', k: 'f', d: 'LZ4 decompress. Also exposed as top-level lz4decompress.', p: 'crypt' }
      ]
    },
    {
      name: 'Bit',
      url: 'https://getvelocity.llc/docs/bit',
      entries: [
        { n: 'band', s: 'bit.band(...ints)', r: 'number', k: 'f', d: 'Bitwise AND of all arguments.', p: 'bit' },
        { n: 'bor', s: 'bit.bor(...ints)', r: 'number', k: 'f', d: 'Bitwise OR.', p: 'bit' },
        { n: 'bxor', s: 'bit.bxor(...ints)', r: 'number', k: 'f', d: 'Bitwise XOR.', p: 'bit' },
        { n: 'bnot', s: 'bit.bnot(x: number)', r: 'number', k: 'f', d: 'Bitwise NOT (32-bit complement).', p: 'bit' },
        { n: 'badd', s: 'bit.badd(a, b)', r: 'number', k: 'f', d: 'Integer add with 32-bit wrap.', p: 'bit' },
        { n: 'bsub', s: 'bit.bsub(a, b)', r: 'number', k: 'f', d: 'Integer subtract with 32-bit wrap.', p: 'bit' },
        { n: 'bmul', s: 'bit.bmul(a, b)', r: 'number', k: 'f', d: 'Integer multiply with 32-bit wrap.', p: 'bit' },
        { n: 'bdiv', s: 'bit.bdiv(a, b)', r: 'number', k: 'f', d: 'Integer divide with 32-bit wrap.', p: 'bit' },
        { n: 'lshift', s: 'bit.lshift(x, n)', r: 'number', k: 'f', d: 'Logical left shift.', p: 'bit' },
        { n: 'rshift', s: 'bit.rshift(x, n)', r: 'number', k: 'f', d: 'Logical right shift.', p: 'bit' },
        { n: 'arshift', s: 'bit.arshift(x, n)', r: 'number', k: 'f', d: 'Arithmetic (signed) right shift.', p: 'bit' },
        { n: 'rol', s: 'bit.rol(x, n)', r: 'number', k: 'f', d: 'Left rotate.', p: 'bit' },
        { n: 'ror', s: 'bit.ror(x, n)', r: 'number', k: 'f', d: 'Right rotate.', p: 'bit' },
        { n: 'tobit', s: 'bit.tobit(x: number)', r: 'number', k: 'f', d: 'Normalize to 32-bit signed int.', p: 'bit' },
        { n: 'tohex', s: 'bit.tohex(x: number, digits: number?)', r: 'string', k: 'f', d: 'Hex string. Negative digits forces uppercase.', p: 'bit' },
        { n: 'bswap', s: 'bit.bswap(x: number)', r: 'number', k: 'f', d: 'Byte-swap a 32-bit int (endianness flip).', p: 'bit' }
      ]
    },
    {
      name: 'HTTP',
      url: 'https://getvelocity.llc/docs/http',
      entries: [
        { n: 'httpget', s: 'httpget(url: string, followRedirects: boolean?)', r: 'string', k: 'f', d: 'GET request. Returns the response body. Yields.' },
        { n: 'httppost', s: 'httppost(url: string, body: string, contentType: string?)', r: 'string', k: 'f', d: 'POST request. Returns the response body. Yields.' },
        { n: 'request', s: 'request(options: table)', r: 'table', k: 'f', d: 'Full request. Options: Url, Method, Headers, Body, Cookies. Response: Success, StatusCode, StatusMessage, Headers, Body. Yields.', a: ['http_request', 'http.request'] }
      ]
    },
    {
      name: 'Input',
      url: 'https://getvelocity.llc/docs/input',
      entries: [
        { n: 'mouse1click', s: 'mouse1click()', r: '', k: 'f', d: 'Left mouse click.' },
        { n: 'mouse1press', s: 'mouse1press()', r: '', k: 'f', d: 'Left mouse button down.' },
        { n: 'mouse1release', s: 'mouse1release()', r: '', k: 'f', d: 'Left mouse button up.' },
        { n: 'mouse2click', s: 'mouse2click()', r: '', k: 'f', d: 'Right mouse click.' },
        { n: 'mouse2press', s: 'mouse2press()', r: '', k: 'f', d: 'Right mouse button down.' },
        { n: 'mouse2release', s: 'mouse2release()', r: '', k: 'f', d: 'Right mouse button up.' },
        { n: 'mousemoveabs', s: 'mousemoveabs(x: number, y: number)', r: '', k: 'f', d: 'Move cursor to absolute screen coords.' },
        { n: 'mousemoverel', s: 'mousemoverel(dx: number, dy: number)', r: '', k: 'f', d: 'Move cursor by relative delta.' },
        { n: 'mousescroll', s: 'mousescroll(delta: number)', r: '', k: 'f', d: 'Scroll the mouse wheel (positive = up).' },
        { n: 'keypress', s: 'keypress(keyCode: number)', r: '', k: 'f', d: 'Press and hold a key.' },
        { n: 'keyrelease', s: 'keyrelease(keyCode: number)', r: '', k: 'f', d: 'Release a key.' },
        { n: 'keyclick', s: 'keyclick(keyCode: number)', r: '', k: 'f', d: 'Press-then-release in one call.', a: ['keytap'] }
      ]
    },
    {
      name: 'Drawing',
      url: 'https://getvelocity.llc/docs/drawing',
      entries: [
        { n: 'new', s: 'Drawing.new(type: string)', r: 'DrawObject', k: 'c', d: 'Types: Line, Text, Image, Circle, Square, Triangle, Quad. Supports Visible, ZIndex, Transparency, Color plus type-specific props. Call obj:Remove() to destroy.', p: 'Drawing' },
        { n: 'cleardrawcache', s: 'cleardrawcache()', r: '', k: 'f', d: 'Destroy every drawing object created by the executor.' },
        { n: 'isrenderobj', s: 'isrenderobj(value: any)', r: 'boolean', k: 'f', d: 'true if the value is a Drawing object.' },
        { n: 'getrenderproperty', s: 'getrenderproperty(obj: DrawObject, property: string)', r: 'any', k: 'f', d: 'Generic property read - same as obj[property].' },
        { n: 'setrenderproperty', s: 'setrenderproperty(obj: DrawObject, property: string, value: any)', r: '', k: 'f', d: 'Generic property write.' },
        { n: 'getfpscap', s: 'getfpscap()', r: 'number', k: 'f', d: 'Current FPS cap set on the render loop.' },
        { n: 'setfpscap', s: 'setfpscap(fps: number)', r: '', k: 'f', d: 'Cap the client FPS. 0 = uncapped.' },
        { n: 'Remove', s: 'obj:Remove()', r: '', k: 'm', d: 'Destroy the drawing object.', p: 'DrawObject' }
      ]
    },
    {
      name: 'Window',
      url: 'https://getvelocity.llc/docs/window',
      entries: [
        { n: 'isrbxactive', s: 'isrbxactive()', r: 'boolean', k: 'f', d: 'true if the Roblox window has OS focus.', a: ['isgameactive', 'iswindowactive'] }
      ]
    },
    {
      name: 'Cache',
      url: 'https://getvelocity.llc/docs/cache',
      entries: [
        { n: 'invalidate', s: 'cache.invalidate(instance: Instance)', r: '', k: 'f', d: 'Drop the Instance from Roblox userdata cache - next reference creates a fresh userdata.', p: 'cache' },
        { n: 'iscached', s: 'cache.iscached(instance: Instance)', r: 'boolean', k: 'f', d: 'Whether the Instance has an entry in the userdata cache.', p: 'cache' },
        { n: 'replace', s: 'cache.replace(oldInstance: Instance, newInstance: Instance)', r: '', k: 'f', d: 'Point the cache slot for oldInstance at newInstance.', p: 'cache' }
      ]
    },
    {
      name: 'Compression',
      url: 'https://getvelocity.llc/docs/compression',
      entries: [
        { n: 'lz4compress', s: 'lz4compress(data: string)', r: 'string', k: 'f', d: 'LZ4 block-compress a string.' },
        { n: 'lz4decompress', s: 'lz4decompress(data: string, decompressedSize: number)', r: 'string', k: 'f', d: 'LZ4 block-decompress. Requires the original uncompressed length.' }
      ]
    },
    {
      name: 'RakNet',
      url: 'https://getvelocity.llc/docs/raknet',
      entries: [
        { n: 'add_send_hook', s: 'raknet.add_send_hook(callback: function)', r: '', k: 'f', d: 'Register an outgoing packet callback. Send hooks stack in registration order.', p: 'raknet' },
        { n: 'remove_send_hook', s: 'raknet.remove_send_hook(callback: function)', r: '', k: 'f', d: 'Remove the first registration matching this function value.', p: 'raknet' },
        { n: 'add_receive_hook', s: 'raknet.add_receive_hook(callback: function)', r: '', k: 'f', d: 'Set the single incoming packet callback. Calling again REPLACES the previous one.', p: 'raknet' },
        { n: 'remove_receive_hook', s: 'raknet.remove_receive_hook()', r: '', k: 'f', d: 'Clear the incoming callback slot.', p: 'raknet' },
        { n: 'send', s: 'raknet.send(data: buffer | string | {number}, priority: number?, reliability: number?, ordering_channel: number?)', r: '', k: 'f', d: 'Send a custom packet. Defaults priority=1, reliability=3, channel=0.', p: 'raknet' },
        { n: 'hooked', s: 'raknet.hooked()', r: 'boolean', k: 'f', d: 'Whether both RakPeer and ClientReplicator hooks are active (auto-installs if needed).', p: 'raknet' },
        { n: 'is_enabled', s: 'raknet.is_enabled()', r: 'boolean', k: 'f', d: 'Alias of hooked() without the auto-install side effect.', p: 'raknet' },
        { n: 'stats', s: 'raknet.stats()', r: 'table', k: 'f', d: 'Snapshot of transport, capture, rule, and blocking counters.', p: 'raknet' },
        { n: 'clear', s: 'raknet.clear()', r: '', k: 'f', d: 'Wipe every patch rule, blocked id, desync flag, and counters. Callbacks stay.', p: 'raknet' },
        { n: 'desync', s: 'raknet.desync(enabled: boolean)', r: 'boolean', k: 'f', d: 'Toggle outgoing physics-replication suppression. Always restore after a bounded test.', p: 'raknet' },
        { n: 'set', s: 'raknet.set(packetId: number, value: number, start: number?, stop: number?)', r: '', k: 'f', d: 'Byte-patching rule: set range [start, stop) after the id byte to value. Defaults start=0, stop=5.', p: 'raknet' },
        { n: 'toggle', s: 'raknet.toggle(packetId: number, enabled: boolean)', r: '', k: 'f', d: 'Disable / re-enable an existing rule without removing it.', p: 'raknet' },
        { n: 'remove', s: 'raknet.remove(packetId: number)', r: '', k: 'f', d: 'Delete the rule for this packet id.', p: 'raknet' },
        { n: 'block', s: 'raknet.block(packetId: number, enabled: boolean?)', r: 'boolean', k: 'f', d: 'Block or unblock all outgoing packets with this leading byte. enabled defaults to true.', p: 'raknet' },
        { n: 'unblock', s: 'raknet.unblock(packetId: number)', r: '', k: 'f', d: 'Stop blocking this packet id - shorthand for raknet.block(id, false).', p: 'raknet' },
        { n: 'SetData', s: 'packet:SetData(data: buffer | string | {number})', r: '', k: 'm', d: 'Replace the outbound payload. Only affects packets originated by raknet.send.', p: 'RakNetPacket' },
        { n: 'Block', s: 'packet:Block()', r: '', k: 'm', d: 'Drop this packet before it is transmitted.', p: 'RakNetPacket' },
        { n: 'Direction', s: 'packet.Direction', r: 'string', k: 'p', d: 'Outgoing or Incoming.', p: 'RakNetPacket' },
        { n: 'PacketId', s: 'packet.PacketId', r: 'number', k: 'p', d: 'First payload byte - the RakNet MessageID (e.g. 0x83 = ID_DATA).', p: 'RakNetPacket' },
        { n: 'ItemId', s: 'packet.ItemId', r: 'number', k: 'p', d: 'Second payload byte, or 0 when absent.', p: 'RakNetPacket' },
        { n: 'Priority', s: 'packet.Priority', r: 'number', k: 'p', d: 'RakNet send priority: 0 Immediate, 1 High, 2 Medium, 3 Low.', p: 'RakNetPacket' },
        { n: 'Reliability', s: 'packet.Reliability', r: 'number', k: 'p', d: 'RakNet reliability mode (0-7). 3 = reliable ordered.', p: 'RakNetPacket' },
        { n: 'OrderingChannel', s: 'packet.OrderingChannel', r: 'number', k: 'p', d: 'Ordering channel (0-31).', p: 'RakNetPacket' },
        { n: 'Size', s: 'packet.Size', r: 'number', k: 'p', d: 'Original payload length in bytes (before any snapshot truncation).', p: 'RakNetPacket' },
        { n: 'CapturedSize', s: 'packet.CapturedSize', r: 'number', k: 'p', d: 'Number of payload bytes stored in the snapshot (<= 4096).', p: 'RakNetPacket' },
        { n: 'Truncated', s: 'packet.Truncated', r: 'boolean', k: 'p', d: 'true when the snapshot is shorter than the on-wire payload.', p: 'RakNetPacket' },
        { n: 'Sequence', s: 'packet.Sequence', r: 'number', k: 'p', d: 'Monotonic capture id assigned per snapshot.', p: 'RakNetPacket' },
        { n: 'Timestamp', s: 'packet.Timestamp', r: 'number', k: 'p', d: 'Capture time in milliseconds (GetTickCount64).', p: 'RakNetPacket' },
        { n: 'Data', s: 'packet.Data', r: 'string', k: 'p', d: 'Alias of AsString - captured payload bytes as a binary string.', p: 'RakNetPacket' },
        { n: 'AsString', s: 'packet.AsString', r: 'string', k: 'p', d: 'Captured payload bytes as a binary-safe string.', p: 'RakNetPacket' },
        { n: 'AsBuffer', s: 'packet.AsBuffer', r: 'buffer', k: 'p', d: 'Captured payload bytes as a Luau buffer.', p: 'RakNetPacket' },
        { n: 'AsArray', s: 'packet.AsArray', r: '{number}', k: 'p', d: 'Captured payload as an array of unsigned bytes (0-255, 1-indexed).', p: 'RakNetPacket' },
        { n: 'Modified', s: 'packet.Modified', r: 'boolean', k: 'p', d: 'true if SetData was called on this packet object.', p: 'RakNetPacket' },
        { n: 'Blocked', s: 'packet.Blocked', r: 'boolean', k: 'p', d: 'true if Block was called on this packet object.', p: 'RakNetPacket' }
      ]
    },
    {
      name: 'WebSocket',
      url: 'https://getvelocity.llc/docs/websocket',
      entries: [
        { n: 'connect', s: 'WebSocket.connect(url: string)', r: 'WebSocket', k: 'c', d: 'Open a WebSocket connection. URL must start with ws:// or wss://. Yields.', p: 'WebSocket', a: ['WebSocket.new', 'WebSocket.Connect'] },
        { n: 'Send', s: 'ws:Send(message: string)', r: '', k: 'm', d: 'Send a message frame to the server.', p: 'WebSocket' },
        { n: 'Close', s: 'ws:Close()', r: '', k: 'm', d: 'Close the connection.', p: 'WebSocket' },
        { n: 'OnMessage', s: 'ws.OnMessage', r: 'RBXScriptSignal', k: 'g', d: 'Fires with each inbound message.', p: 'WebSocket' },
        { n: 'OnClose', s: 'ws.OnClose', r: 'RBXScriptSignal', k: 'g', d: 'Fires once when the connection closes.', p: 'WebSocket' }
      ]
    },
    {
      name: 'One-target hooking (OTH)',
      url: 'https://getvelocity.llc/docs/oth-hook',
      entries: [
        { n: 'hook', s: 'oth.hook(target: function, hook: function)', r: 'function', k: 'f', d: 'Install a hook on a C closure. Multiple hooks can stack. Returns a callable that dispatches to the next hook in the chain.', p: 'oth' },
        { n: 'unhook', s: 'oth.unhook(target: function, hook: function)', r: 'boolean', k: 'f', d: 'Remove a specific hook. true if it was found and removed.', p: 'oth' },
        { n: 'restore', s: 'oth.restore(target: function)', r: 'boolean', k: 'f', d: 'Drop every hook on the target and restore its original C function.', p: 'oth' },
        { n: 'ishooked', s: 'oth.ishooked(target: function)', r: 'boolean', k: 'f', d: 'true if the target currently has any OTH hooks installed.', p: 'oth' },
        { n: 'get_root_callback', s: 'oth.get_root_callback(target: function)', r: 'function?', k: 'f', d: 'Returns a wrapper that calls the target original (pre-hook) C function directly.', p: 'oth' }
      ]
    },
    {
      name: 'Luau / Roblox',
      url: '',
      entries: [
        { n: 'game', s: 'game: DataModel', r: 'DataModel', k: 't', d: 'The DataModel - root of the Instance tree.' },
        { n: 'workspace', s: 'workspace: Workspace', r: 'Workspace', k: 't', d: 'Shortcut to game.Workspace.' },
        { n: 'script', s: 'script: LuaSourceContainer', r: 'Instance', k: 't', d: 'The script the current code belongs to.' },
        { n: 'shared', s: 'shared: table', r: 'table', k: 't', d: 'Shared table persisted for the executor session.' },
        { n: '_G', s: '_G: table', r: 'table', k: 't', d: 'Global environment table.' },
        { n: 'task', s: 'task', r: 'table', k: 't', d: 'Luau task scheduler: spawn, defer, delay, wait, synchronize, desynchronize.' },
        { n: 'Instance', s: 'Instance.new(className: string, parent: Instance?)', r: 'Instance', k: 't', d: 'Creates an Instance.' },
        { n: 'Vector2', s: 'Vector2.new(x: number, y: number)', r: 'Vector2', k: 't', d: '2D vector.' },
        { n: 'Vector3', s: 'Vector3.new(x: number, y: number, z: number)', r: 'Vector3', k: 't', d: '3D vector.' },
        { n: 'CFrame', s: 'CFrame.new(...)', r: 'CFrame', k: 't', d: 'Coordinate frame (position + rotation).' },
        { n: 'Color3', s: 'Color3.new(r: number, g: number, b: number)', r: 'Color3', k: 't', d: 'RGB color, components 0-1. Also Color3.fromRGB / fromHSV.' },
        { n: 'UDim', s: 'UDim.new(scale: number, offset: number)', r: 'UDim', k: 't', d: 'Scale/offset dimension.' },
        { n: 'UDim2', s: 'UDim2.new(xS, xO, yS, yO)', r: 'UDim2', k: 't', d: '2D scale/offset dimension. Also UDim2.fromScale / fromOffset.' },
        { n: 'Enum', s: 'Enum.Item', r: 'Enum', k: 't', d: 'Roblox Enum accessor.' },
        { n: 'Random', s: 'Random.new(seed: number?)', r: 'Random', k: 't', d: 'Deterministic RNG object.' },
        { n: 'TweenInfo', s: 'TweenInfo.new(time, style, direction, repeatCount, reverses, delayTime)', r: 'TweenInfo', k: 't', d: 'Describes a tween.' },
        { n: 'typeof', s: 'typeof(value: any)', r: 'string', k: 'f', d: 'Returns the Roblox type name of a value.' },
        { n: 'warn', s: 'warn(...)', r: '', k: 'f', d: 'Print to the output as a warning.' },
        { n: 'require', s: 'require(module: ModuleScript)', r: 'any', k: 'f', d: 'Runs a ModuleScript and returns its value.' },
        { n: 'wait', s: 'wait(seconds: number?)', r: 'number', k: 'f', d: 'Yields for the given time (legacy).' },
        { n: 'spawn', s: 'spawn(f: function)', r: 'thread', k: 'f', d: 'Legacy task spawn.' },
        { n: 'delay', s: 'delay(seconds: number, f: function)', r: '', k: 'f', d: 'Legacy delayed call.' }
      ]
    }
  ];

  window.VELOCITY_API = {
    version: '1.3.6',
    source: 'https://getvelocity.llc/docs',
    sections: sections
  };
})();
