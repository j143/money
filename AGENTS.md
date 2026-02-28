# AGENTS.md – AI Agent Developer Guide

This file configures the repository for AI agents acting as primary developers.
Read this file fully before making any changes to the codebase.

---

## Project Overview

**MoneyApp** is a personal financial dashboard built with React 19, Vite, and Firebase.
It consolidates SBI, ICICI, and UPI transactions in one view and uses the RBI Account
Aggregator (AA) framework (Setu / Finvu) for consent-based data fetching.

Repository: `j143/money`
Deployed on: Vercel (edge deployment)

---

## Tech Stack

| Layer       | Technology            |
|-------------|----------------------|
| Frontend    | React 19 + Vite 7    |
| Styling     | Pure.css (~7 KB)     |
| Auth / DB   | Firebase 12          |
| Data        | Setu / Finvu AA APIs |
| Hosting     | Vercel               |

---

## Repository Structure

```
money/
├── .github/
│   └── workflows/
│       └── ci.yml            # GitHub Actions: lint + build on push/PR
├── public/                   # Static assets served as-is
├── src/
│   ├── components/
│   │   ├── AccountCard.jsx   # Individual bank/card tile
│   │   ├── AlertsPanel.jsx   # Low-balance / high-due alerts
│   │   ├── BalanceSummary.jsx# Total assets / due / net worth
│   │   ├── Dashboard.jsx     # Main authenticated view
│   │   ├── Login.jsx         # Google sign-in screen
│   │   ├── Navbar.jsx        # Top bar with export & sign-out
│   │   └── TransactionList.jsx # Searchable, filterable table
│   ├── context/
│   │   └── AuthContext.jsx   # Firebase auth state (React context)
│   ├── services/
│   │   ├── aaService.js      # Account Aggregator API calls
│   │   └── exportService.js  # CSV export helper
│   ├── firebase.js           # Firebase app initialisation
│   ├── App.jsx               # Root component (auth routing)
│   └── index.css             # Design tokens + component styles
├── .env.example              # Environment variable template
├── AGENTS.md                 # This file
├── ROADMAP.md                # Feature roadmap and milestones
├── eslint.config.js          # ESLint flat-config (React + hooks)
├── vite.config.js            # Vite config (React plugin)
├── vercel.json               # Vercel routing config
└── package.json
```

---

## Development Setup

```bash
# Install dependencies
npm install

# Copy and fill in environment variables
cp .env.example .env.local
# Edit .env.local – add Firebase credentials and AA keys
# Without AA keys, the app automatically runs in demo mode

# Start development server (hot-reload on http://localhost:5173)
npm run dev
```

### Required Environment Variables

See `.env.example` for the full list. Key variables:

| Variable                        | Description                              |
|---------------------------------|------------------------------------------|
| `VITE_FIREBASE_API_KEY`         | Firebase Web API key                     |
| `VITE_FIREBASE_AUTH_DOMAIN`     | Firebase auth domain                     |
| `VITE_FIREBASE_PROJECT_ID`      | Firebase project ID                      |
| `VITE_FIREBASE_STORAGE_BUCKET`  | Firebase storage bucket                  |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID         |
| `VITE_FIREBASE_APP_ID`          | Firebase app ID                          |
| `VITE_AA_CLIENT_ID`             | AA provider client ID (Setu / Finvu)     |
| `VITE_AA_CLIENT_SECRET`         | AA provider client secret                |
| `VITE_AA_BASE_URL`              | AA sandbox or production base URL        |

---

## Available Scripts

| Command           | Description                         |
|-------------------|-------------------------------------|
| `npm run dev`     | Start Vite dev server               |
| `npm run build`   | Production build to `dist/`         |
| `npm run preview` | Preview the production build locally|
| `npm run lint`    | Run ESLint on all source files      |

---

## Code Conventions

- **Language**: JavaScript (JSX), no TypeScript (type stubs via `@types/react` for IDE support only)
- **Components**: Functional components with React hooks only — no class components
- **Styling**: Pure.css utility classes + custom CSS variables in `index.css`; avoid inline styles
- **State management**: React context (`AuthContext`) for auth state; local `useState`/`useReducer` for component-level state
- **Imports**: Use relative imports inside `src/`; no path aliases configured
- **Env vars**: All client-side env vars must be prefixed with `VITE_` (Vite convention)
- **No test files yet**: See `ROADMAP.md` – tests are planned for Milestone 1

---

## Making Changes

### Before coding

1. Read this file (`AGENTS.md`) and `ROADMAP.md` to understand priorities.
2. Run `npm run lint` to confirm the baseline lint state before touching files.
3. Run `npm run build` to confirm the project builds cleanly before your changes.

### During coding

- Make the **smallest possible change** to satisfy the requirement.
- Do not remove or modify unrelated working code.
- Keep components focused on a single responsibility.
- If adding a new dependency, check it has no known vulnerabilities first.

### After coding

1. Run `npm run lint` – fix any lint errors introduced by your change.
2. Run `npm run build` – confirm the build still succeeds.
3. Update `ROADMAP.md` if your change completes a milestone task.

---

## Demo Mode

When `VITE_AA_CLIENT_ID` is not set (or empty), `src/services/aaService.js` returns
mock/demo data automatically. This allows full UI development and testing without
real AA credentials.

---

## Deployment

```bash
npm run build    # Build to dist/
vercel --prod    # Deploy to Vercel (requires Vercel CLI + project linked)
```

Set the same environment variables in **Vercel project settings → Environment Variables**
before deploying.

---

## Security Guidelines

- Never commit real credentials or secrets. Use `.env.local` (git-ignored).
- Do not store raw account numbers or banking passwords anywhere in the codebase.
- All AA data fetches must be consent-gated (see RBI AA framework guidelines).
- Consent tokens are session-scoped and must not be persisted to Firestore.
- Run `npm run lint` and address any security-related lint warnings before opening a PR.

---

## Contributing via Pull Requests

1. Create a feature branch from `main`: `git checkout -b feat/your-feature`
2. Follow the coding conventions above.
3. Open a PR with a clear description referencing the relevant `ROADMAP.md` milestone.
4. Ensure lint and build pass in CI before requesting review.
