/* ONX Scaffold core.js — v4.2.0 — 2026-06-10 — LOCKED JS APIs (do not modify) */
// ── Sidebar toggle ──
let sidebarExpanded = true;
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const isMobile = window.innerWidth < 768;
  if (isMobile) {
    const isOpen = sidebar.classList.contains('mobile-open');
    sidebar.classList.toggle('mobile-open', !isOpen);
    document.getElementById('mobile-overlay').classList.toggle('visible', !isOpen);
  } else {
    sidebarExpanded = !sidebarExpanded;
    sidebar.classList.toggle('collapsed', !sidebarExpanded);
    localStorage.setItem('onx-sidebar-collapsed', sidebarExpanded ? '0' : '1');
  }
}
function closeMobileSidebar() {
  document.getElementById('sidebar').classList.remove('mobile-open');
  document.getElementById('mobile-overlay').classList.remove('visible');
}

// ── Artifact panel toggle ──
let artifactOpen = false;
function toggleArtifact() {
  const panel = document.getElementById('artifact-panel');
  const btn = document.getElementById('artifact-toggle-btn');
  artifactOpen = !artifactOpen;
  panel.classList.toggle('hidden-panel', !artifactOpen);
  if (btn) {
    btn.classList.toggle('is-active', artifactOpen);
    btn.setAttribute('title', artifactOpen ? 'Close artefact panel' : 'Open artefact panel');
  }
}

// ── Settings sub-nav panel switcher ──
function showSettingsPanel(panelId, navEl) {
  document.querySelectorAll('#page-settings .settings-nav-item').forEach(el => el.classList.remove('is-active'));
  if (navEl) navEl.classList.add('is-active');
  document.querySelectorAll('#page-settings .settings-panel').forEach(p => {
    p.hidden = (panelId == null) ? true : (p.dataset.panel !== panelId);
  });
}

// ── Page navigation ──
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(a => a.classList.remove('is-active'));
  const page = document.getElementById('page-' + pageId);
  if (page) page.classList.add('active');
  const navItem = document.getElementById('nav-' + pageId);
  if (navItem) navItem.classList.add('is-active');
  if (window.innerWidth < 768) closeMobileSidebar();
  return false;
}

// ── User menu dropdown ──
function toggleUserMenu() {
  const menu = document.getElementById('user-menu');
  menu.classList.toggle('open');
}
document.addEventListener('click', function(e) {
  const menu = document.getElementById('user-menu');
  if (!e.target.closest('.relative') || e.target.closest('#user-menu')) return;
  if (!e.target.closest('button[onclick="toggleUserMenu()"]')) {
    menu.classList.remove('open');
  }
});

// ── Dark mode toggle ──
let darkOn = false;
function toggleDarkMode() {
  darkOn = !darkOn;
  localStorage.setItem('onx-theme', darkOn ? 'dark' : 'light');
  const toggle = document.getElementById('dark-toggle');
  const knob   = document.getElementById('dark-knob');
  toggle.style.backgroundColor = darkOn ? 'var(--onx-teal)' : 'var(--surface-3)';
  knob.style.transform = darkOn ? 'translateX(16px)' : 'translateX(0)';
  document.documentElement.classList.toggle('dark', darkOn);
  // Swap the moon/sun lucide icon
  const iconHost = document.getElementById('dark-icon');
  if (iconHost) {
    const next = document.createElement('i');
    next.id = 'dark-icon';
    next.setAttribute('data-lucide', darkOn ? 'sun' : 'moon');
    next.className = 'icon-md';
    next.style.color = 'var(--text-3)';
    iconHost.replaceWith(next);
    if (window.lucide) lucide.createIcons();
  }
}

// ── Font size preference ──
// Three-layer scaling so it works when the file is opened directly in Chrome:
//   1. CSS variable --fz on :root  → scales all custom px-based classes via calc()
//   2. html font-size              → scales all Tailwind rem-based utilities
//   3. JS inline-style rescaler    → updates the ~34 hardcoded inline font-sizes
// The typewriter greeting is pinned at 32px and excluded from all three layers.
const FONT_SCALE_STEPS = [0.857, 0.929, 1.0, 1.071, 1.143];
const FONT_SIZE_LABELS = ['Smallest', 'Small', 'Default', 'Large', 'Largest'];

