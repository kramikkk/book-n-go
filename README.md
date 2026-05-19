# BookNGo

A multi-tenant SaaS appointment booking platform built with Next.js and Supabase.

## Overview

BookNGo lets businesses publish a public booking page at `/{slug}` where customers can schedule appointments. Each business gets its own branded page with a customizable theme. Business owners and staff manage their bookings, view analytics, and configure settings through a private client dashboard at `/client/`.

Authentication is handled server-side via Supabase SSR, and all routes are protected through Next.js middleware.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Backend & Auth | Supabase (PostgreSQL + Supabase Auth SSR) |
| Styling | Tailwind CSS 4 + shadcn/ui (New York style) |
| Forms & Validation | React Hook Form + Zod |
| Data Tables | TanStack React Table |
| Charts | Recharts |
| Animations | Framer Motion |
| Drag & Drop | @dnd-kit |

## Project Structure

```
book-n-go/
├── app/
│   ├── page.tsx              # Landing page (marketing + login)
│   ├── layout.tsx            # Root layout (fonts, metadata)
│   ├── globals.css           # Global styles
│   ├── api/                  # API route handlers
│   │   ├── auth/             # Sign-in / sign-out / callback
│   │   ├── profile/          # User profile CRUD
│   │   ├── client/           # Dashboard, bookings, settings APIs
│   │   └── slug/             # Slug-scoped public APIs
│   ├── client/               # Authenticated business dashboard
│   │   ├── dashboard/        # Stats overview & charts
│   │   ├── bookings/         # Booking list & management
│   │   ├── profile/          # Profile settings
│   │   └── settings/         # Business settings
│   └── [slug]/               # Public booking pages (per business)
├── components/
│   ├── ui/                   # shadcn/ui & custom base components
│   ├── dashboard/            # Dashboard-specific components
│   └── landing/              # Landing page sections
├── lib/
│   ├── supabase/             # Supabase client (browser, server, admin, middleware)
│   ├── schemas.ts            # Zod validation schemas
│   ├── booking-utils.ts      # Booking helper functions
│   ├── booking-constants.ts  # Shared constants
│   ├── services-config.ts    # Service configuration
│   ├── slug-theme.ts         # Dynamic per-business theming
│   └── user-profile.ts       # User profile helpers
├── hooks/
│   └── use-mobile.ts         # Responsive breakpoint detection
└── public/                   # Static assets
```

## Getting Started

### Prerequisites

- **Node.js** 18 or later
- A **Supabase** project ([create one free](https://supabase.com))

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/book-n-go.git
cd book-n-go
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in your Supabase credentials (see [Environment Variables](#environment-variables) below).

4. Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL — found in **Settings → API** in the Supabase dashboard |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase public anon key — safe to expose in the browser |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key — server-only, never expose publicly |

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm start` | Run the production build |
| `npm run lint` | Run ESLint |

## Architecture Overview

**Routing** — The app uses two distinct route trees. Public booking pages live under `app/[slug]/` and are accessible without authentication. The client dashboard lives under `app/client/` and is protected by Supabase SSR auth enforced in `lib/supabase/middleware.ts`, which runs on every request via `next.config.ts`.

**Authentication** — Supabase Auth is integrated with Next.js middleware using `@supabase/ssr`. The server-side client in `lib/supabase/server.ts` reads cookies to determine the current session, and the admin client in `lib/supabase/server-admin.ts` is used for privileged operations that bypass row-level security.

**Multi-tenancy** — Each business is identified by a unique slug. The `app/[slug]/` route renders the booking page for that business, and `lib/slug-theme.ts` resolves the brand theme dynamically from the slug so each page looks distinct.

**Security** — `next.config.ts` applies strict Content Security Policy headers, disables camera/microphone/geolocation permissions, and restricts image and connection sources to trusted Supabase domains.

## Key Features

- Public, per-business booking pages with dynamic branding and theming
- Client dashboard with booking management, stats, and charts
- Supabase SSR authentication with middleware-level route protection
- Drag-and-drop scheduling support via @dnd-kit
- Strict CSP security headers configured at the framework level
- Form validation with React Hook Form and Zod schemas
- Responsive design with Tailwind CSS 4 and shadcn/ui components
