import { ArrowDownLeft, ArrowUpRight, Repeat, Shield } from "lucide-react";
import { timeAgo, useLedger, type TxKind } from "@/lib/ledger";

const POINTS = [12, 26, 19, 38, 44, 41, 62];

export function YieldChart() {
  const w = 320;
  const h = 110;
  const max = Math.max(...POINTS) * 1.2;
  const coords = POINTS.map((p, i) => [(i / (POINTS.length - 1)) * w, h - (p / max) * h] as const);
  const line = coords.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${line} L${w},${h} L0,${h} Z`;

  return (
    <div className="glass rounded-2xl p-5">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <h2 className="truncate text-sm font-semibold tracking-wide uppercase">Yield Growth · 7d</h2>
        <span className="shrink-0 font-mono text-xs text-neon">+18.4%</span>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="mt-4 h-28 w-full" preserveAspectRatio="none" role="img" aria-label="Yield growth over seven days">
        <defs>
          <linearGradient id="yieldFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--neon)" stopOpacity="0.45" />
            <stop offset="100%" stopColor="var(--neon)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((g) => (
          <line key={g} x1="0" x2={w} y1={h * g} y2={h * g} stroke="var(--border)" strokeWidth="1" />
        ))}
        <path d={area} fill="url(#yieldFill)" />
        <path d={line} fill="none" stroke="var(--neon)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        {coords.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="2.6" fill="var(--neon)" />
        ))}
      </svg>
      <div className="mt-2 flex justify-between font-mono text-[10px] text-muted-foreground">
        {["D1", "D2", "D3", "D4", "D5", "D6", "D7"].map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
    </div>
  );
}

const ICONS: Record<TxKind, { icon: typeof Repeat; color: string }> = {
  send: { icon: ArrowUpRight, color: "var(--destructive)" },
  receive: { icon: ArrowDownLeft, color: "var(--neon)" },
  swap: { icon: Repeat, color: "var(--teal)" },
  stake: { icon: Shield, color: "var(--violet)" },
};

export function ActivityFeed() {
  const { txs } = useLedger();
  return (
    <div className="glass rounded-2xl p-5">
      <h2 className="text-sm font-semibold tracking-wide uppercase">Audit Log</h2>
      <ul className="mt-4 space-y-2">
        {txs.map((t) => {
          const { icon: Icon, color } = ICONS[t.kind];
          return (
            <li key={t.id} className="press grid grid-cols-[auto_minmax(0,1fr)] gap-3 rounded-2xl border border-border bg-surface-2/40 p-3">
              <span
                className="grid h-9 w-9 shrink-0 place-items-center rounded-xl"
                style={{ backgroundColor: `color-mix(in oklab, ${color} 18%, transparent)`, color }}
              >
                <Icon className="h-4 w-4" strokeWidth={1.75} />
              </span>
              <div className="min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium">{t.label}</p>
                  <span className="shrink-0 font-mono text-xs">{t.amount}</span>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1 rounded-full border border-neon/40 bg-neon/10 px-2 py-0.5 text-neon">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-neon" /> Confirmed
                  </span>
                  <span className="truncate">{t.detail}</span>
                  <span>· {timeAgo(t.ts)}</span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
