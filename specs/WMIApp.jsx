import { useState, useEffect, useRef } from 'react'
import appLogo from '../../assets/NFTLogo_Horizontal_FullColour_White.png'
import { useNavigate } from 'react-router-dom'

// ── STYLES (scoped to WMI) ──────────────────────────────────────────────────
const css = `
  .wmi { --ink:#080810;--surface:#0c0c16;--panel:#10101c;--panel2:#131320;--border:rgba(255,255,255,0.055);--border-bright:rgba(200,170,90,0.35);--gold:#c8a84a;--gold-soft:rgba(200,168,74,0.14);--gold-glow:rgba(200,168,74,0.07);--silver:#8896a8;--text:#eeeef5;--text-mid:#9098ac;--text-dim:#3a4255;--green:#4cb87c;--green-soft:rgba(76,184,124,0.13);--red:#e05050;--red-soft:rgba(224,80,80,0.11);--blue:#5090e8;--blue-soft:rgba(80,144,232,0.11);--amber:#e09848;--amber-soft:rgba(224,152,72,0.13);--violet:#8878d8;--violet-soft:rgba(136,120,216,0.12); font-family:'Outfit',sans-serif; font-size:13px; color:var(--text); background:var(--ink); height:100vh; overflow:hidden; display:flex; flex-direction:column; }
  .wmi * { margin:0;padding:0;box-sizing:border-box; }
  .wmi::before { content:'';position:fixed;inset:0;background:radial-gradient(ellipse 70% 45% at 15% 5%,rgba(200,168,74,0.05) 0%,transparent 55%),radial-gradient(ellipse 50% 35% at 85% 95%,rgba(80,144,232,0.04) 0%,transparent 50%);pointer-events:none;z-index:0; }
  .wmi-shell { display:grid;grid-template-columns:200px 1fr;grid-template-rows:48px 1fr;height:100%;position:relative;z-index:1; }
  .wmi-topbar { grid-column:1/-1;display:flex;align-items:center;justify-content:space-between;padding:0 24px;border-bottom:1px solid var(--border);background:rgba(8,8,16,0.92);backdrop-filter:blur(16px);z-index:200; }
  .wmi-brand { display:flex;align-items:center;gap:10px;cursor:pointer; }
  .wmi-brand-text { font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:600;letter-spacing:0.06em; }
  .wmi-brand-ver { font-family:'JetBrains Mono',monospace;font-size:8px;color:var(--gold);letter-spacing:0.18em;text-transform:uppercase; }
  .wmi-pulse { width:5px;height:5px;border-radius:50%;background:var(--green);animation:wmiPulse 2.2s ease-in-out infinite; }
  @keyframes wmiPulse { 0%,100%{opacity:1}50%{opacity:0.3} }
  .wmi-live { font-family:'JetBrains Mono',monospace;font-size:9px;color:var(--text-mid);letter-spacing:0.1em; }
  .wmi-clock { font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--text-mid);letter-spacing:0.06em; }
  .wmi-notif { width:28px;height:28px;border-radius:5px;border:1px solid var(--border);background:transparent;color:var(--text-mid);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:12px;transition:all 0.15s;position:relative; }
  .wmi-notif:hover { border-color:var(--gold);color:var(--gold);background:var(--gold-glow); }
  .wmi-nbadge { position:absolute;top:-3px;right:-3px;width:12px;height:12px;border-radius:50%;background:var(--red);font-family:'JetBrains Mono',monospace;font-size:7px;display:flex;align-items:center;justify-content:center;color:#fff;border:1.5px solid var(--ink); }
  .wmi-user { display:flex;align-items:center;gap:7px;padding:4px 10px 4px 5px;border:1px solid var(--border);border-radius:20px;cursor:pointer;transition:all 0.15s; }
  .wmi-user:hover { border-color:var(--border-bright);background:var(--gold-glow); }
  .wmi-av-sm { width:22px;height:22px;border-radius:50%;background:linear-gradient(135deg,var(--gold),#7a5018);display:flex;align-items:center;justify-content:center;font-family:'JetBrains Mono',monospace;font-size:8px;font-weight:500;color:var(--ink); }
  .wmi-uname { font-size:11px;color:var(--silver); }
  .wmi-sidebar { background:var(--surface);border-right:1px solid var(--border);display:flex;flex-direction:column;overflow-y:auto;overflow-x:hidden;padding:14px 0 20px; }
  .wmi-nav-section { font-family:'JetBrains Mono',monospace;font-size:8px;letter-spacing:0.18em;color:var(--text-dim);text-transform:uppercase;padding:12px 14px 5px;margin-top:6px; }
  .wmi-nav-item { display:flex;align-items:center;justify-content:space-between;padding:8px 14px;cursor:pointer;color:var(--text-mid);font-size:12px;border-left:2px solid transparent;transition:all 0.13s;user-select:none;border-radius:0 4px 4px 0;margin-right:6px; }
  .wmi-nav-item:hover { color:var(--text);background:var(--gold-glow); }
  .wmi-nav-item.active { color:var(--gold);background:var(--gold-soft);border-left-color:var(--gold); }
  .wmi-nav-badge { font-family:'JetBrains Mono',monospace;font-size:8px;padding:2px 5px;border-radius:8px;min-width:16px;text-align:center; }
  .nb-gold { background:var(--gold-soft);color:var(--gold); }
  .nb-red { background:var(--red-soft);color:var(--red); }
  .nb-green { background:var(--green-soft);color:var(--green); }
  .nb-blue { background:var(--blue-soft);color:var(--blue); }
  .wmi-main { display:flex;flex-direction:column;overflow:hidden;background:var(--ink); }
  .wmi-page { display:none;flex-direction:column;height:100%;overflow:hidden; }
  .wmi-page.active { display:flex; }
  .wmi-ph { padding:18px 26px 14px;border-bottom:1px solid var(--border);flex-shrink:0; }
  .wmi-breadcrumb { font-family:'JetBrains Mono',monospace;font-size:8px;color:var(--text-dim);letter-spacing:0.14em;text-transform:uppercase;margin-bottom:6px; }
  .bc-active { color:var(--gold); }
  .wmi-ph-row { display:flex;align-items:flex-end;justify-content:space-between; }
  .wmi-ph-title { font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:400;color:var(--text);letter-spacing:0.01em; }
  .wmi-ph-sub { font-size:11px;color:var(--text-mid);margin-top:3px; }
  .wmi-ph-actions { display:flex;gap:7px; }
  .wbtn { padding:6px 13px;border-radius:4px;font-size:11px;font-family:'Outfit',sans-serif;font-weight:500;cursor:pointer;border:1px solid var(--border);background:transparent;color:var(--silver);transition:all 0.14s;letter-spacing:0.02em; }
  .wbtn:hover { border-color:var(--gold);color:var(--gold);background:var(--gold-glow); }
  .wbtn-gold { background:var(--gold);color:var(--ink);border-color:var(--gold);font-weight:600; }
  .wbtn-gold:hover { background:#d4b860;border-color:#d4b860;color:var(--ink); }
  .wbtn-red { border-color:var(--red);color:var(--red); }
  .wbtn-red:hover { background:var(--red-soft); }
  .wbtn-green { border-color:var(--green);color:var(--green); }
  .wbtn-green:hover { background:var(--green-soft); }
  .wmi-scroll { flex:1;overflow-y:auto;padding:20px 26px;display:flex;flex-direction:column;gap:18px; }
  .wmi-scroll::-webkit-scrollbar { width:4px; }
  .wmi-scroll::-webkit-scrollbar-thumb { background:var(--border);border-radius:2px; }
  .wpanel { background:var(--panel);border:1px solid var(--border);border-radius:7px;overflow:hidden;animation:wFadeUp 0.38s ease both; }
  @keyframes wFadeUp { from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none} }
  .wpanel-h { padding:12px 17px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;flex-shrink:0; }
  .wpanel-title { font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:0.13em;color:var(--silver);text-transform:uppercase;display:flex;align-items:center;gap:7px; }
  .pt-dot { width:5px;height:5px;border-radius:50%; }
  .wpanel-aux { display:flex;align-items:center;gap:10px; }
  .wpanel-link { font-family:'JetBrains Mono',monospace;font-size:9px;color:var(--gold);letter-spacing:0.06em;cursor:pointer;opacity:0.7;transition:opacity 0.14s; }
  .wpanel-link:hover { opacity:1; }
  .wkpi-row { display:grid;grid-template-columns:repeat(5,1fr);gap:10px; }
  .wkpi { background:var(--panel);border:1px solid var(--border);border-radius:7px;padding:13px 15px;position:relative;overflow:hidden;cursor:pointer;transition:border-color 0.18s,transform 0.14s;animation:wFadeUp 0.4s ease both; }
  .wkpi:hover { border-color:var(--border-bright);transform:translateY(-1px); }
  .wkpi::after { content:'';position:absolute;top:0;left:0;right:0;height:2px; }
  .wkpi.c-gold::after { background:linear-gradient(90deg,var(--gold),transparent); }
  .wkpi.c-green::after { background:linear-gradient(90deg,var(--green),transparent); }
  .wkpi.c-red::after { background:linear-gradient(90deg,var(--red),transparent); }
  .wkpi.c-blue::after { background:linear-gradient(90deg,var(--blue),transparent); }
  .wkpi.c-amber::after { background:linear-gradient(90deg,var(--amber),transparent); }
  .wkpi-label { font-family:'JetBrains Mono',monospace;font-size:8px;color:var(--text-dim);letter-spacing:0.13em;text-transform:uppercase;margin-bottom:9px; }
  .wkpi-val { font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:600;color:var(--text);line-height:1; }
  .wkpi-delta { display:inline-flex;align-items:center;gap:3px;margin-top:7px;font-family:'JetBrains Mono',monospace;font-size:9px;padding:2px 6px;border-radius:3px; }
  .d-up { background:var(--green-soft);color:var(--green); }
  .d-down { background:var(--red-soft);color:var(--red); }
  .d-warn { background:var(--amber-soft);color:var(--amber); }
  .d-neu { background:var(--blue-soft);color:var(--blue); }
  .wai-strip { background:linear-gradient(135deg,rgba(200,168,74,0.07),rgba(80,144,232,0.04));border:1px solid var(--border-bright);border-radius:7px;padding:14px 17px;display:flex;gap:13px;align-items:flex-start;animation:wFadeUp 0.35s ease both; }
  .wai-gem { width:32px;height:32px;border-radius:50%;background:var(--gold-soft);border:1px solid var(--gold);display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0; }
  .wai-title { font-family:'JetBrains Mono',monospace;font-size:8px;letter-spacing:0.15em;color:var(--gold);text-transform:uppercase;margin-bottom:5px; }
  .wai-body { font-size:12px;color:var(--text-mid);line-height:1.65; }
  .wai-body strong { color:var(--text);font-weight:500; }
  .wai-acts { display:flex;gap:7px;margin-top:9px;flex-wrap:wrap; }
  .wai-btn { padding:4px 10px;border:1px solid var(--gold);border-radius:3px;font-family:'JetBrains Mono',monospace;font-size:9px;color:var(--gold);background:transparent;cursor:pointer;letter-spacing:0.06em;transition:all 0.14s; }
  .wai-btn:hover { background:var(--gold-soft); }
  .two-col { display:grid;grid-template-columns:1fr 340px;gap:16px; }
  .three-col { display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px; }
  .right-stack { display:flex;flex-direction:column;gap:16px; }
  .wct-head,.wct-row { display:grid;grid-template-columns:34px 1fr 90px 95px 80px 75px 50px;align-items:center;padding:10px 17px;gap:10px; }
  .wct-head { background:rgba(255,255,255,0.02);border-bottom:1px solid var(--border); }
  .wct-row { border-bottom:1px solid var(--border);cursor:pointer;transition:background 0.12s; }
  .wct-row:hover { background:var(--gold-glow); }
  .wct-row:last-child { border-bottom:none; }
  .col-h { font-family:'JetBrains Mono',monospace;font-size:8px;color:var(--text-dim);letter-spacing:0.1em;text-transform:uppercase; }
  .wav { width:28px;height:28px;border-radius:50%;border:1.5px solid var(--border);display:flex;align-items:center;justify-content:center;font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:500;flex-shrink:0;cursor:pointer;transition:border-color 0.15s; }
  .wav:hover { border-color:var(--gold); }
  .av-g { border-color:var(--gold);background:var(--gold-soft);color:var(--gold); }
  .av-b { border-color:var(--blue);background:var(--blue-soft);color:var(--blue); }
  .av-gr { border-color:var(--green);background:var(--green-soft);color:var(--green); }
  .av-a { border-color:var(--amber);background:var(--amber-soft);color:var(--amber); }
  .av-s { border-color:var(--silver);background:rgba(136,150,168,0.1);color:var(--silver); }
  .av-v { border-color:var(--violet);background:var(--violet-soft);color:var(--violet); }
  .c-name { font-size:12px;font-weight:500;color:var(--text); }
  .c-role { font-size:10px;color:var(--text-mid);margin-top:1px; }
  .wheat { display:flex;gap:2px; }
  .whs { width:13px;height:4px;border-radius:2px;background:var(--border); }
  .whs.on { background:var(--gold); }
  .whs.warn { background:var(--red); }
  .wpill { display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border-radius:20px;font-family:'JetBrains Mono',monospace;font-size:8px;letter-spacing:0.06em;text-transform:uppercase; }
  .p-active { background:var(--green-soft);color:var(--green); }
  .p-warm { background:var(--amber-soft);color:var(--amber); }
  .p-cold { background:var(--red-soft);color:var(--red); }
  .p-new { background:var(--blue-soft);color:var(--blue); }
  .mono-sm { font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--text-mid); }
  .waction-ic { width:24px;height:24px;border-radius:4px;border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:10px;cursor:pointer;transition:all 0.14s;color:var(--text-mid); }
  .waction-ic:hover { border-color:var(--gold);color:var(--gold);background:var(--gold-glow); }
  .wsf-item { padding:12px 17px;border-bottom:1px solid var(--border);display:flex;gap:10px;cursor:pointer;transition:background 0.12s; }
  .wsf-item:hover { background:var(--gold-glow); }
  .wsf-item:last-child { border-bottom:none; }
  .wsig-dot { width:7px;height:7px;border-radius:50%;margin-top:3px;flex-shrink:0; }
  .sig-crit { background:var(--red);box-shadow:0 0 6px var(--red); }
  .sig-warn { background:var(--amber); }
  .sig-opp { background:var(--green); }
  .sig-info { background:var(--blue); }
  .wsf-client { font-size:11px;font-weight:500;color:var(--text);margin-bottom:2px; }
  .wsf-detail { font-size:10px;color:var(--text-mid);line-height:1.5; }
  .wsf-meta { display:flex;align-items:center;justify-content:space-between;margin-top:5px; }
  .wsf-time { font-family:'JetBrains Mono',monospace;font-size:8px;color:var(--text-dim); }
  .wsf-tag { font-family:'JetBrains Mono',monospace;font-size:7px;padding:2px 5px;border-radius:3px;letter-spacing:0.08em;text-transform:uppercase; }
  .t-crit { background:var(--red-soft);color:var(--red); }
  .t-warn { background:var(--amber-soft);color:var(--amber); }
  .t-opp { background:var(--green-soft);color:var(--green); }
  .t-info { background:var(--blue-soft);color:var(--blue); }
  .wpipe-row { display:flex;align-items:center;gap:10px;padding:0 17px 10px; }
  .wpipe-label { font-size:10px;color:var(--text-mid);width:82px;flex-shrink:0; }
  .wpipe-wrap { flex:1;height:5px;background:var(--border);border-radius:3px;overflow:hidden; }
  .wpipe-bar { height:100%;border-radius:3px;transition:width 1s ease; }
  .wpipe-val { font-family:'JetBrains Mono',monospace;font-size:9px;color:var(--text-mid);width:48px;text-align:right;flex-shrink:0; }
  .wtl-item { display:flex;gap:11px;padding:9px 17px;position:relative; }
  .wtl-dot { width:13px;height:13px;border-radius:50%;border:2px solid var(--border);background:var(--panel);flex-shrink:0;margin-top:2px;z-index:1; }
  .tl-call { border-color:var(--green); }
  .tl-email { border-color:var(--blue); }
  .tl-meet { border-color:var(--gold); }
  .tl-flag { border-color:var(--red); }
  .tl-note { border-color:var(--violet); }
  .wtl-what { font-size:11px;color:var(--text);margin-bottom:1px; }
  .wtl-who { font-size:10px;color:var(--text-mid); }
  .wtl-when { font-family:'JetBrains Mono',monospace;font-size:8px;color:var(--text-dim);margin-top:2px; }
  .wscore-grid { display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--border); }
  .wscore-cell { background:var(--panel);padding:13px 14px;text-align:center;cursor:pointer;transition:background 0.14s; }
  .wscore-cell:hover { background:var(--panel2); }
  .sc-val { font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:600;line-height:1; }
  .sc-high { color:var(--gold); }
  .sc-med { color:var(--amber); }
  .sc-low { color:var(--red); }
  .sc-name { font-size:9px;color:var(--text-mid);margin-top:4px; }
  .walert-item { padding:12px 17px;border-bottom:1px solid var(--border);display:flex;gap:10px;align-items:flex-start;cursor:pointer;transition:background 0.12s; }
  .walert-item:hover { background:var(--gold-glow); }
  .walert-sev { width:3px;height:40px;border-radius:2px;flex-shrink:0;margin-top:1px; }
  .as-high { background:var(--red); }
  .as-med { background:var(--amber); }
  .as-low { background:var(--blue); }
  .walert-name { font-size:11px;font-weight:500;color:var(--text);margin-bottom:2px; }
  .walert-desc { font-size:10px;color:var(--text-mid);line-height:1.45; }
  .walert-amount { font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--red);margin-left:auto;flex-shrink:0; }
  .wcc-grid { display:grid;grid-template-columns:repeat(3,1fr);gap:12px; }
  .wcc { background:var(--panel);border:1px solid var(--border);border-radius:7px;padding:16px;cursor:pointer;transition:all 0.15s;position:relative;overflow:hidden; }
  .wcc:hover { border-color:var(--border-bright);transform:translateY(-2px); }
  .wcc::after { content:'';position:absolute;top:0;left:0;right:0;height:2px; }
  .wcc.tier-1::after { background:var(--gold); }
  .wcc.tier-2::after { background:var(--silver); }
  .wcc.tier-3::after { background:rgba(255,255,255,0.1); }
  .wcc-top { display:flex;align-items:center;gap:10px;margin-bottom:10px; }
  .wcc-name { font-size:13px;font-weight:500;color:var(--text);margin-bottom:1px; }
  .wcc-org { font-size:10px;color:var(--text-mid); }
  .wcc-stats { display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-top:10px; }
  .wcc-stat { text-align:center; }
  .wcc-stat-val { font-family:'Cormorant Garamond',serif;font-size:16px;font-weight:600;color:var(--text); }
  .wcc-stat-lbl { font-size:9px;color:var(--text-dim);margin-top:1px; }
  .wcc-tags { display:flex;gap:5px;flex-wrap:wrap;margin-top:10px; }
  .wcc-tag { font-family:'JetBrains Mono',monospace;font-size:8px;padding:2px 6px;border-radius:3px;background:var(--panel2);color:var(--text-mid);border:1px solid var(--border);letter-spacing:0.06em; }
  .wintel-item { padding:14px 17px;border-bottom:1px solid var(--border);display:flex;gap:12px;cursor:pointer;transition:background 0.12s; }
  .wintel-item:hover { background:var(--gold-glow); }
  .wintel-item:last-child { border-bottom:none; }
  .wintel-icon { width:32px;height:32px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0; }
  .ii-gold { background:var(--gold-soft); }
  .ii-red { background:var(--red-soft); }
  .ii-green { background:var(--green-soft); }
  .ii-blue { background:var(--blue-soft); }
  .wintel-title { font-size:12px;font-weight:500;color:var(--text);margin-bottom:3px; }
  .wintel-body { font-size:11px;color:var(--text-mid);line-height:1.55; }
  .wintel-footer { display:flex;align-items:center;justify-content:space-between;margin-top:6px; }
  .wintel-source { font-family:'JetBrains Mono',monospace;font-size:8px;color:var(--text-dim); }
  .wintel-acts { display:flex;gap:6px; }
  .wintel-act { padding:3px 8px;border:1px solid var(--border);border-radius:3px;font-family:'JetBrains Mono',monospace;font-size:8px;color:var(--text-mid);cursor:pointer;transition:all 0.13s; }
  .wintel-act:hover { border-color:var(--gold);color:var(--gold); }
  .wsearch-bar { display:flex;align-items:center;gap:8px;padding:0 17px;height:40px;border-bottom:1px solid var(--border); }
  .wsearch-input { flex:1;background:transparent;border:none;outline:none;color:var(--text);font-family:'Outfit',sans-serif;font-size:12px; }
  .wsearch-input::placeholder { color:var(--text-dim); }
  .wf-chip { padding:3px 9px;border-radius:12px;border:1px solid var(--border);font-family:'JetBrains Mono',monospace;font-size:8px;color:var(--text-mid);cursor:pointer;transition:all 0.13s;letter-spacing:0.06em; }
  .wf-chip.active { background:var(--gold-soft);border-color:var(--gold);color:var(--gold); }
  .wf-chip:hover:not(.active) { border-color:var(--silver);color:var(--silver); }
  .wtab-row { display:flex;border-bottom:1px solid var(--border); }
  .wtab-row-inline { display:flex;border:none;padding:0; }
  .wtab { padding:9px 13px;font-family:'JetBrains Mono',monospace;font-size:9px;color:var(--text-mid);cursor:pointer;border-bottom:2px solid transparent;transition:all 0.14s;letter-spacing:0.08em;margin-bottom:-1px; }
  .wtab:hover { color:var(--text); }
  .wtab.active { color:var(--gold);border-bottom-color:var(--gold); }
  .wmodal-overlay { position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:500;backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center; }
  .wmodal { background:var(--panel);border:1px solid var(--border-bright);border-radius:10px;width:580px;max-height:80vh;display:flex;flex-direction:column;animation:wModalIn 0.22s ease; }
  @keyframes wModalIn { from{opacity:0;transform:scale(0.95) translateY(10px)}to{opacity:1;transform:none} }
  .wmodal-hd { padding:18px 22px 14px;border-bottom:1px solid var(--border);display:flex;align-items:flex-start;justify-content:space-between; }
  .wmodal-name { font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:400; }
  .wmodal-role { font-size:11px;color:var(--text-mid);margin-top:2px; }
  .wmodal-close { width:28px;height:28px;border-radius:5px;border:1px solid var(--border);background:transparent;color:var(--text-mid);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:14px;transition:all 0.14s; }
  .wmodal-close:hover { border-color:var(--red);color:var(--red); }
  .wmodal-body { padding:18px 22px;overflow-y:auto;display:flex;flex-direction:column;gap:16px; }
  .wmodal-body::-webkit-scrollbar { width:3px; }
  .wmodal-body::-webkit-scrollbar-thumb { background:var(--border); }
  .wmodal-stat-row { display:grid;grid-template-columns:repeat(3,1fr);gap:10px; }
  .wmodal-stat { background:var(--panel2);border:1px solid var(--border);border-radius:5px;padding:11px; }
  .wms-label { font-family:'JetBrains Mono',monospace;font-size:8px;color:var(--text-dim);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:6px; }
  .wms-val { font-size:14px;font-weight:500;color:var(--text); }
  .wms-val.big { font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:600; }
  .wmodal-sec-title { font-family:'JetBrains Mono',monospace;font-size:9px;color:var(--silver);letter-spacing:0.12em;text-transform:uppercase;margin-bottom:8px; }
  .wmodal-action-row { display:flex;gap:8px;padding-top:6px;border-top:1px solid var(--border); }
  .wflag-row { background:var(--red-soft);border:1px solid rgba(224,80,80,0.25);border-radius:5px;padding:11px 13px;display:flex;gap:10px;align-items:flex-start; }
  .wflag-title { font-size:12px;font-weight:500;color:var(--red);margin-bottom:2px; }
  .wflag-desc { font-size:11px;color:var(--text-mid); }
  .wflag-row.warn { background:var(--amber-soft);border-color:rgba(224,152,72,0.25); }
  .wflag-row.warn .wflag-title { color:var(--amber); }
  .wopp-row { background:var(--green-soft);border:1px solid rgba(76,184,124,0.2);border-radius:5px;padding:11px 13px;display:flex;gap:10px;align-items:flex-start; }
  .wopp-title { font-size:12px;font-weight:500;color:var(--green);margin-bottom:2px; }
  .wopp-desc { font-size:11px;color:var(--text-mid); }
  .wnote-input { width:100%;background:var(--panel2);border:1px solid var(--border);border-radius:5px;padding:9px 11px;color:var(--text);font-family:'Outfit',sans-serif;font-size:12px;resize:none;height:70px;outline:none;transition:border-color 0.14s; }
  .wnote-input:focus { border-color:var(--gold); }
  .wtoast { position:fixed;bottom:24px;right:24px;z-index:900;background:var(--panel2);border:1px solid var(--border-bright);border-radius:6px;padding:11px 16px;display:flex;gap:10px;align-items:center;font-size:12px;color:var(--text);box-shadow:0 8px 32px rgba(0,0,0,0.4);transform:translateY(20px);opacity:0;transition:all 0.22s;pointer-events:none; }
  .wtoast.show { transform:none;opacity:1; }
  .wtoast-msg { font-size:12px;color:var(--text-mid); }
  .wtoast-msg strong { color:var(--text); }
`

