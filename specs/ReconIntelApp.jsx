import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import appLogo from '../../assets/NFTLogo_Horizontal_FullColour_White.png'

// ── FONTS + SCOPED CSS ───────────────────────────────────────────────────────
// Font: Noto Sans JP — loaded via index.html / tailwind.config.js

const CSS = `
// ONX Light Theme — Noto Sans JP
.ril{--bg:#F9FAFB;--bg2:#FFFFFF;--bgp:#FFFFFF;--bgc:#FFFFFF;--bgh:#EFF6FF;--bor:#E5E7EB;--borb:#D1D5DB;--t1:#111827;--t2:#374151;--tm:#9CA3AF;--blue:#2563EB;--blued:#1D4ED8;--cyan:#0891B2;--green:#059669;--amber:#D97706;--red:#DC2626;--red7:#B91C1C;font-family:'Noto Sans JP',system-ui,sans-serif;background:var(--bg);color:var(--t1);height:100vh;overflow:hidden;display:flex;flex-direction:column;}
.ril *{margin:0;padding:0;box-sizing:border-box;}
.ril-top{display:flex;align-items:center;justify-content:space-between;padding:0 24px;height:52px;background:#111827;border-bottom:2px solid #374151;position:relative;z-index:200;flex-shrink:0;}
.ril-logo{display:flex;align-items:center;gap:10px;cursor:pointer;}
.ril-logo-mark{width:32px;height:32px;background:linear-gradient(135deg,#2563EB,#3B82F6);clip-path:polygon(0 0,70% 0,100% 30%,100% 100%,30% 100%,0 70%);box-shadow:0 0 0 2px rgba(59,130,246,.3),0 0 16px rgba(37,99,235,.5);}
.ril-logo-text{font-size:13px;font-weight:600;letter-spacing:.04em;color:#FFFFFF;}
.ril-logo-sub{font-size:9px;color:rgba(255,255,255,.5);letter-spacing:.2em;text-transform:uppercase;}
.ril-nav{display:flex;gap:2px;}
.ril-tab{padding:6px 16px;font-size:12px;font-weight:500;color:rgba(255,255,255,.65);cursor:pointer;border-radius:3px;transition:all .15s;letter-spacing:.03em;border:1px solid transparent;}
.ril-tab:hover{color:#FFFFFF;background:rgba(255,255,255,.1);}
.ril-tab.active{color:#FFFFFF;background:rgba(37,99,235,.2);border-color:rgba(37,99,235,.35);font-weight:600;}
.ril-live{display:flex;align-items:center;gap:6px;font-size:11px;color:#34D399;letter-spacing:.04em;}
.ril-dot{width:6px;height:6px;background:#34D399;border-radius:50%;box-shadow:0 0 6px #34D399;animation:rilPulse 2s infinite;}
@keyframes rilPulse{0%,100%{opacity:1;transform:scale(1);}50%{opacity:.4;transform:scale(.8);}}
.ril-clock{font-size:11px;color:rgba(255,255,255,.5);}
.ril-icon-btn{width:32px;height:32px;display:flex;align-items:center;justify-content:center;border-radius:5px;cursor:pointer;border:1px solid rgba(255,255,255,.15);background:transparent;color:rgba(255,255,255,.6);transition:all .15s;position:relative;}
.ril-icon-btn:hover{background:rgba(255,255,255,.1);color:#FFFFFF;border-color:rgba(255,255,255,.25);}
.ril-nbadge{position:absolute;top:-3px;right:-3px;width:14px;height:14px;background:#EF4444;border-radius:50%;font-size:8px;font-weight:700;display:flex;align-items:center;justify-content:center;border:2px solid #111827;}
.ril-ubadge{width:30px;height:30px;background:#2563EB;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;color:#fff;cursor:pointer;}
.ril-back-btn{display:flex;align-items:center;gap:7px;padding:5px 12px;border:1px solid rgba(255,255,255,.2);border-radius:3px;cursor:pointer;background:rgba(255,255,255,.08);transition:all .15s;}
.ril-back-btn:hover{background:rgba(255,255,255,.15);}
.ril-back-btn span{font-size:10px;color:rgba(255,255,255,.8);letter-spacing:.08em;}
.ril-layout{display:grid;grid-template-columns:220px 1fr;flex:1;overflow:hidden;}
.ril-sidebar{background:#FFFFFF;border-right:2px solid #E5E7EB;padding:16px 0;overflow-y:auto;}
.ril-sb-section{padding:0 12px;margin-bottom:20px;}
.ril-sb-label{font-size:9px;color:var(--tm);letter-spacing:.2em;text-transform:uppercase;padding:0 8px;margin-bottom:6px;}
.ril-sb-item{display:flex;align-items:center;justify-content:space-between;padding:7px 10px;border-radius:4px;cursor:pointer;transition:all .15s;margin-bottom:1px;border:1px solid transparent;}
.ril-sb-item:hover{background:#EFF6FF;border-color:#BFDBFE;}
.ril-sb-item.active{background:#EFF6FF;border:1px solid rgba(37,99,235,.25);box-shadow:0 0 0 3px rgba(37,99,235,.08);}
.ril-sb-item-left{display:flex;align-items:center;gap:8px;font-size:12px;font-weight:500;color:var(--t2);}
.ril-sb-item.active .ril-sb-item-left{color:var(--blue);font-weight:600;}
.ril-sb-badge{font-size:10px;padding:1px 6px;border-radius:10px;font-weight:600;}
.nb-red{background:rgba(232,68,68,.2);color:var(--red);border:1px solid #FCA5A5;}
.nb-amb{background:rgba(245,166,35,.15);color:var(--amber);border:1px solid rgba(245,166,35,.25);}
.nb-grn{background:rgba(0,200,150,.15);color:var(--green);border:1px solid rgba(0,200,150,.25);}
.nb-blu{background:rgba(30,127,232,.15);color:var(--blue);border:1px solid rgba(30,127,232,.25);}
.ril-stat-block{background:#FFFFFF;border:1px solid #E5E7EB;border-radius:8px;padding:12px;margin:0 12px 8px;box-shadow:0 1px 4px rgba(0,0,0,.06);}
.ril-stat-label{font-size:9px;color:var(--tm);letter-spacing:.15em;text-transform:uppercase;margin-bottom:4px;}
.ril-stat-value{font-size:22px;font-weight:700;color:var(--t1);line-height:1;}
.ril-stat-sub{font-size:10px;color:var(--tm);margin-top:3px;}
.ril-stat-value.crit{color:var(--red);}
.ril-stat-value.warn{color:var(--amber);}
.ril-stat-value.good{color:var(--green);}
.ril-main{overflow-y:auto;height:100%;position:relative;background:#F9FAFB;}
.ril-screen-hd{padding:20px 28px 16px;border-bottom:2px solid #E5E7EB;display:flex;align-items:flex-end;justify-content:space-between;position:sticky;top:0;background:#F9FAFB;z-index:10;}
.ril-screen-title{font-size:20px;font-weight:700;color:var(--t1);}
.ril-screen-sub{font-size:11px;color:var(--tm);margin-top:2px;letter-spacing:.05em;}
.ril-hd-actions{display:flex;gap:8px;align-items:center;padding:8px 24px 8px 0;}
.ril-hd-actions .rbtn{padding:8px 16px;font-size:12px;}
.rbtn{padding:7px 14px;border-radius:6px;font-size:11px;font-weight:600;cursor:pointer;border:1px solid #D1D5DB;background:#FFFFFF;color:#374151;transition:all .15s;letter-spacing:.03em;font-family:'Noto Sans JP',sans-serif;box-shadow:0 1px 3px rgba(0,0,0,.08);}
.rbtn:hover{background:#F9FAFB;color:#111827;border-color:#9CA3AF;box-shadow:0 2px 6px rgba(0,0,0,.1);}
.rbtn-primary{background:#2563EB;border-color:#2563EB;color:#fff;box-shadow:0 2px 8px rgba(37,99,235,.35);font-weight:600;}
.rbtn-primary:hover{background:#1D4ED8;box-shadow:0 4px 12px rgba(37,99,235,.4);}
.rbtn-danger{background:#FFFFFF;border-color:#DC2626;color:#DC2626;box-shadow:0 1px 3px rgba(0,0,0,.08);}
.rbtn-danger:hover{background:#FEF2F2;border-color:#B91C1C;}
.rbtn-success{background:#FFFFFF;border-color:#059669;color:#059669;box-shadow:0 1px 3px rgba(0,0,0,.08);}
.rbtn-success:hover{background:#ECFDF5;}
.ril-filter-bar{padding:10px 28px;display:flex;gap:6px;align-items:center;border-bottom:2px solid #E5E7EB;background:#FFFFFF;flex-wrap:wrap;}
.ril-chip{padding:4px 12px;border-radius:20px;font-size:11px;font-weight:500;cursor:pointer;border:1px solid #E5E7EB;color:var(--t2);background:#FFFFFF;transition:all .15s;}
.ril-chip:hover{border-color:var(--blue);color:var(--blue);background:rgba(37,99,235,.04);}
.ril-chip.active{background:#EFF6FF;border:1px solid var(--blue);color:var(--blue);font-weight:600;box-shadow:0 0 0 3px rgba(37,99,235,.08);}
.ril-chip-sep{width:1px;height:20px;background:#D1D5DB;margin:0 4px;}
.ril-search{display:flex;align-items:center;gap:8px;background:#FFFFFF;border:1px solid #D1D5DB;border-radius:6px;padding:6px 12px;margin-left:auto;}
.ril-search input{background:none;border:none;outline:none;color:var(--t1);font-size:12px;font-family:'Noto Sans JP',sans-serif;width:180px;}
.ril-search input::placeholder{color:var(--tm);}
.ril-table{padding:0 28px 24px;}
.ril-table-hd{display:grid;grid-template-columns:28px 76px 170px 150px 120px 1fr 96px 110px 100px;gap:8px;padding:0 12px;height:40px;align-items:center;background:#1E293B;border-radius:6px 6px 0 0;margin-top:12px;font-size:10px;font-weight:600;color:#E2E8F0;letter-spacing:.03em;}
.ril-row{display:grid;grid-template-columns:28px 76px 170px 150px 120px 1fr 96px 110px 100px;gap:8px;padding:10px 12px;cursor:pointer;transition:all .15s;border-bottom:1px solid #E5E7EB;border-left:3px solid transparent;border-right:1px solid transparent;border-top:1px solid transparent;align-items:center;background:#FFFFFF;}
.ril-row:nth-child(even){background:#FAFBFC;}
.ril-row:hover{background:#EFF6FF;border-left-color:var(--blue);border-bottom-color:#D1D5DB;border-right-color:#E5E7EB;}
.ril-row.selected{background:rgba(37,99,235,.04);border-left-color:var(--blue);border-bottom-color:#BFDBFE;}
.ril-row.resolved{opacity:.45;}
.ril-row.monitoring{border-left:3px solid var(--blue);}
.ril-row.escalated-r{border-left:3px solid var(--amber);}
.sev-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;margin:auto;}
.sev-critical{background:var(--red);box-shadow:0 0 6px var(--red);}
.sev-high{background:var(--amber);box-shadow:0 0 4px var(--amber);}
.sev-medium{background:#f5d623;}
.sev-low{background:var(--green);}
.ril-bid{font-size:11px;color:var(--tm);font-weight:500;}
.ril-bname{font-size:12px;font-weight:700;color:var(--t1);}
.ril-bsub{font-size:10px;color:var(--tm);}
.ril-bcp{font-size:12px;color:var(--blue);font-weight:500;}
.ril-bamt{font-size:12px;font-weight:600;color:var(--t1);text-align:left;}
.ril-ai-hyp{font-size:11px;color:var(--t2);display:flex;align-items:center;gap:6px;text-align:left;}
.ril-ai-tag{font-size:9px;background:#EFF6FF;border:1px solid #BFDBFE;color:var(--blue);padding:1px 5px;border-radius:4px;white-space:nowrap;letter-spacing:.05em;flex-shrink:0;font-weight:600;}
.ril-csdr{font-size:11px;font-weight:600;}
.csdr-crit{color:var(--red);font-weight:600;}
.csdr-warn{color:var(--amber);font-weight:600;}
.csdr-ok{color:var(--tm);}
.ril-pen{font-size:11px;text-align:left;font-weight:600;}
.pen-active{color:var(--red);}
.pen-accruing{color:var(--amber);}
.pen-none{color:var(--tm);}
.ril-act-btn{font-size:10px;padding:4px 10px;border-radius:6px;border:1px solid #E5E7EB;background:#FFFFFF;color:var(--t2);cursor:pointer;transition:all .15s;white-space:nowrap;font-family:'Noto Sans JP',sans-serif;font-weight:500;}
.ril-act-btn:hover{background:#F3F4F6;color:var(--t1);border-color:#D1D5DB;}
.ril-act-btn.res{border-color:#A7F3D0;color:#065F46;background:#ECFDF5;}
.ril-act-btn.res:hover{background:#D1FAE5;}
.ril-act-btn.esc{border-color:#FDE68A;color:#92400E;background:#FFFBEB;}
.ril-act-btn.esc:hover{background:#FEF3C7;}
.ril-act-btn.inv{border-color:#BFDBFE;color:var(--blue);background:#EFF6FF;}
.ril-act-btn.inv:hover{background:#DBEAFE;}
.rtag{font-size:9px;padding:2px 6px;border-radius:4px;letter-spacing:.05em;font-weight:600;}
.rtag-mon{background:#EFF6FF;color:var(--blue);border:1px solid #BFDBFE;}
.rtag-esc{background:#FFFBEB;color:#92400E;border:1px solid #FDE68A;}
.rtag-res{background:#ECFDF5;color:#065F46;border:1px solid #A7F3D0;}
.ril-empty{text-align:center;padding:48px;color:var(--tm);background:#FFFFFF;border:2px dashed #E5E7EB;border-radius:8px;margin-top:12px;}
.ril-empty-icon{font-size:36px;margin-bottom:12px;}
.ril-empty-text{font-size:13px;}
.ril-detail-back{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--tm);cursor:pointer;padding:14px 28px 0;transition:color .15s;width:fit-content;border-bottom:2px solid transparent;}
.ril-detail-back:hover{color:var(--blue);}
.ril-detail-layout{display:grid;grid-template-columns:1fr 340px;min-height:100%;}
.ril-detail-main{padding:20px 28px 32px;border-right:2px solid #E5E7EB;background:#F9FAFB;}
.ril-detail-side{padding:20px;background:#FFFFFF;border-left:2px solid #E5E7EB;overflow-y:auto;}
.ril-detail-title{font-size:20px;font-weight:700;}
.ril-meta{display:flex;gap:8px;margin-top:6px;flex-wrap:wrap;}
.ril-mchip{font-size:10px;padding:3px 8px;border-radius:3px;letter-spacing:.05em;}
.ril-section-title{font-size:10px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--tm);margin-bottom:12px;padding-bottom:6px;border-bottom:2px solid #E5E7EB;}
.ril-pos-compare{display:grid;grid-template-columns:1fr 32px 1fr;gap:10px;margin-bottom:24px;}
.ril-pos-box{background:#FFFFFF;border:1px solid #E5E7EB;border-radius:8px;padding:14px;box-shadow:0 1px 4px rgba(0,0,0,.06);}
.ril-pos-box.mismatch{border-color:#FCA5A5;background:rgba(254,242,242,1);}
.ril-pos-src{font-size:9px;text-transform:uppercase;letter-spacing:.2em;color:var(--tm);margin-bottom:10px;}
.ril-pos-row{display:flex;justify-content:space-between;align-items:center;padding:5px 0;border-bottom:1px solid #F3F4F6;font-size:12px;}
.ril-pos-row:last-child{border-bottom:none;}
.ril-pos-key{color:var(--tm);}
.ril-pos-val{font-weight:600;color:var(--t1);}
.ril-pos-val.diff{color:var(--red);}
.ril-pos-vs{display:flex;align-items:center;justify-content:center;color:var(--tm);font-size:18px;}
.ril-ai-card{background:#FFFFFF;border:1px solid rgba(37,99,235,.2);border-left:3px solid var(--blue);border-radius:8px;padding:18px;margin-bottom:20px;position:relative;overflow:hidden;box-shadow:0 2px 8px rgba(37,99,235,.06);}
.ril-ai-card::before{display:none;}
.ril-ai-card-hd{display:flex;align-items:center;gap:10px;margin-bottom:14px;}
.ril-ai-icon{width:28px;height:28px;background:#EFF6FF;border:1px solid #BFDBFE;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0;color:var(--blue);}
.ril-ai-card-title{font-size:12px;font-weight:600;color:var(--blue);letter-spacing:.05em;}
.ril-conf-wrap{display:flex;align-items:center;gap:8px;margin-left:auto;}
.ril-conf-label{font-size:10px;color:var(--tm);}
.ril-conf-bar{width:70px;height:4px;background:#E5E7EB;border-radius:2px;overflow:hidden;}
.ril-conf-fill{height:100%;background:var(--blue);border-radius:2px;}
.ril-conf-pct{font-size:11px;font-weight:600;color:var(--blue);min-width:30px;}
.ril-ai-body{font-size:13px;line-height:1.65;color:var(--t2);}
.ril-ai-body strong{color:var(--t1);font-weight:600;}
.ril-steps{margin-top:14px;display:flex;flex-direction:column;gap:8px;}
.ril-step{display:flex;gap:12px;align-items:flex-start;}
.ril-step-num{width:20px;height:20px;background:var(--blue);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:#fff;flex-shrink:0;margin-top:1px;}
.ril-step-text{font-size:12px;color:var(--t2);line-height:1.5;}
.ril-step-text strong{color:var(--t1);}
.ril-comms-box{background:#FFFFFF;border:1px solid #E5E7EB;border-radius:8px;padding:16px;margin-bottom:20px;box-shadow:0 1px 4px rgba(0,0,0,.04);}
.ril-comms-hd{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;}
.ril-comms-to{font-size:11px;color:var(--tm);margin-bottom:8px;}
.ril-comms-to span{color:var(--blue);}
.ril-comms-body{font-size:11px;color:var(--t2);line-height:1.6;padding:12px;background:#F9FAFB;border-radius:4px;border:1px solid #E5E7EB;white-space:pre-wrap;}
.ril-pattern-card{background:#FFFFFF;border:1px solid #E5E7EB;border-radius:8px;padding:14px;margin-bottom:12px;box-shadow:0 1px 4px rgba(0,0,0,.05);}
.ril-pstat{display:flex;justify-content:space-between;align-items:center;padding:5px 0;font-size:11px;border-bottom:1px solid #F3F4F6;}
.ril-pstat:last-child{border-bottom:none;}
.ril-pstat-k{color:var(--tm);}
.ril-pstat-v{font-weight:600;color:var(--t1);}
.ril-pstat-v.good{color:var(--green);}
.ril-pstat-v.warn{color:var(--amber);}
.ril-reg-item{background:#FFFFFF;border:1px solid #E5E7EB;border-radius:8px;padding:14px;margin-bottom:10px;box-shadow:0 1px 4px rgba(0,0,0,.05);}
.ril-reg-hd{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;}
.ril-reg-name{font-size:12px;font-weight:700;color:var(--t1);}
.ril-reg-status{font-size:10px;padding:2px 8px;border-radius:3px;}
.ril-reg-body{font-size:11px;color:var(--tm);line-height:1.5;}
.ril-reg-body strong{color:var(--amber);}
.ril-hist-item{display:flex;gap:10px;padding:8px 0;border-bottom:1px solid #F3F4F6;font-size:11px;}
.ril-hist-item:last-child{border-bottom:none;}
.ril-hist-t{color:var(--tm);white-space:nowrap;font-size:10px;padding-top:1px;min-width:56px;}
.ril-hist-e{color:var(--t2);line-height:1.4;}
.ril-hist-e strong{color:var(--t1);}
.ril-clock-track{flex:1;height:4px;background:#E5E7EB;border-radius:2px;overflow:hidden;margin-top:6px;}
.ril-clock-fill{height:100%;border-radius:2px;}
.ril-metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;padding:16px 28px;}
.ril-metric{background:#FFFFFF;border:1px solid #E5E7EB;border-radius:8px;padding:16px;position:relative;cursor:pointer;transition:border-color .2s,box-shadow .2s;box-shadow:0 2px 8px rgba(0,0,0,.05);border-left:3px solid transparent;}
.ril-metric:hover{border-color:#D1D5DB;box-shadow:0 4px 16px rgba(0,0,0,.08);}
.ril-metric.red{border-left-color:var(--red);}
.ril-metric.amber{border-left-color:var(--amber);}
.ril-metric.green{border-left-color:var(--green);}
.ril-metric.blue{border-left-color:var(--blue);}
.ril-metric::after{display:none;}
.ril-metric-label{font-size:10px;color:var(--tm);text-transform:uppercase;letter-spacing:.15em;margin-bottom:8px;}
.ril-metric-val{font-size:28px;font-weight:600;line-height:1;margin-bottom:4px;}
.ril-metric-val.red{color:var(--red);}
.ril-metric-val.amber{color:var(--amber);}
.ril-metric-val.green{color:var(--green);}
.ril-metric-val.blue{color:var(--blue);}
.ril-metric-sub{font-size:11px;color:var(--tm);}
.ril-metric-delta{display:inline-flex;align-items:center;gap:3px;font-size:10px;margin-top:6px;padding:2px 6px;border-radius:3px;}
.delta-up{background:rgba(220,38,38,.1);color:var(--red);}
.delta-down{background:rgba(5,150,105,.1);color:var(--green);}
.ril-comp-layout{display:grid;grid-template-columns:1fr 1fr;gap:16px;padding:0 28px 24px;}
.ril-cpanel{background:#FFFFFF;border:1px solid #E5E7EB;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.05);}
.ril-cpanel-hd{padding:12px 16px;border-bottom:2px solid #E5E7EB;display:flex;justify-content:space-between;align-items:center;background:#F9FAFB;}
.ril-cpanel-title{font-size:12px;font-weight:700;color:var(--t1);}
.ril-cpanel-body{padding:14px 16px;}
.ril-pen-row{display:grid;grid-template-columns:1fr 70px 70px 85px;gap:8px;padding:9px 0;border-bottom:1px solid #F3F4F6;align-items:center;font-size:11px;}
.ril-pen-row:last-child{border-bottom:none;}
.ril-pen-fund{font-weight:600;color:var(--t1);}
.ril-pen-sub{font-size:9px;color:var(--tm);}
.ril-pen-days{color:var(--t2);text-align:center;}
.ril-pen-bps{color:var(--tm);text-align:center;}
.ril-pen-eur{font-weight:600;text-align:right;}
.ril-pen-eur.high{color:var(--red);}
.ril-pen-eur.med{color:var(--amber);}
.ril-audit-row{display:grid;grid-template-columns:92px 72px 1fr 68px;gap:8px;padding:8px 0;border-bottom:1px solid #F3F4F6;font-size:11px;align-items:center;}
.ril-audit-row:last-child{border-bottom:none;}
.ril-audit-time{color:var(--tm);font-size:10px;}
.ril-audit-user{color:var(--blue);}
.ril-audit-action{color:var(--blue);}
.astatus{font-size:9px;padding:2px 7px;border-radius:10px;text-align:center;white-space:nowrap;}
.a-resolved{background:#ECFDF5;color:#065F46;border:1px solid #A7F3D0;}
.a-pending{background:#FFFBEB;color:#92400E;border:1px solid #FDE68A;}
.a-escalated{background:#FEF2F2;color:#991B1B;border:1px solid #FECACA;}
.a-auto{background:#EFF6FF;color:var(--blue);border:1px solid #BFDBFE;}
.ril-bar-chart{display:flex;align-items:flex-end;gap:5px;height:72px;padding:4px 0;}
.ril-bar-col{display:flex;flex-direction:column;align-items:center;gap:4px;flex:1;}
.ril-bar{width:100%;border-radius:3px 3px 0 0;}
.ril-bar-lbl{font-size:8px;color:var(--tm);}
.ril-reg-item-comp{background:#FFFFFF;border:1px solid #E5E7EB;border-radius:8px;padding:14px;margin-bottom:10px;cursor:pointer;transition:border-color .15s,box-shadow .15s;}
.ril-reg-item-comp:hover{border-color:#D1D5DB;box-shadow:0 4px 12px rgba(0,0,0,.06);}
.ril-settings{padding:24px 28px;max-width:800px;}
.ril-settings-sec{margin-bottom:32px;}
.ril-settings-sec-title{font-size:14px;font-weight:700;color:var(--t1);margin-bottom:16px;padding-bottom:8px;border-bottom:2px solid #E5E7EB;}
.ril-settings-row{display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid #F3F4F6;}
.ril-settings-row:last-child{border-bottom:none;}
.ril-settings-label{font-size:13px;font-weight:600;color:var(--t1);}
.ril-settings-desc{font-size:11px;color:var(--tm);margin-top:2px;}
.ril-toggle{width:36px;height:20px;background:#D1D5DB;border-radius:10px;cursor:pointer;transition:background .2s;position:relative;flex-shrink:0;}
.ril-toggle.on{background:var(--blue);}
.ril-toggle::after{content:'';position:absolute;top:3px;left:3px;width:14px;height:14px;background:#fff;border-radius:50%;transition:transform .2s;}
.ril-toggle.on::after{transform:translateX(16px);}
.ril-select{background:#FFFFFF;border:1px solid #D1D5DB;color:var(--t1);padding:5px 10px;border-radius:6px;font-size:12px;font-family:'Noto Sans JP',sans-serif;cursor:pointer;}
.ril-input{background:#FFFFFF;border:1px solid #D1D5DB;color:var(--t1);padding:6px 10px;border-radius:6px;font-size:12px;font-family:'Noto Sans JP',sans-serif;width:200px;}
.ril-int-card{background:#FFFFFF;border:1px solid #E5E7EB;border-radius:8px;padding:14px;display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;box-shadow:0 1px 4px rgba(0,0,0,.05);}
.ril-int-info{display:flex;align-items:center;gap:12px;}
.ril-int-icon{width:36px;height:36px;background:#EFF6FF;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;color:var(--blue);border:1px solid #BFDBFE;}
.ril-int-name{font-size:13px;font-weight:600;color:var(--t1);}
.ril-int-status{font-size:11px;color:var(--green);}
.ril-int-status.disc{color:var(--tm);}
.ril-modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:500;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px);animation:rilFadeIn .2s ease;}
@keyframes rilFadeIn{from{opacity:0}to{opacity:1}}
.ril-modal{background:#FFFFFF;border:1px solid #D1D5DB;border-radius:12px;padding:24px;width:480px;max-width:90vw;box-shadow:0 24px 48px rgba(0,0,0,.15),0 0 0 1px rgba(0,0,0,.04);animation:rilScaleIn .2s ease;}
.ril-modal.wide{width:620px;}
@keyframes rilScaleIn{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}
.ril-modal-title{font-size:16px;font-weight:700;margin-bottom:6px;}
.ril-modal-sub{font-size:12px;color:var(--tm);margin-bottom:20px;}
.ril-modal-field{margin-bottom:16px;}
.ril-modal-label{font-size:11px;color:var(--tm);letter-spacing:.1em;text-transform:uppercase;margin-bottom:6px;}
.ril-modal-input{width:100%;background:#FFFFFF;border:1px solid #D1D5DB;color:var(--t1);padding:8px 12px;border-radius:6px;font-size:12px;font-family:'Noto Sans JP',sans-serif;outline:none;transition:border-color .15s,box-shadow .15s;}
.ril-modal-input:focus{border-color:var(--blue);box-shadow:0 0 0 3px rgba(37,99,235,.1);}
.ril-modal-textarea{width:100%;background:#FFFFFF;border:1px solid #D1D5DB;color:var(--t1);padding:8px 12px;border-radius:6px;font-size:11px;font-family:'Noto Sans JP',sans-serif;outline:none;resize:vertical;min-height:100px;line-height:1.6;transition:border-color .15s,box-shadow .15s;}
.ril-modal-textarea:focus{border-color:var(--blue);box-shadow:0 0 0 3px rgba(37,99,235,.1);}
.ril-modal-select{width:100%;background:#FFFFFF;border:1px solid #D1D5DB;color:var(--t1);padding:8px 12px;border-radius:6px;font-size:12px;font-family:'Noto Sans JP',sans-serif;outline:none;cursor:pointer;}
.ril-modal-actions{display:flex;gap:10px;justify-content:flex-end;margin-top:20px;}
.ril-modal-info{background:#F9FAFB;border:1px solid #E5E7EB;border-radius:8px;padding:12px;margin-bottom:16px;font-size:12px;color:var(--t2);line-height:1.5;}
.ril-modal-info strong{color:var(--t1);}
.ril-modal-warn{background:#FFFBEB;border:1px solid #FDE68A;border-radius:8px;padding:12px;margin-bottom:16px;font-size:12px;color:var(--amber);line-height:1.5;}
.ril-modal-success{background:#ECFDF5;border:1px solid #A7F3D0;border-radius:8px;padding:16px;margin-bottom:16px;font-size:13px;color:#065F46;line-height:1.5;text-align:center;}
.ril-team-opt{display:flex;align-items:center;gap:10px;padding:10px;border:1px solid #E5E7EB;border-radius:8px;cursor:pointer;transition:all .15s;margin-bottom:6px;}
.ril-team-opt:hover,.ril-team-opt.sel{border-color:var(--amber);background:rgba(245,166,35,.04);}
.ril-team-av{width:32px;height:32px;background:#EFF6FF;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;color:var(--blue);}
.ril-progress-wrap{background:#E5E7EB;border-radius:4px;height:6px;overflow:hidden;margin:12px 0;}
.ril-progress-fill{height:100%;background:var(--blue);border-radius:4px;transition:width .4s ease;}
.ril-checklist-item{display:flex;align-items:center;gap:10px;padding:8px 0;font-size:12px;color:var(--t2);border-bottom:1px solid #F3F4F6;}
.ril-checklist-item:last-child{border-bottom:none;}
.rcheck{width:16px;height:16px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:9px;flex-shrink:0;}
.rcheck-done{background:#ECFDF5;color:var(--green);border:1px solid #A7F3D0;}
.rcheck-pending{background:#F3F4F6;border:1px solid #E5E7EB;color:var(--tm);}
.rcheck-running{background:#EFF6FF;color:var(--blue);border:1px solid #BFDBFE;animation:rilSpin 1.5s linear infinite;}
@keyframes rilSpin{to{transform:rotate(360deg)}}
.ril-toast-wrap{position:fixed;bottom:24px;right:24px;z-index:600;display:flex;flex-direction:column;gap:8px;pointer-events:none;}
.ril-toast{background:#FFFFFF;border:1px solid #D1D5DB;border-radius:8px;padding:12px 16px;font-size:12px;color:var(--t2);box-shadow:0 8px 24px rgba(0,0,0,.12);display:flex;align-items:center;gap:10px;min-width:280px;animation:rilToastIn .3s ease;}
.ril-toast.success{border-color:var(--green);}
.ril-toast.error{border-color:var(--red);}
.ril-toast.info{border-color:var(--blue);}
@keyframes rilToastIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
::-webkit-scrollbar{width:4px;height:4px;}
::-webkit-scrollbar-track{background:transparent;}
::-webkit-scrollbar-thumb{background:#D1D5DB;border-radius:2px;}
`

