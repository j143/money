# MoneyApp – Roadmap

This document tracks the planned features and milestones for the MoneyApp personal financial dashboard.

## Current State (v0.0.0)

- Google Sign-In via Firebase Authentication
- Account overview for SBI and ICICI (savings & credit cards)
- Balance summary (total assets, dues, net worth)
- Searchable and filterable transaction list
- UPI tagging (GPay, PhonePe, Paytm, BHIM)
- Smart alerts for low balance / high credit-card dues
- CSV export of transaction data
- Demo mode with mock data when no AA credentials are configured

---

## Milestone 1 – Core Stability

- [x] Add unit and integration tests (Vitest + React Testing Library)
- [x] CI pipeline with lint, build, and test checks (GitHub Actions)
- [ ] Error boundary and graceful error UI for API failures
- [ ] Improve AA service retry logic and error handling

## Milestone 2 – Enhanced Data & Accounts

- [ ] Support additional banks (HDFC, Axis, Kotak)
- [ ] Multi-account aggregation with per-account toggles
- [ ] Historical balance chart (line chart per account over time)
- [ ] Recurring transaction detection and labeling

## Milestone 3 – Analytics & Budgeting

- [ ] Monthly spending breakdown by category (bar / pie chart)
- [ ] Budget setting per category with over-budget alerts
- [ ] Savings rate tracker (income vs. expense trend)
- [ ] Year-over-year comparison view

## Milestone 4 – User Experience

- [ ] Dark mode support
- [ ] PWA support (offline-capable, installable on mobile)
- [ ] Customizable dashboard layout (drag-and-drop widgets)
- [ ] Multi-language support (English + Hindi + regional languages)

## Milestone 5 – Security & Compliance

- [ ] Consent flow UI for Account Aggregator framework
- [ ] Consent expiry notifications and renewal flow
- [ ] Audit log of all data fetches (stored in Firestore)
- [ ] Data retention policy and one-click data deletion

---

## Ideas Backlog

- Investment portfolio view (mutual funds, stocks via CDSL/NSDL)
- Tax summary report (Form 26AS, AIS data)
- Bill payment reminders
- Shared expense tracking (split bills)
