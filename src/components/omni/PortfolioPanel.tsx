import { useMemo, useState } from "react";
import { ArrowUpRight, Coins, Search, SlidersHorizontal, TrendingUp, Wallet2, PackageOpen } from "lucide-react";
import { ASSETS, usd, useLedger, type Symbol } from "@/lib/ledger";

export function TokenIcon({ symbol, size = 36 }: { symbol: Symbol; size?: number }) {
  const asset = ASSETS.find((a) => a.symbol === symbol)!;
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full font-mono text-[11px] font-bold"
      style={{
        width: size,
        height: size,
        backgroundColor: `color-mix(in oklab, ${asset.color} 20%, transparent)`,
        color: asset.color,
        border: `1px solid color-mix(in oklab, ${asset.color} 45%, transparent)`,
      }}
    >
      {symbol.slice(0, 3)}
    </span>
  );
}

function Kpi({
  label,
  value,
  sub,
  icon: Icon,
  tint,
}: {
  label: string;
  value: string;
  sub: React.ReactNode;
  icon: typeof Coins;
  tint: string;
}) {
  return (
    <div className="glass press rounded-2xl p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs tracking-wide text-muted-foreground uppercase">{label}</p>
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl" style={{ backgroundColor: `color-mix(in oklab, ${tint} 18%, transparent)`, color: tint }}>
          <Icon className="h-4.5 w-4.5" strokeWidth={1.75} />
        </span>
      </div>
      <p className="mt-3 font-mono text-2xl font-semibold sm:text-3xl">{value}</p>
      <div className="mt-2 text-xs text-muted-foreground">{sub}</div>
    </div>
  );
}

export function PortfolioPanel() {
  const { balances, staked, yieldEarned } = useLedger();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"apy" | "value" | "alpha">("apy");

  const total = ASSETS.reduce((sum, a) => sum + balances[a.symbol] * a.price, 0) + staked;

  const rows = useMemo(() => {
    const list = ASSETS.filter(
      (a) => a.name.toLowerCase().includes(query.toLowerCase()) || a.symbol.toLowerCase().includes(query.toLowerCase()),
    );
    return [...list].sort((a, b) => {
      if (sort === "apy") return b.apy - a.apy;
      if (sort === "value") return balances[b.symbol] * b.price - balances[a.symbol] * a.price;
      return a.name.localeCompare(b.name);
    });
  }, [query, sort, balances]);

  return (
    <section className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Kpi
          label="Total Portfolio Value"
          value={usd(total)}
          tint="var(--neon)"
          icon={Wallet2}
          sub={
            <span className="inline-flex items-center gap-1 text-neon">
              <ArrowUpRight className="h-3.5 w-3.5" /> +5.8% <span className="text-muted-foreground">24h</span>
            </span>
          }
        />
        <Kpi label="Total Staked Assets" value={usd(staked)} tint="var(--violet)" icon={Coins} sub="Locked across 3 yield vaults" />
        <Kpi
          label="Accrued Yield Earnings"
          value={`$${yieldEarned.toFixed(4)}`}
          tint="var(--teal)"
          icon={TrendingUp}
          sub="Streaming per second · auto-compounded"
        />
      </div>

      <div className="glass rounded-2xl p-4 sm:p-5">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:flex sm:justify-between">
          <h2 className="truncate text-sm font-semibold tracking-wide uppercase">Asset Holdings</h2>
          <span className="shrink-0 rounded-full border border-border px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
            {rows.length} indexed
          </span>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search assets..."
              className="w-full rounded-xl border border-border bg-surface-2/60 py-2.5 pr-3 pl-9 text-sm outline-none focus:ring-2 focus:ring-neon"
            />
          </div>
          <div className="relative shrink-0">
            <SlidersHorizontal className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="w-full appearance-none rounded-xl border border-border bg-surface-2/60 py-2.5 pr-8 pl-9 text-sm outline-none focus:ring-2 focus:ring-neon sm:w-56"
            >
              <option value="apy">Highest Yield APY</option>
              <option value="value">Asset Value</option>
              <option value="alpha">Alphabetical</option>
            </select>
          </div>
        </div>

        {rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-12 text-center">
            <PackageOpen className="h-10 w-10 text-muted-foreground" strokeWidth={1.5} />
            <p className="mt-3 font-semibold">No Assets Indexed</p>
            <p className="mt-1 text-sm text-muted-foreground">No holdings match your current search filter.</p>
            <button
              onClick={() => {
                setQuery("");
                setSort("apy");
              }}
              className="press mt-4 rounded-xl border border-neon/50 bg-neon/10 px-4 py-2 text-sm font-medium text-neon focus:ring-2 focus:ring-neon focus:outline-none"
            >
              Clear Current Filter
            </button>
          </div>
        ) : (
          <div className="mt-4 space-y-2">
            {rows.map((a) => (
              <div
                key={a.symbol}
                className="press grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-border bg-surface-2/40 p-3 hover:border-neon/40"
              >
                <TokenIcon symbol={a.symbol} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{a.name}</p>
                  <p className="font-mono text-xs text-muted-foreground">
                    {a.symbol} · {usd(a.price)}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="rounded-full border border-neon/40 bg-neon/10 px-2 py-0.5 font-mono text-[11px] font-semibold text-neon">
                    {a.apy.toFixed(1)}% APY
                  </span>
                  <div className="text-right">
                    <p className="font-mono text-sm">{balances[a.symbol].toLocaleString(undefined, { maximumFractionDigits: 4 })}</p>
                    <p className="font-mono text-[11px] text-muted-foreground">{usd(balances[a.symbol] * a.price)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
