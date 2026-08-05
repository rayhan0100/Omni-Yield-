import { useState } from "react";
import { ArrowDownUp, Settings2 } from "lucide-react";
import { toast } from "sonner";
import { ASSETS, useLedger, type Symbol } from "@/lib/ledger";
import { TokenIcon } from "./PortfolioPanel";

const RATES: Record<Symbol, number> = { ETH: 3120.44, USDC: 1, USDT: 0.999 };

export function SwapCard() {
  const { balances, adjust, addTx, connection } = useLedger();
  const [from, setFrom] = useState<Symbol>("ETH");
  const [to, setTo] = useState<Symbol>("USDC");
  const [amount, setAmount] = useState("1");
  const [settings, setSettings] = useState(false);
  const [slippage, setSlippage] = useState("0.5");
  const [rotating, setRotating] = useState(false);

  const parsed = parseFloat(amount) || 0;
  const output = (parsed * RATES[from]) / RATES[to];
  const impact = Math.min(9.9, parsed * RATES[from] * 0.00004);

  const flip = () => {
    setRotating(true);
    setFrom(to);
    setTo(from);
    setTimeout(() => setRotating(false), 350);
  };

  const execute = () => {
    if (connection !== "connected") {
      toast.error("Connect your wallet first");
      return;
    }
    if (parsed <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    if (parsed > balances[from]) {
      toast.error(`Insufficient ${from} balance`);
      return;
    }
    adjust(from, -parsed);
    adjust(to, output);
    addTx({ kind: "swap", label: "Swap Executed", detail: `${from} → ${to}`, amount: `${parsed} ${from}` });
    toast.success(`Swapped ${parsed} ${from} for ${output.toFixed(4)} ${to}`);
  };

  const Row = ({ label, sym, onSym, value, editable }: { label: string; sym: Symbol; onSym: (s: Symbol) => void; value: string; editable?: boolean }) => (
    <div className="rounded-2xl border border-border bg-surface-2/50 p-4">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span className="font-mono">Balance: {balances[sym].toLocaleString(undefined, { maximumFractionDigits: 4 })}</span>
      </div>
      <div className="mt-2 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        {editable ? (
          <input
            value={value}
            inputMode="decimal"
            onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
            className="min-w-0 bg-transparent font-mono text-2xl outline-none focus:ring-0"
            placeholder="0.0"
          />
        ) : (
          <p className="min-w-0 truncate font-mono text-2xl text-neon">{value}</p>
        )}
        <div className="relative shrink-0">
          <select
            value={sym}
            onChange={(e) => onSym(e.target.value as Symbol)}
            className="appearance-none rounded-xl border border-border bg-surface px-3 py-2 pr-7 font-mono text-sm outline-none focus:ring-2 focus:ring-neon"
          >
            {ASSETS.map((a) => (
              <option key={a.symbol} value={a.symbol}>
                {a.symbol}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <div className="glass rounded-2xl p-5">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <TokenIcon symbol={from} size={28} />
          <h2 className="truncate text-sm font-semibold tracking-wide uppercase">Multi-Chain Swap</h2>
        </div>
        <button
          onClick={() => setSettings((s) => !s)}
          aria-label="Swap settings"
          className="press shrink-0 rounded-xl border border-border p-2 text-muted-foreground hover:text-neon focus:ring-2 focus:ring-neon focus:outline-none"
        >
          <Settings2 className="h-4 w-4" />
        </button>
      </div>

      {settings && (
        <div className="mt-4 rounded-2xl border border-border bg-surface-2/50 p-4">
          <p className="text-xs text-muted-foreground">Slippage Tolerance</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {["0.1", "0.5", "1.0"].map((p) => (
              <button
                key={p}
                onClick={() => setSlippage(p)}
                className={`press rounded-xl border px-3 py-1.5 font-mono text-xs focus:ring-2 focus:ring-neon focus:outline-none ${
                  slippage === p ? "border-neon bg-neon/15 text-neon" : "border-border text-muted-foreground"
                }`}
              >
                {p}%
              </button>
            ))}
            <input
              value={slippage}
              onChange={(e) => setSlippage(e.target.value.replace(/[^0-9.]/g, ""))}
              className="w-24 rounded-xl border border-border bg-surface px-3 py-1.5 font-mono text-xs outline-none focus:ring-2 focus:ring-neon"
              placeholder="Custom"
            />
          </div>
        </div>
      )}

      <div className="mt-4 space-y-2">
        <Row label="From" sym={from} onSym={setFrom} value={amount} editable />
        <div className="flex justify-center">
          <button
            onClick={flip}
            aria-label="Reverse assets"
            className={`press -my-4 grid h-10 w-10 place-items-center rounded-xl border border-border bg-surface text-neon focus:ring-2 focus:ring-neon focus:outline-none ${
              rotating ? "rotate-180" : ""
            } transition-transform duration-300`}
          >
            <ArrowDownUp className="h-4 w-4" />
          </button>
        </div>
        <Row label="To (estimated)" sym={to} onSym={setTo} value={output ? output.toFixed(4) : "0.0"} />
      </div>

      <div className="mt-4 space-y-2 rounded-2xl border border-border bg-surface-2/40 p-3 text-xs">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Rate</span>
          <span className="font-mono">
            1 {from} = {(RATES[from] / RATES[to]).toFixed(4)} {to}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Price impact</span>
          <span className={`font-mono ${impact > 3 ? "text-destructive" : "text-neon"}`}>{impact.toFixed(2)}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-surface">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, impact * 10)}%`, background: impact > 3 ? "var(--destructive)" : "var(--gradient-neon)" }}
          />
        </div>
      </div>

      <button
        onClick={execute}
        className="press mt-4 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground focus:ring-2 focus:ring-neon focus:outline-none"
      >
        Swap Assets
      </button>
    </div>
  );
}
