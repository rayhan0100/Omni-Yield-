import { useEffect, useRef, useState } from "react";
import { ChevronDown, Copy, LogOut, Loader2, Wallet, X } from "lucide-react";
import { useLedger, truncate } from "@/lib/ledger";
import { Identicon } from "./Identicon";

const WALLETS = [
  { name: "MetaMask", desc: "Browser extension", tint: "var(--neon)" },
  { name: "WalletConnect", desc: "Scan with mobile wallet", tint: "var(--teal)" },
  { name: "Coinbase Wallet", desc: "Coinbase smart wallet", tint: "var(--violet)" },
];

export function WalletControl() {
  const { connection, address, connect, disconnect } = useLedger();
  const [modal, setModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (connection === "connected") setModal(false);
  }, [connection]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const copy = () => {
    void navigator.clipboard?.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  if (connection === "connecting") {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm text-muted-foreground sm:px-4">
        <Loader2 className="h-4 w-4 shrink-0 animate-spin text-neon" />
        <span className="hidden sm:inline">Authorizing Session...</span>
      </div>
    );
  }

  if (connection === "connected") {
    return (
      <div className="relative" ref={ref}>
        <div className="flex items-center gap-1 rounded-xl border border-border bg-surface-2/80 p-1 pl-2">
          <Identicon seed={address} size={26} />
          <button
            onClick={() => setOpen((o) => !o)}
            className="press flex items-center gap-1 rounded-lg px-2 py-1 font-mono text-xs text-foreground hover:bg-surface focus:ring-2 focus:ring-neon focus:outline-none sm:text-sm"
          >
            {truncate(address)}
            <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
          <button
            onClick={copy}
            aria-label="Copy address"
            className="press relative rounded-lg p-2 text-muted-foreground hover:bg-surface hover:text-neon focus:ring-2 focus:ring-neon focus:outline-none"
          >
            <Copy className="h-4 w-4" />
            {copied && (
              <span className="absolute top-full right-0 z-30 mt-1 rounded-md bg-neon px-2 py-1 text-[11px] font-semibold text-neon-foreground shadow-lg">
                Copied!
              </span>
            )}
          </button>
        </div>
        {open && (
          <div className="glass absolute right-0 z-30 mt-2 w-64 rounded-2xl p-3 text-sm">
            <p className="text-xs text-muted-foreground">Connected account</p>
            <p className="mt-1 font-mono text-xs break-all text-neon">{address}</p>
            <button
              onClick={() => {
                disconnect();
                setOpen(false);
              }}
              className="press mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-destructive/40 bg-destructive/10 py-2 font-medium text-destructive hover:bg-destructive/20 focus:ring-2 focus:ring-destructive focus:outline-none"
            >
              <LogOut className="h-4 w-4" /> Disconnect
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setModal(true)}
        className="press pulse-ring flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground focus:ring-2 focus:ring-neon focus:outline-none sm:px-4"
      >
        <Wallet className="h-4 w-4" />
        <span className="hidden xs:inline sm:inline">Connect Wallet</span>
        <span className="xs:hidden sm:hidden">Connect</span>
      </button>
      {modal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm sm:items-center" onClick={() => setModal(false)}>
          <div className="glass w-full max-w-md rounded-3xl p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold">Connect a wallet</h2>
                <p className="mt-1 text-sm text-muted-foreground">Choose a provider to authorize your OmniYield session.</p>
              </div>
              <button onClick={() => setModal(false)} aria-label="Close" className="press rounded-lg p-1 text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-5 space-y-2">
              {WALLETS.map((w) => (
                <button
                  key={w.name}
                  onClick={() => connect(w.name)}
                  className="press flex w-full items-center gap-3 rounded-2xl border border-border bg-surface-2/60 p-3 text-left hover:border-neon/50 focus:ring-2 focus:ring-neon focus:outline-none"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl" style={{ backgroundColor: `color-mix(in oklab, ${w.tint} 22%, transparent)` }}>
                    <Wallet className="h-5 w-5" style={{ color: w.tint }} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold">{w.name}</span>
                    <span className="block text-xs text-muted-foreground">{w.desc}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
