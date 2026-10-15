# AquaFlow — Water Delivery Management

A bilingual (English / Urdu) water-supplier operations workspace with a public marketing site, supplier dashboard and master-admin subscription console. Built with React and Vite.

## Run locally

```bash
npm install
npm run dev
```

Vite binds to `0.0.0.0` for preview environments. Production build:

```bash
npm run build
npm run preview
```

## Demo access

The sign-in page has quick-entry buttons for both demo workspaces.

- **Water supplier:** `owner@aquaflow.pk` / `demo1234`
- **Master administrator:** `admin@aquaflow.pk` / `AquaAdmin2026!`

The master admin can issue monthly (30-day), quarterly (90-day), yearly (365-day) or custom-day license keys. The supplier signup form accepts an available key. Two sample available keys are included in the demo; the master console can generate more.

## Included workflows

- Supplier overview with delivery, revenue, customer and can-circulation KPIs
- Orders: create, search, filter, export CSV and mark deliveries complete
- Customers: create, search, track routes, delivery cadence and outstanding balances
- Deliveries: route cards, driver/vehicle information, stop progress and active queue
- Inventory and volume tracking: filled/empty cans, bottled water, packaging, low-stock alerts, stock adjustments and litre-to-US-gallon reporting
- Billing: customer invoices, collections, balances and operating expenses
- Reports: delivery, revenue, can volume and route-performance summaries
- Settings: business profile, language, notification preferences and subscription details
- Master console: issue/copy/revoke license keys and review active workspaces
- English/Urdu language switch with RTL layout

## Hosting

This is a Vite static frontend and includes `vercel.json` for SPA routing. A GitHub Actions workflow (`.github/workflows/pages.yml`) builds this branch and deploys to GitHub Pages. The one-time repository setting must allow **Settings → Pages → Build and deployment → GitHub Actions**. The project-site base path is configured for `/WaterSystem/`.

## Important demo limitation

This build is a **front-end prototype**, not a production SaaS backend. Demo records, generated license keys, accounts and session state are stored in the current browser's `localStorage`; passwords are not protected by a server, and changes do not sync between devices or users. Before accepting real suppliers or payments, connect a secure API/database, hash passwords, enforce subscriptions server-side, add role-based access controls and configure payment/webhook handling. Never use the demo credentials or browser-only license keys for real customer data.
