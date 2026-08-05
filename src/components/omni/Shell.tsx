import type { ReactNode } from "react";
import { Activity, ArrowLeftRight, LayoutDashboard, Send, Shield } from "lucide-react";
import { useLedger } from "@/lib/ledger";
import { WalletControl } from "./WalletControl";

const NAV = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "swap", label: "Swap", icon: ArrowLeftRight },
  { id: "send", label: "Send", icon: Send },
  { id: "vaults", label: "Vaults", icon: Shield },
  { id: "activity", label: "Activity", icon: Activity },
];

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <span className="neon-glow grid h-8 w-8 shrink-0 place-items-center rounded-xl border border-neon/50 bg-neon/10 font-mono text-sm font-bold text-neon">
        Ω
      </span>
      {!compact && (
        <span className="truncate text-lg font-semibold tracking-tight">
          <span className="neon-text">Omni</span>Yield
        </span>
      )}
    </div>
  );
}

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Shell({ children, aside }: { children: ReactNode; aside: ReactNode }) {
  const { block } = useLedger();

  return (
    <div className="grid-noise min-h-screen bg-background">
      <div className="mx-auto flex w-full max-w-[1500px]">
        {/* Sidebar */}
        <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-border p-5 lg:flex">
          <Logo />
          <nav className="mt-8 space-y-1">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => scrollTo(n.id)}
                className="press flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-surface-2/60 hover:text-neon focus:ring-2 focus:ring-neon focus:outline-none"
              >
                <n.icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                <span className="truncate">{n.label}</span>
              </button>
            ))}
          </nav>
          <div className="mt-auto rounded-2xl border border-border bg-surface-2/40 p-3">
            <p className="text-[11px] text-muted-foreground">Current Block Height</p>
            <p className="mt-1 font-mono text-sm text-neon">#{block.toLocaleString()}</p>
          </div>
        </aside>

        {/* Main */}
        <div className="min-w-0 flex-1">
          <header className="glass sticky top-0 z-40 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-none border-x-0 border-t-0 px-4 py-3 sm:px-6">
            <div className="flex min-w-0 items-center gap-4">
              <div className="lg:hidden">
                <Logo />
              </div>
              <div className="hidden min-w-0 lg:block">
                <p className="text-[11px] tracking-wide text-muted-foreground uppercase">Current Block Height</p>
                <p className="font-mono text-sm text-neon">
                  #{block.toLocaleString()} <span className="ml-1 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-neon align-middle" />
                </p>
              </div>
            </div>
            <WalletControl />
          </header>

          <div className="flex flex-col gap-6 px-4 pt-6 pb-28 sm:px-6 lg:flex-row lg:pb-10">
            <main className="min-w-0 flex-1 space-y-6">{children}</main>
            <div className="w-full shrink-0 space-y-6 lg:w-[360px]">{aside}</div>
          </div>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <nav className="glass fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 rounded-none border-x-0 border-b-0 px-2 py-2 lg:hidden">
        {NAV.map((n) => (
          <button
            key={n.id}
            onClick={() => scrollTo(n.id)}
            className="press flex flex-col items-center gap-1 rounded-xl py-1.5 text-[10px] text-muted-foreground hover:text-neon focus:ring-2 focus:ring-neon focus:outline-none"
          >
            <n.icon className="h-5 w-5" strokeWidth={1.75} />
            {n.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
