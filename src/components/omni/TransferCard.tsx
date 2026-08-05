import { useState } from "react";
import { Check, Download, ExternalLink, Loader2, Send } from "lucide-react";
import { ASSETS, useLedger, type Symbol } from "@/lib/ledger";

const GAS = { ETH: 0.0021, USDC: 1.4, USDT: 1.4 } as const;

export function TransferCard() {
  const { balances, adjust, addTx, connection } = useLedger();
  const [asset, setAsset] = useState<Symbol>("USDC");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [phase, setPhase] = useState<"form" | "signing" | "done">("form");
  const [hash, setHash] = useState("");

  const touched = recipient.length > 0;
  const valid = /^0x[a-fA-F0-9]{40}$/.test(recipient);
  const parsed = parseFloat(amount) || 0;
  const canSend = valid && parsed > 0 && parsed <= balances[asset] && connection === "connected";

  const submit = () => {
    setPhase("signing");
    const h = `mock-yield-hash-${Math.random().toString(16).slice(2, 12)}`;
    setTimeout(() => {
      adjust(asset, -parsed);
      addTx({ kind: "send", label: "Outbound Transfer", detail: `To ${recipient.slice(0, 6)}...${recipient.slice(-4)}`, amount: `-${parsed} ${asset}` });
      setHash(h);
      setPhase("done");
    }, 2500);
  };

  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center gap-2">
        <Send className="h-4 w-4 text-neon" />
        <h2 className="text-sm font-semibold tracking-wide uppercase">Transfer Gateway</h2>
      </div>

      {phase === "form" && (
        <div className="mt-4 space-y-4">
          <div>
            <label className="text-xs text-muted-foreground">Asset</label>
            <select
              value={asset}
              onChange={(e) => setAsset(e.target.value as Symbol)}
              className="mt-1 w-full appearance-none rounded-xl border border-border bg-surface-2/60 px-3 py-2.5 font-mono text-sm outline-none focus:ring-2 focus:ring-neon"
            >
              {ASSETS.map((a) => (
                <option key={a.symbol} value={a.symbol}>
                  {a.symbol} — {balances[a.symbol].toLocaleString(undefined, { maximumFractionDigits: 4 })} available
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-muted-foreground">Recipient Address</label>
            <input
              value={recipient}
              onChange={(e) => setRecipient(e.target.value.trim())}
              placeholder="0x..."
              maxLength={42}
              className={`mt-1 w-full rounded-xl border bg-surface-2/60 px-3 py-2.5 font-mono text-sm outline-none focus:ring-2 ${
                !touched
                  ? "border-border focus:ring-neon"
                  : valid
                    ? "border-neon text-neon focus:ring-neon"
                    : "border-destructive text-destructive focus:ring-destructive"
              }`}
            />
            {touched && !valid && <p className="mt-1 text-xs text-destructive">Invalid Address Format</p>}
            {valid && <p className="mt-1 text-xs text-neon">Address verified on-chain</p>}
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs text-muted-foreground">Amount</label>
              <button
                onClick={() => setAmount(Math.max(0, balances[asset] - GAS[asset]).toFixed(asset === "ETH" ? 4 : 2))}
                className="font-mono text-xs font-semibold text-neon hover:underline focus:ring-2 focus:ring-neon focus:outline-none"
              >
                [MAX]
              </button>
            </div>
            <input
              value={amount}
              inputMode="decimal"
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
              placeholder="0.00"
              className="mt-1 w-full rounded-xl border border-border bg-surface-2/60 px-3 py-2.5 font-mono text-sm outline-none focus:ring-2 focus:ring-neon"
            />
            <p className="mt-1 font-mono text-[11px] text-muted-foreground">
              Est. network fee {GAS[asset]} {asset}
            </p>
          </div>

          <button
            disabled={!canSend}
            onClick={submit}
            className="press w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground focus:ring-2 focus:ring-neon focus:outline-none disabled:cursor-not-allowed disabled:opacity-40"
          >
            {connection === "connected" ? "Send Assets" : "Connect Wallet to Send"}
          </button>
        </div>
      )}

      {phase === "signing" && (
        <div className="mt-6 flex flex-col items-center gap-3 py-10 text-center">
          <Loader2 className="h-9 w-9 animate-spin text-neon" />
          <p className="font-medium">Awaiting Signature from Wallet...</p>
          <p className="text-xs text-muted-foreground">Confirm the transaction in your wallet app.</p>
        </div>
      )}

      {phase === "done" && (
        <div className="mt-6 flex flex-col items-center gap-3 py-6 text-center">
          <span className="neon-glow grid h-16 w-16 place-items-center rounded-full border border-neon/50 bg-neon/10">
            <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="var(--neon)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path className="draw-check" d="M4 12.5 L10 18.5 L20 6.5" />
            </svg>
          </span>
          <p className="font-semibold">Transfer Confirmed</p>
          <div className="w-full rounded-2xl border border-dashed border-border bg-surface-2/50 p-4 text-left font-mono text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount</span>
              <span>
                {parsed} {asset}
              </span>
            </div>
            <div className="mt-1 flex justify-between gap-3">
              <span className="text-muted-foreground">To</span>
              <span className="truncate">{recipient}</span>
            </div>
            <div className="mt-1 flex justify-between">
              <span className="text-muted-foreground">Fee</span>
              <span>
                {GAS[asset]} {asset}
              </span>
            </div>
            <a href={`/tx/${hash}`} onClick={(e) => e.preventDefault()} className="mt-3 inline-flex items-center gap-1 text-neon hover:underline">
              /tx/{hash.slice(0, 22)}... <ExternalLink className="h-3 w-3" />
            </a>
          </div>
          <div className="flex w-full flex-col gap-2 sm:flex-row">
            <button className="press flex flex-1 items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-sm focus:ring-2 focus:ring-neon focus:outline-none">
              <Download className="h-4 w-4" /> Receipt
            </button>
            <button
              onClick={() => {
                setPhase("form");
                setAmount("");
                setRecipient("");
              }}
              className="press flex flex-1 items-center justify-center gap-2 rounded-xl bg-neon py-2.5 text-sm font-semibold text-neon-foreground focus:ring-2 focus:ring-neon focus:outline-none"
            >
              <Check className="h-4 w-4" /> Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