// ── DATA ────────────────────────────────────────────────────────────────────
const INITIAL_DB = {
  clients: [
    { id:'harrington', initials:'HF', avClass:'av-g', tier:'trust', category:'trust', name:'Harrington Family Office', org:'Multi-generational Wealth', aum:'$340M', heat:3, heatWarn:true, status:'p-warm', statusLabel:'⚑ Alert', lastTouch:'2d ago', pipeline:'$40M', score:6.2, scoreClass:'sc-med', tags:['Estate Planning','Fixed Income','Multi-gen'], flags:['T+3 settlement discrepancy — $2.4M MSFT bonds'], opps:['Restructure fixed income allocation Q2 2026'], notes:'Client sensitive about fee transparency. Prefers email, not phone. Annual meeting in April.' },
    { id:'henderson', initials:'HC', avClass:'av-b', tier:'inst', category:'inst', name:'Henderson Capital', org:'Institutional Mandate · $180M AUM', aum:'$180M', heat:2, heatWarn:false, status:'p-cold', statusLabel:'● Cold', lastTouch:'47d ago', pipeline:'$65M', score:3.1, scoreClass:'sc-low', tags:['Equity','Alternatives','Q1 Review'], flags:['No contact in 47 days — Q1 review cycle starts 2 Mar'], opps:['Expand alternatives allocation','Introduce ESG overlay'], notes:'Key contact: James H., CIO. Very direct, numbers-driven. Meets quarterly.' },
    { id:'kapur', initials:'KP', avClass:'av-gr', tier:'uhnw', category:'uhnw', name:'Kapur Private Trust', org:'UHNW Individual · $95M AUM', aum:'$95M', heat:5, heatWarn:false, status:'p-active', statusLabel:'● Active', lastTouch:'Today', pipeline:'$20M', score:8.7, scoreClass:'sc-high', tags:['UHNW','Private Equity','Philanthropy'], flags:[], opps:['Introduce private credit product','Philanthropy advisory conversation'], notes:'Highly engaged. Values strategic insight over product pitch. Birthday in March — send note.' },
    { id:'okafor', initials:'OV', avClass:'av-a', tier:'inst', category:'inst', name:'Okafor Ventures', org:'Emerging Prospect · Est. $60M', aum:'Est $60M', heat:3, heatWarn:false, status:'p-new', statusLabel:'✦ New', lastTouch:'5d ago', pipeline:'$60M', score:6.8, scoreClass:'sc-med', tags:['New Prospect','Competitor Exit','VC-backed'], flags:[], opps:['$60M mandate — competitor outflow signal','First-mover advantage window: 2 weeks'], notes:'Warm introduction via Kapur. Tech-forward expectations. Needs digital-first onboarding.' },
    { id:'whitmore', initials:'WT', avClass:'av-s', tier:'trust', category:'trust', name:'Whitmore Trust', org:'Family Trust · $210M AUM', aum:'$210M', heat:4, heatWarn:false, status:'p-active', statusLabel:'● Active', lastTouch:'1d ago', pipeline:'$85M', score:5.9, scoreClass:'sc-med', tags:['Trust Structure','Bonds','Capital Preservation'], flags:[], opps:['Structured products pitch — scheduled March review'], notes:'Trustee review board meets quarterly. Conservative mandate. Risk-averse.' },
    { id:'strand', initials:'SB', avClass:'av-g', tier:'uhnw', category:'uhnw', name:'Strand-Blackwell Family', org:'UHNW · $420M AUM', aum:'$420M', heat:5, heatWarn:false, status:'p-active', statusLabel:'● Active', lastTouch:'3d ago', pipeline:'$80M', score:9.4, scoreClass:'sc-high', tags:['UHNW','Real Assets','Family Office'], flags:[], opps:['Real assets expansion','Next-gen wealth planning'], notes:'Flagship relationship. Three generations. Annual strategy offsite in Zurich each June.' },
    { id:'reinhardt', initials:'RC', avClass:'av-b', tier:'inst', category:'inst', name:'Reinhardt Capital', org:'Institutional · $150M AUM', aum:'$150M', heat:1, heatWarn:true, status:'p-cold', statusLabel:'● Cold', lastTouch:'22d ago', pipeline:'$30M', score:2.8, scoreClass:'sc-low', tags:['Institutional','Fee Sensitivity'], flags:['Custodian fee mismatch — $18,400 delta across 3 accounts'], opps:[], notes:'Fee-sensitive mandate. Relationship at risk. Recommend immediate contact from senior banker.' },
  ],
  network: [
    { id:'n1', initials:'MR', avClass:'av-gr', tier:'tier-1', name:'Marcus Reid', org:'Private Bank Introducer', tags:['Top Introducer','3 Referrals 2025'], score:'12', scoreLbl:'referrals', lastTouch:'1w' },
    { id:'n2', initials:'LA', avClass:'av-g', tier:'tier-1', name:'Lena Ashworth', org:'M&A Advisory · Cross-sell', tags:['M&A','Corporate Advisory'], score:'2', scoreLbl:'active deals', lastTouch:'3d' },
    { id:'n3', initials:'TK', avClass:'av-b', tier:'tier-2', name:'Tariq Khan', org:'Legal Counsel · Referral', tags:['Estate Law','Trust Setup'], score:'5', scoreLbl:'referrals', lastTouch:'2w' },
    { id:'n4', initials:'FN', avClass:'av-a', tier:'tier-2', name:'Fiona Ng', org:'Family Business Advisor', tags:['Succession','UHNW'], score:'4', scoreLbl:'introductions', lastTouch:'1m' },
    { id:'n5', initials:'JB', avClass:'av-v', tier:'tier-3', name:'James Bowman', org:'Tax Partner · Referral', tags:['Tax Planning'], score:'1', scoreLbl:'referral', lastTouch:'2m' },
    { id:'n6', initials:'SP', avClass:'av-s', tier:'tier-2', name:'Sofia Patel', org:'Family Office Consultant', tags:['FO Setup','Multi-gen'], score:'3', scoreLbl:'introductions', lastTouch:'3w' },
  ],
  alerts: [
    { id:'a1', sev:'as-high', client:'Harrington Family Office', desc:'T+3 settlement discrepancy — $2.4M unreconciled in MSFT fixed income allocation. Custodian vs internal position mismatch.', amount:'−$2.4M', resolved:false },
    { id:'a2', sev:'as-high', client:'Henderson Capital', desc:'No relationship contact in 47 days. Q1 investment review begins 2 March. Churn risk: HIGH. Immediate outreach required.', amount:'Risk: $65M', resolved:false },
    { id:'a3', sev:'as-high', client:'Reinhardt Capital', desc:'Custodian fee mismatch across 3 accounts. Delta of $18,400 pending reconciliation review with ops team.', amount:'−$18.4K', resolved:false },
    { id:'a4', sev:'as-med', client:'Strand-Blackwell Family', desc:'FX rate applied at wrong tenor on 2 transactions — GBP/USD mismatch, trade date vs settlement date.', amount:'−$6.1K', resolved:false },
    { id:'a5', sev:'as-med', client:'Kapur Private Trust', desc:'Corporate action timing offset — dividend credited on wrong date. Low financial impact, notation required.', amount:'−$1.2K', resolved:false },
    { id:'a6', sev:'as-low', client:'Okafor Ventures', desc:'KYC documentation refresh required before onboarding. AML sign-off pending compliance review.', amount:'Compliance', resolved:false },
    { id:'a7', sev:'as-low', client:'Whitmore Trust', desc:'Mandate review document unsigned — 3 days past target return date. Trustee follow-up needed.', amount:'Admin', resolved:false },
  ],
  activity: [
    { type:'tl-call', what:'Portfolio review call', who:'Kapur Private Trust', when:'Today · 10:30 AM' },
    { type:'tl-flag', what:'Settlement discrepancy flagged', who:'Harrington Family Office', when:'Today · 09:14 AM' },
    { type:'tl-email', what:'Q1 strategy note sent', who:'Whitmore Trust', when:'Yesterday · 3:45 PM' },
    { type:'tl-meet', what:'Intro meeting — new prospect', who:'Okafor Ventures', when:'Fri 20 Feb · 2:00 PM' },
    { type:'tl-meet', what:'Annual review discussion', who:'Strand-Blackwell Family', when:'Thu 19 Feb · 11:00 AM' },
    { type:'tl-email', what:'Mandate renewal letter sent', who:'Reinhardt Capital', when:'Wed 18 Feb · 9:00 AM' },
    { type:'tl-call', what:'Quarterly performance review', who:'Henderson Capital', when:'Tue 14 Jan · 2:30 PM' },
    { type:'tl-note', what:'Client preference update logged', who:'Kapur Private Trust', when:'Mon 13 Jan · 4:00 PM' },
  ],
  signals: [
    { type:'sig-crit', client:'Harrington Family Office', detail:'T+3 settlement gap — $2.4M unreconciled. Same-day resolution required.', time:'09:14 today', tag:'t-crit', tagLabel:'CRITICAL' },
    { type:'sig-warn', client:'Henderson Capital', detail:'47 days without contact. Q1 review cycle opens next week. Churn probability elevated.', time:'Auto-detected', tag:'t-warn', tagLabel:'REL RISK' },
    { type:'sig-opp', client:'Okafor Ventures', detail:'Competitor outflows detected. $60M mandate actively reviewing alternatives.', time:'2d ago', tag:'t-opp', tagLabel:'OPPORTUNITY' },
    { type:'sig-info', client:'Kapur Private Trust', detail:'Private credit product suitable based on last call discussion. Time to pitch.', time:'3d ago', tag:'t-info', tagLabel:'INTEL' },
  ],
  scores: [
    { name:'Strand-Blackwell', val:9.4, cls:'sc-high', id:'strand' },
    { name:'Kapur Trust', val:8.7, cls:'sc-high', id:'kapur' },
    { name:'Okafor Ventures', val:6.8, cls:'sc-med', id:'okafor' },
    { name:'Harrington FO', val:6.2, cls:'sc-med', id:'harrington' },
    { name:'Whitmore Trust', val:5.9, cls:'sc-med', id:'whitmore' },
    { name:'Henderson Cap', val:3.1, cls:'sc-low', id:'henderson' },
  ],
  intelligence: [
    { cat:'opp', icon:'💰', icClass:'ii-green', title:'Competitor AUM Outflows — Opportunity Window', body:"Intelligence signals indicate significant outflows from a major competitor's wealth division. Okafor Ventures and 2 other UHNW prospects are actively reviewing mandates. Estimated window: 2–3 weeks before re-allocation decisions.", source:'Market Intel · Network Scan', time:'Today' },
    { cat:'risk', icon:'⚠', icClass:'ii-red', title:'Interest Rate Sensitivity — Fixed Income Portfolios', body:'BoE signals potential 25bps cut in March MPC meeting. Review fixed income exposure across Harrington FO, Whitmore Trust, and Reinhardt Capital. Duration risk elevated for long-dated positions.', source:'Macro Signal · Bloomberg', time:'Today' },
    { cat:'opp', icon:'✦', icClass:'ii-gold', title:'Private Credit Product — Kapur Trust Fit', body:'Based on Q4 review conversation, Kapur indicated appetite for illiquid premium. New private credit mandate (8.2% target yield) launching March. Recommend pitch by end of February to secure allocation.', source:'CRM · Product Launch', time:'Yesterday' },
    { cat:'market', icon:'◎', icClass:'ii-blue', title:'Q1 Equity Market Positioning — Client Portfolio Review', body:'S&P and FTSE 100 both up QoQ. 6 client portfolios underperforming relative benchmark by >50bps. Proactive performance conversations recommended before clients initiate them.', source:'Portfolio Analytics', time:'Yesterday' },
    { cat:'risk', icon:'📋', icClass:'ii-red', title:'Mandate Renewals Due — 3 Clients', body:'Whitmore Trust, Reinhardt Capital, and Henderson Capital all have mandate renewals outstanding in the next 30 days. Non-renewal triggers a compliance escalation. Status: 1 signed, 2 outstanding.', source:'Compliance · CRM', time:'2d ago' },
    { cat:'opp', icon:'🌍', icClass:'ii-green', title:'Next-Gen Wealth Transfer — Strand-Blackwell', body:'Strand-Blackwell next-generation family members (two in 30s) identified as new contact targets. Proactive next-gen programme invitation recommended. Potential for $80M+ separate mandate over 5 years.', source:'Relationship Memory · CRM', time:'3d ago' },
  ],
  pipeline: {
    stages: ['Discovery','Qualified','Proposal','Negotiation','Closing'],
    deals: [
      { stage:'Discovery', name:'Okafor Ventures', val:'$60M', owner:'Sarah W.', age:'5d', hot:true },
      { stage:'Discovery', name:'Blackpool Endowment', val:'$35M', owner:'Sarah W.', age:'12d', hot:false },
      { stage:'Discovery', name:'Prentiss Holdings', val:'$25M', owner:'James K.', age:'18d', hot:false },
      { stage:'Qualified', name:'Henderson Capital +', val:'$65M', owner:'Sarah W.', age:'30d', hot:false },
      { stage:'Qualified', name:'MUFG Pension', val:'$30M', owner:'Tom R.', age:'22d', hot:false },
      { stage:'Proposal', name:'Whitmore Trust +', val:'$85M', owner:'Sarah W.', age:'14d', hot:false },
      { stage:'Proposal', name:'Rani Family Office', val:'$22M', owner:'James K.', age:'8d', hot:true },
      { stage:'Negotiation', name:'Strand-Blackwell +', val:'$80M', owner:'Sarah W.', age:'6d', hot:true },
      { stage:'Negotiation', name:'Ashford Capital', val:'$20M', owner:'Tom R.', age:'11d', hot:false },
      { stage:'Closing', name:'Kapur Trust +', val:'$20M', owner:'Sarah W.', age:'3d', hot:true },
      { stage:'Closing', name:'Delacroix Partners', val:'$28M', owner:'James K.', age:'7d', hot:false },
      { stage:'Closing', name:'Singh Family Trust', val:'$12M', owner:'Tom R.', age:'9d', hot:false },
    ]
  },
  referrals: [
    { from:'Marcus Reid', client:'Okafor Ventures', val:'$60M', status:'Active', date:'15 Feb 2026' },
    { from:'Lena Ashworth', client:'Rani Family Office', val:'$22M', status:'Proposal', date:'10 Feb 2026' },
    { from:'Tariq Khan', client:'Singh Family Trust', val:'$12M', status:'Closing', date:'2 Feb 2026' },
    { from:'Marcus Reid', client:'Prentiss Holdings', val:'$25M', status:'Discovery', date:'20 Jan 2026' },
    { from:'Sofia Patel', client:'Blackpool Endowment', val:'$35M', status:'Discovery', date:'18 Jan 2026' },
  ],
  memory: [
    { client:'Harrington Family Office', avatar:'HF', avClass:'av-g', notes:['Margaret prefers email contact before any call — never call unannounced','Annual in-person review: April, client travels to London for this','Third generation now involved: ask about Thomas (26) — potential successor','Fee review pending — sensitive topic, approach carefully in Q2'] },
    { client:'Kapur Private Trust', avatar:'KP', avClass:'av-gr', notes:['Birthday: 17 March — send handwritten note','Passion: Contemporary art collection (Lisson Gallery client)','Loves data — always bring quantitative backup to meetings','Philanthropy conversation deferred from Jan — re-raise in March'] },
    { client:'Henderson Capital', avatar:'HC', avClass:'av-b', notes:['James Henderson: CIO, Oxford PPE, prefers concise decks (max 8 slides)','Q1 review cycle is critical — never miss it','Lost a previous mandate to competitor on fee grounds — fee sensitivity HIGH','Internal champion: Victoria (Associate Director) — maintain relationship'] },
    { client:'Strand-Blackwell Family', avatar:'SB', avClass:'av-g', notes:['Annual strategy offsite: June, Zurich — book early','Three generations involved: Sir Geoffrey (patriarch), Edward (son), Clara (granddaughter)','Clara increasingly influential — cultivate direct relationship','Real assets preference — no crypto exposure under any circumstances'] },
  ],
}

