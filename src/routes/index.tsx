import { createFileRoute } from "@tanstack/react-router";
import { LedgerProvider, useLedger } from "@/lib/ledger";
import { Shell } from "@/components/omni/Shell";
import { PortfolioPanel } from "@/components/omni/PortfolioPanel";
import { SwapCard } from "@/components/omni/SwapCard";
import { TransferCard } from "@/components/omni/TransferCard";
import { VaultsCard } from "@/components/omni/VaultsCard";
import { ActivityFeed, YieldChart } from "@/components/omni/Activity";
import { DashboardSkeleton, CardSkeleton } from "@/components/omni/Skeletons";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OmniYield — Multi-Chain DeFi Yield Dashboard" },
      {
        name: "description",
        content:
          "OmniYield is a neon cyber DeFi dashboard for tracking multi-chain balances, swapping assets, transferring tokens and compounding yield vaults.",
      },
      { property: "og:title", content: "OmniYield — Multi-Chain DeFi Yield Dashboard" },
      {
        property: "og:description",
        content: "Track portfolio value, swap tokens, sign transfers and stake into yield vaults from one live dashboard.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <LedgerProvider>
      <Dashboard />
    </LedgerProvider>
  ),
});

function Dashboard() {
  const { booting } = useLedger();

  return (
    <Shell
      aside={
        booting ? (
          <>
            <CardSkeleton lines={4} />
            <CardSkeleton lines={6} />
          </>
        ) : (
          <>
            <YieldChart />
            <section id="activity" className="scroll-mt-24">
              <ActivityFeed />
            </section>
          </>
        )
      }
    >
      <h1 className="sr-only">OmniYield multi-chain DeFi dashboard</h1>
      {booting ? (
        <DashboardSkeleton />
      ) : (
        <>
          <section id="overview" className="scroll-mt-24">
            <PortfolioPanel />
          </section>
          <div className="grid gap-6 xl:grid-cols-2">
            <section id="swap" className="scroll-mt-24">
              <SwapCard />
            </section>
            <section id="send" className="scroll-mt-24">
              <TransferCard />
            </section>
          </div>
          <section id="vaults" className="scroll-mt-24">
            <VaultsCard />
          </section>
        </>
      )}
    </Shell>
  );
}
