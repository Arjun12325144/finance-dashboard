# 💎 FinFlow — Finance Dashboard

A clean, human-designed finance dashboard built with **React + Vite + Zustand + Recharts**.

---

## 🚀 Setup (works with Node 16–22)

```bash
npm install
npm run dev        # development  →  http://localhost:5173
npm run build      # production build
npm run preview    # preview production build
```

> **Why Vite?** `react-scripts 5` has compatibility issues with Node 18+. Vite works seamlessly on all modern Node versions.

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Sidebar.jsx          # Navigation + role switcher + theme toggle
│   ├── Dashboard.jsx        # Overview: stats, charts, recent activity
│   ├── Transactions.jsx     # Full table with filter/sort/search/pagination
│   ├── Insights.jsx         # Analytics, monthly breakdown, category dive
│   ├── Charts.jsx           # Area, Pie, Bar chart components (Recharts)
│   ├── StatCards.jsx        # 4 animated summary cards with counters
│   ├── TransactionModal.jsx # Add / Edit modal with validation
│   └── TickerBar.jsx        # Scrolling market ticker
├── store/
│   └── useStore.js          # Zustand store (persisted to localStorage)
├── data/
│   └── transactions.js      # Mock data generator + category constants
├── utils/
│   └── helpers.js           # Formatters, aggregators, CSV/JSON export
├── App.jsx                  # Root layout
├── main.jsx                 # Vite entry point
└── index.css                # Full design system (CSS variables)
```

---

## ✅ Features

### Dashboard Overview
- 4 stat cards: Balance, Income, Expenses, Savings Rate — with animated number counters
- Area chart: Income vs Expenses over 6 months
- Donut pie chart: Spending breakdown by category
- Recent transactions list + top categories with progress bars

### Transactions
- Paginated table (15/page) with 100+ realistic mock entries
- Search, filter by type/category/date range, sort by date or amount
- Admin: Add, Edit, Delete transactions · Viewer: read-only
- Export to CSV or JSON

### Role-Based UI
- **Admin** — full CRUD access
- **Viewer** — read-only, no action buttons shown
- Switch via sidebar dropdown, persisted across sessions

### Insights
- 6 insight cards: top category, average expenses, savings rate, trend, net worth, transaction count
- Monthly bar chart comparison
- Category breakdown with animated bars
- Month-by-month summary table

### State Management (Zustand)
- `transactions`, `filters`, `role`, `darkMode`, `activePage`, `modal`
- `getFilteredTransactions()` — derived getter applying all active filters
- Persisted to `localStorage` via `zustand/middleware/persist`

---

## 🎨 Design Notes

| Choice | Reason |
|---|---|
| **DM Sans** + **DM Mono** | Warm, humanist pairing — avoids the clinical Inter/Roboto look |
| **Warm amber** accent `#f0a500` | Chosen to feel hand-picked, not auto-generated |
| **Dark slate** `#131416` base | Neutral warm-dark, not cold blue-black |
| Green `#3ecf8e` / Red `#f16060` | Softer than neon — easier on the eyes |
| 2px top-border on stat cards | Subtle color coding without being heavy |
| Slide-up + stagger animations | Feels built, not templated |

---

## ⚡ Enhancements Included

- ✅ Dark / Light mode toggle (full theme via CSS variables)
- ✅ localStorage persistence (role, darkMode, transactions)
- ✅ Export CSV and JSON
- ✅ Responsive layout (collapses sidebar on mobile)
- ✅ Animated number counters on load
- ✅ Scrolling market ticker bar
- ✅ Form validation in modal
- ✅ Empty state handling
- ✅ Pagination

---

## 💡 Notes

- Mock data covers 6 months, ~100+ transactions, auto-generated on first load
- To reset data: open DevTools → Application → LocalStorage → delete `finance-dashboard-state`
