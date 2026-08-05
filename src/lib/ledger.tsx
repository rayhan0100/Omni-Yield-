import { createContext, useContext, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";

export type Symbol = "ETH" | "USDC" | "USDT";

export type TxKind = "send" | "receive" | "swap" | "stake";

export interface Tx {
  id: string;
  kind: TxKind;
  label: string;
  detail: string;
  amount: string;
  ts: number;
  hash: string;
}

export interface Asset {
  symbol: Symbol;
  name: string;
  apy: number;
  price: number;
  color: string;
}

export const ASSETS: Asset[] = [
  { symbol: "ETH", name: "Ethereum", apy: 4.2, price: 3120.44, color: "var(--violet)" },
  { symbol: "USDC", name: "USD Coin", apy: 8.5, price: 1, color: "var(--teal)" },
  { symbol: "USDT", name: "Tether USD", apy: 6.1, price: 1, color: "var(--neon)" },
];

export const VAULTS = [
  { id: "flex", name: "Flexible Vault", apy: 4.2, risk: "Low risk · instant unstake" },
  { id: "balanced", name: "Balanced Vault", apy: 8.5, risk: "Medium risk · optimized routing" },
  { id: "max", name: "DeFi Max Vault", apy: 18.1, risk: "High risk · leveraged strategies" },
] as const;

export type Balances = Record<Symbol, number>;

interface LedgerState {
  booting: boolean;
  block: number;
  connection: "disconnected" | "connecting" | "connected";
  address: string;
  balances: Balances;
  staked: number;
  yieldEarned: number;
  txs: Tx[];
  connect: (wallet: string) => void;
  disconnect: () => void;
  addTx: (tx: Omit<Tx, "id" | "ts" | "hash">) => void;
  adjust: (symbol: Symbol, delta: number) => void;
  stake: (symbol: Symbol, amount: number, vault: string, apy: number) => void;
}

const Ctx = createContext<LedgerState | null>(null);

const rand = () => Math.random().toString(16).slice(2);

export function LedgerProvider({ children }: { children: ReactNode }) {
  const [booting, setBooting] = useState(true);
  const [block, setBlock] = useState(21_482_113);
  const [connection, setConnection] = useState<LedgerState["connection"]>("disconnected");
  const [address, setAddress] = useState("");
  const [balances, setBalances] = useState<Balances>({ ETH: 4.8213, USDC: 12480.55, USDT: 6320.1 });
  const [staked, setStaked] = useState(3250);
  const [yieldEarned, setYieldEarned] = useState(184.2317);
  const [txs, setTxs] = useState<Tx[]>(() => {
    const now = Date.now();
    return [
      { id: rand(), kind: "receive", label: "Inbound Transfer", detail: "From 0x91c4...8ad2", amount: "+1.250 ETH", ts: now - 1000 * 60 * 4, hash: `0x${rand()}${rand()}` },
      { id: rand(), kind: "swap", label: "Swap Executed", detail: "USDC → ETH", amount: "1,200.00 USDC", ts: now - 1000 * 60 * 22, hash: `0x${rand()}${rand()}` },
      { id: rand(), kind: "stake", label: "Vault Deposit", detail: "Balanced Vault · 8.5% APY", amount: "2,000.00 USDC", ts: now - 1000 * 60 * 68, hash: `0x${rand()}${rand()}` },
      { id: rand(), kind: "send", label: "Outbound Transfer", detail: "To 0x4fd1...77b0", amount: "-320.00 USDT", ts: now - 1000 * 60 * 190, hash: `0x${rand()}${rand()}` },
    ];
  });

  useEffect(() => {
    const t = setTimeout(() => setBooting(false), 1500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const i = setInterval(() => setBlock((b) => b + 1), 3500);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    const i = setInterval(() => setYieldEarned((y) => y + 0.00317), 1000);
    return () => clearInterval(i);
  }, []);

  const addTx = useCallback((tx: Omit<Tx, "id" | "ts" | "hash">) => {
    setTxs((prev) => [{ ...tx, id: rand(), ts: Date.now(), hash: `0x${rand()}${rand()}` }, ...prev].slice(0, 30));
  }, []);

  const adjust = useCallback((symbol: Symbol, delta: number) => {
    setBalances((b) => ({ ...b, [symbol]: Math.max(0, b[symbol] + delta) }));
  }, []);

  const connect = useCallback((wallet: string) => {
    setConnection("connecting");
    setTimeout(() => {
      setAddress(`0x7a${rand().slice(0, 4)}9f${rand().slice(0, 6)}3b21`);
      setConnection("connected");
      addTx({ kind: "receive", label: `${wallet} Session`, detail: "Wallet authorized", amount: "—" });
    }, 1800);
  }, [addTx]);

  const disconnect = useCallback(() => {
    setConnection("disconnected");
    setAddress("");
  }, []);

  const stake = useCallback(
    (symbol: Symbol, amount: number, vault: string, apy: number) => {
      const asset = ASSETS.find((a) => a.symbol === symbol)!;
      adjust(symbol, -amount);
      setStaked((s) => s + amount * asset.price);
      addTx({ kind: "stake", label: "Vault Deposit", detail: `${vault} · ${apy}% APY`, amount: `${amount.toLocaleString()} ${symbol}` });
    },
    [addTx, adjust],
  );

  const value = useMemo<LedgerState>(
    () => ({ booting, block, connection, address, balances, staked, yieldEarned, txs, connect, disconnect, addTx, adjust, stake }),
    [booting, block, connection, address, balances, staked, yieldEarned, txs, connect, disconnect, addTx, adjust, stake],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLedger() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLedger must be used inside LedgerProvider");
  return ctx;
}

export function truncate(addr: string) {
  return addr ? `${addr.slice(0, 4)}...${addr.slice(-4)}` : "";
}

export function timeAgo(ts: number) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 45) return "Just Now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} minute${m === 1 ? "" : "s"} ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hour${h === 1 ? "" : "s"} ago`;
  return `${Math.floor(h / 24)} day${Math.floor(h / 24) === 1 ? "" : "s"} ago`;
}

export function usd(n: number, digits = 2) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: digits, maximumFractionDigits: digits });
}
