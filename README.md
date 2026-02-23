
---

```md
# Interactive Dashboard — Frontend (React + Vite + Firebase Auth + TanStack Query)

This is the frontend for the Traffic Dashboard home task.

What it does:
- Login/Register with Firebase Auth (Email+Password + Google)
- Calls a Firebase Functions backend (REST)
- Dashboard:
  - Table (pagination, sorting, date filtering)
  - Chart with granularity toggle (daily/weekly/monthly)
  - URL-driven modals (create/edit/delete)
- Role-based UI: only `editor` sees create/edit/delete actions

---

## Tech Stack

- React (Vite)
- TypeScript
- React Router (BrowserRouter + Routes + lazy loading + Suspense)
- TanStack Query (server-state only: caching, invalidation, optimistic updates)
- Firebase Auth (Web SDK)
- React Hook Form + Zod (forms + validation)
- shadcn/ui + Tailwind CSS (UI components)
- Recharts (Line for daily, Bar for weekly/monthly)
- Axios (HTTP client)
- Sonner (toasts)

---

## Project Structure (by responsibility)

Top-level folders:

- `domain/`
  - “Pure” app layer
  - Datasources interfaces/implementations (Firebase Auth, token getters, etc.)
  - Keep business rules away from React

- `api/`
  - HTTP calls (axios wrappers) to the backend

- `hooks/`
  - App hooks + TanStack Query hooks (queries/mutations)
  - Optimistic updates + invalidation logic lives here

- `pages/`
  - Route-level screens (Login / Register / Dashboard)
  - Dashboard includes modal screens

- `layout/`
  - Shared layouts (auth layout, app layout)

- `components/`
  - Reusable UI components (mostly shadcn/ui wrappers + small custom bits)

- `router/`
  - Router config, route guards, lazy loading

This matches a Clean-ish split: **domain** (core), **hooks/api** (application glue), **pages/components** (presentation).

---

## Important Note: QueryClientProvider is NOT “state management”

`<QueryClientProvider>` is just TanStack Query’s provider so React Query can:
- cache server responses
- track loading/errors
- run invalidations/refetches

It’s not “global state” like Redux/Zustand. It’s server-state caching.

---

## Environment Variables (Vercel / Local)

Because this is Vite, **only variables prefixed with `VITE_` are exposed** to the client bundle. :contentReference[oaicite:3]{index=3}

### Required (Firebase Web SDK)
Set these from your Firebase project settings:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_USE_AUTH_EMULATOR=true`
- `VITE_AUTH_EMULATOR_URL=http://127.0.0.1:9099`

### Backend base URL
- `VITE_API_BASE_URL`

Examples:
- **Local Functions emulator**
- `VITE_API_BASE_URL=http://127.0.0.1:5001/interactive-dashboard-7add2/europe-west1/api`
## Install & Run (Local)

From the frontend folder:

```bash
npm install
npm run dev
```
### Build:
```bash
npm run build
npm run preview
```


## Routing

### Routes
- `/login`
- `/register`
- `/dashboard`

### Router features
- `BrowserRouter` + `Routes`
- Lazy loading with `React.lazy` + `<Suspense />`
- Route guard:
  - If not authenticated → redirect to `/login`

---

## Auth Flow (Firebase)

### Email/Password
- Register + login using Firebase Auth Web SDK

### Google Login
- `signInWithPopup`

### If Google popup fails on Vercel
You must whitelist your deployed domain:

Firebase Console → **Authentication** → **Settings** → **Authorized domains**  
Add:
- `interactive-dashboard-fe.vercel.app`

Otherwise you’ll get:
- `FirebaseError: auth/unauthorized-domain`

---

## Dashboard (Table + Chart)

### Data fetching
TanStack Query handles:
- List query (table)
- Aggregate query (chart)

### Pagination (10 rows)
The table uses 10 rows per page with **placeholder / keep previous data** to avoid UI flashes when switching pages.

### Mutations
Create/update/delete traffic rows use `useMutation`.

UX pattern:
- **Optimistic update** for the **table**
- **Invalidate/refetch** for the **chart** (aggregation depends on global stats)

### Toasts
- `toast.success(...)` / `toast.error(...)`
- Messages come from API responses where possible

---

## Modal Routing (URL-driven modals)

I wanted modals to be:
- Deep-linkable
- Back/forward friendly
- Refresh-safe

So modals are controlled via `URLSearchParams`, for example:
- `?modal=create`
- `?modal=edit&date=2026-02-01`
- `?modal=delete&date=2026-02-01`

A `ModalShell` component reads search params and renders the correct dialog.  
Closing a modal = navigate back / remove params.

---

## Role-based UI

The backend returns `role: viewer | editor` on `GET /auth/me`.

Frontend uses that:
- If `viewer`: hide Create/Edit/Delete buttons
- If `editor`: show them and allow mutations

Backend still enforces permissions (frontend is just UX).

---

## Deployment

### Frontend (Vercel)
1. Deploy the Vite app
2. Add all `VITE_*` env vars in Vercel project settings
3. Redeploy (Vercel only injects env vars at build time)