// ── CLOCK (isolated so ticking doesn't re-render the whole app) ────────────
function Clock() {
  const [clock, setClock] = useState('')
  useEffect(() => {
    const tick = () => {
      const now = new Date()
      setClock(now.toLocaleTimeString('en-GB', { hour:'2-digit', minute:'2-digit', second:'2-digit' }) + ' GMT')
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  return <div className="wmi-clock">{clock}</div>
}

// ── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function WMIApp() {
  const nav = useNavigate()
  const [db, setDb] = useState(() => JSON.parse(JSON.stringify(INITIAL_DB)))
  const [page, setPage] = useState('focus')
  const [modal, setModal] = useState(null) // { type, data }
  const [toast, setToast] = useState({ show:false, icon:'', msg:'' })

  const [clientFilter, setClientFilter] = useState('all')
  const [intelFilter, setIntelFilter] = useState('all')
  const [clientTier, setClientTier] = useState('all')
  const [clientSearch, setClientSearch] = useState('')
  const [noteText, setNoteText] = useState('')
  const toastTimer = useRef(null)











  function showToast(icon, msg) {
    setToast({ show:true, icon, msg })
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(t => ({ ...t, show:false })), 2800)
  }

  function openClientModal(id) {
    const c = db.clients.find(c => c.id === id)
    if(c) { setNoteText(''); setModal({ type:'client', data:c }) }
  }

  function closeModal() { setModal(null) }

  function resolveAlert(id) {
    setDb(d => {
      const nd = JSON.parse(JSON.stringify(d))
      const a = nd.alerts.find(a => a.id === id)
      if(a) { a.resolved = true; showToast('✓', `<strong>${a.client}</strong> alert resolved`) }
      return nd
    })
  }

  function resolveAllAlerts() {
    setDb(d => { const nd = JSON.parse(JSON.stringify(d)); nd.alerts.forEach(a => a.resolved = true); return nd })
    showToast('✓', '<strong>All alerts</strong> marked as resolved')
  }

  function logCall(id) {
    setDb(d => {
      const nd = JSON.parse(JSON.stringify(d))
      const c = nd.clients.find(c => c.id === id)
      if(!c) return nd
      c.lastTouch = 'Just now'
      if(c.heat < 5) c.heat++
      c.heatWarn = false
      const s = nd.scores.find(s => s.id === id)
      if(s) s.val = Math.min(10, parseFloat((s.val + 0.3).toFixed(1)))
      nd.activity.unshift({ type:'tl-call', what:'Call logged', who:c.name, when:'Just now' })
      showToast('📞', `<strong>Call logged</strong> with ${c.name}`)
      return nd
    })
  }

  function saveNote(id) {
    if(!noteText.trim()) { showToast('⚠', '<strong>Note empty</strong> — nothing to save'); return }
    setDb(d => {
      const nd = JSON.parse(JSON.stringify(d))
      const c = nd.clients.find(c => c.id === id)
      if(c) { c.notes = noteText + '\n\n' + c.notes; showToast('💾', `<strong>Note saved</strong> to ${c.name}`) }
      return nd
    })
    setNoteText('')
  }

  function advanceDeal(name, stage) {
    setDb(d => {
      const nd = JSON.parse(JSON.stringify(d))
      const stages = nd.pipeline.stages
      const idx = stages.indexOf(stage)
      const deal = nd.pipeline.deals.find(d => d.name === name)
      if(deal && idx < stages.length - 1) {
        deal.stage = stages[idx + 1]
        showToast('↗', `<strong>${name}</strong> advanced to ${stages[idx + 1]}`)
      } else {
        showToast('🏆', `<strong>${name}</strong> deal closed!`)
      }
      return nd
    })
  }

  const alertCount = db.alerts.filter(a => !a.resolved).length

  // ── RENDER HELPERS ─────────────────────────────────────────────────────────
  function HeatBar({ heat, heatWarn }) {
    return (
      <div className="wheat">
        {[1,2,3,4,5].map(i => (
          <div key={i} className={`whs${i <= heat ? (i === heat && heatWarn ? ' warn' : ' on') : ''}`} />
        ))}
      </div>
    )
  }

  function ClientRow({ c }) {
    return (
      <div className="wct-row" onClick={() => openClientModal(c.id)}>
        <div className={`wav ${c.avClass}`}>{c.initials}</div>
        <div><div className="c-name">{c.name}</div><div className="c-role">{c.org}</div></div>
        <HeatBar heat={c.heat} heatWarn={c.heatWarn} />
        <div><span className={`wpill ${c.status}`}>{c.statusLabel}</span></div>
        <div className="mono-sm">{c.aum}</div>
        <div className="mono-sm">{c.lastTouch}</div>
        <div onClick={e => e.stopPropagation()}>
          <div className="waction-ic" onClick={() => logCall(c.id)} title="Log call">📞</div>
        </div>
      </div>
    )
  }

  function filteredClients(f) {
    let list = db.clients
    if(f === 'risk') list = list.filter(c => c.status === 'p-cold')
    if(f === 'hot') list = list.filter(c => c.heat >= 4)
    return list
  }

  function filteredClientsByTier(tier, search) {
    let list = db.clients
    if(tier === 'uhnw') list = list.filter(c => c.category === 'uhnw')
    if(tier === 'inst') list = list.filter(c => c.category === 'inst')
    if(tier === 'trust') list = list.filter(c => c.category === 'trust')
    if(search) list = list.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.org.toLowerCase().includes(search.toLowerCase()))
    return list
  }

  // ── PAGES ──────────────────────────────────────────────────────────────────
  function PageFocus() {
    return (
      <div className="wmi-page active" style={{display:'flex'}}>
        <div className="wmi-ph">
          <div className="wmi-breadcrumb">WMI · <span className="bc-active">Focus</span></div>
          <div className="wmi-ph-row">
            <div>
              <div className="wmi-ph-title">Relationship Command Centre</div>
              <div className="wmi-ph-sub">Client intelligence, signals & relationship health</div>
            </div>
            <div className="wmi-ph-actions">
              <button className="wbtn" onClick={() => showToast('📤','<strong>Export</strong> report generated')}>Export</button>
              <button className="wbtn wbtn-gold" onClick={() => showToast('✓','<strong>New client</strong> modal coming soon')}>+ New Client</button>
            </div>
          </div>
        </div>
        <div className="wmi-scroll">
          {/* AI Strip */}
          <div className="wai-strip">
            <div className="wai-gem">✦</div>
            <div style={{flex:1}}>
              <div className="wai-title">Morning Intelligence · 22 Feb 2026</div>
              <div className="wai-body">
                <strong>3 priority actions</strong> need attention today. <strong>Henderson Capital</strong> has not been contacted in <strong>47 days</strong> — their Q1 review cycle starts next week, high churn risk. <strong>Harrington FO</strong> has a settlement discrepancy flagged overnight; <strong>$2.4M</strong> unreconciled requiring same-day resolution. New signal: competitor outflows suggest <strong>Okafor Ventures</strong> ($60M mandate) is actively reviewing alternatives.
              </div>
              <div className="wai-acts">
                <button className="wai-btn" onClick={() => setPage('alerts')}>Review Flags</button>
                <button className="wai-btn" onClick={() => openClientModal('henderson')}>Contact Henderson</button>
                <button className="wai-btn" onClick={() => openClientModal('okafor')}>Outreach Okafor</button>
                <button className="wai-btn" onClick={() => setPage('briefing')}>Full Briefing →</button>
              </div>
            </div>
          </div>

          {/* KPIs */}
          <div className="wkpi-row">
            {[
              { c:'c-gold', label:'AUM Managed', val:'$2.7B', delta:'d-up', deltaText:'↑ 4.2% QoQ', page:'clients' },
              { c:'c-green', label:'Active Clients', val:'84', delta:'d-up', deltaText:'+3 this month', page:'clients' },
              { c:'c-red', label:'Open Alerts', val:String(alertCount), delta:'d-down', deltaText:'↑ 3 new today', page:'alerts' },
              { c:'c-blue', label:'Pipeline Value', val:'$380M', delta:'d-warn', deltaText:'3 stalled deals', page:'pipeline' },
              { c:'c-amber', label:'Relationship Score', val:'7.2', delta:'d-down', deltaText:'↓ from 8.1' },
            ].map((k,i) => (
              <div key={i} className={`wkpi ${k.c}`} style={{animationDelay:`${i*0.05}s`}} onClick={() => k.page && setPage(k.page)}>
                <div className="wkpi-label">{k.label}</div>
                <div className="wkpi-val">{k.val}</div>
                <div className={`wkpi-delta ${k.delta}`}>{k.deltaText}</div>
              </div>
            ))}
          </div>

          {/* Two col */}
          <div className="two-col">
            <div className="wpanel">
              <div className="wpanel-h">
                <div className="wpanel-title"><div className="pt-dot" style={{background:'var(--gold)'}}/>Priority Relationships</div>
                <div className="wpanel-aux">
                  <div className="wtab-row-inline">
                    {['all','risk','hot'].map(f => (
                      <div key={f} className={`wtab${clientFilter === f ? ' active' : ''}`} onClick={() => setClientFilter(f)}>{f.charAt(0).toUpperCase()+f.slice(1)}</div>
                    ))}
                  </div>
                  <div className="wpanel-link" onClick={() => setPage('clients')}>All Clients →</div>
                </div>
              </div>
              <div className="wct-head">
                <div/><div className="col-h">Client</div><div className="col-h">Rel. Heat</div>
                <div className="col-h">Status</div><div className="col-h">AUM</div>
                <div className="col-h">Last Touch</div><div className="col-h">Act.</div>
              </div>
              {filteredClients(clientFilter).map(c => <ClientRow key={c.id} c={c} />)}
            </div>

            <div className="right-stack">
              <div className="wpanel">
                <div className="wpanel-h">
                  <div className="wpanel-title"><div className="pt-dot" style={{background:'var(--red)'}}/>Signal Feed</div>
                  <div className="wpanel-link" onClick={() => setPage('alerts')}>Clear All</div>
                </div>
                {db.signals.map((s,i) => (
                  <div key={i} className="wsf-item" onClick={() => { const c = db.clients.find(c => c.name === s.client); if(c) openClientModal(c.id) }}>
                    <div className={`wsig-dot ${s.type}`}/>
                    <div style={{flex:1}}>
                      <div className="wsf-client">{s.client}</div>
                      <div className="wsf-detail">{s.detail}</div>
                      <div className="wsf-meta">
                        <div className="wsf-time">{s.time}</div>
                        <div className={`wsf-tag ${s.tag}`}>{s.tagLabel}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="wpanel">
                <div className="wpanel-h">
                  <div className="wpanel-title"><div className="pt-dot" style={{background:'var(--blue)'}}/>Pipeline Stages</div>
                  <div className="wpanel-link" onClick={() => setPage('pipeline')}>$380M →</div>
                </div>
                <div style={{padding:'14px 0 6px'}}>
                  {[['Discovery','90%','var(--blue)','$120M'],['Qualified','65%','var(--gold)','$95M'],['Proposal','52%','var(--amber)','$80M'],['Negotiation','36%','var(--green)','$55M'],['Closing','20%','var(--green)','$30M']].map(([label,w,color,val]) => (
                    <div key={label} className="wpipe-row">
                      <div className="wpipe-label">{label}</div>
                      <div className="wpipe-wrap"><div className="wpipe-bar" style={{width:w,background:color}}/></div>
                      <div className="wpipe-val">{val}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom 3-col */}
          <div className="three-col">
            <div className="wpanel">
              <div className="wpanel-h">
                <div className="wpanel-title"><div className="pt-dot" style={{background:'var(--red)'}}/>Open Issues</div>
                <div className="wpanel-link" onClick={() => setPage('alerts')}>{alertCount} open →</div>
              </div>
              {db.alerts.filter(a=>!a.resolved).slice(0,4).map(a => (
                <div key={a.id} className="walert-item" onClick={() => setModal({ type:'alert', data:a })}>
                  <div className={`walert-sev ${a.sev}`}/>
                  <div style={{flex:1}}>
                    <div className="walert-name">{a.client}</div>
                    <div className="walert-desc">{a.desc.substring(0,80)}…</div>
                  </div>
                  <div className="walert-amount">{a.amount}</div>
                </div>
              ))}
            </div>
            <div className="wpanel">
              <div className="wpanel-h">
                <div className="wpanel-title"><div className="pt-dot" style={{background:'var(--silver)'}}/>Recent Activity</div>
                <div className="wpanel-link" onClick={() => setPage('activity')}>Full Log →</div>
              </div>
              {db.activity.slice(0,5).map((a,i) => (
                <div key={i} className="wtl-item" style={{padding:'9px 17px'}}>
                  <div className={`wtl-dot ${a.type}`}/>
                  <div>
                    <div className="wtl-what">{a.what}</div>
                    <div className="wtl-who">{a.who}</div>
                    <div className="wtl-when">{a.when}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="wpanel">
              <div className="wpanel-h">
                <div className="wpanel-title"><div className="pt-dot" style={{background:'var(--gold)'}}/>Relationship Scores</div>
                <div className="wpanel-link">AI-powered</div>
              </div>
              <div className="wscore-grid">
                {db.scores.map(s => (
                  <div key={s.id} className="wscore-cell" onClick={() => openClientModal(s.id)}>
                    <div className={`sc-val ${s.cls}`}>{s.val}</div>
                    <div className="sc-name">{s.name}</div>
                  </div>
                ))}
              </div>
              <div style={{padding:'10px 15px',borderTop:'1px solid var(--border)'}}>
                <div style={{fontSize:'10px',color:'var(--text-mid)',lineHeight:'1.55'}}>Computed from: contact frequency, response rate, meeting cadence, and growth signals.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  function PageClients() {
    const list = filteredClientsByTier(clientTier, clientSearch)
    return (
      <div className="wmi-page active" style={{display:'flex'}}>
        <div className="wmi-ph">
          <div className="wmi-breadcrumb">WMI · <span className="bc-active">Clients</span></div>
          <div className="wmi-ph-row">
            <div><div className="wmi-ph-title">Client Book</div><div className="wmi-ph-sub">84 active relationships · $2.7B AUM under management</div></div>
            <div className="wmi-ph-actions">
              <button className="wbtn wbtn-gold" onClick={() => showToast('✓','<strong>New client</strong> modal — coming soon')}>+ New Client</button>
            </div>
          </div>
        </div>
        <div className="wsearch-bar">
          <span style={{color:'var(--text-dim)'}}>⌕</span>
          <input className="wsearch-input" value={clientSearch} onChange={e => setClientSearch(e.target.value)} placeholder="Search clients, organisations, tiers…"/>
          <div style={{display:'flex',gap:'6px'}}>
            {['all','uhnw','inst','trust'].map(t => (
              <div key={t} className={`wf-chip${clientTier === t ? ' active':''}`} onClick={() => setClientTier(t)}>{t.toUpperCase()}</div>
            ))}
          </div>
        </div>
        <div className="wmi-scroll">
          <div className="wcc-grid">
            {list.map(c => {
              const tierClass = c.heat >= 4 ? 'tier-1' : c.heat >= 2 ? 'tier-2' : 'tier-3'
              return (
                <div key={c.id} className={`wcc ${tierClass}`} onClick={() => openClientModal(c.id)}>
                  <div className="wcc-top">
                    <div className={`wav ${c.avClass}`} style={{width:'36px',height:'36px',fontSize:'11px'}}>{c.initials}</div>
                    <div><div className="wcc-name">{c.name}</div><div className="wcc-org">{c.org}</div></div>
                  </div>
                  <div className="wcc-stats">
                    <div className="wcc-stat"><div className="wcc-stat-val">{c.score}</div><div className="wcc-stat-lbl">Score</div></div>
                    <div className="wcc-stat"><div className="wcc-stat-val">{c.aum.replace('Est ','')}</div><div className="wcc-stat-lbl">AUM</div></div>
                    <div className="wcc-stat"><div className="wcc-stat-val">{c.heat}/5</div><div className="wcc-stat-lbl">Heat</div></div>
                  </div>
                  <div className="wcc-tags">{c.tags.map(t => <div key={t} className="wcc-tag">{t}</div>)}</div>
                  <div style={{display:'flex',gap:'6px',marginTop:'10px',paddingTop:'10px',borderTop:'1px solid var(--border)'}} onClick={e=>e.stopPropagation()}>
                    <button className="wbtn" style={{flex:1,fontSize:'10px'}} onClick={() => logCall(c.id)}>Log Call</button>
                    <button className="wbtn" style={{flex:1,fontSize:'10px'}} onClick={() => showToast('📧',`<strong>Email</strong> for ${c.name}`)}>Email</button>
                    <button className="wbtn" style={{flex:1,fontSize:'10px'}} onClick={() => showToast('📅',`<strong>Meeting</strong> scheduled with ${c.name}`)}>Schedule</button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  function PageIntelligence() {
    const filtered = intelFilter === 'all' ? db.intelligence : db.intelligence.filter(i => i.cat === intelFilter)
    return (
      <div className="wmi-page active" style={{display:'flex'}}>
        <div className="wmi-ph">
          <div className="wmi-breadcrumb">WMI · <span className="bc-active">Intelligence</span></div>
          <div className="wmi-ph-row">
            <div><div className="wmi-ph-title">Market & Client Intelligence</div><div className="wmi-ph-sub">AI-curated signals, competitor movements & opportunity detection</div></div>
            <div className="wmi-ph-actions">
              <button className="wbtn" onClick={() => showToast('🔄','<strong>Refreshing</strong> intelligence feed…')}>Refresh</button>
              <button className="wbtn wbtn-gold" onClick={() => showToast('⚙','<strong>Filters</strong> — configure signal sources')}>Configure</button>
            </div>
          </div>
        </div>
        <div className="wtab-row">
          {[['all','All Signals'],['opp','Opportunities'],['risk','Risk Flags'],['market','Market']].map(([v,l]) => (
            <div key={v} className={`wtab${intelFilter===v?' active':''}`} onClick={() => setIntelFilter(v)}>{l}</div>
          ))}
        </div>
        <div className="wmi-scroll">
          <div className="wpanel">
            {filtered.map((item,i) => (
              <div key={i} className="wintel-item">
                <div className={`wintel-icon ${item.icClass}`}>{item.icon}</div>
                <div style={{flex:1}}>
                  <div className="wintel-title">{item.title}</div>
                  <div className="wintel-body">{item.body}</div>
                  <div className="wintel-footer">
                    <div className="wintel-source">{item.source} · {item.time}</div>
                    <div className="wintel-acts">
                      <div className="wintel-act" onClick={() => showToast('📋','<strong>Action</strong> added to task list')}>Add Task</div>
                      <div className="wintel-act" onClick={() => showToast('📧','<strong>Note</strong> saved to Memory')}>Save</div>
                      <div className="wintel-act" onClick={() => showToast('✓','<strong>Signal</strong> dismissed')}>Dismiss</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  function PagePipeline() {
    return (
      <div className="wmi-page active" style={{display:'flex'}}>
        <div className="wmi-ph">
          <div className="wmi-breadcrumb">WMI · <span className="bc-active">Pipeline</span></div>
          <div className="wmi-ph-row">
            <div><div className="wmi-ph-title">Deal Pipeline</div><div className="wmi-ph-sub">12 active opportunities · $380M total value</div></div>
            <div className="wmi-ph-actions">
              <button className="wbtn wbtn-gold" onClick={() => showToast('➕','<strong>New opportunity</strong> added')}>+ Opportunity</button>
            </div>
          </div>
        </div>
        <div className="wmi-scroll">
          <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:'12px',alignItems:'start'}}>
            {db.pipeline.stages.map(stage => {
              const deals = db.pipeline.deals.filter(d => d.stage === stage)
              const total = deals.reduce((s,d) => s + parseFloat(d.val.replace('$','').replace('M','')), 0)
              return (
                <div key={stage}>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'8px',letterSpacing:'0.14em',color:'var(--text-dim)',textTransform:'uppercase',paddingBottom:'10px'}}>
                    {stage} <span style={{color:'var(--gold)'}}>{deals.length}</span> · ${total}M
                  </div>
                  {deals.map(d => (
                    <div key={d.name} className="wpanel" style={{marginBottom:'8px',cursor:'pointer'}} onClick={() => showToast('◈',`<strong>${d.name}</strong> · ${d.stage} · ${d.val}`)}>
                      <div style={{padding:'11px 13px'}}>
                        {d.hot && <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'7px',color:'var(--gold)',letterSpacing:'0.1em',marginBottom:'5px'}}>● HOT</div>}
                        <div style={{fontSize:'11px',fontWeight:'500',color:'var(--text)',marginBottom:'3px'}}>{d.name}</div>
                        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'11px',color:'var(--gold)'}}>{d.val}</div>
                        <div style={{display:'flex',justifyContent:'space-between',marginTop:'8px',paddingTop:'7px',borderTop:'1px solid var(--border)'}}>
                          <div style={{fontSize:'9px',color:'var(--text-dim)'}}>{d.owner}</div>
                          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'8px',color:'var(--text-dim)'}}>{d.age}</div>
                        </div>
                        <div style={{display:'flex',gap:'4px',marginTop:'8px'}} onClick={e=>e.stopPropagation()}>
                          <button className="wbtn" style={{fontSize:'9px',padding:'3px 7px',flex:1}} onClick={() => advanceDeal(d.name,d.stage)}>Advance</button>
                          <button className="wbtn wbtn-red" style={{fontSize:'9px',padding:'3px 7px',flex:1}} onClick={() => showToast('✗',`<strong>${d.name}</strong> flagged for review`)}>Flag</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  function PageAlerts() {
    return (
      <div className="wmi-page active" style={{display:'flex'}}>
        <div className="wmi-ph">
          <div className="wmi-breadcrumb">WMI · <span className="bc-active">Alerts</span></div>
          <div className="wmi-ph-row">
            <div><div className="wmi-ph-title">Open Alerts</div><div className="wmi-ph-sub">{alertCount} items requiring attention · 3 critical</div></div>
            <div className="wmi-ph-actions">
              <button className="wbtn" onClick={resolveAllAlerts}>Mark All Resolved</button>
              <button className="wbtn wbtn-gold" onClick={() => showToast('📤','<strong>Alert report</strong> sent to compliance')}>Send to Compliance</button>
            </div>
          </div>
        </div>
        <div className="wmi-scroll">
          <div className="wpanel">
            {db.alerts.map(a => (
              <div key={a.id} className="walert-item" style={{opacity:a.resolved?0.4:1}} onClick={() => setModal({type:'alert',data:a})}>
                <div className={`walert-sev ${a.sev}`}/>
                <div style={{flex:1}}>
                  <div className="walert-name">{a.client} {a.resolved && <span style={{fontSize:'9px',color:'var(--green)',marginLeft:'6px'}}>✓ Resolved</span>}</div>
                  <div className="walert-desc">{a.desc}</div>
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:'5px',alignItems:'flex-end'}}>
                  <div className="walert-amount">{a.amount}</div>
                  {!a.resolved && <button className="wbtn wbtn-green" style={{fontSize:'9px',padding:'3px 8px'}} onClick={e=>{e.stopPropagation();resolveAlert(a.id)}}>Resolve</button>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  function PageActivity() {
    return (
      <div className="wmi-page active" style={{display:'flex'}}>
        <div className="wmi-ph">
          <div className="wmi-breadcrumb">WMI · <span className="bc-active">Activity</span></div>
          <div className="wmi-ph-row">
            <div><div className="wmi-ph-title">Activity Log</div><div className="wmi-ph-sub">All client interactions, touchpoints & system events</div></div>
          </div>
        </div>
        <div className="wmi-scroll">
          <div className="wpanel">
            {db.activity.map((a,i) => (
              <div key={i} className="wtl-item" style={{padding:'11px 17px',cursor:'pointer'}}
                onMouseOver={e=>e.currentTarget.style.background='var(--gold-glow)'}
                onMouseOut={e=>e.currentTarget.style.background='transparent'}>
                <div className={`wtl-dot ${a.type}`}/>
                <div style={{flex:1}}>
                  <div className="wtl-what">{a.what}</div>
                  <div className="wtl-who">{a.who}</div>
                  <div className="wtl-when">{a.when}</div>
                </div>
                <button className="wbtn" style={{fontSize:'9px',padding:'3px 8px',alignSelf:'center'}} onClick={() => showToast('📝',`<strong>Note</strong> opened for ${a.who}`)}>View</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  function PageNetwork() {
    return (
      <div className="wmi-page active" style={{display:'flex'}}>
        <div className="wmi-ph">
          <div className="wmi-breadcrumb">WMI · <span className="bc-active">Network</span></div>
          <div className="wmi-ph-row">
            <div><div className="wmi-ph-title">Professional Network</div><div className="wmi-ph-sub">Intermediaries, introducers & strategic contacts</div></div>
            <div className="wmi-ph-actions">
              <button className="wbtn wbtn-gold" onClick={() => showToast('➕','<strong>Contact added</strong> to network')}>+ Add Contact</button>
            </div>
          </div>
        </div>
        <div className="wmi-scroll">
          <div className="wcc-grid">
            {db.network.map(n => (
              <div key={n.id} className={`wcc ${n.tier}`} onClick={() => showToast('◎',`<strong>${n.name}</strong> · ${n.org}`)}>
                <div className="wcc-top">
                  <div className={`wav ${n.avClass}`} style={{width:'36px',height:'36px',fontSize:'11px'}}>{n.initials}</div>
                  <div><div className="wcc-name">{n.name}</div><div className="wcc-org">{n.org}</div></div>
                </div>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:'10px'}}>
                  <div>
                    <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'20px',fontWeight:'600',color:'var(--gold)'}}>{n.score}</div>
                    <div style={{fontSize:'9px',color:'var(--text-dim)'}}>{n.scoreLbl}</div>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div style={{fontSize:'10px',color:'var(--text-mid)'}}>Last contact</div>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'10px',color:'var(--silver)'}}>{n.lastTouch} ago</div>
                  </div>
                </div>
                <div className="wcc-tags">{n.tags.map(t=><div key={t} className="wcc-tag">{t}</div>)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  function PageReferrals() {
    return (
      <div className="wmi-page active" style={{display:'flex'}}>
        <div className="wmi-ph">
          <div className="wmi-breadcrumb">WMI · <span className="bc-active">Referrals</span></div>
          <div className="wmi-ph-row">
            <div><div className="wmi-ph-title">Referral Tracker</div><div className="wmi-ph-sub">5 active referrals · Est. $145M pipeline value</div></div>
          </div>
        </div>
        <div className="wmi-scroll">
          <div className="wpanel">
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr 1fr',padding:'10px 17px',borderBottom:'1px solid var(--border)'}}>
              {['From','Prospect','Value','Status','Date'].map(h => <div key={h} className="col-h">{h}</div>)}
            </div>
            {db.referrals.map((r,i) => (
              <div key={i} style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr 1fr',padding:'11px 17px',borderBottom:'1px solid var(--border)',cursor:'pointer',transition:'background 0.12s'}}
                onMouseOver={e=>e.currentTarget.style.background='var(--gold-glow)'}
                onMouseOut={e=>e.currentTarget.style.background='transparent'}>
                <div style={{fontSize:'12px',color:'var(--text)',fontWeight:'500'}}>{r.from}</div>
                <div style={{fontSize:'12px',color:'var(--text)'}}>{r.client}</div>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'11px',color:'var(--gold)'}}>{r.val}</div>
                <div><span className={`wpill ${r.status==='Active'||r.status==='Closing'?'p-active':r.status==='Proposal'?'p-warm':'p-new'}`}>{r.status}</span></div>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'10px',color:'var(--text-mid)'}}>{r.date}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  function PageBriefing() {
    const sections = [
      { icon:'☀', title:'Priority Actions Today', color:'var(--gold)', items:['Contact Henderson Capital immediately — Q1 review cycle opens Monday, 47-day silence is relationship-critical','Resolve Harrington FO settlement discrepancy ($2.4M) before market open — escalate to operations','Send warm outreach to Okafor Ventures — competitor exit window closes in approx. 2 weeks'] },
      { icon:'📊', title:'Portfolio Pulse', color:'var(--blue)', items:['AUM up 4.2% QoQ — Strand-Blackwell and Kapur Trust leading performers','6 client portfolios underperforming vs benchmark by >50bps — proactive review calls needed','BoE cut signal in March — review fixed income duration exposure across 3 mandates'] },
      { icon:'◎', title:'Relationship Health', color:'var(--green)', items:['Strand-Blackwell (9.4) and Kapur Trust (8.7) in excellent standing','Henderson Capital (3.1) and Reinhardt Capital (2.8) at critical risk levels','Average relationship score declined from 8.1 → 7.2 this quarter — action required'] },
      { icon:'✦', title:'Opportunities to Pursue', color:'var(--amber)', items:['Private credit product pitch to Kapur Trust — launch window closes end of February','Okafor Ventures $60M mandate — first mover advantage, warm introduction via Kapur','Strand-Blackwell next-gen programme — Clara (30s) is increasingly influential, initiate direct relationship'] },
    ]
    return (
      <div className="wmi-page active" style={{display:'flex'}}>
        <div className="wmi-ph">
          <div className="wmi-breadcrumb">WMI · <span className="bc-active">Daily Briefing</span></div>
          <div className="wmi-ph-row">
            <div><div className="wmi-ph-title">Morning Briefing</div><div className="wmi-ph-sub">AI-generated daily intelligence digest · Sunday 22 Feb 2026</div></div>
            <div className="wmi-ph-actions">
              <button className="wbtn" onClick={() => showToast('📧','<strong>Briefing</strong> sent to your inbox')}>Send to Email</button>
            </div>
          </div>
        </div>
        <div className="wmi-scroll">
          {sections.map((s,i) => (
            <div key={i} className="wpanel">
              <div className="wpanel-h">
                <div className="wpanel-title" style={{fontSize:'11px',color:s.color}}>{s.icon} &nbsp;{s.title}</div>
              </div>
              <div style={{padding:'14px 17px',display:'flex',flexDirection:'column',gap:'8px'}}>
                {s.items.map((item,j) => (
                  <div key={j} style={{display:'flex',gap:'10px',alignItems:'flex-start'}}>
                    <div style={{width:'5px',height:'5px',borderRadius:'50%',background:s.color,marginTop:'5px',flexShrink:0}}/>
                    <div style={{fontSize:'12px',color:'var(--text-mid)',lineHeight:'1.6'}}>{item}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  function PageMemory() {
    return (
      <div className="wmi-page active" style={{display:'flex'}}>
        <div className="wmi-ph">
          <div className="wmi-breadcrumb">WMI · <span className="bc-active">Memory</span></div>
          <div className="wmi-ph-row">
            <div><div className="wmi-ph-title">Client Memory</div><div className="wmi-ph-sub">Contextual notes, preferences & relationship history</div></div>
            <div className="wmi-ph-actions">
              <button className="wbtn wbtn-gold" onClick={() => showToast('✦','<strong>Memory</strong> synced with AI')}>Sync with AI</button>
            </div>
          </div>
        </div>
        <div className="wmi-scroll">
          <div className="wpanel">
            {db.memory.map((m,i) => (
              <div key={i} style={{padding:'16px 17px',borderBottom:'1px solid var(--border)'}}>
                <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'12px'}}>
                  <div className={`wav ${m.avClass}`}>{m.avatar}</div>
                  <div style={{fontSize:'13px',fontWeight:'500',color:'var(--text)'}}>{m.client}</div>
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:'7px'}}>
                  {m.notes.map((n,j) => (
                    <div key={j} style={{display:'flex',gap:'9px',alignItems:'flex-start'}}>
                      <div style={{width:'4px',height:'4px',borderRadius:'50%',background:'var(--gold)',marginTop:'5px',flexShrink:0}}/>
                      <div style={{fontSize:'11px',color:'var(--text-mid)',lineHeight:'1.55'}}>{n}</div>
                    </div>
                  ))}
                </div>
                <div style={{display:'flex',gap:'7px',marginTop:'12px'}}>
                  <button className="wbtn" style={{fontSize:'10px'}} onClick={() => showToast('✦',`<strong>Memory</strong> added for ${m.client}`)}>+ Add Note</button>
                  <button className="wbtn" style={{fontSize:'10px'}} onClick={() => showToast('📤',`<strong>Notes</strong> exported for ${m.client}`)}>Export</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ── MODALS ─────────────────────────────────────────────────────────────────
  function ClientModal({ c }) {
    const activity = db.activity.filter(a => a.who.includes(c.name.split(' ')[0]))
    return (
      <div className="wmodal">
        <div className="wmodal-hd">
          <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
            <div className={`wav ${c.avClass}`} style={{width:'40px',height:'40px',fontSize:'13px'}}>{c.initials}</div>
            <div><div className="wmodal-name">{c.name}</div><div className="wmodal-role">{c.org}</div></div>
          </div>
          <button className="wmodal-close" onClick={closeModal}>✕</button>
        </div>
        <div className="wmodal-body">
          <div className="wmodal-stat-row">
            <div className="wmodal-stat"><div className="wms-label">AUM</div><div className="wms-val big" style={{color:'var(--gold)'}}>{c.aum}</div></div>
            <div className="wmodal-stat"><div className="wms-label">Rel. Score</div><div className={`wms-val big ${c.scoreClass}`}>{c.score}</div></div>
            <div className="wmodal-stat"><div className="wms-label">Pipeline</div><div className="wms-val big" style={{color:'var(--blue)'}}>{c.pipeline}</div></div>
          </div>
          <div className="wmodal-stat-row">
            <div className="wmodal-stat"><div className="wms-label">Status</div><div className="wms-val"><span className={`wpill ${c.status}`}>{c.statusLabel}</span></div></div>
            <div className="wmodal-stat"><div className="wms-label">Last Contact</div><div className="wms-val">{c.lastTouch}</div></div>
            <div className="wmodal-stat"><div className="wms-label">Rel. Heat</div><div className="wms-val">{c.heat}/5</div></div>
          </div>
          {c.flags.length > 0 && (
            <div>
              <div className="wmodal-sec-title">⚑ Active Flags</div>
              {c.flags.map((f,i) => (
                <div key={i} className="wflag-row"><div style={{fontSize:'14px'}}>⚑</div><div><div className="wflag-title">Action Required</div><div className="wflag-desc">{f}</div></div></div>
              ))}
            </div>
          )}
          {c.opps.length > 0 && (
            <div>
              <div className="wmodal-sec-title">✦ Opportunities</div>
              {c.opps.map((o,i) => (
                <div key={i} className="wopp-row"><div style={{fontSize:'14px'}}>↗</div><div><div className="wopp-title">Opportunity</div><div className="wopp-desc">{o}</div></div></div>
              ))}
            </div>
          )}
          <div>
            <div className="wmodal-sec-title">◎ Relationship Memory</div>
            <div style={{background:'var(--panel2)',border:'1px solid var(--border)',borderRadius:'5px',padding:'12px',fontSize:'11px',color:'var(--text-mid)',lineHeight:'1.65'}}>{c.notes}</div>
          </div>
          {activity.length > 0 && (
            <div>
              <div className="wmodal-sec-title">◷ Recent Activity</div>
              <div style={{background:'var(--panel2)',border:'1px solid var(--border)',borderRadius:'5px',overflow:'hidden'}}>
                {activity.slice(0,3).map((a,i) => (
                  <div key={i} style={{padding:'9px 12px',borderBottom:'1px solid var(--border)',fontSize:'11px'}}>
                    <div style={{color:'var(--text)'}}>{a.what}</div>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'9px',color:'var(--text-dim)',marginTop:'2px'}}>{a.when}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div>
            <div className="wmodal-sec-title">✏ Quick Note</div>
            <textarea className="wnote-input" placeholder="Add a note about this client…" value={noteText} onChange={e=>setNoteText(e.target.value)}/>
          </div>
          <div className="wmodal-action-row">
            <button className="wbtn wbtn-gold" onClick={() => { logCall(c.id); closeModal() }}>📞 Log Call</button>
            <button className="wbtn" onClick={() => { showToast('📧',`<strong>Email</strong> composed for ${c.name}`); closeModal() }}>📧 Email</button>
            <button className="wbtn" onClick={() => { showToast('📅',`<strong>Meeting</strong> scheduled with ${c.name}`); closeModal() }}>📅 Schedule</button>
            <button className="wbtn" onClick={() => saveNote(c.id)}>💾 Save Note</button>
            <button className="wbtn wbtn-red" onClick={closeModal}>Close</button>
          </div>
        </div>
      </div>
    )
  }

  function AlertModal({ a }) {
    return (
      <div className="wmodal">
        <div className="wmodal-hd">
          <div><div className="wmodal-name">{a.client}</div><div className="wmodal-role">Alert Detail · {a.amount}</div></div>
          <button className="wmodal-close" onClick={closeModal}>✕</button>
        </div>
        <div className="wmodal-body">
          <div className={`wflag-row${a.sev==='as-med'?' warn':''}`}>
            <div style={{fontSize:'14px'}}>⚑</div>
            <div>
              <div className="wflag-title">{a.sev==='as-high'?'High Priority':a.sev==='as-med'?'Medium Priority':'Low Priority'}</div>
              <div className="wflag-desc">{a.desc}</div>
            </div>
          </div>
          <div>
            <div className="wmodal-sec-title">Resolution Steps</div>
            <div style={{display:'flex',flexDirection:'column',gap:'7px'}}>
              {['Contact client relationship team immediately','Escalate to operations desk','Document resolution in audit log','Confirm with compliance if required'].map((s,i) => (
                <div key={i} style={{display:'flex',gap:'9px',alignItems:'flex-start'}}>
                  <div style={{width:'18px',height:'18px',borderRadius:'50%',border:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'JetBrains Mono',monospace",fontSize:'8px',color:'var(--text-dim)',flexShrink:0}}>{i+1}</div>
                  <div style={{fontSize:'12px',color:'var(--text-mid)',lineHeight:'1.55',paddingTop:'1px'}}>{s}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="wmodal-action-row">
            <button className="wbtn wbtn-gold" onClick={() => { resolveAlert(a.id); closeModal() }}>✓ Mark Resolved</button>
            <button className="wbtn" onClick={() => { showToast('📧','<strong>Alert</strong> forwarded to compliance'); closeModal() }}>Forward to Compliance</button>
            <button className="wbtn wbtn-red" onClick={closeModal}>Close</button>
          </div>
        </div>
      </div>
    )
  }

  const NAV = [
    { section:'Overview', items:[
      { id:'focus', label:'Focus', icon:'◈' },
      { id:'intelligence', label:'Intelligence', icon:'◎', badge:'5', badgeClass:'nb-gold' },
      { id:'pipeline', label:'Pipeline', icon:'▦', badge:'12', badgeClass:'nb-blue' },
    ]},
    { section:'Relationships', items:[
      { id:'clients', label:'Clients', icon:'◉', badge:'2', badgeClass:'nb-green' },
      { id:'network', label:'Network', icon:'⬡' },
      { id:'referrals', label:'Referrals', icon:'↗', badge:'5', badgeClass:'nb-gold' },
    ]},
    { section:'Monitoring', items:[
      { id:'alerts', label:'Alerts', icon:'⚑', badge:String(alertCount), badgeClass:'nb-red' },
      { id:'activity', label:'Activity', icon:'◷' },
    ]},
    { section:'Tools', items:[
      { id:'briefing', label:'Daily Briefing', icon:'✦' },
      { id:'memory', label:'Memory', icon:'◫' },
    ]},
  ]

  const pages = { focus:<PageFocus/>, clients:<PageClients/>, intelligence:<PageIntelligence/>, pipeline:<PagePipeline/>, alerts:<PageAlerts/>, activity:<PageActivity/>, network:<PageNetwork/>, referrals:<PageReferrals/>, briefing:<PageBriefing/>, memory:<PageMemory/> }

  return (
    <>
      <style>{css}</style>
      <link rel="preconnect" href="https://fonts.googleapis.com"/>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=JetBrains+Mono:wght@300;400;500&family=Outfit:wght@300;400;500;600&display=swap" rel="stylesheet"/>

      <div className="wmi">
        <div className="wmi-shell">
          {/* Topbar */}
          <header className="wmi-topbar">
            <div className="wmi-brand" onClick={() => setPage('focus')}>
              <img src={appLogo} alt="WMI" style={{height:'26px',width:'auto',objectFit:'contain',marginRight:'12px'}}/>
              <div>
                <div className="wmi-brand-text">WMI</div>
                <div className="wmi-brand-ver">Relationship Intelligence</div>
              </div>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:'6px'}}>
              <div className="wmi-pulse"/>
              <div className="wmi-live">LIVE · All systems operational</div>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:'14px'}}>
              <Clock />
              <button className="wmi-notif" onClick={() => setPage('alerts')}>
                ⚑<div className="wmi-nbadge">{alertCount}</div>
              </button>
              <div onClick={() => nav('/demo')} style={{display:'flex',alignItems:'center',gap:'7px',padding:'5px 12px',border:'1px solid #c8a84a',borderRadius:'20px',cursor:'pointer',background:'rgba(200,168,74,0.12)',transition:'all 0.15s'}}
                onMouseOver={e=>e.currentTarget.style.background='rgba(200,168,74,0.22)'}
                onMouseOut={e=>e.currentTarget.style.background='rgba(200,168,74,0.12)'}>
                <span style={{color:'#c8a84a',fontSize:'12px'}}>←</span>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'10px',color:'#c8a84a',letterSpacing:'0.08em'}}>Back to Canvas</span>
              </div>
            </div>
          </header>

          {/* Sidebar */}
          <nav className="wmi-sidebar">
            {NAV.map(group => (
              <div key={group.section}>
                <div className="wmi-nav-section">{group.section}</div>
                {group.items.map(item => (
                  <div key={item.id} className={`wmi-nav-item${page===item.id?' active':''}`} onClick={() => setPage(item.id)}>
                    <div style={{display:'flex',alignItems:'center',gap:'9px'}}>
                      <div style={{fontSize:'11px',width:'14px',textAlign:'center',opacity:'0.8'}}>{item.icon}</div>
                      {item.label}
                    </div>
                    {item.badge && <div className={`wmi-nav-badge ${item.badgeClass}`}>{item.badge}</div>}
                  </div>
                ))}
              </div>
            ))}
          </nav>

          {/* Main */}
          <main className="wmi-main">
            {pages[page]}
          </main>
        </div>

        {/* Modal */}
        {modal && (
          <div className="wmodal-overlay" onClick={e => { if(e.target===e.currentTarget) closeModal() }}>
            {modal.type === 'client' && <ClientModal c={modal.data}/>}
            {modal.type === 'alert' && <AlertModal a={modal.data}/>}
          </div>
        )}

        {/* Toast */}
        <div className={`wtoast${toast.show?' show':''}`}>
          <div style={{fontSize:'14px'}}>{toast.icon}</div>
          <div className="wtoast-msg" dangerouslySetInnerHTML={{__html:toast.msg}}/>
        </div>
      </div>
    </>
  )
}
