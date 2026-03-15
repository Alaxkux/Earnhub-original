# EarnHub
**Personal Micro-Earning Aggregator Dashboard**

A React + Vite dashboard to manage and track micro-earning tasks from CPX Research, AdGate Media, and OfferToro — all in one place.

---

## Quick Start

### 1. Frontend
```bash
# From the project root
npm install
cp .env.example .env
# Fill in your offerwall API keys and VITE_API_URL
npm run dev
# → http://localhost:3000
```

### 2. Backend
```bash
cd server
npm install
cp .env.example .env
# Fill in MONGO_URI, JWT_SECRET, PORT
npm run dev
# → http://localhost:5000
```

Both must be running at the same time during development.

---

## Environment Variables

Edit `.env` before running:

| Variable | Description |
|---|---|
| `VITE_CPX_APP_ID` | CPX Research App ID |
| `VITE_CPX_SECURITY_HASH` | CPX security hash (optional) |
| `VITE_ADGATE_APP_ID` | AdGate Media App ID |
| `VITE_OFFERTORO_APP_ID` | OfferToro App ID |
| `VITE_OFFERTORO_SECRET` | OfferToro secret key |
| `VITE_APP_USER_ID` | Your unique user ID (passed to all providers) |

---

## Project Structure

```
src/
├── components/
│   ├── layout/          Sidebar, Header, BottomNav
│   ├── dashboard/       StatsCard, GoalProgress, StreakBadge
│   ├── offers/          OfferCard
│   ├── analytics/       WeeklyChart, PlatformBreakdown
│   ├── history/         HistoryList
│   └── notifications/   NotifPanel
├── pages/
│   ├── DashboardPage    Overview, stats, recent activity
│   ├── OffersPage       Provider cards + iframe viewer
│   ├── AnalyticsPage    Charts and platform breakdown
│   ├── HistoryPage      Full task log
│   ├── NotificationsPage Alerts
│   └── SettingsPage     Goals, API key status, data reset
├── context/
│   └── EarnHubContext   Global state (reducer + localStorage)
├── hooks/
│   ├── useOffers        Aggregates provider configs
│   ├── useEarnings      Balance, history, logTask()
│   └── useNotifications Alerts management
└── services/
    ├── cpxResearch      Iframe URL + postMessage listener
    ├── adGate           Iframe URL + postMessage listener
    └── offerToro        Iframe URL + postMessage listener
```

---

## How Earnings Are Tracked

1. User opens a provider's offerwall via the **Offers** page (iframe)
2. User completes a task inside the iframe
3. The provider fires a `postMessage` event on completion
4. EarnHub's listener (in `OffersPage`) catches it and calls `logTask()`
5. The task is saved to state and persisted in `localStorage`

> **Note:** Payments are handled entirely by the offerwall providers. EarnHub only tracks completions locally.

---

## Tech Stack

- **React 18** + **Vite**
- **React Router v6** — client-side routing
- **Chart.js** + **react-chartjs-2** — analytics charts
- **Context API** — global state (no Redux)
- **Plain CSS** with CSS variables — no Tailwind
- **localStorage** — data persistence

---

## Pages

| Route | Page |
|---|---|
| `/` | Dashboard |
| `/offers` | Offers & Offerwalls |
| `/analytics` | Charts & Analytics |
| `/history` | Earnings History |
| `/notifications` | Alerts |
| `/settings` | Settings |
# Earnhub-original