let _origInlineFontSizes = null;
function _collectInlineFontSizes() {
  _origInlineFontSizes = [];
  document.querySelectorAll('[style*="font-size"]').forEach(function(el) {
    if (el.classList.contains('typewriter-greeting')) return;
    var m = el.style.fontSize.match(/([\d.]+)px/);
    if (m) _origInlineFontSizes.push({ el: el, origPx: parseFloat(m[1]) });
  });
}

window.applyFontSize = function(step) {
  step = parseInt(step, 10);
  var scale = FONT_SCALE_STEPS[step - 1] || 1;

  // Layer 1 & 2: CSS variable + html font-size
  document.documentElement.style.setProperty('--fz', scale);
  document.documentElement.style.fontSize = (16 * scale) + 'px';

  // Layer 3: inline styles
  if (!_origInlineFontSizes) _collectInlineFontSizes();
  _origInlineFontSizes.forEach(function(item) {
    item.el.style.fontSize = (item.origPx * scale).toFixed(1) + 'px';
  });

  // Pin typewriter to its design size
  document.querySelectorAll('.typewriter-greeting').forEach(function(tw) {
    tw.style.fontSize = '32px';
  });

  var label = document.getElementById('font-size-label');
  if (label) label.textContent = FONT_SIZE_LABELS[step - 1];
  try { localStorage.setItem('onx-font-size', step); } catch(e) {}
};

(function initFontSize() {
  try {
    var saved = parseInt(localStorage.getItem('onx-font-size') || '3', 10);
    var slider = document.getElementById('font-size-slider');
    if (slider) slider.value = saved;
    window.applyFontSize(saved);
  } catch(e) {
    window.applyFontSize(3);
  }
})();

// ── Lucide hydration helper ──
function refreshLucide(root) {
  if (window.lucide) lucide.createIcons(root ? { nameAttr: 'data-lucide' } : undefined);
}

let agentIconSrc = '';

function getAgentIconSrc() {
  if (!agentIconSrc) {
    // Matches the asset path (reference docs) or an inlined data-URI (delivered single-file app).
    const icon = document.querySelector('img.agent-icon-img[src*="onx-agent-icon"], img.agent-icon-img[src^="data:image"]');
    agentIconSrc = icon ? icon.src : '';
  }
  return agentIconSrc;
}

function agentAvatarMarkup(extraClass = '', thinking = false) {
  const cls = `agent-icon-wrap flex-shrink-0 ${extraClass} ${thinking ? 'is-thinking' : ''}`.trim();
  return `
    <span class="${cls}">
      <img src="${getAgentIconSrc()}" alt="AI Agent" class="agent-icon-img" />
    </span>
  `;
}

function userAvatarMarkup() {
  return `<div class="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center text-gray-700" style="font-size:9px;font-weight:700;flex-shrink:0;margin-top:2px">U</div>`;
}

function hydrateAgentAvatars(root = document) {
  const src = getAgentIconSrc();
  if (!src) return;
  root.querySelectorAll('img[data-agent-avatar]').forEach((img) => {
    img.src = src;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  hydrateAgentAvatars();
  showNewChat();
  if (window.lucide) lucide.createIcons();
});

// ── Chat send ──
function sendMessage() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text) return;

  const messages = document.getElementById('chat-messages');

  appendHtml(messages, userTurnMarkup(text, new Date()));
  startTrace(messages);
  messages.scrollTop = messages.scrollHeight;

  input.value = '';
  input.style.height = 'auto';

  // Stream a live activity trace, then collapse it as the answer lands.
  // Delivered apps override these steps with domain-specific calls.
  const steps = [
    'Parsing request and resolving intent…',
    toolCallMarkup({ tag: 'TOOL', body: 'Querying connected data sources' }),
    toolCallMarkup({ tag: 'MCP', body: 'Calling Security Master via MCP gateway' }),
    'Synthesising response…',
  ];
  let i = 0;
  const tick = () => {
    if (i < steps.length) {
      addTraceStep(steps[i++]);
      messages.scrollTop = messages.scrollHeight;
      setTimeout(tick, 360);
      return;
    }
    completeTrace();
    const aiBody = `<p class="text-sm text-gray-800 leading-relaxed">I've received your query. In a live environment, I'd process this in real-time. For now, this is a UI prototype — agent logic is in development.</p>`;
    appendHtml(messages, aiTurnMarkup(aiBody, { date: new Date(), runRef: 'AI Agent' }));
    if (window.lucide) lucide.createIcons();
    messages.scrollTop = messages.scrollHeight;
  };
  setTimeout(tick, 300);
}

