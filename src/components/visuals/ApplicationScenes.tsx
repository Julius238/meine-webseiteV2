"use client";

import { ReactNode } from "react";

/**
 * Application scenes for the Solutions phase.
 *
 * Premium SaaS product surfaces — NOT wireframes. Every scene:
 *  - uses layered surfaces (panel-on-panel, inner highlight at top of panels)
 *  - shows realistic dense content (real data, sparklines, avatars, status badges)
 *  - has visible active/selected states with cyan glow
 *  - uses proper visual hierarchy (title / label / value / muted text)
 *  - shares the exact same design language so all four feel like one product family
 *
 * Shared design tokens used across all four scenes:
 *  - PANEL_OUTER: bg-gradient + border + backdrop-blur + top inner highlight
 *  - PANEL_INNER: tighter surface for KPIs / list items
 *  - ACTIVE: ring + bg-accent/10 + border-accent/30
 *  - typography: text-[10/11px] for body, font-mono text-[9px] for labels
 */

export function ApplicationScene({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="relative w-full max-w-2xl">
      {/* atmospheric glow shelf */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-12 rounded-[40px] blur-3xl opacity-60"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgba(94,231,255,0.28), transparent 60%), radial-gradient(circle at 75% 80%, rgba(58,139,255,0.22), transparent 60%)",
        }}
      />

      {/* 3D perspective tilt only above md — on phones the rotation reads as
          a tilted card on a narrow screen, hurts readability and can clip. */}
      <div className="md:[perspective:1800px]">
        <div
          className="relative rounded-2xl overflow-hidden border border-white/12 shadow-[0_40px_100px_rgba(0,0,0,0.65)] md:[transform:rotateY(-3deg)_rotateX(1.5deg)] md:[transform-style:preserve-3d]"
          style={{
            background:
              "linear-gradient(155deg, rgba(20,28,46,0.95) 0%, rgba(10,15,25,0.95) 100%)",
            backdropFilter: "blur(24px)",
          }}
        >
          {/* top inner highlight — suggests light from above */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px"
            style={{
              background:
                "linear-gradient(to right, transparent, rgba(255,255,255,0.18), transparent)",
            }}
          />

          {/* HUD corner brackets */}
          <span className="pointer-events-none absolute top-0 left-0 h-6 w-6 border-l border-t border-accent/55 rounded-tl-2xl" />
          <span className="pointer-events-none absolute top-0 right-0 h-6 w-6 border-r border-t border-accent/55 rounded-tr-2xl" />
          <span className="pointer-events-none absolute bottom-0 left-0 h-6 w-6 border-l border-b border-accent/55 rounded-bl-2xl" />
          <span className="pointer-events-none absolute bottom-0 right-0 h-6 w-6 border-r border-b border-accent/55 rounded-br-2xl" />

          {/* top app bar */}
          <div className="relative flex items-center justify-between px-5 py-3 border-b border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_10px_#5EE7FF]" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-white/90">
                {title}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[9px] uppercase tracking-widest text-mute-soft">
                v 2.1
              </span>
              <span className="h-3 w-px bg-white/10" />
              <span className="font-mono text-[9px] uppercase tracking-widest text-emerald-300/85 flex items-center gap-1">
                <span className="h-1 w-1 rounded-full bg-emerald-300" />
                live
              </span>
            </div>
          </div>

          {/* scene content area */}
          <div className="relative aspect-[4/3] p-4 text-[10px]">{children}</div>
        </div>
      </div>
    </div>
  );
}

/* ----- shared building blocks ----- */

