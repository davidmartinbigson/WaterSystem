# AquaFlow — water delivery workspace

AquaFlow is a Next.js App Router application for water suppliers. It keeps supplier accounts, license activation, customers, orders, delivery routes, inventory, pricing, expenses and workspace settings in PostgreSQL so the same account can be used from different browser profiles and devices.

## Stack and status

- Next.js 15, React 18, Node.js 20.9 or newer
- PostgreSQL through `pg` with checked-in SQL migrations
- Server-side bcrypt password hashes, signed HTTP-only sessions and HMAC-hashed, single-use license keys
- English and Urdu UI, including right-to-left layout
- GitHub Actions runs unit tests and a production build. Vercel configuration is included.

The repository is prepared for a Vercel deployment, but it has **not** been connected to a Vercel project or a hosted database from this workspace. GitHub Pages only served the earlier static version; it cannot run this app's API or PostgreSQL-backed features. Use Vercel (or another Node.js host) for the dynamic deployment. Any records saved in the old static app's browser storage are not automatically migrated into PostgreSQL; export anything you need from that app before switching.

## Local development

1. Install Node.js 20.9+ and PostgreSQL.
2. Copy `.env.example` to `.env.local` and set `DATABASE_URL` to your PostgreSQL connection string.
3. Generate two different long secrets and put them in `AUTH_SECRET` and `LICENSE_HASH_SECRET`:

   ```sh
   node -e "console.log(require('node:crypto').randomBytes(48).toString('base64url'))"
   ```

   Run the command twice. Keep both values private and stable. Changing `AUTH_SECRET` signs everyone out; changing `LICENSE_HASH_SECRET` makes previously issued keys impossible to validate.

4. Set a valid `MASTER_ADMIN_EMAIL` and a unique `MASTER_ADMIN_PASSWORD` of at least 12 characters. Set `MASTER_ADMIN_NAME` if desired.
5. Install, migrate, provision the master administrator and start the app:

   ```sh
   npm ci
   npm run db:migrate
   npm run db:seed
   npm run dev
   ```

   Open `http://localhost:3000`. `npm run db:seed` creates or updates the configured master-admin account using a bcrypt hash. Do not use a shared or example password.

The sign-in API can also bootstrap the configured master account on its first matching login after the schema has been migrated. The explicit seed command is preferable for local setup. Re-running it updates that account's password to the current `MASTER_ADMIN_PASSWORD` value.

## Vercel deployment

1. Push this repository to GitHub and import `davidmartinbigson/WaterSystem` into a Vercel project. This workspace has not connected to, imported into, or deployed to your Vercel account.
2. Attach a PostgreSQL database (for example, Neon or another PostgreSQL provider) and add its connection string as `DATABASE_URL` in Vercel Project → Settings → Environment Variables. Use separate databases for production and previews if you enable preview deployments.
3. Add the following private environment variables for the environments you intend to deploy:
   - `DATABASE_URL`
   - `AUTH_SECRET` — a random secret, at least 32 characters
   - `LICENSE_HASH_SECRET` — a different random secret, at least 32 characters
   - `MASTER_ADMIN_EMAIL`
   - `MASTER_ADMIN_PASSWORD` — at least 12 characters
   - Optional: `MASTER_ADMIN_NAME`
4. Use the Next.js framework preset and the `npm run vercel-build` build command. That command applies pending SQL migrations, then builds the Next.js app. Ensure the selected database is reachable from the build environment.
5. Deploy, sign in with the configured master-admin credentials, issue a supplier license, and copy the newly generated key while it is shown. The full key is intentionally not stored or shown again; the database stores only its HMAC and a short hint.
6. Keep the GitHub repository as the source of truth and connect Vercel to the same repository/branch for subsequent deployments. GitHub Actions checks tests and builds; it does not deploy the app.

Do not commit `.env.local`, database URLs, secrets, SMTP credentials or production customer data. Configure a database backup/restore plan before using real business records.

## Accounts and licenses

- Only the master administrator can issue or revoke licenses.
- The master can issue monthly (30-day), quarterly (90-day), yearly (365-day), or custom (1–3650-day) keys.
- A supplier must claim a valid, available license while signing up. Claiming is transactional and single-use across profiles/devices. The license period starts at activation.
- License issuance grants access; AquaFlow does not currently process subscription payments online.
- Supplier accounts and workspace records are enforced and loaded on the server; client-side storage is not used for authentication or business records. The interface remembers language and notification preference locally.
- License keys are shown in full only at creation. Save the key securely before closing the confirmation.

## Workspace behavior

Owner workspace data is tenant-scoped by the authenticated user and stored in a PostgreSQL `JSONB` record. New suppliers start with no customer, order, expense or route history and a zero-stock starter product catalog. The workspace then stores customers, orders, routes, inventory, expenses, configurable per-litre / 19L-can pricing, delivery balances and report messaging settings. Initial price values are starter defaults—review them in Settings before creating real orders. Updates are debounced and saved through authenticated API routes. Concurrent edits from multiple devices currently use last-write-wins rather than live collaboration.

Available API areas include:

- `/api/auth/*` — session, login, signup and logout
- `/api/profile` — supplier profile
- `/api/workspace` — owner-only workspace read/save
- `/api/admin/licenses` — master-only license issue, listing and revocation
- `/api/reports/email` — SMTP delivery reports for active supplier accounts

## Delivery messages

- **WhatsApp:** AquaFlow opens a pre-filled `wa.me` message containing the supplier's current business name and delivery details. The supplier reviews and sends it in WhatsApp; this is not automatic WhatsApp Business API delivery.
- **Email:** AquaFlow sends through server-side SMTP. To enable it, set `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, and `SMTP_FROM` as private Vercel Environment Variables. `SMTP_SECURE=true` can be set when required by the provider (port 465 is treated as secure automatically). Without SMTP configuration, email reports return a clear setup error. SMTP secrets are never entered into the browser.

## Checks

```sh
npm test
npm run build
npm audit
```

The Next.js build and tests should be run locally or by GitHub Actions after setting up the code. Migrations can be checked with `npm run db:migrate` against a disposable or development PostgreSQL database.
