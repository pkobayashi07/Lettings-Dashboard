# Lettings Dashboard

A property management CRM/dashboard for Admin, Lettings, Maintenance, and Finance teams.

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

The seed script creates:

- Organization: "Acme Property Management"
- User: `admin@example.com` / `password123` (Department: Admin, Role: Owner)

### 4. Run the app

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) and sign in with the seeded admin account.

## Project structure

```
prisma/schema.prisma        Data model (Organization, User, Property, Unit,
                             Landlord, Tenant, Tenancy, MaintenanceTicket, Payment)
prisma/seed.ts               Seed script for local dev
src/proxy.ts                 Optimistic auth redirect (login-gate for all routes)
src/lib/session.ts            JWT session cookie encrypt/decrypt
src/lib/dal.ts                Data Access Layer: verifySession(), getCurrentUser()
src/lib/require-department.ts Per-page department/role access check
src/lib/nav.ts                 Sidebar nav items, filtered by department/role
src/lib/actions/auth.ts        Server actions: login, logout
src/app/login/                Login page
src/app/(dashboard)/          Authenticated shell (sidebar + topbar) and pages:
  page.tsx                     Cross-department KPI dashboard (placeholder data)
  admin/, lettings/,
  maintenance/, finance/       Per-department pages (scaffolded, no data yet)
```

## Roles & departments

- **Departments**: `ADMIN`, `LETTINGS`, `MAINTENANCE`, `FINANCE` — determines which
  section of the app a staff member sees by default.
- **Roles**: `OWNER`, `MANAGER` (see and access every department), `STAFF`
  (limited to their own department + the shared dashboard).

## Roadmap

This is the foundation phase (auth, data model, base layout). Planned next:

1. **Lettings module** — applicant pipeline, tenancy management
2. **Maintenance module** — ticketing, contractor assignment
3. **Finance module** — rent/payments tracking, arrears, invoicing
4. **Dashboard & reporting** — live KPIs wired to real data
5. **Polish** — document uploads, compliance alerts, notifications, audit log

## Useful scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run lint` | Lint the codebase |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:seed` | Seed demo data |
| `npm run db:studio` | Open Prisma Studio (visual DB browser) |