function Panel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative rounded-lg border border-white/10 overflow-hidden ${className}`}
      style={{
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
      }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(255,255,255,0.12), transparent)",
        }}
      />
      {children}
    </div>
  );
}

function Label({ children }: { children: ReactNode }) {
  return (
    <div className="font-mono text-[9px] uppercase tracking-widest text-mute-soft">
      {children}
    </div>
  );
}

/* ============================================================
   SCENE 01 — Dashboard
   ============================================================ */
export function DashboardScene() {
  const nav = [
    { l: "Übersicht", active: true },
    { l: "Aufträge", badge: 12 },
    { l: "Kund:innen" },
    { l: "Berichte" },
    { l: "Einstellungen" },
  ];
  const kpis = [
    { l: "Umsatz", v: "€ 142.4k", t: "+18%", up: true, spark: "0,16 8,12 16,14 24,8 32,10 40,4 48,7 56,2" },
    { l: "Aufträge", v: "1 247", t: "+212", up: true, spark: "0,14 8,10 16,11 24,8 32,5 40,7 48,3 56,2" },
    { l: "Offen", v: "23", t: "-4", up: true, spark: "0,6 8,8 16,5 24,9 32,4 40,8 48,5 56,3" },
    { l: "Antwort Ø", v: "2:14h", t: "-12%", up: true, spark: "0,12 8,10 16,11 24,8 32,9 40,6 48,7 56,4" },
  ];
  const activity = [
    { dot: "bg-accent", t: "Auftrag #4127 erstellt", who: "M. Becker", ago: "2 min" },
    { dot: "bg-emerald-400", t: "Rechnung 2487-B versendet", who: "Auto", ago: "5 min" },
    { dot: "bg-accent", t: "Anfrage klassifiziert · Angebot", who: "Auto", ago: "9 min" },
    { dot: "bg-amber-300", t: "Wartet auf Freigabe", who: "K. Vogt", ago: "14 min" },
  ];
  return (
    <div className="grid grid-cols-12 gap-3 h-full">
      {/* Sidebar */}
      <aside className="col-span-3 flex flex-col gap-2">
        <Panel className="flex-1 p-2">
          <div className="px-1 pt-1 pb-2">
            <Label>Navigation</Label>
          </div>
          <nav className="space-y-0.5">
            {nav.map((n) => (
              <div
                key={n.l}
                className={`rounded-md px-2 py-1.5 flex items-center justify-between gap-1.5 ${
                  n.active
                    ? "bg-accent/12 border border-accent/30 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                    : "text-white/72 border border-transparent"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <span
                    className={`h-1 w-1 rounded-full ${
                      n.active
                        ? "bg-accent shadow-[0_0_6px_#5EE7FF]"
                        : "bg-white/25"
                    }`}
                  />
                  {n.l}
                </span>
                {n.badge != null && (
                  <span className="rounded-full bg-white/8 border border-white/12 px-1.5 text-[8px] text-white/80">
                    {n.badge}
                  </span>
                )}
              </div>
            ))}
          </nav>

          <div className="mt-3 pt-3 border-t border-white/8 px-1">
            <Label>Warnungen</Label>
            <div className="mt-1.5 rounded-md border border-amber-400/30 bg-amber-400/8 px-2 py-1.5 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-300 animate-pulse" />
              <span className="text-amber-200/95 text-[10px]">2 Engpässe</span>
            </div>
          </div>
        </Panel>
      </aside>

      {/* Main */}
      <main className="col-span-9 flex flex-col gap-2">
        {/* KPI row */}
        <div className="grid grid-cols-4 gap-2">
          {kpis.map((k) => (
            <Panel key={k.l} className="p-2.5">
              <Label>{k.l}</Label>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-base font-semibold text-white tracking-tight">
                  {k.v}
                </span>
                <span
                  className={`text-[9px] font-mono ${
                    k.up ? "text-emerald-300" : "text-rose-300"
                  }`}
                >
                  {k.up ? "▲" : "▼"} {k.t}
                </span>
              </div>
              <svg viewBox="0 0 56 16" className="w-full h-4 mt-1.5">
                <defs>
                  <linearGradient id={`spk-${k.l}`} x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#5EE7FF" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#5EE7FF" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <polyline
                  fill="none"
                  stroke="#5EE7FF"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={k.spark}
                />
                <polygon
                  fill={`url(#spk-${k.l})`}
                  points={`${k.spark} 56,16 0,16`}
                />
              </svg>
            </Panel>
          ))}
        </div>

        {/* Chart */}
        <Panel className="flex-1 p-3 min-h-0">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-[11px] font-semibold text-white tracking-tight">
                Auslastung
              </div>
              <div className="text-[9px] text-mute-soft">letzte 30 Tage</div>
            </div>
            <div className="flex items-center gap-3 text-[9px]">
              <span className="flex items-center gap-1.5 text-white/85">
                <span className="h-2 w-2 rounded-sm bg-accent" />
                Aktuell
              </span>
              <span className="flex items-center gap-1.5 text-white/55">
                <span className="h-2 w-2 rounded-sm bg-white/30" />
                Vorperiode
              </span>
            </div>
          </div>
          <svg
            viewBox="0 0 200 60"
            preserveAspectRatio="none"
            className="w-full h-[calc(100%-2rem)] min-h-0"
          >
            <defs>
              <linearGradient id="dashArea" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#5EE7FF" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#5EE7FF" stopOpacity="0" />
              </linearGradient>
            </defs>
            <g stroke="rgba(255,255,255,0.06)" strokeDasharray="2 3">
              {[10, 25, 40].map((y) => (
                <line key={y} x1="0" x2="200" y1={y} y2={y} />
              ))}
            </g>
            {/* prev */}
            <polyline
              fill="none"
              stroke="rgba(255,255,255,0.28)"
              strokeWidth="1.2"
              strokeDasharray="2 2"
              points="0,38 20,34 40,36 60,28 80,30 100,22 120,26 140,18 160,22 180,16 200,18"
            />
            {/* current area */}
            <polygon
              fill="url(#dashArea)"
              points="0,46 20,40 40,42 60,28 80,32 100,18 120,24 140,12 160,20 180,8 200,14 200,60 0,60"
            />
            <polyline
              fill="none"
              stroke="#5EE7FF"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              points="0,46 20,40 40,42 60,28 80,32 100,18 120,24 140,12 160,20 180,8 200,14"
            />
            {/* marker */}
            <circle cx="200" cy="14" r="2.6" fill="#5EE7FF" />
            <circle cx="200" cy="14" r="4.5" fill="#5EE7FF" opacity="0.3" />
          </svg>
        </Panel>

        {/* Activity */}
        <Panel className="p-2.5">
          <div className="flex items-center justify-between mb-1.5">
            <Label>Aktivität</Label>
            <span className="font-mono text-[9px] text-mute-soft">heute</span>
          </div>
          <div className="space-y-1">
            {activity.map((a, i) => (
              <div
                key={i}
                className="flex items-center gap-2 rounded px-1.5 py-1 hover:bg-white/[0.02]"
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${a.dot} shadow-[0_0_6px_currentColor]`}
                />
                <span className="text-white/85 truncate flex-1">{a.t}</span>
                <span className="text-mute-soft text-[9px] font-mono">
                  {a.who}
                </span>
                <span className="text-mute-soft text-[9px] font-mono w-12 text-right">
                  vor {a.ago}
                </span>
              </div>
            ))}
          </div>
        </Panel>
      </main>
    </div>
  );
}

/* ============================================================
   SCENE 02 — Automation
   ============================================================ */
export function AutomationScene() {
  const nodes = [
    { x: 12, y: 28, l: "Neue Anfrage", s: "Mail · Trigger", icon: "✉", active: false },
    { x: 12, y: 72, l: "Webhook", s: "Formular", icon: "↘", active: false },
    { x: 42, y: 50, l: "KI-Klassifikation", s: "Routing", icon: "✦", active: true },
    { x: 72, y: 32, l: "Angebotsentwurf", s: "Template", icon: "▤", active: false },
    { x: 72, y: 72, l: "Support-Ticket", s: "Eskalation", icon: "!", active: false },
    { x: 95, y: 50, l: "Freigabe", s: "Versand", icon: "↣", active: false },
  ];
  const edges: Array<[number, number]> = [
    [0, 2],
    [1, 2],
    [2, 3],
    [2, 4],
    [3, 5],
    [4, 5],
  ];
  const palette = [
    { icon: "✉", l: "Trigger" },
    { icon: "▼", l: "Filter" },
    { icon: "✦", l: "KI Step" },
    { icon: "⊳", l: "Branch" },
    { icon: "↣", l: "Action" },
  ];
  return (
    <div className="grid grid-cols-12 gap-3 h-full">
      {/* Node palette */}
      <aside className="col-span-3 flex flex-col gap-2">
        <Panel className="p-2 flex-1">
          <div className="px-1 pt-1 pb-2">
            <Label>Knoten</Label>
          </div>
          <div className="space-y-1">
            {palette.map((p) => (
              <div
                key={p.l}
                className="rounded-md border border-white/10 px-2 py-1.5 flex items-center gap-2 bg-gradient-to-b from-white/[0.04] to-transparent"
              >
                <span className="h-5 w-5 rounded-md bg-white/8 border border-white/12 flex items-center justify-center text-accent text-[11px]">
                  {p.icon}
                </span>
                <span className="text-white/85">{p.l}</span>
              </div>
            ))}
          </div>
        </Panel>
        <Panel className="p-2">
          <Label>Statistik</Label>
          <div className="mt-2 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-white/65">Heute</span>
              <span className="text-white font-mono">14 verarbeitet</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/65">Fehler</span>
              <span className="text-emerald-300 font-mono">0</span>
            </div>
          </div>
        </Panel>
      </aside>

      {/* Canvas */}
      <main className="col-span-9 flex flex-col gap-2 min-h-0">
        {/* sub-header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="rounded-md border border-accent/30 bg-accent/12 px-2 py-1 font-mono text-[9px] uppercase tracking-widest text-accent">
              ● Aktiv
            </span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-mute-soft">
              Angebots-Workflow · v 2.1
            </span>
          </div>
          <span className="font-mono text-[9px] uppercase tracking-widest text-mute-soft">
            Letzter Lauf · 12s
          </span>
        </div>

        {/* Canvas */}
        <Panel className="flex-1 p-3 min-h-0 relative">
          {/* dot grid bg */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-50"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
              backgroundSize: "16px 16px",
            }}
          />
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-3 h-[calc(100%-1.5rem)] w-[calc(100%-1.5rem)]">
            <defs>
              <linearGradient id="autoEdge" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#5EE7FF" stopOpacity="0.1" />
                <stop offset="50%" stopColor="#5EE7FF" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#3A8BFF" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            {edges.map(([a, b], i) => {
              const na = nodes[a];
              const nb = nodes[b];
              const mx = (na.x + nb.x) / 2;
              const d = `M${na.x} ${na.y} C ${mx} ${na.y}, ${mx} ${nb.y}, ${nb.x} ${nb.y}`;
              return (
                <g key={i}>
                  <path d={d} stroke="url(#autoEdge)" strokeWidth="0.45" fill="none" />
                  <circle r="0.6" fill="#5EE7FF">
                    <animateMotion dur={`${2 + (i % 3) * 0.5}s`} repeatCount="indefinite" path={d} />
                  </circle>
                </g>
              );
            })}
          </svg>
          {nodes.map((n, i) => (
            <div
              key={i}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${n.x}%`, top: `${n.y}%` }}
            >
              <div
                className={`rounded-md border px-2 py-1.5 min-w-[88px] bg-gradient-to-b from-white/[0.05] to-white/[0.01] backdrop-blur-md ${
                  n.active
                    ? "border-accent/50 shadow-[0_0_20px_rgba(94,231,255,0.35)]"
                    : "border-white/12"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className={`h-4 w-4 rounded-sm border flex items-center justify-center text-[9px] ${
                      n.active
                        ? "border-accent/50 bg-accent/15 text-accent"
                        : "border-white/15 bg-white/5 text-white/80"
                    }`}
                  >
                    {n.icon}
                  </span>
                  <span className="font-mono text-[8px] uppercase tracking-widest text-mute-soft">
                    {n.s}
                  </span>
                </div>
                <div className="text-[10px] text-white/95 mt-0.5 font-medium">
                  {n.l}
                </div>
              </div>
            </div>
          ))}
        </Panel>

        {/* run log */}
        <Panel className="p-2 px-3">
          <div className="flex items-center gap-3 text-[9px]">
            <span className="flex items-center gap-1.5 text-emerald-300">
              <span className="h-1 w-1 rounded-full bg-emerald-300" />
              Run #4128
            </span>
            <span className="text-mute-soft font-mono">14:23:08</span>
            <span className="text-mute-soft">Klassifikation → Angebot</span>
            <span className="ml-auto rounded-full bg-emerald-400/10 border border-emerald-400/25 px-1.5 py-0.5 text-emerald-300 text-[8px]">
              OK 240ms
            </span>
          </div>
        </Panel>
      </main>
    </div>
  );
}

/* ============================================================
   SCENE 03 — CMS
   ============================================================ */
export function CmsScene() {
  const pages = [
    { l: "Startseite", status: "published" },
    { l: "Über uns", status: "draft", active: true, indent: 0 },
    { l: "Team", status: "published", indent: 1 },
    { l: "Leistungen", status: "published" },
    { l: "Blog", status: "published" },
    { l: "Kontakt", status: "published" },
  ];
  return (
    <div className="grid grid-cols-12 gap-3 h-full">
      {/* Page tree */}
      <aside className="col-span-3 flex flex-col gap-2">
        <Panel className="p-2 flex-1">
          <div className="px-1 pt-1 pb-2 flex items-center justify-between">
            <Label>Seiten</Label>
            <span className="rounded-full bg-white/8 border border-white/12 px-1.5 text-[8px] text-white/80">
              6
            </span>
          </div>
          <div className="space-y-0.5">
            {pages.map((p) => (
              <div
                key={p.l}
                className={`rounded-md px-2 py-1.5 flex items-center gap-1.5 ${
                  p.active
                    ? "bg-accent/12 border border-accent/30 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                    : "text-white/72 border border-transparent"
                }`}
                style={{ paddingLeft: `${0.5 + (p.indent ?? 0) * 0.75}rem` }}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    p.status === "draft"
                      ? "bg-amber-300"
                      : "bg-emerald-300"
                  }`}
                />
                <span className="flex-1 truncate">{p.l}</span>
              </div>
            ))}
          </div>
        </Panel>
      </aside>

      {/* Editor (live preview style) */}
      <main className="col-span-6 flex flex-col gap-2 min-h-0">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-white">Über uns</div>
            <div className="font-mono text-[9px] uppercase tracking-widest text-mute-soft">
              /ueber-uns
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="rounded-md border border-amber-400/30 bg-amber-400/8 px-2 py-1 font-mono text-[9px] uppercase tracking-widest text-amber-200">
              Entwurf
            </span>
            <span className="rounded-md border border-accent/40 bg-accent text-ink-950 px-2 py-1 font-mono text-[9px] uppercase tracking-widest font-semibold">
              Veröffentlichen
            </span>
          </div>
        </div>

        <Panel className="flex-1 p-3 min-h-0 overflow-hidden">
          <div className="space-y-2">
            {/* HERO BLOCK */}
            <div className="rounded-md border border-white/10 overflow-hidden bg-gradient-to-br from-cyan-500/15 via-blue-500/10 to-transparent p-3 relative">
              <div className="font-mono text-[8px] uppercase tracking-widest text-white/55 mb-1">
                Hero
              </div>
              <div className="text-[13px] font-semibold text-white leading-tight">
                Aus manuellen Abläufen<br />werden digitale Systeme.
              </div>
              <div className="mt-2 flex gap-1.5">
                <span className="rounded-full bg-accent text-ink-950 px-2 py-0.5 text-[8px] font-semibold">
                  Projekt starten
                </span>
                <span className="rounded-full border border-white/20 px-2 py-0.5 text-[8px] text-white/85">
                  Leistungen
                </span>
              </div>
              <span className="absolute top-2 right-2 font-mono text-[8px] text-mute-soft">
                ≡
              </span>
            </div>

            {/* TEXT BLOCK — active */}
            <div className="rounded-md border border-accent/40 overflow-hidden bg-accent/8 p-3 relative shadow-[0_0_20px_rgba(94,231,255,0.15)]">
              <div className="flex items-center justify-between mb-1.5">
                <div className="font-mono text-[8px] uppercase tracking-widest text-accent">
                  Text · bearbeitet
                </div>
                <div className="flex items-center gap-1.5 font-mono text-[8px] text-mute-soft">
                  <span className="h-1 w-1 rounded-full bg-accent animate-pulse" />
                  Auto-Speichern
                </div>
              </div>
              <div className="space-y-1">
                <div className="h-1.5 rounded-full bg-white/85 w-3/4" />
                <div className="h-1.5 rounded-full bg-white/50 w-full" />
                <div className="h-1.5 rounded-full bg-white/50 w-5/6" />
                <div className="h-1.5 rounded-full bg-white/50 w-4/6" />
              </div>
            </div>

            {/* IMAGE BLOCK */}
            <div className="rounded-md border border-white/10 overflow-hidden p-2.5 bg-gradient-to-b from-white/[0.04] to-transparent">
              <div className="flex items-center justify-between mb-1.5">
                <div className="font-mono text-[8px] uppercase tracking-widest text-white/55">
                  Galerie · 3 Bilder
                </div>
                <span className="font-mono text-[8px] text-mute-soft">≡</span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="aspect-[4/3] rounded border border-white/8 bg-gradient-to-br from-cyan-500/10 to-blue-500/5 flex items-center justify-center"
                  >
                    <span className="h-2 w-2 rounded-full bg-white/15" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Panel>
      </main>

      {/* Properties */}
      <aside className="col-span-3 flex flex-col gap-2 min-h-0">
        <Panel className="p-2.5 flex-1 min-h-0 overflow-hidden">
          <Label>Eigenschaften · Text</Label>
          <div className="mt-2 space-y-2">
            <div>
              <div className="text-[9px] text-mute-soft mb-1">Überschrift</div>
              <div className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 text-[10px] text-white/90">
                Wer ich bin
              </div>
            </div>
            <div>
              <div className="text-[9px] text-mute-soft mb-1">Layout</div>
              <div className="grid grid-cols-3 gap-1">
                {["L", "C", "R"].map((c, i) => (
                  <div
                    key={c}
                    className={`rounded border px-1 py-1 text-center text-[9px] ${
                      i === 1
                        ? "border-accent/40 bg-accent/12 text-white"
                        : "border-white/10 bg-white/[0.02] text-white/60"
                    }`}
                  >
                    {c}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="text-[9px] text-mute-soft mb-1">Abstand</div>
              <div className="rounded-md border border-white/10 bg-white/[0.03] h-1.5 relative">
                <div className="absolute inset-y-0 left-0 w-1/2 rounded-full bg-accent" />
                <span className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_8px_rgba(94,231,255,0.6)]" />
              </div>
            </div>
            <div>
              <div className="text-[9px] text-mute-soft mb-1">Sichtbar</div>
              <div className="flex items-center justify-between rounded-md border border-white/10 bg-white/[0.02] px-2 py-1.5">
                <span className="text-[10px] text-white/85">Auf Mobile</span>
                <span className="relative h-3 w-6 rounded-full bg-accent">
                  <span className="absolute top-0.5 right-0.5 h-2 w-2 rounded-full bg-white" />
                </span>
              </div>
            </div>
          </div>
        </Panel>
      </aside>
    </div>
  );
}

