<div align="center">
  <img src="https://i.imgur.com/IyzLh8q.png" alt="Exo Client" width="800"/>
</div>

<p align="center">
  <img alt="Version" src="https://img.shields.io/github/v/release/potatos1233/Exo-Client?include_prereleases" />
  <a href="https://github.com/potatos1233/Exo-Client/commits/main" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/github/last-commit/potatos1233/Exo-Client" />
  </a>
  <a href="https://github.com/potatos1233/Exo-Client/blob/main/LICENSE" target="_blank">
    <img alt="License: GPL--3.0" src="https://img.shields.io/github/license/potatos1233/Exo-Client" />
  </a>
</p>


A standalone, **external** Luau executor for Windows. It is a C++ Win32 host
that embeds a WebView2 window, serves a local Monaco editor UI, and runs scripts
in a real Luau VM **inside its own process**. It does not inject into, attach to,
or depend on any game process.

Nothing here is a mock. The buttons do real work:

- **Execute** compiles the editor contents with the real Luau compiler and runs
  them on an in-process Luau state; `print`/`warn` output streams to the console.
- **Reload VM** destroys and rebuilds the Luau state.
- **Open / Save** use the native Windows `IFileOpenDialog` / `IFileSaveDialog`.
- **Hub** toggles the script library; items are read from real `.lua` files in
  `scripts\` and run with one click.

## Engine

The execution engine is `src\vm.cpp`. It links the vendored Luau statically and
implements the executor API directly:

- `identifyexecutor`, `getexecutorname`, `getexecutorversion`
- `getgenv`, `getrenv`
- file API rooted at `workspace\`: `readfile`, `writefile`, `appendfile`,
  `isfile`, `isfolder`, `makefolder`, `delfile`, `delfolder`, `listfiles`,
  `loadfile`
- `base64.encode` / `base64.decode` (and `base64_encode` / `base64_decode`)
- `print` / `warn` captured to the console
- an `Exo` table (`Exo.name`, `Exo.version`)

Scripts run on a coroutine with an 8-second wall-clock limit enforced by a VM
interrupt, so a runaway loop can't hang the client. Compile and runtime errors
are reported verbatim.

## Layout

```
velocity-executor\
  src\                host application (Velocity.exe)
    main.cpp            window, WebView2 host, JS bridge
    vm.*                in-process Luau VM + Exo API surface
    file_io.*           native file dialogs + read/write
    util.*              string / JSON / base64 helpers
  ui\                 editor UI served to WebView2
    index.html, app.css, app.js
    velocity-api.js     full API completion database
    vs\                 Monaco 0.57.0 (AMD build)
  scripts\            bundled library scripts (*.lua)
  vendor\
    luau\               vendored Luau SDK (headers + /MT static libs)
    webview2\           WebView2 SDK
  _legacy\            retired injection/pipe/module code (not built)
  build.bat           locates MSVC, builds the host
  build_luau*.bat     reference scripts used to build the vendored Luau libs
  setup.ps1           fetches the WebView2 SDK + Monaco
```

## Build

```
build.bat
```

Produces `Velocity.exe` in the project root. `build.bat` finds the MSVC
toolchain itself via `vswhere.exe` and calls `vcvars64.bat`, so you can run it
from any shell. It expects `vendor\webview2` and `vendor\luau` to be present.

The vendored Luau libs are built `/MT` to match the host's static CRT. The
reference scripts (`build_luau.bat`, `build_luau_mt.bat`) rebuild them from a
`luau-lang/luau` checkout.

> `velocity_mod.dll` (the legacy injected companion) is **not** part of the
> external client and is not built by `build.bat`.

## Run

Launch `Velocity.exe`, write a script, and press **Execute** (or `Ctrl+Enter`).

## Package / distribute

The app is a folder-based executable: the `.exe` loads `ui\` and `scripts\` from
the folder it sits in. To ship it, copy the executable (rename it to
`ExoClient.exe` if you like) alongside the `ui\` and `scripts\` folders. The
runtime creates `runtime\` (WebView2 user data) and `workspace\` (script file
API root) next to the exe on first launch, so those folders don't need to ship.

## Autocomplete

`ui\velocity-api.js` is the API surface completion database (23 libraries, 206
completions). It feeds a Monaco `CompletionItemProvider` for Lua:

- Type a **namespace** (`crypt.`, `bit.`, `raknet.`, `Drawing.`, `WebSocket.`,
  `debug.`, ...) to get its members with signatures.
- Type the start of a **global** (`get`, `fire`, `read`) for functions and
  aliases.
- Every entry carries its real signature, return type and description.
- Snippets insert parameter placeholders (`readfile(${1:path})`).

Only the subset listed under **Engine** is implemented by the VM today; the
completion database documents the wider API surface.

## Library scripts

Files in `scripts\` are listed in the Hub, parsed from headers:

```lua
-- @name: My Script
-- @desc: What it does.
```

Click a card to load it into the editor; press the â–¶ button to execute it
directly.

## Notes

- WebView2 Runtime must be installed (the host shows a clear message if not).
- The editor worker loads from the same origin via a virtual host mapping
  (`https://velocity.app` -> `ui\`), so no external CDN is required.
- `runtime\` is the WebView2 user-data folder, created next to the executable.
- `workspace\` is the sandbox root for the file API, created on first run.