// Insert an HTML string as the last child of a container (preserves siblings)
function appendHtml(container, html) {
  const tpl = document.createElement('template');
  tpl.innerHTML = html.trim();
  container.appendChild(tpl.content);
}

function handleEnter(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
}

function escapeHtml(text) {
  return text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ── Audit-trail timestamps (relative-then-absolute) ──
function formatMessageTime(date) {
  const now = new Date();
  const diffSec = Math.floor((now - date) / 1000);
  if (diffSec < 60) return 'just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHr = Math.floor(diffMin / 60);
  const sameDay = date.toDateString() === now.toDateString();
  if (diffHr < 24 && sameDay) return `${diffHr} hr ago`;
  const time = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return `Yesterday ${time}`;
  const monthDay = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  if (date.getFullYear() === now.getFullYear()) return `${monthDay} ${time}`;
  return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatLedgerTooltip(date, runRef) {
  const pad = n => String(n).padStart(2, '0');
  const d = `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}`;
  const t = `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  return `${d} ${t} UTC${runRef ? ` · ${runRef}` : ''}`;
}

function bubbleActionsMarkup({ side, date, runRef, withCite }) {
  const time = date || new Date();
  const label = formatMessageTime(time);
  const tooltip = formatLedgerTooltip(time, runRef);
  const timeSpan = `<span class="bubble-actions-time" title="${tooltip}">${label}</span>`;
  const copyBtn = `<button class="btn-icon-sm" onclick="copyBubble(this)" title="Copy" aria-label="Copy"><i data-lucide="copy"></i></button>`;
  const citeBtn = withCite
    ? `<button class="btn-icon-sm" onclick="showSources(this)" title="View sources" aria-label="View sources"><i data-lucide="book-open"></i></button>`
    : '';
  if (side === 'user') {
    return `<div class="bubble-actions user-actions">${copyBtn}${timeSpan}</div>`;
  }
  return `<div class="bubble-actions">${timeSpan}${copyBtn}${citeBtn}</div>`;
}

// ── Turn builders — each returns a .chat-turn wrapper ──
function userTurnMarkup(text, date) {
  return `
    <div class="chat-turn">
      <div class="flex items-start gap-3 justify-end">
        <div class="chat-bubble-user px-3 py-2 max-w-xl">
          <p class="text-sm leading-relaxed">${escapeHtml(text)}</p>
        </div>
        ${userAvatarMarkup()}
      </div>
      ${bubbleActionsMarkup({ side: 'user', date })}
    </div>
  `;
}

function aiTurnMarkup(innerHtml, { date, runRef } = {}) {
  return `
    <div class="chat-turn">
      <div class="flex items-start gap-3">
        ${agentAvatarMarkup('mt-0.5')}
        <div class="chat-bubble-ai max-w-xl">${innerHtml}</div>
      </div>
      ${bubbleActionsMarkup({ side: 'ai', date, runRef, withCite: true })}
    </div>
  `;
}

function aiThinkingMarkup() {
  return `
    <div class="chat-turn" id="typing-indicator">
      <div class="flex items-start gap-3">
        ${agentAvatarMarkup('mt-0.5', true)}
        <div class="chat-bubble-ai" aria-live="polite">
          <span class="thinking-dots" aria-label="Thinking"><span></span><span></span><span></span></span>
        </div>
      </div>
    </div>
  `;
}

// ── Thread section divider ──
function threadSectionMarkup(title, date) {
  const time = (date || new Date()).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  return `
    <div class="thread-section">
      <span class="thread-section-rule"></span>
      <span class="thread-section-label">
        <span class="thread-section-title">${escapeHtml(title)}</span>
        <span class="thread-section-time">${time}</span>
      </span>
      <span class="thread-section-rule"></span>
    </div>
  `;
}

// ── Tool call block + activity trace group ──
// Internal helpers (not part of the public API surface).
function traceStripHtml(html) {
  return String(html).replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}
function traceAttrEscape(text) {
  return escapeHtml(String(text)).replace(/"/g, '&quot;');
}
function traceChevronSvg(open) {
  return `<svg class="trace-chevron${open ? ' is-open' : ''}" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6" /></svg>`;
}

// One agent tool/system call. `body` is trusted HTML (may carry inline emphasis);
// `tag` is escaped + uppercased (TOOL, MCP, SQL, …).
function toolCallMarkup({ tag = 'TOOL', body = '' } = {}) {
  return `<div class="tool-call"><span class="tool-tag">${escapeHtml(String(tag)).toUpperCase()}</span>${body}</div>`;
}

// A full trace group. `steps` is an array of trace-line HTML strings (each may embed
// a toolCallMarkup). `open` renders the expanded list; collapsed shows "N steps · <last>".
function traceGroupMarkup({ steps = [], open = false } = {}) {
  const count = steps.length;
  const last = traceStripHtml(steps[count - 1] || '');
  const label = open ? 'Hide activity' : `${count} step${count === 1 ? '' : 's'}`;
  const peek = open ? '' : (last ? `· ${escapeHtml(last)}` : '');
  const listHtml = steps.map((s) => `<div class="trace-line">${s}</div>`).join('');
  return `
    <div class="trace-group" data-step-count="${count}" data-last-step="${traceAttrEscape(last)}">
      <button class="trace-toggle" aria-expanded="${open}" onclick="toggleTrace(this)">
        ${traceChevronSvg(open)}
        <span class="trace-label">${label}</span>
        <span class="trace-toggle-peek">${peek}</span>
      </button>
      <div class="trace-list"${open ? '' : ' hidden'}>${listHtml}</div>
    </div>
  `;
}

// Re-render a trace group's toggle to match an open/closed state.
// open = userToggled ?? isLatestUnit (spec state model).
function renderTraceToggle(group, open) {
  if (!group) return;
  const btn = group.querySelector('.trace-toggle');
  const chevron = group.querySelector('.trace-chevron');
  const label = group.querySelector('.trace-label');
  const peek = group.querySelector('.trace-toggle-peek');
  const list = group.querySelector('.trace-list');
  const count = parseInt(group.dataset.stepCount || '0', 10);
  const last = group.dataset.lastStep || '';
  if (btn) btn.setAttribute('aria-expanded', String(open));
  if (chevron) chevron.classList.toggle('is-open', open);
  if (label) label.textContent = open ? 'Hide activity' : `${count} step${count === 1 ? '' : 's'}`;
  if (peek) peek.textContent = open ? '' : (last ? `· ${last}` : '');
  if (list) list.hidden = !open;
}

// Manual override — once the user clicks, their choice sticks for that group.
function toggleTrace(btn) {
  const group = btn.closest('.trace-group');
  if (!group) return;
  const open = btn.getAttribute('aria-expanded') === 'true';
  group.dataset.userToggled = 'true';
  renderTraceToggle(group, !open);
}

// ── Live trace state machine ──
// The latest (streaming) group is expanded; it auto-collapses on completion
// unless the user has manually toggled it.
let liveTraceGroup = null;

function startTrace(container) {
  completeTrace(); // collapse any prior live group first
  const tpl = document.createElement('template');
  tpl.innerHTML = `
    <div class="chat-turn">
      <div class="flex items-start gap-3">
        ${agentAvatarMarkup('mt-0.5', true)}
        <div class="flex-1 min-w-0">
          ${traceGroupMarkup({ steps: [], open: true })}
        </div>
      </div>
    </div>
  `.trim();
  container.appendChild(tpl.content);
  liveTraceGroup = container.querySelector('.chat-turn:last-child .trace-group');
  if (window.lucide) lucide.createIcons();
  return liveTraceGroup;
}

function addTraceStep(html) {
  if (!liveTraceGroup) return;
  const list = liveTraceGroup.querySelector('.trace-list');
  const line = document.createElement('div');
  line.className = 'trace-line';
  line.innerHTML = html;
  list.appendChild(line);
  liveTraceGroup.dataset.stepCount = String(parseInt(liveTraceGroup.dataset.stepCount || '0', 10) + 1);
  liveTraceGroup.dataset.lastStep = traceStripHtml(html);
  // Stay in whatever state we're in (expanded while live, or collapsed if user pinned it).
  const open = liveTraceGroup.querySelector('.trace-toggle').getAttribute('aria-expanded') === 'true';
  renderTraceToggle(liveTraceGroup, open);
  if (window.lucide) lucide.createIcons();
}

function completeTrace() {
  if (!liveTraceGroup) return;
  const group = liveTraceGroup;
  liveTraceGroup = null;
  const turn = group.closest('.chat-turn');
  const avatar = turn && turn.querySelector('.agent-icon-wrap');
  if (avatar) avatar.classList.remove('is-thinking');
  if (group.dataset.userToggled === 'true') return; // sticky: respect the user's choice
  renderTraceToggle(group, false); // auto-collapse on completion
}

// ── Artifact pointer card ──
function artifactPointerMarkup({ title, meta, onclick = 'toggleArtifact()' }) {
  return `
    <button class="artifact-pointer" onclick="${onclick}">
      <span class="artifact-pointer-icon"><i data-lucide="file-text"></i></span>
      <span class="artifact-pointer-body">
        <span class="artifact-pointer-title">${escapeHtml(title)}</span>
        <span class="artifact-pointer-meta">${escapeHtml(meta)}</span>
      </span>
      <i data-lucide="chevron-right" class="artifact-pointer-chevron"></i>
    </button>
  `;
}

// ── Bubble action handlers ──
function copyBubble(btn) {
  const turn = btn.closest('.chat-turn');
  if (!turn) return;
  const bubble = turn.querySelector('.chat-bubble-ai, .chat-bubble-user');
  if (!bubble) return;
  const text = bubble.innerText.trim();
  if (!navigator.clipboard) return;
  navigator.clipboard.writeText(text).then(() => {
    const icon = btn.querySelector('i, svg');
    const original = icon ? icon.outerHTML : '';
    btn.innerHTML = '<i data-lucide="check"></i>';
    if (window.lucide) lucide.createIcons({ nameAttr: 'data-lucide', icons: lucide.icons });
    setTimeout(() => { btn.innerHTML = original || '<i data-lucide="copy"></i>'; if (window.lucide) lucide.createIcons(); }, 1100);
  });
}

function showSources(btn) {
  console.log('[scaffold] showSources stub — wire to real source list when available', btn);
}

// ── Welcome-screen typewriter ──
// FLEXIBLE per app: set `window.ONX_TYPEWRITER = [...]` in an inline <script>
// BEFORE core.js loads to override these. Keep each line short — the
// .typewriter-greeting uses white-space:nowrap and won't wrap.
const typewriterMessages = (typeof window !== 'undefined' && Array.isArray(window.ONX_TYPEWRITER) && window.ONX_TYPEWRITER.length)
  ? window.ONX_TYPEWRITER
  : [
  "I'm AI Agent. Ready when you are.",
  "Need a quick summary?",
  "What needs attention today?",
  "Spot any anomalies lately?",
];
const TYPEWRITER_CHAR_MS = 38;
const TYPEWRITER_HOLD_MS = 2200;

let typewriterMsgIndex = 0;
let typewriterCharTimer = null;
let typewriterHoldTimer = null;
let typewriterActive = false;

function initTypewriterGhost() {
  const ghost = document.querySelector('.typewriter-ghost');
  if (!ghost) return;
  // Pick the longest message to lock in width; the trailing space accounts
  // for the blinking cursor's ~5px footprint so it never spills over.
  const longest = typewriterMessages.reduce((a, b) => b.length > a.length ? b : a, '');
  ghost.textContent = longest + ' ';
}

function startTypewriter() {
  if (typewriterActive) return;
  initTypewriterGhost();
  typewriterActive = true;
  typewriterMsgIndex = 0;
  typewriterTypeMessage();
}

function stopTypewriter() {
  typewriterActive = false;
  if (typewriterCharTimer) { clearInterval(typewriterCharTimer); typewriterCharTimer = null; }
  if (typewriterHoldTimer) { clearTimeout(typewriterHoldTimer); typewriterHoldTimer = null; }
}

function typewriterTypeMessage() {
  const el = document.getElementById('typewriter');
  if (!el || !typewriterActive) return;
  const msg = typewriterMessages[typewriterMsgIndex];
  let charIdx = 0;
  el.textContent = '';
  typewriterCharTimer = setInterval(() => {
    charIdx++;
    el.textContent = msg.slice(0, charIdx);
    if (charIdx >= msg.length) {
      clearInterval(typewriterCharTimer);
      typewriterCharTimer = null;
      typewriterHoldTimer = setTimeout(() => {
        typewriterMsgIndex = (typewriterMsgIndex + 1) % typewriterMessages.length;
        if (typewriterActive) typewriterTypeMessage();
      }, TYPEWRITER_HOLD_MS);
    }
  }, TYPEWRITER_CHAR_MS);
}

// ── New chat / Home screen ──
function setChatHeaderVisible(visible) {
  document.getElementById('chat-panel-header').style.display = visible ? 'flex' : 'none';
  document.getElementById('chat-panel-divider').style.display = visible ? 'block' : 'none';
}

function setThreadTitle(title) {
  const titleEl = document.getElementById('thread-title');
  if (titleEl) titleEl.textContent = title;
}

// ── Editable thread title ──
function focusThreadTitle() {
  const el = document.getElementById('thread-title');
  if (!el) return;
  el.focus();
  // Select all text so retyping replaces the placeholder
  const range = document.createRange();
  range.selectNodeContents(el);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
}

function handleThreadTitleKey(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    e.target.blur();
  } else if (e.key === 'Escape') {
    e.preventDefault();
    // Revert: restore from data-original if we stashed it on focus; else just blur
    if (e.target.dataset.original != null) {
      e.target.textContent = e.target.dataset.original;
    }
    e.target.blur();
  }
}

function commitThreadTitle() {
  const el = document.getElementById('thread-title');
  if (!el) return;
  const cleaned = el.textContent.replace(/\s+/g, ' ').trim();
  el.textContent = cleaned || 'Untitled Thread';
  delete el.dataset.original;
}

document.addEventListener('focusin', (e) => {
  if (e.target.id === 'thread-title') {
    e.target.dataset.original = e.target.textContent;
  }
});

function runSummaryThreadMarkup() {
  const t0 = new Date();
  const t1 = new Date(t0.getTime() + 12000);
  const t2 = new Date(t0.getTime() + 14000);

  const greeting = `
    <p class="text-sm text-gray-800 leading-relaxed mb-4">
      Hello! I'm <strong>AI Agent</strong>. I can help you review data, surface patterns,
      interpret results, and generate reports.
    </p>
    <p class="text-sm text-gray-800 leading-relaxed">
      You can ask me things like:<br>
      <span class="text-gray-500">— "Summarise the latest review"</span><br>
      <span class="text-gray-500">— "What's driving the top issue?"</span><br>
      <span class="text-gray-500">— "Compare this period to last"</span>
    </p>
  `;

  const summary = `
    <p class="text-sm text-gray-800 leading-relaxed mb-2">
      <strong>Run #0001 — Sample Dataset</strong> completed [Date]. Here's what needs your attention:
    </p>
    <div class="border-l-4 border-orange-400 bg-orange-50 rounded-r px-3 py-2 mb-2">
      <div class="text-xs font-semibold text-orange-700 mb-0.5">🚨 Urgent · 213 exceptions</div>
      <div class="text-xs text-gray-700">Anomaly detected across Category A — 142 records. AI classifies this as a <strong>configuration issue</strong>, not a data error. Recommend reviewing config before sign-off.</div>
    </div>
    <p class="text-xs text-gray-500">Total: 312 exceptions · 11% defect rate · 194 docs affected.</p>
    ${artifactPointerMarkup({ title: 'Run #0001 — Sample Dataset', meta: 'Full report · 312 exceptions · 11% defect' })}
  `;

  return `
    ${threadSectionMarkup('Run #0001 — Sample Dataset', t0)}
    ${aiTurnMarkup(greeting, { date: t0, runRef: 'AI Agent' })}
    ${userTurnMarkup('Summarise the latest run and flag anything I should review urgently.', t1)}
    ${aiTurnMarkup(summary, { date: t2, runRef: 'Run #0001' })}
  `;
}

function loadRunSummaryThread() {
  const messages = document.getElementById('chat-messages');
  messages.innerHTML = runSummaryThreadMarkup();
  if (window.lucide) lucide.createIcons();
  showActiveChat();
  if (!artifactOpen) toggleArtifact();
  messages.scrollTop = messages.scrollHeight;
}

function showNewChat() {
  // Clear existing messages
  document.getElementById('chat-messages').innerHTML = '';
  // Reset thread title
  setThreadTitle('New Thread');
  // Close artifact panel if open
  if (artifactOpen) toggleArtifact();
  setChatHeaderVisible(false);
  // Show home screen, hide active chat
  document.getElementById('home-screen').classList.remove('hidden');
  document.getElementById('home-screen').style.display = 'flex';
  document.getElementById('active-chat-view').style.display = 'none';
  // Focus home input
  setTimeout(() => document.getElementById('home-input').focus(), 50);
  startTypewriter();
}

function showActiveChat() {
  setThreadTitle('Untitled Thread');
  setChatHeaderVisible(true);
  document.getElementById('home-screen').style.display = 'none';
  document.getElementById('active-chat-view').style.display = 'flex';
  stopTypewriter();
}

function homePrompt(text) {
  if (text === 'Summarise the latest review') {
    document.getElementById('home-input').value = '';
    loadRunSummaryThread();
    return;
  }
  document.getElementById('home-input').value = text;
  sendHomeMessage();
}

function sendHomeMessage() {
  const input = document.getElementById('home-input');
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  input.style.height = 'auto';
  showActiveChat();
  const messages = document.getElementById('chat-messages');
  // First query in a fresh thread gets a subtle divider with the query topic
  const sectionTitle = text.length > 60 ? text.slice(0, 57) + '…' : text;
  appendHtml(messages, threadSectionMarkup(sectionTitle, new Date()));
  appendHtml(messages, userTurnMarkup(text, new Date()));
  appendHtml(messages, aiThinkingMarkup());
  if (window.lucide) lucide.createIcons();
  messages.scrollTop = messages.scrollHeight;
  setTimeout(() => {
    const typing = document.getElementById('typing-indicator');
    if (typing) typing.remove();
    const aiBody = `<p class="text-sm text-gray-800 leading-relaxed">I've received your query. In a live environment, I'd process this in real-time. For now, this is a UI prototype — agent logic is in development.</p>`;
    appendHtml(messages, aiTurnMarkup(aiBody, { date: new Date(), runRef: 'AI Agent' }));
    if (window.lucide) lucide.createIcons();
    messages.scrollTop = messages.scrollHeight;
  }, 1200);
}

function handleHomeEnter(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendHomeMessage();
  }
}