// ── CLOCK COMPONENT ────────────────────────────────────────────────────────
function Clock() {
  const [clock, setClock] = useState('')
  useEffect(() => {
    const tick = () => {
      const n = new Date()
      setClock(`${String(n.getUTCHours()).padStart(2,'0')}:${String(n.getUTCMinutes()).padStart(2,'0')}:${String(n.getUTCSeconds()).padStart(2,'0')} GMT`)
    }
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id)
  }, [])
  return <div className="ril-clock">{clock}</div>
}

// ── DATA ─────────────────────────────────────────────────────────────────────
const BREAKS = [
  { id:'BRK-4471', sev:'critical', isin:'DE000BWB1AK5', name:'KfW 2.375% 2031', counterparty:'BNY Mellon / Euroclear', amount:'EUR 2,450,000', assetClass:'fi', custodian:'bny', hypothesis:'Corporate action timing — ex-date discrepancy', csdr:'T+2 FAIL', csdrClass:'csdr-crit', penalty:'EUR 1,225', penaltyClass:'pen-active', action:'investigate', tags:['csdr'],
    detail:{ sev:'CRITICAL', isin:'DE000BWB1AK5', assetClass:'Fixed Income · EUR', csdrStatus:'FAILING', csdrColor:'var(--red)', confidence:87, internal:{ source:'Internal OMS · BlackRock Aladdin', qty:'2,000,000', settle:'19-Feb-2026', accrued:'EUR 47,500', diffQty:true, diffSettle:true }, external:{ source:'Custodian Statement · BNY Mellon', qty:'1,800,000', settle:'20-Feb-2026', accrued:'EUR 47,500' }, analysis:'The break is caused by a <strong>corporate action ex-date timing discrepancy</strong> on KfW 2.375% 2031. KfW declared a coupon payment with an ex-date of <strong>17-Feb-2026</strong>, but the internal OMS applied this on trade date <strong>18-Feb-2026</strong>, creating a settlement date offset. BNY Mellon recognised the ex-date correctly per Euroclear instruction.<br><br>The quantity discrepancy of <strong>200,000 units</strong> is a separate unconfirmed partial allocation from the 18-Feb booking.', steps:['Contact <strong>BNY Mellon Operations</strong> (ops.settlement@bnymellon.com) to confirm ex-date treatment and request settlement date amendment to 19-Feb.','Contact <strong>Deutsche Bank Trade Confirmation</strong> to obtain confirmation of the 200,000 unit partial allocation from booking ref DB-20240218-KFW.','If BNY Mellon does not confirm by <strong>11:00 GMT</strong>, escalate to Senior Operations Manager — CSDR penalty begins at market close.'], commsTo:'ops.settlement@bnymellon.com', commsSubject:'Settlement Date Query — DE000BWB1AK5 — BRK-4471', commsBody:'Dear BNY Mellon Operations,\n\nWe are writing regarding a settlement discrepancy on the following position:\n\n  ISIN:             DE000BWB1AK5 (KfW 2.375% 2031)\n  Internal Ref:     BRK-4471\n  Our Settlement:   19-Feb-2026\n  Your Statement:   20-Feb-2026\n\nPlease confirm your ex-date reference and advise whether a settlement date amendment is possible by 11:00 GMT today.\n\nKind regards,\nS. Rahman — Reconciliation Operations', pattern:{ label:'BNY Mellon x Corporate Actions x KfW', count:14, avgTime:'3h 22min', sla:'2h 45min', method:'Email ops team', accuracy:'91%' }, reg:{ name:'CSDR Settlement Discipline', status:'FAILING', statusColor:'var(--red)', statusBg:'#FEF2F2', statusBorder:'#FECACA', body:'Position has failed to settle on intended settlement date. <strong>Penalty accrual begins at market close today</strong> at 0.5 bps/day on EUR 2,450,000. Estimated daily penalty: <strong>EUR 1,225</strong>.', clockPct:30, clockColor:'var(--red)', clockLabel:'Buy-in: 3d 14h' }, history:[{t:'07:02',e:'<strong>Break detected</strong> — BNY Mellon T+0 statement received and parsed'},{t:'07:04',e:'<strong>AI analysis complete</strong> — Root cause: corporate action ex-date (87% confidence)'},{t:'07:04',e:'<strong>CSDR flag raised</strong> — Position identified as T+0 failing'},{t:'07:42',e:'<strong>Under investigation</strong> — Draft communication prepared'}] }
  },
  { id:'BRK-4468', sev:'critical', isin:'GB00B1YW4409', name:'Vodafone Group PLC', counterparty:'Citi / CREST', amount:'GBP 890,000', assetClass:'eq', custodian:'citi', hypothesis:'Settlement date convention mismatch T+2/T+3', csdr:'T+2 FAIL', csdrClass:'csdr-crit', penalty:'GBP 356', penaltyClass:'pen-active', action:'escalate', tags:['csdr'],
    detail:{ sev:'CRITICAL', isin:'GB00B1YW4409', assetClass:'Equities · GBP', csdrStatus:'FAILING', csdrColor:'var(--red)', confidence:92, internal:{ source:'Internal OMS · BlackRock Aladdin', qty:'100,000', settle:'19-Feb-2026', accrued:'GBP 0', diffSettle:true }, external:{ source:'Custodian Statement · Citi / CREST', qty:'100,000', settle:'20-Feb-2026', accrued:'GBP 0' }, analysis:'This break is caused by a <strong>settlement convention discrepancy</strong>. The trade was booked internally on a T+2 basis (standard UK equity settlement), but the instruction sent to CREST via Citi was submitted with a T+3 settlement date. This is a <strong>known booking error pattern</strong> seen 6 times in the past 90 days.', steps:['Submit a <strong>settlement amendment instruction</strong> to Citi CREST Operations to correct the settlement date from 20-Feb to 19-Feb.','Reference trade ID <strong>VF-20240218-001</strong> in the amendment. Citi CREST typically processes within 45 minutes.','If amendment not confirmed by <strong>10:30 GMT</strong>, escalate — CREST cut-off for same-day amendments is 12:00 GMT.'], commsTo:'crest.ops@citi.com', commsSubject:'Settlement Date Amendment — GB00B1YW4409 — BRK-4468', commsBody:'Dear Citi CREST Operations,\n\nPlease process the following settlement date amendment:\n\n  ISIN:             GB00B1YW4409 (Vodafone Group PLC)\n  Trade ID:         VF-20240218-001\n  Current Settle:   20-Feb-2026\n  Requested Settle: 19-Feb-2026\n  Quantity:         100,000 shares\n\nThis is urgent — CSDR penalty accrual begins at market close today.\n\nKind regards,\nS. Rahman', pattern:{ label:'Citi CREST x Settlement Convention x UK Equities', count:6, avgTime:'1h 48min', sla:'45min', method:'Amendment via Citi portal', accuracy:'95%' }, reg:{ name:'CSDR Settlement Discipline', status:'FAILING', statusColor:'var(--red)', statusBg:'#FEF2F2', statusBorder:'#FECACA', body:'UK equity position failing settlement. <strong>Penalty accrual at 1.0 bps/day</strong> on GBP 890,000 = GBP 89/day.', clockPct:25, clockColor:'var(--red)', clockLabel:'Buy-in: 3d 18h' }, history:[{t:'06:58',e:'<strong>Break detected</strong> — Citi CREST T+0 statement parsed'},{t:'07:00',e:'<strong>AI analysis complete</strong> — Root cause: T+2/T+3 convention (92% confidence)'},{t:'07:10',e:'<strong>Pattern match</strong> — 6 identical breaks found in 90-day history'}] }
  },
  { id:'BRK-4465', sev:'high', isin:'US912828ZL15', name:'US Treasury 1.5% 2025', counterparty:'JP Morgan / DTC', amount:'USD 5,000,000', assetClass:'fi', custodian:'jpm', hypothesis:'FX conversion rate variance — USD/EUR booking', csdr:'T+3 Review', csdrClass:'csdr-warn', penalty:'USD 2,500', penaltyClass:'pen-accruing', action:'resolve', tags:['csdr'],
    detail:{ sev:'HIGH', isin:'US912828ZL15', assetClass:'Fixed Income · USD', csdrStatus:'REVIEW', csdrColor:'var(--amber)', confidence:81, internal:{ source:'Internal OMS · BlackRock Aladdin', qty:'5,000,000', settle:'19-Feb-2026', accrued:'USD 37,500', diffAccrued:true }, external:{ source:'Custodian Statement · JP Morgan / DTC', qty:'5,000,000', settle:'19-Feb-2026', accrued:'USD 37,812' }, analysis:'The break is an <strong>FX conversion rate variance</strong> on accrued interest. The internal system booked accrued interest using the USD/EUR rate of 1.0802 (yesterday\'s fixing), while JP Morgan\'s statement reflects 1.0875 (this morning\'s ECB fixing). The difference is <strong>USD 312</strong>.<br><br>This is a timing difference that will <strong>self-resolve on tomorrow\'s T+0 statement</strong>.', steps:['<strong>No immediate action required.</strong> This break will self-resolve on the T+0 statement tomorrow.','If the break persists after 20-Feb, contact JP Morgan Operations to confirm FX fixing date methodology.','Update the internal OMS to use the same-day ECB fixing for accrued interest calculations to prevent recurrence.'], commsTo:'N/A — self-resolving', commsSubject:'N/A', commsBody:'No counterparty communication required.\n\nThis is a FX rate timing difference that will resolve automatically on the next T+0 statement cycle.\n\nMonitoring until 20-Feb-2026.', pattern:{ label:'JP Morgan x FX Variance x US Treasuries', count:22, avgTime:'Self-resolves T+1', sla:'N/A', method:'Monitor — auto-closes', accuracy:'98%' }, reg:{ name:'CSDR Settlement Discipline', status:'REVIEW', statusColor:'var(--amber)', statusBg:'#FFFBEB', statusBorder:'#FDE68A', body:'Position is settling on time. Accrued interest discrepancy of USD 312 does not affect settlement.', clockPct:0, clockColor:'var(--green)', clockLabel:'No buy-in risk' }, history:[{t:'07:15',e:'<strong>Break detected</strong> — JP Morgan T+0 statement parsed'},{t:'07:16',e:'<strong>AI analysis complete</strong> — Root cause: FX rate timing (81% confidence)'},{t:'07:16',e:'<strong>Self-resolving flag set</strong> — Monitor until 20-Feb statement'}] }
  },
  { id:'BRK-4463', sev:'high', isin:'FR0000131104', name:'BNP Paribas SA', counterparty:'State Street / Euroclear', amount:'EUR 1,100,000', assetClass:'eq', custodian:'ss', hypothesis:'Partial fill booking — quantity discrepancy 500 units', csdr:'T+3 Monitor', csdrClass:'csdr-warn', penalty:'EUR 440', penaltyClass:'pen-accruing', action:'resolve', tags:[],
    detail:{ sev:'HIGH', isin:'FR0000131104', assetClass:'Equities · EUR', csdrStatus:'MONITOR', csdrColor:'var(--amber)', confidence:78, internal:{ source:'Internal OMS · BlackRock Aladdin', qty:'10,000', settle:'19-Feb-2026', accrued:'EUR 0', diffQty:true }, external:{ source:'Custodian Statement · State Street / Euroclear', qty:'9,500', settle:'19-Feb-2026', accrued:'EUR 0' }, analysis:'The quantity discrepancy of <strong>500 shares</strong> relates to a partial fill on a block trade executed on 18-Feb. Exane BNP executed 9,500 of the 10,000 order and the remaining 500 shares are on a working order. The internal OMS booked the <strong>full 10,000</strong> on trade date.', steps:['Contact <strong>Exane BNP execution desk</strong> to confirm status of the remaining 500 share fill on trade date 18-Feb.','If fill confirmed, instruct State Street to update position to 10,000. If order cancelled, correct the internal OMS booking to 9,500.','Expected resolution by <strong>16:00 GMT</strong> today.'], commsTo:'execution@exane.com', commsSubject:'Partial Fill Confirmation — FR0000131104 — BRK-4463', commsBody:'Dear Exane Execution Desk,\n\nCould you please confirm the status of the following order:\n\n  ISIN:         FR0000131104 (BNP Paribas SA)\n  Trade Date:   18-Feb-2026\n  Order Qty:    10,000 shares\n  Confirmed:    9,500 shares\n  Outstanding:  500 shares\n\nPlease advise whether the remaining 500 shares will be filled today or if the order has been cancelled.\n\nKind regards,\nS. Rahman', pattern:{ label:'State Street x Partial Fills x French Equities', count:8, avgTime:'4h 10min', sla:'Same day', method:'Broker confirmation', accuracy:'82%' }, reg:{ name:'CSDR Settlement Discipline', status:'MONITOR', statusColor:'var(--amber)', statusBg:'#FFFBEB', statusBorder:'#FDE68A', body:'Position settling partially. 500 unit shortfall will accrue penalties if not resolved by T+2.', clockPct:55, clockColor:'var(--amber)', clockLabel:'T+3 deadline: 22h' }, history:[{t:'07:20',e:'<strong>Break detected</strong> — State Street statement shows 9,500 vs internal 10,000'},{t:'07:21',e:'<strong>AI analysis complete</strong> — Root cause: partial fill (78% confidence)'},{t:'07:22',e:'<strong>Assigned to S. Rahman</strong> — French equity desk ownership'}] }
  },
  { id:'BRK-4460', sev:'high', isin:'XS2356789012', name:'Siemens AG 0.5% 2028', counterparty:'Deutsche Bank / Clearstream', amount:'EUR 780,000', assetClass:'fi', custodian:'bny', hypothesis:'Accrued interest — day count convention 30/360 vs Act/360', csdr:'T+3 Monitor', csdrClass:'csdr-warn', penalty:'EUR 312', penaltyClass:'pen-accruing', action:'resolve', tags:[],
    detail:{ sev:'HIGH', isin:'XS2356789012', assetClass:'Fixed Income · EUR', csdrStatus:'MONITOR', csdrColor:'var(--amber)', confidence:89, internal:{ source:'Internal OMS · BlackRock Aladdin', qty:'780,000', settle:'19-Feb-2026', accrued:'EUR 3,900', diffAccrued:true }, external:{ source:'Custodian Statement · Deutsche Bank / Clearstream', qty:'780,000', settle:'19-Feb-2026', accrued:'EUR 3,940' }, analysis:'The accrued interest discrepancy of <strong>EUR 40</strong> is caused by a <strong>day count convention difference</strong>. The internal system uses 30/360, while Deutsche Bank Clearstream calculates on Act/360. The bond prospectus specifies <strong>Act/365 Fixed</strong> — meaning both systems are incorrect.', steps:['Agree the correct accrued interest figure with Deutsche Bank based on <strong>Act/365 Fixed</strong> per the Siemens bond prospectus.','Submit a manual accrued interest correction in the OMS for the difference of EUR 40.','Raise a <strong>system configuration ticket</strong> to update the day count convention for XS2356789012.'], commsTo:'recon.clearstream@db.com', commsSubject:'Accrued Interest Discrepancy — XS2356789012 — BRK-4460', commsBody:'Dear Deutsche Bank Clearstream Operations,\n\nWe have an accrued interest discrepancy:\n\n  ISIN:          XS2356789012 (Siemens AG 0.5% 2028)\n  Our Accrual:   EUR 3,900 (30/360)\n  Your Accrual:  EUR 3,940 (Act/360)\n  Difference:    EUR 40\n\nThe bond prospectus specifies Act/365 Fixed. Could you please confirm your calculation basis?\n\nKind regards,\nS. Rahman', pattern:{ label:'Deutsche Bank x Day Count x Siemens Eurobond', count:5, avgTime:'2h 30min', sla:'Same day', method:'Manual OMS correction + DB agreement', accuracy:'94%' }, reg:{ name:'CSDR Settlement Discipline', status:'MONITOR', statusColor:'var(--amber)', statusBg:'#FFFBEB', statusBorder:'#FDE68A', body:'Position settling correctly — only accrued interest is in dispute. No settlement fail risk.', clockPct:0, clockColor:'var(--green)', clockLabel:'No immediate risk' }, history:[{t:'07:18',e:'<strong>Break detected</strong> — Clearstream statement shows EUR 3,940 vs internal EUR 3,900'},{t:'07:19',e:'<strong>AI analysis complete</strong> — Root cause: 30/360 vs Act/360 (89% confidence)'},{t:'07:19',e:'<strong>Recurring pattern matched</strong> — 5 identical breaks in last 90 days'}] }
  },
  { id:'BRK-4458', sev:'medium', isin:'IE00B4L5Y983', name:'iShares Core MSCI World ETF', counterparty:'BNY Mellon / Euronext', amount:'EUR 340,000', assetClass:'eq', custodian:'bny', hypothesis:'Dividend reinvestment — likely self-resolving T+1', csdr:'T+4 OK', csdrClass:'csdr-ok', penalty:'—', penaltyClass:'pen-none', action:'monitor', tags:['auto'],
    detail:{ sev:'MEDIUM', isin:'IE00B4L5Y983', assetClass:'Equities · EUR (ETF)', csdrStatus:'OK', csdrColor:'var(--green)', confidence:84, internal:{ source:'Internal OMS · BlackRock Aladdin', qty:'12,500', settle:'19-Feb-2026', accrued:'EUR 0', diffQty:true }, external:{ source:'Custodian Statement · BNY Mellon / Euronext', qty:'12,438', settle:'19-Feb-2026', accrued:'EUR 0' }, analysis:'The quantity discrepancy of <strong>62 units</strong> is consistent with a <strong>dividend reinvestment event</strong>. iShares MSCI World declared a dividend on 14-Feb-2026. The DRIP units are in process of being created and will appear on BNY Mellon\'s statement on the T+1 settlement cycle.<br><br>This break will <strong>self-resolve on tomorrow\'s statement</strong>. No action required today.', steps:['<strong>No action required today.</strong> The DRIP units will settle on tomorrow\'s T+1 cycle.','If the break persists after 20-Feb, contact BNY Mellon ETF Operations.','Monitor via the compliance dashboard.'], commsTo:'N/A — self-resolving', commsSubject:'N/A', commsBody:'No counterparty communication required.\n\nThis is a dividend reinvestment timing difference. Expected to self-resolve 20-Feb-2026.', pattern:{ label:'BNY Mellon x DRIP x iShares ETFs', count:18, avgTime:'Self-resolves T+1', sla:'N/A', method:'Auto-closes on next statement', accuracy:'97%' }, reg:{ name:'CSDR Settlement Discipline', status:'OK', statusColor:'var(--green)', statusBg:'#ECFDF5', statusBorder:'#A7F3D0', body:'No settlement fail. Break is a timing difference below materiality threshold.', clockPct:0, clockColor:'var(--green)', clockLabel:'No risk' }, history:[{t:'07:25',e:'<strong>Break detected</strong> — BNY Mellon shows 12,438 vs internal 12,500'},{t:'07:26',e:'<strong>AI analysis complete</strong> — Root cause: DRIP timing (84% confidence)'},{t:'07:26',e:'<strong>Auto-monitoring set</strong> — Self-resolve expected 20-Feb'}] }
  },
  { id:'BRK-4456', sev:'medium', isin:'LU0274208692', name:'Xtrackers Euro Stoxx 50', counterparty:'Citi / Euroclear', amount:'EUR 215,000', assetClass:'fx', custodian:'citi', hypothesis:'Counterparty confirmation delay — Citi typically responds by 10:00', csdr:'T+4 OK', csdrClass:'csdr-ok', penalty:'—', penaltyClass:'pen-none', action:'monitor', tags:['auto'],
    detail:{ sev:'MEDIUM', isin:'LU0274208692', assetClass:'ETF · EUR', csdrStatus:'OK', csdrColor:'var(--green)', confidence:76, internal:{ source:'Internal OMS · BlackRock Aladdin', qty:'5,000', settle:'19-Feb-2026', accrued:'EUR 0', diffSettle:true }, external:{ source:'Custodian Statement · Citi / Euroclear', qty:'5,000', settle:'Unconfirmed', accrued:'EUR 0' }, analysis:'Citi has not yet confirmed the settlement instruction for this position. Based on <strong>Citi Euroclear\'s typical morning processing schedule</strong>, confirmation is expected by 10:00 GMT. This break always resolves before noon.', steps:['<strong>Wait until 10:00 GMT.</strong> Citi Euroclear confirmation is consistently received by this time.','If no confirmation by 10:00 GMT, call Citi ETF Operations directly.','Escalate at 11:00 GMT if still unresolved.'], commsTo:'etf.ops@citi.com', commsSubject:'Settlement Confirmation Pending — LU0274208692 — BRK-4456', commsBody:'Dear Citi ETF Operations,\n\nWe have an unconfirmed settlement instruction:\n\n  ISIN:          LU0274208692 (Xtrackers Euro Stoxx 50)\n  Quantity:      5,000 units\n  Settlement:    19-Feb-2026\n\nCould you please confirm receipt and expected confirmation time?\n\nKind regards,\nS. Rahman', pattern:{ label:'Citi x Confirmation Delay x Euroclear ETFs', count:31, avgTime:'Resolves by 10:15 GMT', sla:'~10:00 GMT', method:'Wait — auto-confirms', accuracy:'93%' }, reg:{ name:'CSDR Settlement Discipline', status:'OK', statusColor:'var(--green)', statusBg:'#ECFDF5', statusBorder:'#A7F3D0', body:'No settlement fail. Confirmation timing break — not a genuine discrepancy.', clockPct:0, clockColor:'var(--green)', clockLabel:'No risk today' }, history:[{t:'07:02',e:'<strong>Break detected</strong> — Citi statement shows unconfirmed status'},{t:'07:03',e:'<strong>AI analysis complete</strong> — Root cause: confirmation timing (76% confidence)'},{t:'07:03',e:'<strong>Auto-monitoring set</strong> — Pattern: resolves by 10:00 GMT in 31/31 cases'}] }
  },
  { id:'BRK-4451', sev:'low', isin:'US594918BP38', name:'Microsoft Corp 2.4% 2026', counterparty:'JP Morgan / DTC', amount:'USD 120,000', assetClass:'fi', custodian:'jpm', hypothesis:'Rounding difference — will auto-resolve on EOD sweep', csdr:'T+5 Low', csdrClass:'csdr-ok', penalty:'—', penaltyClass:'pen-none', action:'auto', tags:['auto'],
    detail:{ sev:'LOW', isin:'US594918BP38', assetClass:'Fixed Income · USD', csdrStatus:'OK', csdrColor:'var(--green)', confidence:99, internal:{ source:'Internal OMS · BlackRock Aladdin', qty:'120,000', settle:'19-Feb-2026', accrued:'USD 2,400.00', diffAccrued:true }, external:{ source:'Custodian Statement · JP Morgan / DTC', qty:'120,000', settle:'19-Feb-2026', accrued:'USD 2,400.01' }, analysis:'This is a <strong>USD 0.01 rounding difference</strong> on accrued interest caused by a floating point precision difference. This exact break appears on <strong>every interest accrual cycle</strong> for this CUSIP and is automatically corrected on the EOD sweep at 17:00 GMT.', steps:['<strong>No action required.</strong> This break will auto-resolve on the EOD position sweep at 17:00 GMT.','This is a known rounding artifact — it always auto-closes.','If it does not close after the EOD sweep, raise a system configuration ticket.'], commsTo:'N/A', commsSubject:'N/A', commsBody:'No action required.\n\nThis is a USD 0.01 rounding difference on accrued interest that auto-resolves on the EOD sweep at 17:00 GMT. This break pattern has occurred 47 times for this CUSIP and always closes automatically.', pattern:{ label:'JP Morgan DTC x Rounding x US Corporates', count:47, avgTime:'Auto-resolves EOD', sla:'N/A', method:'EOD system sweep', accuracy:'100%' }, reg:{ name:'CSDR Settlement Discipline', status:'OK', statusColor:'var(--green)', statusBg:'#ECFDF5', statusBorder:'#A7F3D0', body:'No settlement fail. Sub-penny rounding artifact with no CSDR implications.', clockPct:0, clockColor:'var(--green)', clockLabel:'No risk' }, history:[{t:'07:05',e:'<strong>Break detected</strong> — USD 0.01 rounding difference on accrual'},{t:'07:05',e:'<strong>AI analysis complete</strong> — Root cause: rounding artifact (99% confidence)'},{t:'07:05',e:'<strong>Auto-resolve scheduled</strong> — EOD sweep 17:00 GMT'}] }
  },
]

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function ReconIntelApp() {
  const nav = useNavigate()
  const [screen, setScreen] = useState('queue') // queue | detail | compliance | settings
  const [breakStates, setBreakStates] = useState(() => Object.fromEntries(BREAKS.map(b => [b.id, 'open'])))
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [detailId, setDetailId] = useState(null)
  const [modal, setModal] = useState(null)
  const [resolvedCount, setResolvedCount] = useState(23)
  const [toasts, setToasts] = useState([])
  const [escalateTarget, setEscalateTarget] = useState(null)
  const [resolveTarget, setResolveTarget] = useState(null)
  const [reconStep, setReconStep] = useState('pre') // pre | running | done
  const [reconProgress, setReconProgress] = useState(35)
  const [reconStepIdx, setReconStepIdx] = useState(0)
  const [selectedTeam, setSelectedTeam] = useState(0)
  const [toggles, setToggles] = useState([true, true, true, false, true, true, false, true])

  function showToast(msg, type = 'info') {
    const id = Date.now()
    setToasts(t => [...t, { id, msg, type }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3100)
  }

  function setBreakState(id, state) {
    setBreakStates(s => ({ ...s, [id]: state }))
  }

  function openDetail(id) { setDetailId(id); setScreen('detail') }

  function filteredBreaks() {
    return BREAKS.filter(b => {
      const st = breakStates[b.id]
      const s = search.toLowerCase()
      if (s && ![b.isin, b.name, b.counterparty, b.id].some(v => v.toLowerCase().includes(s))) return false
      if (filter === 'csdr') return b.tags.includes('csdr') && st !== 'resolved'
      if (filter === 'unassigned') return st === 'open'
      if (filter === 'auto') return b.tags.includes('auto')
      if (['critical','high','medium','low'].includes(filter)) return b.sev === filter
      if (['fi','eq','fx'].includes(filter)) return b.assetClass === filter
      if (['bny','jpm','citi','ss'].includes(filter)) return b.custodian === filter
      return true
    })
  }

  function confirmResolve() {
    if (!resolveTarget) return
    setBreakState(resolveTarget, 'resolved')
    setResolvedCount(c => c + 1)
    setModal('resolve-success')
    setResolveTarget(null)
  }

  function confirmEscalate() {
    if (!escalateTarget) return
    setBreakState(escalateTarget, 'escalated')
    setModal(null)
    showToast(`${escalateTarget} escalated to T. Okafor — Senior Operations`, 'info')
    setEscalateTarget(null)
  }

  function startRecon() {
    setReconStep('running')
    setReconProgress(35)
    setReconStepIdx(0)
    let prog = 35, step = 0
    const iv = setInterval(() => {
      prog = Math.min(prog + Math.random() * 15 + 5, 100)
      setReconProgress(prog)
      const newStep = Math.floor(prog / 17)
      if (newStep > step) { step = newStep; setReconStepIdx(step) }
      if (prog >= 100) { clearInterval(iv); setTimeout(() => setReconStep('done'), 400) }
    }, 300)
  }

  const detail = detailId ? BREAKS.find(b => b.id === detailId) : null

  // ── RENDER: QUEUE ──────────────────────────────────────────────────────────
  function QueueScreen() {
    const list = filteredBreaks()
    const CHIPS = [
      ['all','All (8)'], ['csdr','CSDR Failing (2)'], ['unassigned','Unassigned (5)'], ['auto','Auto-resolvable (2)'],
      null,
      ['fi','Fixed Income'], ['eq','Equities'], ['fx','FX'],
    ]
    return (
      <>
        <div className="ril-screen-hd">
          <div>
            <div className="ril-screen-title">Morning Break Queue</div>
            <div className="ril-screen-sub">19 FEB 2026 · T+0 SESSION · AI-PRIORITISED</div>
          </div>
          <div className="ril-hd-actions">
            <button className="rbtn" onClick={() => setModal('export')}>Export</button>
            <button className="rbtn" onClick={() => setModal('assign')}>Assign All</button>
            <button className="rbtn rbtn-primary" onClick={() => { setReconStep('pre'); setModal('recon') }}>Run Reconciliation</button>
          </div>
        </div>
        <div className="ril-filter-bar" style={{background:'var(--bgp)'}}>
          {CHIPS.map((c, i) => c === null
            ? <div key={i} className="ril-chip-sep"/>
            : <div key={c[0]} className={`ril-chip${filter===c[0]?' active':''}`} onClick={() => setFilter(c[0])}>{c[1]}</div>
          )}
          <div className="ril-search">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="#9CA3AF" strokeWidth="2"><circle cx="7" cy="7" r="5"/><path d="M12 12l2.5 2.5"/></svg>
            <input placeholder="Search ISIN, counterparty…" value={search} onChange={e => setSearch(e.target.value)}/>
          </div>
        </div>
        <div className="ril-table">
          <div className="ril-table-hd">
            <div/><div>BREAK ID</div><div>INSTRUMENT</div><div>COUNTERPARTY</div>
            <div>BREAK AMOUNT</div><div>AI ROOT CAUSE</div><div>CSDR CLOCK</div>
            <div>PENALTY EXP.</div><div>ACTION</div>
          </div>
          {list.length === 0
            ? <div className="ril-empty"><div className="ril-empty-icon">◎</div><div className="ril-empty-text">No breaks match the current filter</div></div>
            : list.map((b, i) => {
                const st = breakStates[b.id]
                let rowClass = 'ril-row'
                if (st === 'resolved') rowClass += ' resolved'
                if (st === 'monitoring') rowClass += ' monitoring'
                if (st === 'escalated') rowClass += ' escalated-r'
                const stateTag = st === 'monitoring' ? <span className="rtag rtag-mon" style={{marginLeft:4}}>MONITORING</span>
                  : st === 'escalated' ? <span className="rtag rtag-esc" style={{marginLeft:4}}>ESCALATED</span>
                  : st === 'resolved' ? <span className="rtag rtag-res" style={{marginLeft:4}}>RESOLVED</span>
                  : null
                let actionEl
                if (st === 'resolved') actionEl = <span style={{fontSize:'10px',color:'var(--green)'}}>✓ Resolved</span>
                else if (st === 'monitoring') actionEl = <button className="ril-act-btn inv" onClick={e=>{e.stopPropagation();openDetail(b.id)}}>Monitoring</button>
                else if (st === 'escalated') actionEl = <button className="ril-act-btn esc" onClick={e=>{e.stopPropagation();openDetail(b.id)}}>Escalated</button>
                else if (b.action === 'investigate') actionEl = <button className="ril-act-btn inv" onClick={e=>{e.stopPropagation();openDetail(b.id)}}>Investigate</button>
                else if (b.action === 'escalate') actionEl = <button className="ril-act-btn esc" onClick={e=>{e.stopPropagation();setEscalateTarget(b.id);setModal('escalate')}}>Escalate</button>
                else if (b.action === 'resolve') actionEl = <button className="ril-act-btn res" onClick={e=>{e.stopPropagation();setResolveTarget(b.id);setModal('resolve')}}>Resolve</button>
                else if (b.action === 'monitor') actionEl = <button className="ril-act-btn" onClick={e=>{e.stopPropagation();setBreakState(b.id,'monitoring');showToast(`${b.id} set to monitoring`,'info')}}>Monitor</button>
                else actionEl = <button className="ril-act-btn inv" onClick={e=>{e.stopPropagation();openDetail(b.id)}}>Auto-resolve</button>
                return (
                  <div key={b.id} className={rowClass} style={{animationDelay:`${i*0.04}s`}} onClick={() => openDetail(b.id)}>
                    <div style={{display:'flex',alignItems:'center',justifyContent:'center'}}><div className={`sev-dot sev-${b.sev}`}/></div>
                    <div className="ril-bid">{b.id}</div>
                    <div><div className="ril-bname">{b.isin}</div><div className="ril-bsub">{b.name}{stateTag}</div></div>
                    <div className="ril-bcp">{b.counterparty}</div>
                    <div className="ril-bamt">{b.amount}</div>
                    <div className="ril-ai-hyp"><span className="ril-ai-tag">AI</span>{b.hypothesis}</div>
                    <div className={`ril-csdr ${b.csdrClass}`}>{b.csdr}</div>
                    <div className={`ril-pen ${b.penaltyClass}`}>{b.penalty}</div>
                    <div onClick={e=>e.stopPropagation()}>{actionEl}</div>
                  </div>
                )
              })
          }
        </div>
      </>
    )
  }

  // ── RENDER: DETAIL ─────────────────────────────────────────────────────────
  function DetailScreen() {
    if (!detail) return null
    const d = detail.detail
    const st = breakStates[detail.id]
    const csdrChipStyle = d.csdrStatus === 'FAILING'
      ? {background:'#FEF2F2',border:'1px solid #FECACA',color:'var(--red)'}
      : {background:'#FFFBEB',border:'1px solid #FDE68A',color:'var(--amber)'}
    return (
      <>
        <div className="ril-detail-back" onClick={() => setScreen('queue')}>← Back to Break Queue</div>
        <div className="ril-detail-layout">
          <div className="ril-detail-main">
            <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',margin:'16px 0 20px'}}>
              <div>
                <div className="ril-detail-title">{detail.id} — {detail.name}</div>
                <div className="ril-meta">
                  <span className="ril-mchip" style={{background:'#FEF2F2',border:'1px solid #FECACA',color:'var(--red)'}}>{d.sev}</span>
                  <span className="ril-mchip" style={{background:'var(--bg2)',border:'1px solid var(--bor)',color:'var(--tm)'}}>{detail.isin}</span>
                  <span className="ril-mchip" style={{background:'var(--bg2)',border:'1px solid var(--bor)',color:'var(--tm)'}}>{d.assetClass}</span>
                  <span className="ril-mchip" style={csdrChipStyle}>CSDR: {d.csdrStatus}</span>
                </div>
              </div>
              <div style={{display:'flex',gap:'8px'}}>
                {st === 'resolved'
                  ? <span className="rtag rtag-res" style={{fontSize:'12px',padding:'4px 12px'}}>RESOLVED</span>
                  : <>
                      <button className="rbtn" onClick={() => { setResolveTarget(detail.id); setModal('resolve') }}>Resolve</button>
                      <button className="rbtn rbtn-danger" onClick={() => { setEscalateTarget(detail.id); setModal('escalate') }}>Escalate</button>
                      <button className="rbtn rbtn-primary" onClick={() => setScreen('compliance')}>Audit Trail</button>
                    </>
                }
              </div>
            </div>

            <div className="ril-section-title">Position Comparison</div>
            <div className="ril-pos-compare">
              <div className="ril-pos-box">
                <div className="ril-pos-src">{d.internal.source}</div>
                <div className="ril-pos-row"><span className="ril-pos-key">ISIN</span><span className="ril-pos-val">{detail.isin}</span></div>
                <div className="ril-pos-row"><span className="ril-pos-key">Quantity</span><span className="ril-pos-val">{d.internal.qty}</span></div>
                <div className="ril-pos-row"><span className="ril-pos-key">Settlement</span><span className="ril-pos-val">{d.internal.settle}</span></div>
                <div className="ril-pos-row"><span className="ril-pos-key">Accrued Int.</span><span className="ril-pos-val">{d.internal.accrued}</span></div>
              </div>
              <div className="ril-pos-vs">≠</div>
              <div className="ril-pos-box mismatch">
                <div className="ril-pos-src">{d.external.source}</div>
                <div className="ril-pos-row"><span className="ril-pos-key">ISIN</span><span className="ril-pos-val">{detail.isin}</span></div>
                <div className="ril-pos-row"><span className="ril-pos-key">Quantity</span><span className={`ril-pos-val${d.internal.diffQty?' diff':''}`}>{d.external.qty}</span></div>
                <div className="ril-pos-row"><span className="ril-pos-key">Settlement</span><span className={`ril-pos-val${d.internal.diffSettle?' diff':''}`}>{d.external.settle}</span></div>
                <div className="ril-pos-row"><span className="ril-pos-key">Accrued Int.</span><span className={`ril-pos-val${d.internal.diffAccrued?' diff':''}`}>{d.external.accrued}</span></div>
              </div>
            </div>

            <div className="ril-ai-card">
              <div className="ril-ai-card-hd">
                <div className="ril-ai-icon">◈</div>
                <div className="ril-ai-card-title">AI Root Cause Analysis</div>
                <div className="ril-conf-wrap">
                  <span className="ril-conf-label">CONFIDENCE</span>
                  <div className="ril-conf-bar"><div className="ril-conf-fill" style={{width:`${d.confidence}%`}}/></div>
                  <span className="ril-conf-pct">{d.confidence}%</span>
                </div>
              </div>
              <div className="ril-ai-body" dangerouslySetInnerHTML={{__html: d.analysis}}/>
              <div className="ril-steps">
                <div style={{fontSize:'10px',color:'var(--tm)',letterSpacing:'.15em',textTransform:'uppercase',marginBottom:'6px'}}>Recommended Resolution Path</div>
                {d.steps.map((s, i) => (
                  <div key={i} className="ril-step">
                    <div className="ril-step-num">{i+1}</div>
                    <div className="ril-step-text" dangerouslySetInnerHTML={{__html: s}}/>
                  </div>
                ))}
              </div>
            </div>

            <div className="ril-comms-box">
              <div className="ril-comms-hd">
                <div className="ril-section-title" style={{margin:0}}>AI-Drafted Communication</div>
                <button className="rbtn" onClick={() => setModal('send')}>Edit &amp; Send</button>
              </div>
              <div className="ril-comms-to">TO: <span>{d.commsTo}</span> &nbsp;|&nbsp; SUBJECT: <span>{d.commsSubject}</span></div>
              <div className="ril-comms-body">{d.commsBody}</div>
            </div>
          </div>

          <div className="ril-detail-side">
            <div className="ril-section-title">Regulatory Impact</div>
            <div className="ril-reg-item" style={{borderColor:d.reg.statusBorder,marginBottom:'14px'}}>
              <div className="ril-reg-hd">
                <div className="ril-reg-name">{d.reg.name}</div>
                <div className="ril-reg-status" style={{background:d.reg.statusBg,color:d.reg.statusColor,border:`1px solid ${d.reg.statusBorder}`}}>{d.reg.status}</div>
              </div>
              <div className="ril-reg-body" dangerouslySetInnerHTML={{__html: d.reg.body}}/>
              {d.reg.clockPct > 0
                ? <div style={{display:'flex',alignItems:'center',gap:'8px',marginTop:'8px'}}>
                    <span style={{fontSize:'10px',color:'var(--tm)',whiteSpace:'nowrap'}}>{d.reg.clockLabel}</span>
                    <div className="ril-clock-track"><div className="ril-clock-fill" style={{width:`${d.reg.clockPct}%`,background:d.reg.clockColor}}/></div>
                  </div>
                : <div style={{fontSize:'10px',color:'var(--green)',marginTop:'6px',}}>{d.reg.clockLabel}</div>
              }
            </div>

            <div className="ril-section-title">Institutional Memory</div>
            <div className="ril-pattern-card">
              <div style={{fontSize:'11px',color:'var(--tm)',marginBottom:'10px'}}>{d.pattern.label}</div>
              {[['Similar breaks (6mo)', d.pattern.count, ''],['Avg resolution time', d.pattern.avgTime, 'good'],['Counterparty SLA', d.pattern.sla, 'warn'],['Resolution method', d.pattern.method, ''],['AI accuracy (type)', d.pattern.accuracy, 'good']].map(([k,v,cls]) => (
                <div key={k} className="ril-pstat">
                  <span className="ril-pstat-k">{k}</span>
                  <span className={`ril-pstat-v${cls?' '+cls:''}`}>{v}</span>
                </div>
              ))}
            </div>

            <div className="ril-section-title" style={{marginTop:'16px'}}>Break Timeline</div>
            {d.history.map((h, i) => (
              <div key={i} className="ril-hist-item">
                <span className="ril-hist-t">{h.t} GMT</span>
                <span className="ril-hist-e" dangerouslySetInnerHTML={{__html: h.e}}/>
              </div>
            ))}

            <div style={{marginTop:'16px',display:'flex',flexDirection:'column',gap:'8px'}}>
              <button className="rbtn rbtn-success" style={{width:'100%'}} onClick={() => { setResolveTarget(detail.id); setModal('resolve') }}>Resolve Break</button>
              <button className="rbtn rbtn-danger" style={{width:'100%'}} onClick={() => { setEscalateTarget(detail.id); setModal('escalate') }}>Escalate to Senior Ops</button>
              <button className="rbtn" style={{width:'100%',marginTop:'4px'}} onClick={() => { setBreakState(detail.id,'monitoring'); showToast(`${detail.id} set to monitoring`,'info') }}>Set to Monitoring</button>
            </div>
          </div>
        </div>
      </>
    )
  }

  // ── RENDER: COMPLIANCE ─────────────────────────────────────────────────────
  function ComplianceScreen() {
    const BAR_DATA = [
      ['Mon','rgba(30,127,232,.6)','rgba(30,127,232,.2)',55],['Tue','rgba(245,166,35,.6)','rgba(245,166,35,.2)',68],
      ['Wed','rgba(0,200,150,.6)','rgba(0,200,150,.2)',42],['Thu','rgba(30,127,232,.6)','rgba(30,127,232,.2)',58],
      ['Fri','rgba(0,200,150,.6)','rgba(0,200,150,.2)',35],['Mon','rgba(0,200,150,.6)','rgba(0,200,150,.2)',28],
      ['Tue','rgba(37,99,235,.6)','rgba(37,99,235,.2)',30],
    ]
    return (
      <>
        <div className="ril-screen-hd">
          <div>
            <div className="ril-screen-title">Compliance & Audit Dashboard</div>
            <div className="ril-screen-sub">19 FEB 2026 · REGULATORY EXPOSURE + AUTO-GENERATED AUDIT TRAIL</div>
          </div>
          <div className="ril-hd-actions">
            <button className="rbtn" onClick={() => setModal('csdr-export')}>Export CSDR Report</button>
            <button className="rbtn rbtn-primary" onClick={() => setModal('filing')}>Generate Regulatory Filing</button>
          </div>
        </div>
        <div className="ril-metrics">
          {[
            { label:'CSDR Penalty Exposure', val:'€84,200', cls:'red', sub:'Accruing across 8 positions', delta:'↑ €12,400 vs yesterday', dc:'delta-up', onClick:() => { setFilter('csdr'); setScreen('queue') } },
            { label:'Positions at Risk', val:'8', cls:'amber', sub:'Buy-in exposure within 4 days', delta:'↑ 3 new today', dc:'delta-up', onClick:() => setModal('buyin') },
            { label:'Resolved Today', val:String(resolvedCount), cls:'green', sub:'Avg resolution: 2h 14min', delta:'↓ 38min vs last week', dc:'delta-down', onClick:() => setScreen('queue') },
            { label:'Audit Trail Coverage', val:'100%', cls:'blue', sub:'All breaks auto-documented', delta:'↓ 0 manual entries required', dc:'delta-down' },
          ].map((m, i) => (
            <div key={i} className={`ril-metric ${m.cls}`} onClick={m.onClick}>
              <div className="ril-metric-label">{m.label}</div>
              <div className={`ril-metric-val ${m.cls}`}>{m.val}</div>
              <div className="ril-metric-sub">{m.sub}</div>
              <div className={`ril-metric-delta ${m.dc}`}>{m.delta}</div>
            </div>
          ))}
        </div>
        <div className="ril-comp-layout">
          {/* CSDR Penalty Tracker */}
          <div className="ril-cpanel">
            <div className="ril-cpanel-hd">
              <div className="ril-cpanel-title">CSDR Settlement Fails — Penalty Tracker</div>
              <span className="ril-sb-badge nb-red">8 active</span>
            </div>
            <div className="ril-cpanel-body">
              <div style={{display:'grid',gridTemplateColumns:'1fr 70px 70px 85px',gap:'8px',padding:'0 0 8px',fontSize:'9px',color:'var(--tm)',letterSpacing:'.1em',textTransform:'uppercase',borderBottom:'1px solid var(--bor)',marginBottom:'4px'}}>
                <div>Position</div><div style={{textAlign:'center'}}>Days</div><div style={{textAlign:'center'}}>Rate</div><div style={{textAlign:'right'}}>Accrued</div>
              </div>
              {[
                ['KfW 2.375% 2031','DE000BWB1AK5 · BNY Mellon','1d','0.5bps','€1,225','high','BRK-4471'],
                ['US Treasury 1.5% 2025','US912828ZL15 · JP Morgan','2d','0.5bps','€4,980','high','BRK-4465'],
                ['Siemens AG 0.5% 2028','XS2356789012 · Deutsche Bank','3d','0.5bps','€1,170','med','BRK-4460'],
                ['BNP Paribas SA','FR0000131104 · State Street','2d','1.0bps','€2,200','med','BRK-4463'],
                ['Vodafone Group PLC','GB00B1YW4409 · Citi','1d','1.0bps','£890','med','BRK-4468'],
              ].map(([name, sub, days, bps, eur, cls, bid]) => (
                <div key={bid} className="ril-pen-row" style={{cursor:'pointer'}} onClick={() => openDetail(bid)}>
                  <div><div className="ril-pen-fund">{name}</div><div className="ril-pen-sub">{sub}</div></div>
                  <div className="ril-pen-days">{days}</div>
                  <div className="ril-pen-bps">{bps}</div>
                  <div className={`ril-pen-eur ${cls}`}>{eur}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Audit Trail */}
          <div className="ril-cpanel">
            <div className="ril-cpanel-hd">
              <div className="ril-cpanel-title">Auto-Generated Audit Trail</div>
              <button className="rbtn" style={{fontSize:'10px',padding:'4px 10px'}} onClick={() => setModal('pdf')}>Export PDF</button>
            </div>
            <div className="ril-cpanel-body">
              <div style={{display:'grid',gridTemplateColumns:'92px 72px 1fr 68px',gap:'8px',padding:'0 0 8px',fontSize:'9px',color:'var(--tm)',letterSpacing:'.1em',textTransform:'uppercase',borderBottom:'1px solid var(--bor)',marginBottom:'4px'}}>
                <div>Timestamp</div><div>User</div><div>Action</div><div>Status</div>
              </div>
              {[
                ['07:04:12','SYSTEM','AI root cause analysis — BRK-4471 classified: corporate action timing (87%)','a-auto','AUTO'],
                ['07:05:33','SYSTEM','CSDR penalty flag raised — BRK-4471 settlement fail T+0','a-escalated','FLAGGED'],
                ['07:42:18','S. Rahman','Investigation opened — BRK-4471, draft comms prepared to BNY Mellon','a-pending','PENDING'],
                ['06:55:04','SYSTEM','BRK-4451 auto-resolved — rounding diff cleared on EOD sweep','a-resolved','RESOLVED'],
                ['06:30:11','T. Okafor','BRK-4439 resolved — State Street confirmed partial allocation','a-resolved','RESOLVED'],
                ['06:12:45','SYSTEM','MiFID II best execution doc generated — BRK-4471 ref MEX-2026-0219-4471','a-auto','AUTO'],
                ['05:58:02','T. Okafor','BRK-4437 escalated to Senior Ops — buy-in deadline T+1','a-escalated','ESCALATED'],
              ].map(([t, u, a, cls, lbl], i) => (
                <div key={i} className="ril-audit-row">
                  <div className="ril-audit-time">{t}</div>
                  <div className="ril-audit-user">{u}</div>
                  <div className="ril-audit-action">{a}</div>
                  <div><span className={`astatus ${cls}`}>{lbl}</span></div>
                </div>
              ))}
            </div>
          </div>

          {/* Bar Chart */}
          <div className="ril-cpanel">
            <div className="ril-cpanel-hd"><div className="ril-cpanel-title">Break Resolution Trend — Last 7 Days</div></div>
            <div className="ril-cpanel-body">
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:'8px'}}>
                <span style={{fontSize:'11px',color:'var(--tm)'}}>Mean Time to Resolution</span>
                <span style={{fontSize:'13px',fontWeight:'600',color:'var(--green)'}}>2h 14min <span style={{fontSize:'10px',color:'var(--tm)',fontWeight:'400'}}>↓ 38% vs baseline</span></span>
              </div>
              <div className="ril-bar-chart">
                {[['Mon',55,'rgba(30,127,232,.5)'],['Tue',68,'rgba(245,166,35,.5)'],['Wed',42,'rgba(0,200,150,.5)'],['Thu',58,'rgba(30,127,232,.5)'],['Fri',35,'rgba(0,200,150,.5)'],['Mon',28,'rgba(0,200,150,.5)'],['Tue',30,'rgba(37,99,235,.5)']].map(([lbl,h,c]) => (
                  <div key={lbl+h} className="ril-bar-col">
                    <div className="ril-bar" style={{height:`${h}px`,background:c}}/>
                    <div className="ril-bar-lbl">{lbl}</div>
                  </div>
                ))}
              </div>
              <div style={{display:'flex',justifyContent:'space-between',marginTop:'12px',paddingTop:'12px',borderTop:'1px solid var(--bor)'}}>
                {[['73%','AI Accuracy'],['11','Auto-Resolved'],['€0','Penalties YTD'],['100%','Audit Coverage']].map(([v,l]) => (
                  <div key={l} style={{textAlign:'center'}}>
                    <div style={{fontSize:'16px',fontWeight:'600',color:'var(--blue)'}}>{v}</div>
                    <div style={{fontSize:'10px',color:'var(--tm)'}}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Regulatory Deadlines */}
          <div className="ril-cpanel">
            <div className="ril-cpanel-hd"><div className="ril-cpanel-title">Upcoming Regulatory Deadlines</div></div>
            <div className="ril-cpanel-body">
              {[
                { name:'CSDR Buy-In Deadline', status:'TODAY 17:30', statusStyle:{background:'rgba(232,68,68,.1)',color:'var(--red)',border:'1px solid #FCA5A5'}, body:'BRK-4437 — mandatory buy-in if not resolved. Estimated cost: <strong>€45,000 above market</strong>. Escalated to Senior Ops at 05:58.', onClick:() => setModal('buyin'), borderStyle:'#FCA5A5' },
                { name:'EMIR Trade Reporting', status:'T+1 · 12:00', statusStyle:{background:'rgba(245,166,35,.1)',color:'var(--amber)',border:'1px solid rgba(245,166,35,.2)'}, body:'14 derivative trades require EMIR reporting to FCA trade repository. Auto-generated reports ready — 0 manual prep required.', onClick:() => setModal('emir'), borderStyle:'var(--bor)' },
                { name:'MiFID II Transaction Reporting', status:'ON TRACK', statusStyle:{background:'rgba(0,200,150,.1)',color:'var(--green)',border:'1px solid rgba(0,200,150,.2)'}, body:"Yesterday's 127 reportable transactions submitted to FCA ARM at 06:15 GMT. Confirmation ref: ARM-2026-0219-00847.", onClick:() => setModal('mifid'), borderStyle:'var(--bor)' },
              ].map((r, i) => (
                <div key={i} className="ril-reg-item-comp" style={{borderColor:r.borderStyle}} onClick={r.onClick}>
                  <div className="ril-reg-hd">
                    <div className="ril-reg-name">{r.name}</div>
                    <div className="ril-reg-status" style={r.statusStyle}>{r.status}</div>
                  </div>
                  <div className="ril-reg-body" dangerouslySetInnerHTML={{__html: r.body}}/>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    )
  }

  // ── RENDER: SETTINGS ───────────────────────────────────────────────────────
  function SettingsScreen() {
    return (
      <>
        <div className="ril-screen-hd">
          <div>
            <div className="ril-screen-title">Settings</div>
            <div className="ril-screen-sub">SYSTEM CONFIGURATION · INTEGRATIONS · USER PREFERENCES</div>
          </div>
          <div className="ril-hd-actions">
            <button className="rbtn rbtn-primary" onClick={() => showToast('Settings saved successfully','success')}>Save Changes</button>
          </div>
        </div>
        <div className="ril-settings">
          <div className="ril-settings-sec">
            <div className="ril-settings-sec-title">Data Integrations</div>
            {[
              ['SS','SmartStream TLM','● Connected · Last sync 07:02 GMT',false],
              ['BR','Broadridge','● Connected · Last sync 07:00 GMT',false],
              ['BL','Bloomberg B-PIPE','● Connected · Real-time feed active',false],
              ['AL','BlackRock Aladdin (OMS)','○ Disconnected',true],
              ['EC','Euroclear SWIFT Feed','● Connected · SWIFT MT950 active',false],
            ].map(([icon,name,status,disco]) => (
              <div key={name} className="ril-int-card">
                <div className="ril-int-info">
                  <div className="ril-int-icon">{icon}</div>
                  <div>
                    <div className="ril-int-name">{name}</div>
                    <div className={`ril-int-status${disco?' disc':''}`}>{status}</div>
                  </div>
                </div>
                <button className={`rbtn${disco?' rbtn-primary':''}`} onClick={() => setModal(disco?'connect':'integration')}>{disco?'Connect':'Configure'}</button>
              </div>
            ))}
          </div>

          <div className="ril-settings-sec">
            <div className="ril-settings-sec-title">AI Intelligence Settings</div>
            {[
              ['Auto-resolve low-confidence breaks','Automatically close breaks classified as rounding differences or timing offsets below £5,000',0],
              ['AI draft counterparty communications','Generate draft emails for each break requiring counterparty contact',1],
              ['Institutional memory learning','Feed resolved breaks back into the pattern recognition model',2],
            ].map(([label,desc,idx]) => (
              <div key={idx} className="ril-settings-row">
                <div><div className="ril-settings-label">{label}</div><div className="ril-settings-desc">{desc}</div></div>
                <div className={`ril-toggle${toggles[idx]?' on':''}`} onClick={() => setToggles(t => { const n=[...t]; n[idx]=!n[idx]; return n })}/>
              </div>
            ))}
            <div className="ril-settings-row">
              <div><div className="ril-settings-label">Confidence threshold for auto-classification</div><div className="ril-settings-desc">Minimum confidence score to display AI hypothesis without human review flag</div></div>
              <select className="ril-select"><option>70%</option><option selected>75%</option><option>80%</option><option>85%</option></select>
            </div>
          </div>

          <div className="ril-settings-sec">
            <div className="ril-settings-sec-title">Regulatory Configuration</div>
            {[
              ['CSDR jurisdiction','Regulatory framework for settlement discipline calculations'],
              ['CSDR early warning threshold','Alert when failing position reaches this percentage of buy-in timeline'],
            ].map(([label,desc],i) => (
              <div key={i} className="ril-settings-row">
                <div><div className="ril-settings-label">{label}</div><div className="ril-settings-desc">{desc}</div></div>
                <select className="ril-select"><option>{i===0?'EU / UK CSDR':'25%'}</option><option>{i===0?'US SEC Rule 15c3-3':'50%'}</option></select>
              </div>
            ))}
            <div className="ril-settings-row">
              <div><div className="ril-settings-label">Auto-generate MiFID II documentation</div><div className="ril-settings-desc">Automatically produce best execution records for all reportable transactions</div></div>
              <div className={`ril-toggle${toggles[3]?' on':''}`} onClick={() => setToggles(t => { const n=[...t]; n[3]=!n[3]; return n })}/>
            </div>
            <div className="ril-settings-row">
              <div><div className="ril-settings-label">EMIR reporting entity LEI</div><div className="ril-settings-desc">Legal Entity Identifier for trade repository reporting</div></div>
              <input className="ril-input" defaultValue="213800WAVVOPS85N2205"/>
            </div>
          </div>

          <div className="ril-settings-sec">
            <div className="ril-settings-sec-title">Notifications & Alerts</div>
            {[[4,'CSDR penalty alerts','Real-time push notification when a position starts accruing CSDR penalties'],[5,'Buy-in deadline warnings','Alert at 24h, 4h, and 1h before mandatory buy-in triggers'],[6,'Daily reconciliation summary','Email digest at 08:00 GMT with overnight breaks and pending actions']].map(([idx,label,desc]) => (
              <div key={idx} className="ril-settings-row">
                <div><div className="ril-settings-label">{label}</div><div className="ril-settings-desc">{desc}</div></div>
                <div className={`ril-toggle${toggles[idx]?' on':''}`} onClick={() => setToggles(t => { const n=[...t]; n[idx]=!n[idx]; return n })}/>
              </div>
            ))}
            <div className="ril-settings-row">
              <div><div className="ril-settings-label">Notification email</div></div>
              <input className="ril-input" defaultValue="s.rahman@institution.com"/>
            </div>
          </div>
        </div>
      </>
    )
  }

  // ── MODALS ─────────────────────────────────────────────────────────────────
  const RECON_CHECKS = ['Connecting to SmartStream TLM','Fetching BNY Mellon T+0 statements','Processing JP Morgan custodian data','Running AI break classification','Generating CSDR assessment','Updating institutional memory']

  function Modal({ modal, setModal, resolveTarget, escalateTarget, selectedTeam, setSelectedTeam, detail, reconStep, reconStepIdx, reconProgress, startRecon, showToast, openDetail, setScreen, confirmResolve, confirmEscalate }) {
    if (!modal) return null

    const close = () => setModal(null)
    const genericExportFn = (msg) => { close(); showToast(msg, 'success') }

    const content = {
      'resolve': (
        <div className="ril-modal">
          <div className="ril-modal-title">Resolve Break</div>
          <div className="ril-modal-sub">{resolveTarget} — Mark as resolved and update the audit trail</div>
          <div className="ril-modal-info">
            <strong>Break:</strong> {resolveTarget}<br/>
            <strong>Instrument:</strong> {BREAKS.find(b=>b.id===resolveTarget)?.name}<br/>
            <strong>Break Amount:</strong> {BREAKS.find(b=>b.id===resolveTarget)?.amount}
          </div>
          <div className="ril-modal-field">
            <div className="ril-modal-label">Resolution Method</div>
            <select className="ril-modal-select">
              <option>Counterparty confirmed and amended</option>
              <option>Internal booking correction</option>
              <option>Corporate action timing — self-resolved</option>
              <option>FX conversion reconciled</option>
              <option>Other</option>
            </select>
          </div>
          <div className="ril-modal-field">
            <div className="ril-modal-label">Resolution Notes</div>
            <textarea className="ril-modal-textarea" placeholder="Add notes for the audit trail…"/>
          </div>
          <div className="ril-modal-actions">
            <button className="rbtn" onClick={close}>Cancel</button>
            <button className="rbtn rbtn-success" onClick={confirmResolve}>✓ Mark as Resolved</button>
          </div>
        </div>
      ),
      'resolve-success': (
        <div className="ril-modal">
          <div className="ril-modal-success">
            <div style={{fontSize:'32px',marginBottom:'8px'}}>✓</div>
            <div style={{fontSize:'15px',fontWeight:'600',marginBottom:'6px'}}>Break Resolved</div>
            <div style={{fontSize:'12px',opacity:.8}}>Break has been marked as resolved and logged to the audit trail.</div>
          </div>
          <div style={{fontSize:'12px',color:'var(--tm)',textAlign:'center',marginBottom:'16px'}}>Resolution documented automatically. Regulatory audit trail updated.</div>
          <div className="ril-modal-actions" style={{justifyContent:'center'}}>
            <button className="rbtn rbtn-primary" onClick={() => { closeModal(); setScreen('queue') }}>Return to Queue</button>
          </div>
        </div>
      ),
      'escalate': (
        <div className="ril-modal">
          <div className="ril-modal-title">Escalate Break</div>
          <div className="ril-modal-sub">{escalateTarget} — Route to a senior team member for urgent action</div>
          <div className="ril-modal-warn">⚠ This break has active CSDR penalty accrual. Escalation will be flagged as time-critical in the audit trail.</div>
          <div className="ril-modal-field">
            <div className="ril-modal-label">Select Team Member</div>
            {[['TO','T. Okafor','Senior Operations Manager'],['MK','M. Krishnamurthy','Head of Reconciliation'],['JL','J. Li','Compliance Officer']].map(([init,name,role],i) => (
              <div key={i} className={`ril-team-opt${selectedTeam===i?' sel':''}`} onClick={() => setSelectedTeam(i)}>
                <div className="ril-team-av">{init}</div>
                <div><div style={{fontSize:'12px',fontWeight:'600',color:'var(--blue)'}}>{name}</div><div style={{fontSize:'10px',color:'var(--tm)'}}>{role}</div></div>
              </div>
            ))}
          </div>
          <div className="ril-modal-field">
            <div className="ril-modal-label">Escalation Note</div>
            <textarea className="ril-modal-textarea" defaultValue="CSDR penalty accruing. BNY Mellon not responding to initial query. Buy-in risk if not resolved by 14:00 GMT."/>
          </div>
          <div className="ril-modal-actions">
            <button className="rbtn" onClick={close}>Cancel</button>
            <button className="rbtn rbtn-danger" onClick={confirmEscalate}>↑ Escalate Now</button>
          </div>
        </div>
      ),
      'send': (
        <div className="ril-modal wide">
          <div className="ril-modal-title">Send Counterparty Communication</div>
          <div className="ril-modal-sub">Review and send the AI-drafted message</div>
          <div className="ril-modal-field">
            <div className="ril-modal-label">Channel</div>
            <select className="ril-modal-select"><option>Email — ops.settlement@bnymellon.com</option><option>Bloomberg Chat — BNY MELLON OPS</option></select>
          </div>
          <div className="ril-modal-field">
            <div className="ril-modal-label">Message</div>
            <textarea className="ril-modal-textarea" style={{minHeight:'160px'}} defaultValue={detail?.detail?.commsBody || ''}/>
          </div>
          <div className="ril-modal-actions">
            <button className="rbtn" onClick={close}>Cancel</button>
            <button className="rbtn rbtn-primary" onClick={() => { closeModal(); showToast('Message sent to counterparty — logged to audit trail','success') }}>Send Message ↗</button>
          </div>
        </div>
      ),
      'recon': (
        <div className="ril-modal">
          <div className="ril-modal-title">{reconStep==='done'?'Reconciliation Complete':reconStep==='running'?'Reconciliation Running...':'Run Full Reconciliation'}</div>
          <div className="ril-modal-sub">{reconStep==='running'?'Processing position data — do not close this window':'Process all position data against custodian statements'}</div>
          {reconStep === 'pre' && <>
            <div className="ril-modal-info"><strong>Scope:</strong> 2,847 positions across 4 custodians<br/><strong>Estimated duration:</strong> 45–90 seconds</div>
            <div className="ril-modal-field">
              <div className="ril-modal-label">Run Type</div>
              <select className="ril-modal-select"><option>Full intraday reconciliation</option><option>Fixed income only</option><option>Equities only</option><option>CSDR failing positions only</option></select>
            </div>
            <div className="ril-modal-actions">
                  <button className="rbtn" onClick={close}>Cancel</button>
              <button className="rbtn rbtn-primary" onClick={startRecon}>▶ Start Reconciliation</button>
            </div>
          </>}
          {reconStep === 'running' && <>
            {RECON_CHECKS.map((label, i) => {
              const isDone = i < reconStepIdx
              const isRunning = i === reconStepIdx
              return (
                <div key={i} className="ril-checklist-item">
                  <div className={`rcheck${isDone?' rcheck-done':isRunning?' rcheck-running':' rcheck-pending'}`}>{isDone?'✓':'◌'}</div>
                  {label}
                </div>
              )
            })}
            <div className="ril-progress-wrap"><div className="ril-progress-fill" style={{width:`${reconProgress}%`}}/></div>
            <div style={{fontSize:'11px',color:'var(--tm)',textAlign:'center'}}>Processing position data… {Math.floor(reconProgress/100*2847).toLocaleString()} / 2,847</div>
          </>}
          {reconStep === 'done' && <>
            <div className="ril-modal-success">
              <div style={{fontSize:'32px'}}>⚡</div>
              <div style={{fontSize:'15px',fontWeight:'600',marginBottom:'6px'}}>Reconciliation Complete</div>
              <div style={{fontSize:'12px',opacity:.8}}>2,847 positions processed · 8 new breaks detected · 3 auto-resolved</div>
            </div>
            <div className="ril-modal-actions" style={{justifyContent:'center'}}>
              <button className="rbtn rbtn-primary" onClick={() => { closeModal(); setScreen('queue') }}>View Updated Queue</button>
            </div>
          </>}
        </div>
      ),
      'export': (
        <div className="ril-modal">
          <div className="ril-modal-title">Export Break Queue</div>
          <div className="ril-modal-sub">Download current break data in your preferred format</div>
          <div className="ril-modal-field"><div className="ril-modal-label">Export Format</div><select className="ril-modal-select"><option>Excel (.xlsx) — Full break data with AI analysis</option><option>CSV — Position data only</option><option>PDF — Formatted report for management</option></select></div>
          <div className="ril-modal-actions">
                <button className="rbtn" onClick={close}>Cancel</button><button className="rbtn rbtn-primary" onClick={() => genericExportFn('Break queue exported successfully')}>↓ Download</button></div>
        </div>
      ),
      'assign': (
        <div className="ril-modal">
          <div className="ril-modal-title">Auto-Assign Breaks</div>
          <div className="ril-modal-sub">AI will distribute unassigned breaks based on team capacity</div>
          <div className="ril-modal-info"><strong>Unassigned breaks:</strong> 5<br/><strong>Available team members:</strong> S. Rahman, T. Okafor, M. Krishnamurthy</div>
          <div className="ril-modal-field"><div className="ril-modal-label">Assignment Logic</div><select className="ril-modal-select"><option>AI-optimised (by counterparty ownership + workload)</option><option>Round robin</option></select></div>
          <div className="ril-modal-actions">
                <button className="rbtn" onClick={close}>Cancel</button><button className="rbtn rbtn-primary" onClick={() => genericExportFn('5 breaks assigned successfully')}>Assign Breaks</button></div>
        </div>
      ),
      'csdr-export': (
        <div className="ril-modal">
          <div className="ril-modal-title">Export CSDR Report</div>
          <div className="ril-modal-sub">Generate the official settlement discipline report</div>
          <div className="ril-modal-info"><strong>Report period:</strong> 19 Feb 2026<br/><strong>Failing positions:</strong> 8<br/><strong>Total penalty accrual:</strong> €84,200</div>
          <div className="ril-modal-field"><div className="ril-modal-label">Submit To</div><select className="ril-modal-select"><option>FCA (UK) — via REGDATA portal</option><option>ESMA (EU) — via FIRDS</option><option>Download only</option></select></div>
          <div className="ril-modal-actions">
                <button className="rbtn" onClick={close}>Cancel</button><button className="rbtn rbtn-primary" onClick={() => genericExportFn('CSDR report generated and ready for submission')}>Generate Report</button></div>
        </div>
      ),
      'filing': (
        <div className="ril-modal">
          <div className="ril-modal-title">Generate Regulatory Filing</div>
          <div className="ril-modal-sub">Produce and submit the required regulatory reports</div>
          <div className="ril-modal-field"><div className="ril-modal-label">Filing Type</div><select className="ril-modal-select"><option>CSDR Settlement Discipline Report</option><option>EMIR Trade Report</option><option>MiFID II Transaction Report (ARM)</option><option>Full Regulatory Package</option></select></div>
          <div className="ril-modal-info">All required data has been auto-collected. <strong>Zero manual data entry required.</strong></div>
          <div className="ril-modal-actions">
                <button className="rbtn" onClick={close}>Cancel</button><button className="rbtn rbtn-primary" onClick={() => genericExportFn('Regulatory filing generated and submitted')}>Generate &amp; Submit</button></div>
        </div>
      ),
      'pdf': (
        <div className="ril-modal">
          <div className="ril-modal-title">Export Audit Trail PDF</div>
          <div className="ril-modal-sub">Generate a tamper-evident PDF of the complete audit trail</div>
          <div className="ril-modal-info"><strong>Period:</strong> 19 Feb 2026 · Full session<br/><strong>Events logged:</strong> 47 entries<br/><strong>Coverage:</strong> 100% of breaks documented</div>
          <div className="ril-modal-actions">
                <button className="rbtn" onClick={close}>Cancel</button><button className="rbtn rbtn-primary" onClick={() => genericExportFn('Audit trail PDF generated successfully')}>↓ Generate PDF</button></div>
        </div>
      ),
      'buyin': (
        <div className="ril-modal">
          <div className="ril-modal-title">⚠ Buy-In Alert — BRK-4437</div>
          <div className="ril-modal-sub">Mandatory buy-in triggers at 17:30 GMT today</div>
          <div className="ril-modal-warn">This position has failed to settle for 4 consecutive business days. Under CSDR Article 7, the CSD will initiate a mandatory buy-in unless resolved today.</div>
          <div className="ril-modal-info"><strong>Instrument:</strong> Italian BTp 1.35% 2022 (IT0005367492)<br/><strong>Fail quantity:</strong> 5,000,000 units<br/><strong>Current market value:</strong> €4,850,000<br/><strong>Estimated buy-in premium:</strong> €45,000</div>
          <div className="ril-modal-actions"><button className="rbtn" onClick={close}>Close</button><button className="rbtn rbtn-danger" onClick={() => { closeModal(); openDetail('BRK-4471') }}>View in Detail →</button></div>
        </div>
      ),
      'emir': (
        <div className="ril-modal">
          <div className="ril-modal-title">EMIR Trade Reporting</div>
          <div className="ril-modal-sub">14 derivative trades pending FCA trade repository submission</div>
          <div className="ril-modal-info"><strong>Deadline:</strong> T+1 by 12:00 GMT<br/><strong>Reports ready:</strong> 14 of 14<br/><strong>Manual preparation required:</strong> 0</div>
          <div style={{fontSize:'12px',color:'var(--green)',marginBottom:'16px'}}>✓ All 14 reports auto-generated and validated.</div>
          <div className="ril-modal-actions"><button className="rbtn" onClick={close}>Close</button><button className="rbtn rbtn-primary" onClick={() => genericExportFn('14 EMIR reports submitted to DTCC GTR')}>Submit to Repository ↗</button></div>
        </div>
      ),
      'mifid': (
        <div className="ril-modal">
          <div className="ril-modal-title">MiFID II Transaction Reporting</div>
          <div className="ril-modal-sub">Yesterday's submission — confirmation details</div>
          <div className="ril-modal-success"><div style={{fontSize:'20px'}}>✓</div>127 transactions submitted successfully to FCA ARM at 06:15 GMT. Zero rejections.</div>
          <div className="ril-modal-info"><strong>Submission ref:</strong> ARM-2026-0219-00847<br/><strong>Accepted:</strong> 127 of 127<br/><strong>Rejected:</strong> 0</div>
          <div className="ril-modal-actions"><button className="rbtn rbtn-primary" onClick={close}>Close</button></div>
        </div>
      ),
      'integration': (
        <div className="ril-modal">
          <div className="ril-modal-title">Configure Integration</div>
          <div className="ril-modal-sub">Adjust connection settings and sync frequency</div>
          <div className="ril-modal-field"><div className="ril-modal-label">API Endpoint</div><input className="ril-modal-input" defaultValue="https://api.smartstream.com/v2/recon"/></div>
          <div className="ril-modal-field"><div className="ril-modal-label">Sync Frequency</div><select className="ril-modal-select"><option>Real-time (WebSocket)</option><option>Every 5 minutes</option></select></div>
          <div className="ril-modal-actions">
                <button className="rbtn" onClick={close}>Cancel</button><button className="rbtn rbtn-primary" onClick={() => genericExportFn('Integration settings saved')}>Save Configuration</button></div>
        </div>
      ),
      'connect': (
        <div className="ril-modal">
          <div className="ril-modal-title">Connect BlackRock Aladdin</div>
          <div className="ril-modal-sub">Configure OMS data feed integration</div>
          <div className="ril-modal-field"><div className="ril-modal-label">Aladdin API Key</div><input className="ril-modal-input" placeholder="Enter your Aladdin API key…"/></div>
          <div className="ril-modal-field"><div className="ril-modal-label">Environment</div><select className="ril-modal-select"><option>Production</option><option>UAT / Staging</option></select></div>
          <div className="ril-modal-actions">
                <button className="rbtn" onClick={close}>Cancel</button><button className="rbtn rbtn-primary" onClick={() => genericExportFn('BlackRock Aladdin connected successfully')}>Test &amp; Connect</button></div>
        </div>
      ),
    }[modal]

    if (!content) return null
    return (
      <div className="ril-modal-overlay" onClick={e => { if(e.target===e.currentTarget) close() }}>
        {content}
      </div>
    )
  }

  const SIDEBAR_GROUPS = [
    { label:'By Severity', items:[
      { id:'all', label:'All Breaks', badgeClass:'nb-blu', badge:'8' },
      { id:'critical', label:'Critical', badgeClass:'nb-red', badge:'2' },
      { id:'high', label:'High', badgeClass:'nb-amb', badge:'3' },
      { id:'medium', label:'Medium', badgeClass:'nb-blu', badge:'2' },
      { id:'low', label:'Low', badgeClass:'nb-grn', badge:'1' },
    ]},
    { label:'By Asset Class', items:[
      { id:'fi', label:'Fixed Income', badgeClass:'nb-amb', badge:'4' },
      { id:'eq', label:'Equities', badgeClass:'nb-blu', badge:'3' },
      { id:'fx', label:'FX / Derivatives', badgeClass:'nb-blu', badge:'1' },
    ]},
    { label:'By Custodian', items:[
      { id:'bny', label:'BNY Mellon', badgeClass:'nb-amb', badge:'3' },
      { id:'jpm', label:'JP Morgan', badgeClass:'nb-blu', badge:'2' },
      { id:'citi', label:'Citi', badgeClass:'nb-blu', badge:'2' },
      { id:'ss', label:'State Street', badgeClass:'nb-grn', badge:'1' },
    ]},
    { label:'Quick Actions', items:[
      { id:'_recon', label:'Run Reconciliation', icon:true },
      { id:'_comp', label:'Compliance Report', icon:true },
    ]},
  ]

  return (
    <>
      <style>{CSS}</style>
      
      <div className="ril">
        {/* Topbar */}
        <div className="ril-top">
          <div style={{display:'flex',alignItems:'center',gap:'32px'}}>
            <div className="ril-logo" onClick={() => setScreen('queue')}>
              <img src={appLogo} alt="Logo" style={{height:'29px',width:'auto'}}/>
            </div>
            <div className="ril-nav">
              {[['queue','Break Queue'],['compliance','Compliance & Audit'],['settings','Settings']].map(([id,label]) => (
                <div key={id} className={`ril-tab${screen===id?' active':''}`} onClick={() => setScreen(id)}>{label}</div>
              ))}
            </div>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:'16px'}}>
            <div className="ril-live"><div className="ril-dot"/>LIVE · T+0</div>
            <Clock/>
            <div className="ril-icon-btn" title="Notifications">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 1a5 5 0 015 5v3l1.5 2.5H1.5L3 9V6a5 5 0 015-5z"/><path d="M6.5 13.5a1.5 1.5 0 003 0"/></svg>
              <div className="ril-nbadge">3</div>
            </div>
            <div className="ril-back-btn" onClick={() => nav('/demo')}>
              <span>←</span><span>Back to Canvas</span>
            </div>
          </div>
        </div>

        {/* Layout */}
        <div className="ril-layout">
          {/* Sidebar */}
          <div className="ril-sidebar">
            <div style={{padding:'0 12px',marginBottom:'16px'}}>
              {[
                { label:'Open Breaks', val:'47', cls:'crit', sub:'↑ 12 from yesterday' },
                { label:'CSDR Exposure', val:'€84,200', cls:'warn', sub:'Accruing on 8 positions' },
                { label:'AI Resolution Rate', val:'73%', cls:'good', sub:'Correct root cause · 7-day avg' },
              ].map(s => (
                <div key={s.label} className="ril-stat-block">
                  <div className="ril-stat-label">{s.label}</div>
                  <div className={`ril-stat-value ${s.cls}`}>{s.val}</div>
                  <div className="ril-stat-sub">{s.sub}</div>
                </div>
              ))}
            </div>
            {SIDEBAR_GROUPS.map(group => (
              <div key={group.label} className="ril-sb-section">
                <div className="ril-sb-label">{group.label}</div>
                {group.items.map(item => (
                  <div key={item.id} className={`ril-sb-item${filter===item.id&&!item.icon?' active':''}`}
                    onClick={() => {
                      if (item.id === '_recon') { setReconStep('pre'); setModal('recon') }
                      else if (item.id === '_comp') setScreen('compliance')
                      else { setFilter(item.id); setScreen('queue') }
                    }}>
                    <div className="ril-sb-item-left">{item.label}</div>
                    {item.badge && <span className={`ril-sb-badge ${item.badgeClass}`}>{item.badge}</span>}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Main */}
          <div className="ril-main">
            {screen === 'queue' && <QueueScreen/>}
            {screen === 'detail' && <DetailScreen/>}
            {screen === 'compliance' && <ComplianceScreen/>}
            {screen === 'settings' && <SettingsScreen/>}
          </div>
        </div>

        {/* Modal */}
        {modal && <Modal key={modal} modal={modal} setModal={setModal} resolveTarget={resolveTarget} escalateTarget={escalateTarget} selectedTeam={selectedTeam} setSelectedTeam={setSelectedTeam} detail={detail} reconStep={reconStep} reconStepIdx={reconStepIdx} reconProgress={reconProgress} startRecon={startRecon} showToast={showToast} openDetail={openDetail} setScreen={setScreen} confirmResolve={confirmResolve} confirmEscalate={confirmEscalate} />}

        {/* Toasts */}
        <div className="ril-toast-wrap">
          {toasts.map(t => (
            <div key={t.id} className={`ril-toast ${t.type}`}>
              <span style={{fontSize:'14px'}}>{t.type==='success'?'✓':t.type==='error'?'✕':'◈'}</span>
              <span>{t.msg}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
