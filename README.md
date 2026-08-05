# Welcome to your Lovable project
# OmniYield

This project was built with [Lovable](https://lovable.dev).
A self-contained DeFi dashboard built with React, TypeScript, and TanStack Start. It simulates a live blockchain ledger, wallet authentication, portfolio tracking, token swaps, transfers, yield vaults, and activity logging — all running client-side in the preview environment.

## Build with Lovable
## Features

Open your project in the [Lovable editor](https://lovable.dev) and keep building.
- **Live Ledger Engine**: Simulated block height ticks forward in real time, driving yield accrual and transaction timestamps.
- **Wallet Authentication**: Multi-phase connect flow with procedural identicons and clipboard address copying.
- **Portfolio Monitoring**: KPI cards, searchable/sortable asset table, and empty-state handling.
- **Swap Engine**: AMM-style token swap with slippage settings and price-impact calculation.
- **Secure Transfers**: Recipient validation, balance-aware max send, and a multi-step signing modal.
- **Yield Vaults**: Three risk pools with duration-based APY multipliers and a returns calculator.
- **Activity Feed**: SVG yield-growth chart and a rolling audit log with status badges.
- **Responsive Shell**: Three-column desktop layout, collapsing to a sticky bottom navigation on mobile.

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: connect the project to GitHub and every change made in Lovable is committed straight to your repository.
- **Full ownership**: this code is yours. Push to your repository and your changes sync back into Lovable, ready for your next prompt.
## Tech Stack

## Development
- **Framework**: TanStack Start (React 19, Vite 7)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State**: React Context + hooks (`src/lib/ledger.tsx`)
- **UI Primitives**: shadcn/ui components (`src/components/ui/`)
- **Icons**: Lucide React
- **Charts**: Recharts

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).
## Project Structure

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
```
src/
├── components/
│   ├── omni/           # Dashboard-specific components
│   │   ├── Activity.tsx
│   │   ├── Identicon.tsx
│   │   ├── PortfolioPanel.tsx
│   │   ├── Shell.tsx
│   │   ├── Skeletons.tsx
│   │   ├── SwapCard.tsx
│   │   ├── TransferCard.tsx
│   │   ├── VaultsCard.tsx
│   │   └── WalletControl.tsx
│   └── ui/             # Reusable shadcn/ui primitives
├── lib/
│   ├── ledger.tsx      # Global state provider and helpers
│   └── utils.ts        # Tailwind/class utilities
├── routes/
│   ├── __root.tsx      # Root layout, fonts, meta, toaster
│   └── index.tsx       # Dashboard route
├── router.tsx          # TanStack Router setup
├── server.ts           # Server entry
├── start.ts            # Start configuration
└── styles.css          # Design tokens, theme, animations
```

## Getting Started

Requirements:

- Node.js 20+
- npm or bun

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

## Built with
The app will be available at `http://localhost:8080`.

- TanStack Start
- TypeScript
- React
- Tailwind CSS
## Available Scripts

| Script            | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start the development server         |
| `npm run build`   | Build for production                 |
| `npm run build:dev` | Build in development mode            |
| `npm run preview` | Preview the production build         |
| `npm run lint`    | Run ESLint                           |
| `npm run format`  | Format code with Prettier            |

## Notes

- Wallet connection and blockchain data are simulated in memory for demonstration purposes.
- No external API keys or real wallet integrations are required to run the project.
- All state is managed through React hooks inside `LedgerProvider`.