// Close user menu on outside click
document.addEventListener('click', function(e) {
  if (!e.target.closest('.relative')) {
    document.getElementById('user-menu')?.classList.remove('open');
  }
});



// ═══════════════════════════════════════════════════
// MODAL — openModal({title, body, confirmLabel, cancelLabel, danger, onConfirm})
// ═══════════════════════════════════════════════════
function openModal({ title = '', body = '', confirmLabel = 'Confirm', cancelLabel = 'Cancel', danger = false, onConfirm } = {}) {
  const backdrop = document.getElementById('modal-backdrop');
  const modal = backdrop.querySelector('.modal');
  modal.innerHTML = `
    <div class="modal-title">${title}</div>
    <div class="modal-body">${body}</div>
    <div class="modal-actions">
      <button class="btn btn-secondary btn-sm" onclick="closeModal()">${cancelLabel}</button>
      <button class="btn ${danger ? 'btn-danger' : 'btn-primary'} btn-sm" id="modal-confirm-btn">${confirmLabel}</button>
    </div>
  `;
  document.getElementById('modal-confirm-btn').onclick = () => {
    if (onConfirm) onConfirm();
    closeModal();
  };
  backdrop.classList.add('is-open');
}
function closeModal() {
  document.getElementById('modal-backdrop').classList.remove('is-open');
}