/* ============================================================
   SCENE 04 — Assistant
   ============================================================ */
export function AssistantScene() {
  const queue = [
    { l: "Posteingang", c: 30, active: true },
    { l: "Angebote", c: 12 },
    { l: "Support", c: 9 },
    { l: "Reports", c: 4 },
  ];
  return (
    <div className="grid grid-cols-12 gap-3 h-full">
      {/* Queue */}
      <aside className="col-span-3 flex flex-col gap-2">
        <Panel className="flex-1 p-2">
          <div className="px-1 pt-1 pb-2 flex items-center justify-between">
            <Label>Queue</Label>
            <span className="rounded-full bg-accent/15 border border-accent/30 px-1.5 text-[8px] text-accent font-mono">
              3 läuft
            </span>
          </div>
          <div className="space-y-0.5">
            {queue.map((q) => (
              <div
                key={q.l}
                className={`rounded-md px-2 py-1.5 flex items-center justify-between gap-1.5 ${
                  q.active
                    ? "bg-accent/12 border border-accent/30 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                    : "text-white/72 border border-transparent"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <span
                    className={`h-1 w-1 rounded-full ${
                      q.active ? "bg-accent shadow-[0_0_6px_#5EE7FF]" : "bg-white/25"
                    }`}
                  />
                  {q.l}
                </span>
                <span className="rounded-full bg-white/8 border border-white/12 px-1.5 text-[8px] text-white/85">
                  {q.c}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-3 pt-3 border-t border-white/8 px-1">
            <Label>Letzte Aktion</Label>
            <div className="mt-1.5 text-[10px] text-white/85 leading-snug">
              12 Angebots-Entwürfe vorbereitet
            </div>
            <div className="mt-1 text-[9px] text-mute-soft font-mono">
              vor 4 min
            </div>
          </div>
        </Panel>
      </aside>

      {/* Thread */}
      <main className="col-span-9 flex flex-col gap-2 min-h-0">
        {/* sub header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-6 w-6 rounded-md bg-gradient-to-br from-cyan-400/25 to-blue-500/15 border border-accent/30 flex items-center justify-center text-accent text-[11px] font-bold">
              ✦
            </span>
            <div>
              <div className="text-[11px] font-semibold text-white">
                Mail-Assistant
              </div>
              <div className="font-mono text-[8px] uppercase tracking-widest text-mute-soft">
                Auto · GPT-4 / Claude
              </div>
            </div>
          </div>
          <span className="rounded-md border border-emerald-400/25 bg-emerald-400/8 px-2 py-1 font-mono text-[9px] uppercase tracking-widest text-emerald-300 flex items-center gap-1">
            <span className="h-1 w-1 rounded-full bg-emerald-300 animate-pulse" />
            Auto-Mode
          </span>
        </div>

        {/* Conversation */}
        <Panel className="flex-1 p-3 min-h-0 overflow-hidden flex flex-col gap-2">
          {/* User msg */}
          <div className="self-end max-w-[80%] flex flex-col items-end gap-0.5">
            <div className="rounded-2xl rounded-br-sm bg-white/8 border border-white/10 px-2.5 py-1.5 text-white/90 text-[10px]">
              Klassifiziere alle 30 Mails von heute und bereite Antwort-Entwürfe vor.
            </div>
            <div className="font-mono text-[8px] text-mute-soft">14:18</div>
          </div>

          {/* Assistant msg with rich content */}
          <div className="self-start max-w-[92%] flex gap-2">
            <span className="h-5 w-5 mt-1 rounded-md bg-gradient-to-br from-cyan-400/25 to-blue-500/15 border border-accent/30 flex items-center justify-center text-accent text-[10px] flex-shrink-0">
              ✦
            </span>
            <div className="flex-1 space-y-1.5">
              <div className="rounded-2xl rounded-bl-sm bg-accent/10 border border-accent/30 px-2.5 py-2 text-white space-y-2 text-[10px]">
                <div>Verarbeitet. Klassifizierung abgeschlossen:</div>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { l: "Angebote", v: 12, color: "bg-accent/20 border-accent/40 text-accent" },
                    { l: "Support", v: 9, color: "bg-amber-400/15 border-amber-400/30 text-amber-200" },
                    { l: "Rechng.", v: 6, color: "bg-emerald-400/15 border-emerald-400/30 text-emerald-200" },
                    { l: "Spam", v: 3, color: "bg-white/8 border-white/15 text-white/65" },
                  ].map((b) => (
                    <div
                      key={b.l}
                      className={`rounded border px-1.5 py-1 text-center ${b.color}`}
                    >
                      <div className="text-[12px] font-bold leading-none">
                        {b.v}
                      </div>
                      <div className="font-mono text-[8px] uppercase tracking-widest mt-0.5">
                        {b.l}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {[
                  { l: "Entwürfe zeigen", primary: true },
                  { l: "CSV-Export" },
                  { l: "Im CRM anlegen" },
                ].map((a) => (
                  <span
                    key={a.l}
                    className={`rounded-full px-2 py-1 text-[9px] font-medium ${
                      a.primary
                        ? "bg-accent text-ink-950 shadow-[0_0_12px_rgba(94,231,255,0.4)]"
                        : "bg-white/8 border border-white/12 text-white/85"
                    }`}
                  >
                    {a.l}
                  </span>
                ))}
              </div>
              <div className="font-mono text-[8px] text-mute-soft pl-1">14:19 · 1.2s</div>
            </div>
          </div>

          {/* User msg */}
          <div className="self-end max-w-[70%] flex flex-col items-end gap-0.5">
            <div className="rounded-2xl rounded-br-sm bg-white/8 border border-white/10 px-2.5 py-1.5 text-white/90 text-[10px]">
              Entwürfe für die Angebote bauen.
            </div>
            <div className="font-mono text-[8px] text-mute-soft">14:20</div>
          </div>

          {/* Assistant msg compact with progress */}
          <div className="self-start max-w-[88%] flex gap-2">
            <span className="h-5 w-5 mt-1 rounded-md bg-gradient-to-br from-cyan-400/25 to-blue-500/15 border border-accent/30 flex items-center justify-center text-accent text-[10px] flex-shrink-0">
              ✦
            </span>
            <div className="flex-1 space-y-1">
              <div className="rounded-2xl rounded-bl-sm bg-accent/10 border border-accent/30 px-2.5 py-2 text-white text-[10px]">
                <div>12 Entwürfe vorbereitet — bereit zur Freigabe.</div>
                <div className="mt-1.5 h-1 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full w-full bg-gradient-to-r from-accent to-accent-deep" />
                </div>
              </div>
            </div>
          </div>
        </Panel>
      </main>
    </div>
  );
}

export const sceneByKey = {
  dashboard: DashboardScene,
  automation: AutomationScene,
  cms: CmsScene,
  assistant: AssistantScene,
} as const;

export type SceneKey = keyof typeof sceneByKey;
