// Exo Client UI.
// Pure front-end: talks to the native host over the WebView2 message bridge.
// The host runs a standalone Luau VM; scripts execute locally.
(function () {
  'use strict';

  // ---------------------------------------------------------------------
  // Bridge
  // ---------------------------------------------------------------------
  var webview = (window.chrome && window.chrome.webview) || null;

  function send(obj) {
    if (webview) webview.postMessage(JSON.stringify(obj));
  }

  function b64encode(str) {
    var bytes = new TextEncoder().encode(str);
    var bin = '';
    for (var i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin);
  }

  function b64decode(b64) {
    var bin = atob(b64);
    var bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  }

  function baseName(p) {
    return p ? p.replace(/^.*[\\/]/, '') : '';
  }

  // ---------------------------------------------------------------------
  // State + console
  // ---------------------------------------------------------------------
  var state = { vmReady: false, name: 'untitled.lua', path: null };

  var consoleEl = document.getElementById('console');
  var consoleLines = 0;

  function log(level, text) {
    var line = document.createElement('div');
    line.className = 'line ' + (level || 'info');
    var ts = document.createElement('span');
    ts.className = 'ts';
    ts.textContent = new Date().toLocaleTimeString();
    line.appendChild(ts);
    line.appendChild(document.createTextNode(text));
    consoleEl.appendChild(line);
    if (++consoleLines > 500) {
      consoleEl.removeChild(consoleEl.firstChild);
      consoleLines--;
    }
    consoleEl.scrollTop = consoleEl.scrollHeight;
  }

  var statusEl = document.getElementById('status-text');

  function setStatus(level, text) {
    statusEl.className = 'status' + (level ? ' ' + level : '');
    statusEl.textContent = text || '\u2014';
    statusEl.title = text || '';
  }

  function renderStatus() {
    if (state.vmReady) setStatus('ok', 'VM ready');
    else setStatus('', 'VM offline');
  }

  function setFileName() {
    document.getElementById('file-name').textContent = state.name || 'untitled.lua';
  }

  // ---------------------------------------------------------------------
  // Purple rain
  // ---------------------------------------------------------------------
  // Quiet ambient drizzle: thin vertical streaks, 2-3px wide, 10-40% opacity,
  // colors between #7B2FF7 and #C17AFF, drifting at varied speeds.
  function startRain() {
    var canvas = document.getElementById('rain');
    var ctx = canvas.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = 0, h = 0;
    var streaks = [];

    function rand(a, b) { return a + Math.random() * (b - a); }

    function makeStreak(initial) {
      return {
        x: Math.random() * w,
        y: initial ? Math.random() * h : rand(-h * 0.5, -20),
        len: rand(18, 70),
        width: rand(2, 3),
        speed: rand(18, 55),        // px per second — slow, calm
        alpha: rand(0.10, 0.40),
        hue: rand(0, 1)
      };
    }

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var count = Math.max(24, Math.round(w / 14));
      streaks = [];
      for (var i = 0; i < count; i++) streaks.push(makeStreak(true));
    }

    function color(hue, alpha) {
      var r = Math.round(123 + (193 - 123) * hue);
      var g = Math.round(47 + (122 - 47) * hue);
      var b = Math.round(247 + (255 - 247) * hue);
      return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha.toFixed(3) + ')';
    }

    var last = 0;
    function frame(t) {
      if (!last) last = t;
      var dt = Math.min(0.05, (t - last) / 1000);
      last = t;

      ctx.clearRect(0, 0, w, h);

      for (var i = 0; i < streaks.length; i++) {
        var s = streaks[i];
        ctx.fillStyle = color(s.hue, s.alpha);
        ctx.fillRect(s.x, s.y, s.width, s.len);
        s.y += s.speed * dt;
        if (s.y > h + s.len) streaks[i] = makeStreak(false);
      }
      requestAnimationFrame(frame);
    }

    window.addEventListener('resize', resize);
    resize();
    requestAnimationFrame(frame);
  }

  // ---------------------------------------------------------------------
  // Monaco
  // ---------------------------------------------------------------------
  var editor = null;
  var strings = [];

  function parseParams(sig) {
    var open = sig.indexOf('(');
    var close = sig.lastIndexOf(')');
    if (open < 0 || close <= open) return [];
    var inner = sig.slice(open + 1, close).trim();
    if (!inner) return [];
    var parts = [], depth = 0, cur = '';
    for (var i = 0; i < inner.length; i++) {
      var ch = inner[i];
      if (ch === '{' || ch === '(') depth++;
      else if (ch === '}' || ch === ')') depth--;
      if (ch === ',' && depth === 0) { parts.push(cur); cur = ''; }
      else cur += ch;
    }
    if (cur.trim()) parts.push(cur);
    return parts.map(function (p) {
      var t = p.trim();
      var name = t.split(':')[0].replace(/\?/g, '').trim();
      if (!name || name === '...') return '...';
      return name;
    });
  }

  function snippetFor(name, sig, kind) {
    if (kind !== 'f' && kind !== 'c' && kind !== 'm') return name;
    var params = parseParams(sig);
    if (!params.length) return name + '()';
    var ph = params.map(function (p, i) { return '${' + (i + 1) + ':' + p + '}'; });
    return name + '(' + ph.join(', ') + ')';
  }

  function docFor(e) {
    var md = '```lua\n' + e.s + (e.r ? '  --> ' + e.r : '') + '\n```';
    if (e.d) md += '\n\n' + e.d;
    if (e.a && e.a.length) md += '\n\n*Aliases:* `' + e.a.join('`, `') + '`';
    return { value: md };
  }

  function buildCompletions(monaco) {
    var K = monaco.languages.CompletionItemKind;
    var KIND = { f: K.Function, c: K.Constructor, m: K.Method, t: K.Variable, p: K.Property, g: K.Event };

    var globals = [];
    var members = new Map();

    function makeItem(label, e) {
      return {
        label: label,
        kind: KIND[e.k] || K.Function,
        detail: e.r ? e.s + '  \u2192  ' + e.r : e.s,
        documentation: docFor(e),
        insertText: snippetFor(label, e.s, e.k),
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        sortText: (e.k === 't' ? '2' : '1') + label
      };
    }

    function addGlobal(label, e) {
      globals.push(makeItem(label, e));
    }

    function addMember(parent, label, e, plain) {
      var key = parent.toLowerCase();
      if (!members.has(key)) members.set(key, []);
      var item = makeItem(label, e);
      if (plain) item.insertText = label;
      members.get(key).push(item);
    }

    var api = window.VELOCITY_API;
    (api ? api.sections : []).forEach(function (section) {
      section.entries.forEach(function (e) {
        if (e.p) addMember(e.p, e.n, e, false);
        else addGlobal(e.n, e);

        (e.a || []).forEach(function (alias) {
          if (alias.indexOf('.') !== -1) {
            var bits = alias.split('.');
            addMember(bits[0], bits[bits.length - 1], e, true);
          } else {
            addGlobal(alias, e);
          }
        });
      });
    });

    monaco.languages.registerCompletionItemProvider('lua', {
      triggerCharacters: ['.', ':'],
      provideCompletionItems: function (model, position) {
        var line = model.getLineContent(position.lineNumber).slice(0, position.column - 1);
        var member = line.match(/([A-Za-z_][A-Za-z0-9_]*)\s*[.:]\s*([A-Za-z0-9_]*)$/);
        var word = model.getWordUntilPosition(position);
        var range = new monaco.Range(position.lineNumber, word.startColumn,
                                     position.lineNumber, position.column);

        var source;
        if (member) {
          source = members.get(member[1].toLowerCase()) || [];
        } else {
          source = globals;
        }
        return {
          suggestions: source.map(function (item) {
            var clone = Object.create(item);
            clone.range = range;
            return clone;
          })
        };
      }
    });

    strings = globals.length;
  }

  function defineTheme(monaco) {
    monaco.editor.defineTheme('velocity-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6d5f96', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'c084fc' },
        { token: 'string', foreground: '9fe8b8' },
        { token: 'number', foreground: 'f0a6ff' },
        { token: 'delimiter', foreground: '8b7fc0' },
        { token: 'identifier', foreground: 'ece7f7' }
      ],
      colors: {
        'editor.background': '#17171C',
        'editor.foreground': '#E8E6ED',
        'editorLineNumber.foreground': '#4A4658',
        'editorLineNumber.activeForeground': '#C17AFF',
        'editor.selectionBackground': '#2E1A47',
        'editor.inactiveSelectionBackground': '#241634',
        'editorCursor.foreground': '#C17AFF',
        'editor.lineHighlightBackground': '#1C1C23',
        'editorGutter.background': '#17171C',
        'editorWidget.background': '#1A1A20',
        'editorWidget.border': '#2E1A47',
        'editorSuggestWidget.background': '#1A1A20',
        'editorSuggestWidget.border': '#2E1A47',
        'editorSuggestWidget.selectedBackground': '#2E1A47',
        'editorSuggestWidget.highlightForeground': '#C17AFF',
        'editorIndentGuide.background1': '#241A33',
        'editorIndentGuide.activeBackground1': '#3A2A63',
        'scrollbarSlider.background': '#2E1A4799',
        'scrollbarSlider.hoverBackground': '#7B2FF799'
      }
    });
  }

  // ---------------------------------------------------------------------
  // Actions
  // ---------------------------------------------------------------------
  function doExecute() {
    if (!editor) return;
    var code = editor.getValue();
    if (!code.trim()) { log('warn', 'Editor is empty.'); return; }
    send({ cmd: 'execute', data: b64encode(code) });
  }

  function doReloadVm() {
    send({ cmd: 'reloadvm' });
    log('info', 'Reloading the Luau VM...');
  }

  function doOpen() { send({ cmd: 'open' }); }

  function doSave() {
    if (!editor) return;
    send({ cmd: 'save', data: b64encode(editor.getValue()), name: state.name });
  }

  function doSaveToLibrary() {
    if (!editor) return;
    send({ cmd: 'save', data: b64encode(editor.getValue()), name: state.name, library: true });
  }

  function doNew() {
    if (!editor) return;
    editor.setValue('-- New script\n\n');
    state.name = 'untitled.lua';
    state.path = null;
    setFileName();
  }

  function renderLibrary(items) {
    var lib = document.getElementById('library');
    lib.innerHTML = '';
    if (!items || !items.length) {
      var empty = document.createElement('div');
      empty.className = 'empty';
      empty.innerHTML = 'No scripts yet.<br>Write one and use <b>Save to library</b>.';
      lib.appendChild(empty);
      return;
    }
    items.forEach(function (item) {
      var card = document.createElement('div');
      card.className = 'card';

      var main = document.createElement('div');
      main.className = 'card-main';
      var nm = document.createElement('div');
      nm.className = 'card-name';
      nm.textContent = item.name || item.file;
      var ds = document.createElement('div');
      ds.className = 'card-desc';
      ds.textContent = item.desc || item.file;
      main.appendChild(nm);
      main.appendChild(ds);
      main.addEventListener('click', function () {
        send({ cmd: 'openScript', file: item.file, library: true });
      });

      var run = document.createElement('button');
      run.className = 'card-run';
      run.title = 'Execute ' + (item.name || item.file);
      run.textContent = '\u25B6';
      run.addEventListener('click', function (ev) {
        ev.stopPropagation();
        send({ cmd: 'runScript', file: item.file });
      });

      card.appendChild(main);
      card.appendChild(run);
      lib.appendChild(card);
    });
  }

  function onHostMessage(data) {
    var msg = data;
    if (typeof msg === 'string') {
      try { msg = JSON.parse(msg); } catch (e) { return; }
    }
    if (!msg || !msg.type) return;

    switch (msg.type) {
      case 'status':
        log(msg.level || 'info', msg.text || '');
        setStatus(msg.level || 'info', msg.text || '');
        break;
      case 'console':
        log(msg.level || 'info', msg.text || '');
        break;
      case 'state':
        state.vmReady = !!msg.vmReady;
        renderStatus();
        break;
      case 'fileContent':
        if (editor) {
          editor.setValue(b64decode(msg.data || ''));
          state.name = msg.name || 'untitled.lua';
          state.path = msg.path || null;
          setFileName();
          log('info', 'Loaded ' + state.name);
        }
        break;
      case 'saved':
        state.path = msg.path || null;
        state.name = baseName(msg.path) || state.name;
        setFileName();
        break;
      case 'scripts':
        renderLibrary(msg.items || []);
        break;
    }
  }

  // ---------------------------------------------------------------------
  // Boot
  // ---------------------------------------------------------------------
  function on(id, fn) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('click', fn);
  }

  function wireUi() {
    var dragBar = document.querySelector('.title-drag');
    if (dragBar) {
      dragBar.addEventListener('pointerdown', function (e) {
        if (e.button !== 0) return;
        if (e.target && e.target.closest && e.target.closest('.win-controls')) return;
        try { dragBar.setPointerCapture(e.pointerId); } catch (ignored) {}
        e.preventDefault();
        send({ cmd: 'dragstart' });
      });
      window.addEventListener('pointerup', function () { send({ cmd: 'dragend' }); });
      window.addEventListener('pointercancel', function () { send({ cmd: 'dragend' }); });
      window.addEventListener('blur', function () { send({ cmd: 'dragend' }); });
    }
    on('win-min', function () { send({ cmd: 'minimize' }); });
    on('win-close', function () { send({ cmd: 'close' }); });
    on('btn-reload', doReloadVm);
    on('btn-execute', doExecute);
    on('btn-new', doNew);
    on('btn-open', doOpen);
    on('btn-save', doSave);
    on('btn-save-lib', doSaveToLibrary);
    on('btn-hub', function () {
      document.getElementById('sidebar').classList.toggle('open');
    });
    on('btn-clear-console', function () {
      consoleEl.innerHTML = '';
      consoleLines = 0;
    });
    on('btn-refresh-scripts', function () { send({ cmd: 'refreshScripts' }); });
    on('btn-open-folder', function () { send({ cmd: 'openScriptsFolder' }); });

    if (webview) {
      webview.addEventListener('message', function (ev) { onHostMessage(ev.data); });
    } else {
      log('warn', 'Native bridge unavailable (running outside the host).');
    }
  }

  function boot() {
    startRain();
    wireUi();

    if (typeof require !== 'function') {
      log('error', 'Monaco loader failed to load.');
      return;
    }

    require.config({ paths: { vs: 'vs' } });
    require(['vs/editor/editor.main', 'vs/basic-languages/monaco.contribution'],
      function (monaco) {
        defineTheme(monaco);
        buildCompletions(monaco);

        editor = monaco.editor.create(document.getElementById('editor'), {
          value: [
            '-- Exo Client - standalone Luau VM',
            '-- Ctrl+Space browses the API; Ctrl+Enter runs the script.',
            '',
            'local name, version = identifyexecutor()',
            'print(("running %s %s"):format(name, version))',
            '',
            'writefile("hello.txt", "hello from Exo Client")',
            'print("wrote hello.txt:", isfile("hello.txt"))',
            ''
          ].join('\n'),
          language: 'lua',
          theme: 'velocity-dark',
          automaticLayout: true,
          fontFamily: "'JetBrains Mono', 'Cascadia Code', Consolas, monospace",
          fontSize: 12,
          fontLigatures: true,
          lineHeight: 18,
          letterSpacing: 0.2,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          renderLineHighlight: 'all',
          roundedSelection: true,
          padding: { top: 14, bottom: 14 },
          tabSize: 4,
          insertSpaces: true,
          bracketPairColorization: { enabled: true },
          suggest: { showWords: false, showSnippets: false },
          quickSuggestions: { other: true, comments: false, strings: false }
        });

        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, doExecute);

        setFileName();
        renderStatus();
        log('info', 'Exo Client loaded \u2014 ' + strings + ' API completions ready.');

        // Tell the native host we're live; it replies with state + scripts.
        send({ cmd: 'ready' });
      },
      function (err) {
        log('error', 'Failed to load Monaco editor: ' + err);
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