// ═══════════════════════════════════════════════════
// TOAST — toast(message, { type: 'success'|'error'|'info', duration })
// ═══════════════════════════════════════════════════
function toast(message, { type = 'info', duration = 3500 } = {}) {
  const container = document.getElementById('toast-container');
  const div = document.createElement('div');
  div.className = `toast toast-${type}`;
  const iconName = type === 'success' ? 'check-circle-2' : type === 'error' ? 'alert-circle' : 'info';
  div.innerHTML = `
    <i data-lucide="${iconName}" class="icon-md toast-icon"></i>
    <div class="toast-body">${message}</div>
    <i data-lucide="x" class="icon-sm toast-close"></i>
  `;
  container.appendChild(div);
  div.querySelector('.toast-close').onclick = () => div.remove();
  if (window.lucide) lucide.createIcons();
  setTimeout(() => {
    div.style.animation = 'toast-out 200ms ease forwards';
    setTimeout(() => div.remove(), 200);
  }, duration);
}

// ═══════════════════════════════════════════════════
// KEYBOARD SHORTCUTS
//   ⌘/Ctrl+K → focus search
//   Escape   → close menus / drawers / modal
// ═══════════════════════════════════════════════════
document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    document.querySelector('.nav-search')?.focus();
    return;
  }
  if (e.key === 'Escape') {
    if (document.getElementById('modal-backdrop')?.classList.contains('is-open')) {
      closeModal(); return;
    }
    if (typeof historyOpen !== 'undefined' && historyOpen) { toggleHistory(); return; }
    document.getElementById('user-menu')?.classList.remove('open');
  }
});

