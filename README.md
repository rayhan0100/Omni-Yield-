## Project Structure

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
```
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
