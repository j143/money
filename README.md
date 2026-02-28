# MoneyApp – Personal Financial Dashboard

A responsive React + Firebase web app to consolidate your SBI, ICICI, and UPI transactions in one dashboard. Built with [Pure.css](https://purecss.io/) for a lightweight, mobile-first UI.

## Features

- 🔐 **Google Sign-In** via Firebase Authentication
- 🏦 **Account overview** – SBI, ICICI savings & credit cards
- 📊 **Balance summary** – total assets, dues, and net worth
- 💳 **Transaction list** – searchable, filterable by category (Food, Transport, UPI, …)
- 📱 **UPI tagging** – GPay, PhonePe, Paytm, BHIM transactions labeled
- 🔔 **Smart alerts** – low balance / high credit-card due warnings
- ⬇️ **CSV export** of any account's transactions
- 🔬 **Demo mode** – runs with mock data when no AA credentials are set

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | React 19 + Vite | Fast HMR, modern JSX |
| Styling | Pure.css (~7 KB) | Mobile-first grids, no build overhead |
| Auth / DB | Firebase | Serverless, secure |
| Data | Setu / Finvu AA APIs | RBI-compliant consent-based fetching |
| Hosting | Vercel | Free tier, fast edge deploys |

## Quick Start

```bash
# 1. Clone and install
npm install

# 2. Configure environment
cp .env.example .env.local
# Edit .env.local with your Firebase & AA credentials

# 3. Run dev server
npm run dev
```

## Environment Variables

See `.env.example` for all required variables.

### Firebase setup
1. Create a project at [Firebase Console](https://console.firebase.google.com)
2. Enable **Authentication → Google** provider
3. Enable **Firestore Database**
4. Copy your web app credentials into `.env.local`

### Account Aggregator (AA) setup
- **Setu sandbox** – [docs.setu.co/data/account-aggregator](https://docs.setu.co/data/account-aggregator/quickstart)
- **Finvu sandbox** – [docs.finvu.in](https://docs.finvu.in/)
- Without AA credentials the app runs in **demo mode** with mock data.

## Deploy to Vercel

```bash
npm run build          # local build check
vercel --prod          # deploy
```

Set the same env vars in your Vercel project settings.

## Project Structure

```
src/
├── components/
│   ├── AccountCard.jsx      # individual bank/card tile
│   ├── AlertsPanel.jsx      # low-balance / high-due alerts
│   ├── BalanceSummary.jsx   # total assets / due / net worth
│   ├── Dashboard.jsx        # main authenticated view
│   ├── Login.jsx            # Google sign-in screen
│   ├── Navbar.jsx           # top bar with export & sign-out
│   └── TransactionList.jsx  # searchable, filterable table
├── context/
│   └── AuthContext.jsx      # Firebase auth state
├── services/
│   ├── aaService.js         # Account Aggregator (Setu/Finvu) calls
│   └── exportService.js     # CSV export helper
├── firebase.js              # Firebase app initialisation
├── App.jsx
└── index.css                # design tokens + component styles
```

## RBI Compliance Notes

- Data is fetched with **explicit user consent** via the AA framework.
- No raw account numbers or credentials are stored.
- Consent tokens are ephemeral (session-scoped).
