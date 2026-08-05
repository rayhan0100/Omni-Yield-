import { useState } from "react";
import { Shield } from "lucide-react";
import { toast } from "sonner";
import { ASSETS, VAULTS, useLedger, usd, type Symbol } from "@/lib/ledger";

const DURATIONS = [
  { id: "flex", label: "Flexible", days: 30, mult: 1 },
  { id: "30", label: "30 Days", days: 30, mult: 1.15 },
  { id: "90", label: "90 Days", days: 90, mult: 1.4 },
];

export function VaultsCard() {
  const { balances, stake, connection } = useLedger();
  const [vaultId, setVaultId] = useState<string>("balanced");
  const [asset, setAsset] = useState<Symbol>("USDC");
  const [amount, setAmount] = useState("500");
  const [duration, setDuration] = useState("30");

  const vault = VAULTS.find((v) => v.id === vaultId)!;
  const dur = DURATIONS.find((d) => d.id === duration)!;
  const parsed = parseFloat(amount) || 0;
  const price = ASSETS.find((a) => a.symbol === asset)!.price;
  const apy = vault.apy * dur.mult;
  const expected = parsed * price * (apy / 100) * (dur.days / 365);

  const submit = () => {
    if (connection !== "connected") {
      toast.error("Connect your wallet first");
      return;
    }
    if (parsed <= 0 || parsed > balances[asset]) {
      toast.error(`Insufficient ${asset} balance`);
      return;
    }
    stake(asset, parsed, vault.name, Number(apy.toFixed(1)));
    toast.success(`Staked ${parsed} ${asset} into ${vault.name}`, { description: `Expected return ${usd(expected)} over ${dur.days} days` });
    setAmount("");
  };

  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center gap-2">
        <Shield className="h-4 w-4 text-violet" style={{ color: "var(--violet)" }} />
        <h2 className="text-sm font-semibold tracking-wide uppercase">Yield Vaults</h2>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        {VAULTS.map((v) => (
          <button
            key={v.id}
            onClick={() => setVaultId(v.id)}
            className={`press rounded-2xl border p-3 text-left focus:ring-2 focus:ring-neon focus:outline-none ${
              vaultId === v.id ? "border-neon bg-neon/10" : "border-border bg-surface-2/40"
            }`}
          >
            <p className="font-mono text-lg font-semibold text-neon">{v.apy}%</p>
            <p className="mt-0.5 text-sm font-medium">{v.name}</p>
            <p className="mt-1 text-[11px] text-muted-foreground">{v.risk}</p>
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
        <div>
          <label className="text-xs text-muted-foreground">Stake amount</label>
          <input
            value={amount}
            inputMode="decimal"
            onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
            placeholder="0.00"
            className="mt-1 w-full rounded-xl border border-border bg-surface-2/60 px-3 py-2.5 font-mono text-sm outline-none focus:ring-2 focus:ring-neon"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Asset</label>
          <select
            value={asset}
            onChange={(e) => setAsset(e.target.value as Symbol)}
            className="mt-1 w-full appearance-none rounded-xl border border-border bg-surface-2/60 px-3 py-2.5 font-mono text-sm outline-none focus:ring-2 focus:ring-neon sm:w-32"
          >
            {ASSETS.map((a) => (
              <option key={a.symbol} value={a.symbol}>
                {a.symbol}
              </option>
            ))}
          </select>
        </div>
      </div>

      <fieldset className="mt-4">
        <legend className="text-xs text-muted-foreground">Lockup duration</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {DURATIONS.map((d) => (
            <label
              key={d.id}
              className={`press cursor-pointer rounded-xl border px-3 py-2 text-xs ${
                duration === d.id ? "border-neon bg-neon/10 text-neon" : "border-border text-muted-foreground"
              }`}
            >
              <input type="radio" name="duration" value={d.id} checked={duration === d.id} onChange={() => setDuration(d.id)} className="sr-only" />
              {d.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-4 rounded-2xl border border-border bg-surface-2/40 p-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Effective APY</span>
          <span className="font-mono text-neon">{apy.toFixed(1)}%</span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Expected Returns</span>
          <span className="font-mono text-xl font-semibold text-neon">{usd(expected, 4)}</span>
        </div>
      </div>

      <button
        onClick={submit}
        className="press mt-4 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground focus:ring-2 focus:ring-neon focus:outline-none"
      >
        Stake Assets
      </button>
    </div>
  );
}
