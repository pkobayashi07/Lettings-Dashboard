# Lettings Dashboard

A property management CRM/dashboard for Admin, Lettings, Maintenance, and Finance teams.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fpkobayashi07%2FLettings-Dashboard%2Ftree%2Fclaude%2Fproperty-manager-crm-plan-m77rjn&env=DATABASE_URL,SESSION_SECRET&envDescription=Postgres+connection+string+and+a+random+session+secret&project-name=lettings-dashboard&repository-name=lettings-dashboard)

> The button gets you to the Vercel import screen pre-filled; if anything
> looks off, use the manual steps below instead — see "Deploying a live
> preview".

## Stack

- [Next.js 16](https://nextjs.org) (App Router, TypeScript)
- PostgreSQL + [Prisma](https://www.prisma.io) (v6)
- Tailwind CSS v4
- Custom cookie-based session auth (`jose` + `bcryptjs`), following the [Next.js authentication guide](https://nextjs.org/docs/app/guides/authentication)

> **Note:** this project uses Next.js 16, which renamed `middleware.ts` to `proxy.ts` (see `src/proxy.ts`). No functional change, just a naming update.

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

- `DATABASE_URL`: a PostgreSQL connection string.
- `SESSION_SECRET`: generate one with `openssl rand -base64 32`.

### 3. Set up the database

```bash
npm run db:migrate   # creates tables from prisma/schema.prisma
npm run db:seed      # creates a demo organization + admin user
```

The seed script creates an organization ("Bucknell Property"), demo
staff logins, and sample records:

| Email | Password | Department | Role |
|---|---|---|---|
| `admin@example.com` | `password123` | Admin | Owner (full access) |
| `lettings@example.com` | `password123` | Lettings | Staff |
| `maintenance@example.com` | `password123` | Maintenance | Staff |
| `finance@example.com` | `password123` | Finance | Staff |

Plus a sample landlord, two properties/units, two tenants, an applicant
tenancy, an active tenancy (with a lease end date, a paid and an overdue
rent charge), a contractor, a maintenance ticket, and three compliance
items (expired, due soon, and valid) to explore.

### 4. Run the app

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) and sign in with the seeded admin account.

## Deploying a live preview (Vercel)

1. **Create a free Postgres database** — [Neon](https://neon.tech) or
   [Supabase](https://supabase.com) both have a free tier that works well
   with Vercel. Create a project and copy the connection string (it looks
   like `postgresql://user:password@host/dbname?sslmode=require`).
2. **Import this repo on Vercel** — go to
   [vercel.com/new](https://vercel.com/new), import
   `pkobayashi07/Lettings-Dashboard`, and select the
   `claude/property-manager-crm-plan-m77rjn` branch (or whichever branch
   you're testing).
3. **Add environment variables** in the Vercel project's Settings →
   Environment Variables:
   - `DATABASE_URL` — the connection string from step 1
   - `SESSION_SECRET` — any random string, e.g. output of
     `openssl rand -base64 32`
4. **Deploy.** Vercel runs `npm install` (which triggers `prisma generate`
   via the `postinstall` script), then `npm run build`, which itself runs
   `prisma migrate deploy` and seeds the demo data before building —
   no manual database step needed.
5. Visit your new `*.vercel.app` URL and sign in with one of the seeded
   accounts (see the table above).

> **Note:** the `build` script re-runs the (idempotent) seed on every
> deploy, which is convenient for a demo/test environment but not what
> you'd want for a real production launch with real data. Before going
> live for real, change `"build"` in `package.json` back to
> `"prisma migrate deploy && next build"` (drop the `npm run db:seed`
> step).

## Project structure

```
prisma/schema.prisma        Data model (Organization, User, Property, Unit,
                             Landlord, Tenant, Tenancy, Contractor,
                             MaintenanceTicket, ComplianceItem, Payment)
prisma/seed.ts               Seed script for local dev
src/proxy.ts                 Optimistic auth redirect (login-gate for all routes)
src/lib/session.ts            JWT session cookie encrypt/decrypt
src/lib/dal.ts                Data Access Layer: verifySession(), getCurrentUser()
src/lib/require-department.ts Per-page department/role access check
src/lib/nav.ts                 Sidebar nav items, filtered by department/role
src/lib/form-state.ts          Shared form action state type
src/lib/zod-helpers.ts         Shared zod preprocessors (optional string/email)
src/lib/dashboard-kpis.ts      Home dashboard KPI queries, per department
src/lib/actions/auth.ts        Server actions: login, logout
src/lib/admin/                 Admin module: zod schemas + server actions
src/lib/lettings/              Lettings module: zod schemas + server actions
src/lib/maintenance/           Maintenance module: zod schemas + server actions
src/lib/finance/                Finance module: zod schemas + server actions
src/app/login/                Login page
src/app/(dashboard)/          Authenticated shell (sidebar + topbar) and pages:
  page.tsx                     Cross-department KPI dashboard (live data)
  admin/                        Compliance items (certificates + expiry tracking)
  lettings/                     Applicant pipeline, properties/units, tenants, landlords
  maintenance/                  Ticket board, contractors
  finance/                      Rent charges, arrears, collections
```

## Roles & departments

- **Departments**: `ADMIN`, `LETTINGS`, `MAINTENANCE`, `FINANCE` — determines which
  section of the app a staff member sees by default.
- **Roles**: `OWNER`, `MANAGER` (see and access every department), `STAFF`
  (limited to their own department + the shared dashboard).

## Roadmap

- [x] **Foundation** — auth, org/user/role model, base layout
- [x] **Lettings module** — landlords, properties/units, tenants, applicant pipeline
- [x] **Maintenance module** — ticketing (Open → In progress/On hold → Resolved), contractor directory
- [x] **Finance module** — rent charges, arrears/outstanding tracking, mark-as-paid
- [x] **Dashboard KPIs** — wired to real data (active users, occupancy, arrears, ticket resolution time, etc.)
- [x] **Compliance tracking** — certificates/documents per property with expiry status (Expired/Due soon/Valid), plus a lease end date on active tenancies (powers "Renewals Due")
- [ ] **Invoicing** — management fees, landlord statements (not yet built)
- [ ] **Polish** — document uploads (attach the actual certificate file), notifications, audit log

## Useful scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run lint` | Lint the codebase |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:seed` | Seed demo data |
| `npm run db:studio` | Open Prisma Studio (visual DB browser) |
