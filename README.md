# Expense Tracker

A personal expense tracker built with React and TypeScript. Log what you spend, sort it into categories, set a monthly budget, and see where your money goes with a category breakdown and a day-by-day chart. Everything is saved in the browser, so there's no sign-up and no server.

**Live demo:** [expense-tracker-one-bay-13.vercel.app](https://expense-tracker-one-bay-13.vercel.app/) · [Netlify mirror](https://mariamhus-expense-tracker.netlify.app/)

<img width="1345" height="910" alt="image" src="https://github.com/user-attachments/assets/0faaa231-0f64-4225-85ad-5385ca6af26b" />


## Features

- Add, edit, and delete expenses with an amount, description, category, and date
- Undo a deletion from the confirmation message
- Monthly budget with a spending bar split by category and a marker showing the budget limit
- Amount left or amount over budget, shown at a glance
- Quick stats: daily average and a comparison with the same point last month
- Category breakdown that doubles as a filter, from the list or the bar
- Spending-by-day chart with tooltips, plus a table view for exact numbers
- Search, browse previous months, and export to CSV
- Currency picker, including EGP
- Sample data on the first visit so the dashboard looks full, with a one-click option to clear it
- Automatic light and dark mode
- Amounts stored as whole numbers of cents to avoid floating-point rounding errors

## Tech stack

- [React 19](https://react.dev/) with TypeScript
- [Vite](https://vite.dev/) for development and builds
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Recharts](https://recharts.org/) for the daily chart
- [Lucide](https://lucide.dev/) icons

## Getting started

You need [Node.js](https://nodejs.org/) 20.19 or newer.

```bash
git clone https://github.com/mariamhus/Expense-Tracker.git
cd Expense-Tracker
npm install
npm run dev
```

Then open http://localhost:5173.

| Command           | What it does                        |
| ----------------- | ----------------------------------- |
| `npm run dev`     | Starts the dev server               |
| `npm run build`   | Type-checks and builds to `dist/`   |
| `npm run preview` | Serves the production build locally |

## Project structure

```
src/
├── components/
│   ├── BudgetEditor.tsx       Inline budget editing
│   ├── CategoryBreakdown.tsx  Category totals that double as filters
│   ├── DailyChart.tsx         Spending-by-day chart and table view
│   ├── ExpenseForm.tsx        Add and edit dialog
│   ├── ExpenseList.tsx        Expenses grouped by day, with search
│   ├── MonthSwitcher.tsx
│   ├── SpendingSummary.tsx    Monthly total, budget bar, and stats
│   └── Toast.tsx              Confirmation messages with undo
├── hooks/
│   ├── useExpenses.ts         Add, update, delete, and restore expenses
│   └── useLocalStorage.ts
├── lib/
│   ├── categories.ts          Category names, colors, and icons
│   ├── csv.ts                 CSV export
│   ├── dates.ts               Date and month helpers
│   ├── id.ts
│   ├── money.ts               Currency formatting and amount parsing
│   └── sample.ts              Sample data generator
├── App.tsx
├── index.css
├── main.tsx
└── types.ts
```

## Deploying

**Vercel:** import the repository at [vercel.com/new](https://vercel.com/new). Vite is detected automatically.

**Netlify:** import the repository, set the build command to `npm run build` and the publish directory to `dist`.
