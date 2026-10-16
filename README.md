# AquaFlow — Water Delivery Management

A bilingual (English / Urdu) water-supplier operations workspace with a public marketing site, supplier dashboard and master-admin subscription console. Built with React and Vite.

## Run and test locally

```bash
npm install
npm run dev
```

Vite binds to `0.0.0.0` for preview environments. Run the tests and production builds with:

```bash
npm test
npm run build
GITHUB_PAGES=true npm run build
```

## Demo access

The sign-in page has quick-entry buttons for both demo workspaces.

- **Water supplier:** `owner@aquaflow.pk` / `demo1234`
- **Master administrator:** `admin@aquaflow.pk` / `AquaAdmin2026!`

The master admin can issue monthly (30-day), quarterly (90-day), yearly (365-day) or custom-day license keys. Newly generated `AQF` keys include their duration and can be validated during signup in a different browser profile; the demo no longer relies on the key being present in that profile's local key list. The bundled sample keys are local demo records.

## Supplier workflows

- Add customers with phone, optional email, address, delivery route, frequency and starting bottle balance.
- Create and edit routes with a zone, assigned driver/vehicle and planned stops. Assign routes to customers and new orders.
- Set pricing per litre or per 19-litre can, with separate rates for 1.5L packs and 500ml cartons in per-can mode. New order totals, invoices and billing use the saved rates.
- Complete deliveries by recording money received and empty bottles returned. The app updates the customer money/bottle balances, filled/empty-can stock and route progress.
- Preview each delivery report, then open a pre-filled WhatsApp message or an email draft. The report includes the supplier's current business name, delivery date, payment, previous balance, cans delivered/returned, current bottle balance, total money balance, a query window and the configured WhatsApp channel URL.
- Track orders, customers, inventory, invoices, expenses and reports. English and Urdu are supported with RTL layout.

**Messaging limitation:** WhatsApp opens a pre-filled chat/message for the supplier to review and send. Email opens a draft in the customer's mail app; this static site cannot send SMTP email automatically. Automatic email delivery requires a secure server/backend and SMTP provider configuration. Never put SMTP passwords or private credentials in browser code or `localStorage`.

## Public hosting

**Live demo:** [https://davidmartinbigson.github.io/WaterSystem/](https://davidmartinbigson.github.io/WaterSystem/)

The Vite static frontend includes a GitHub Actions workflow (`.github/workflows/pages.yml`) that builds and deploys this branch to GitHub Pages. The repository Pages setting must allow **Settings → Pages → Build and deployment → GitHub Actions**. The project-site base path is configured for `/WaterSystem/`.

## Important security and storage limitations

This is a **front-end demo**, not a production SaaS backend. Accounts, passwords, supplier records, settings, activation and revocation state are stored in the current browser's `localStorage`; they do not sync across profiles or devices. The portable key format uses a client-side checksum for demo convenience, not a secret signature. Anyone with the app source can forge a key, and browser-only activation/revocation cannot enforce one-time use across devices. Before accepting real suppliers or customer data, connect a secure API and hosted database, hash passwords, enforce subscription status server-side, add access controls and configure secure backups. Do not use the demo credentials or browser-only license checks for production access.
