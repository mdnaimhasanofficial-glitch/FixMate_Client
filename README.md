# FixMate

**FixMate** is a home & office repair marketplace. Customers browse verified repair services
(smartphone, laptop, AC, appliances, electrical) and send a repair request, technicians confirm
and complete the jobs from their own dashboard, and admins oversee users, services, bookings and
payments — all in one web app.

This repository is the **frontend** (Next.js). The Express + MongoDB API lives in the separate
`fixmate-server` repository.

## Live URL

`https://your-live-url.vercel.app` _(placeholder — replace after deploying)_

## Test Credentials (placeholders)

| Role       | Email                     | Password            |
| ---------- | ------------------------- | ------------------- |
| Admin      | `admin@fixmate.com`       | `********`          |
| Technician | `technician1@fixmate.com` | `********`          |
| Customer   | `customer@fixmate.com`    | `********`          |

> Passwords are placeholders. Sign up with the **Sign Up** page to create a working account and
> assign yourself a password, or create the demo accounts through the server's seed script.

## Key Features

- **Public pages** — home (hero, featured services, how it works, categories, testimonials),
  services list with URL-based search / category / mode / sort filters and pagination,
  service details with technician card, about page with FAQ.
- **Authentication** — BetterAuth email & password sign-up / sign-in, session-based,
  role-based access for **customer**, **technician** and **admin**.
- **Customer dashboard** — stats overview, my bookings with status filter (cancel a requested
  job, pay a completed job through Stripe checkout), payment history, editable profile
  (name, phone, area, bio, photo).
- **Technician dashboard** — stats overview, add a service (photo upload to ImgBB), my services
  CRUD with an availability switch, incoming requests with the correct action per status
  (Accept / Reject / Start Work / Mark Completed with final amount).
- **Admin dashboard** — stats + revenue overview, user role management, service approval
  (approve / reject), read-only bookings list, transactions list with total revenue.
- **UI** — dark / light mode toggle, responsive on mobile, tablet and desktop, status badges,
  skeleton loading states, empty states, sonner toasts on every action.

## Tech Stack

- **Framework:** Next.js 16 (App Router, TypeScript)
- **Styling:** Tailwind CSS 4, shadcn/ui built on Base UI, tw-animate-css
- **Auth:** BetterAuth + MongoDB adapter
- **Data:** Express + MongoDB REST API (`NEXT_PUBLIC_API_URL`), `apiFetch` helper
- **Charts:** recharts · **Toasts:** sonner · **Icons:** lucide-react · **Theme:** next-themes
- **Payments:** Stripe Checkout (via the API)

## npm Packages

From `package.json`:

**dependencies**

- `@base-ui/react`
- `@better-auth/mongo-adapter`
- `better-auth`
- `class-variance-authority`
- `cn`
- `jsonwebtoken`
- `lucide-react`
- `mongodb`
- `next`
- `next-themes`
- `react`
- `react-dom`
- `recharts`
- `shadcn`
- `sonner`
- `tw-animate-css`

**devDependencies**

- `@tailwindcss/turbopack`
- `@types/jsonwebtoken`
- `@types/node`
- `@types/react`
- `@types/react-dom`
- `eslint`
- `eslint-config-next`
- `tailwindcss`
- `typescript`

## Local Run

1. **Clone and install**

   ```bash
   git clone <your-repo-url>
   cd FixMate/fixmate-client
   npm install
   ```

2. **Environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Fill in `.env.local`:

   | Variable                | Where it comes from                                   |
   | ----------------------- | ----------------------------------------------------- |
   | `NEXT_PUBLIC_API_URL`   | Express API base URL, e.g. `http://localhost:5000`    |
   | `NEXT_PUBLIC_APP_URL`   | This app's URL, e.g. `http://localhost:3000`          |
   | `MONGODB_URI`           | MongoDB connection string                             |
   | `DB_NAME`               | MongoDB database name                                 |
   | `BETTER_AUTH_SECRET`    | Any long random string                                |
   | `BETTER_AUTH_URL`       | This app's URL, e.g. `http://localhost:3000`          |
   | `JWT_SECRET`            | Any long random string (API tokens)                   |
   | `IMGBB_API_KEY`         | Free key from imgbb.com (photo uploads)               |

3. **Start the API** (separate repo, defaults to port 5000)

   ```bash
   cd ../fixmate-server
   npm install
   node seed.js   # optional: demo data
   npm start
   ```

4. **Start this app**

   ```bash
   cd ../fixmate-client
   npm run dev
   ```

   Open <http://localhost:3000>.

## Project Structure

```
app/                 pages and routes (public, auth, dashboard, api)
components/shared/   navbar, footer, cards, public sections
components/dashboard sidebar, topbar, tables, dialogs
components/ui/       shadcn/ui components
lib/                 api client, auth, guards, constants, helpers
middleware.ts        session-cookie check for /dashboard
```