// ═══════════════════════════════════════════════════
// STATE RESTORATION — dark mode, sidebar, last-visited page
// ═══════════════════════════════════════════════════
(function restoreUIState() {
  // Theme
  if (localStorage.getItem('onx-theme') === 'dark') {
    document.documentElement.classList.add('dark');
    darkOn = true;
    const iconHost = document.getElementById('dark-icon');
    if (iconHost) iconHost.setAttribute('data-lucide', 'sun');
    const toggle = document.getElementById('dark-toggle');
    const knob   = document.getElementById('dark-knob');
    if (toggle) toggle.style.backgroundColor = 'var(--onx-teal)';
    if (knob)   knob.style.transform = 'translateX(16px)';
  }
  // Sidebar
  if (localStorage.getItem('onx-sidebar-collapsed') === '1' && window.innerWidth >= 768) {
    document.getElementById('sidebar')?.classList.add('collapsed');
    sidebarExpanded = false;
  }
})();

hydrateAgentAvatars();
showNewChat();
if (window.lucide) lucide.createIcons();

// ── History drawer ──
let historyOpen = false;
function toggleHistory() {
  historyOpen = !historyOpen;
  const drawer = document.getElementById('history-drawer');
  const backdrop = document.getElementById('history-backdrop');
  drawer?.classList.toggle('is-open', historyOpen);
  backdrop?.classList.toggle('is-open', historyOpen);
}

// ── Artifact panel drag-resize ──
function initArtifactResize() {
  const panel = document.getElementById('artifact-panel');
  if (!panel || panel.querySelector('.resize-handle')) return;
  const handle = document.createElement('div');
  handle.className = 'resize-handle';
  handle.title = 'Drag to resize · double-click to reset';
  panel.prepend(handle);

  const saved = localStorage.getItem('onx-artifact-width');
  if (saved) panel.style.setProperty('--artifact-width', saved + 'px');

  let dragging = false, startX = 0, startW = 0;
  handle.addEventListener('mousedown', (e) => {
    dragging = true;
    startX = e.clientX;
    startW = panel.getBoundingClientRect().width;
    handle.classList.add('is-dragging');
    panel.classList.add('is-resizing');
    document.body.classList.add('is-resizing-col');
    e.preventDefault();
  });
  document.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    const dx = startX - e.clientX;
    const w = Math.max(280, Math.min(720, startW + dx));
    panel.style.setProperty('--artifact-width', w + 'px');
  });
  document.addEventListener('mouseup', () => {
    if (!dragging) return;
    dragging = false;
    handle.classList.remove('is-dragging');
    panel.classList.remove('is-resizing');
    document.body.classList.remove('is-resizing-col');
    const w = Math.round(panel.getBoundingClientRect().width);
    localStorage.setItem('onx-artifact-width', w);
  });
  handle.addEventListener('dblclick', () => {
    panel.style.removeProperty('--artifact-width');
    localStorage.removeItem('onx-artifact-width');
  });
}

document.addEventListener('DOMContentLoaded', initArtifactResize);

