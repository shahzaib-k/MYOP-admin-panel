# AGENTS.md

Guidance for AI agents working on the "Make Your Own Platter" admin panel.

## Project Overview

- Next.js 16 (App Router) + TypeScript + Tailwind CSS v4, no `src/` directory.
- This is a **pure frontend**. It consumes the existing Express + Firebase backend in
  `../MYOP-backend` over REST. It never imports `firebase-admin`, never holds a
  service-account credential, and never reimplements backend logic.
- Read `../MYOP-backend/docs/API.md` before touching any service file — it is the
  source of truth for endpoints, request bodies and response shapes, not this file
  or the original build spec.

## Backend Contract (do not guess)

- Every response is `{ success, message, data }` on success and
  `{ success, message, errors }` on failure. All four `services/*.ts` files unwrap
  `response.data.data` and throw `new Error(message)` on `success: false`.
- Auth is a single shared endpoint: `POST /api/auth/login` returns `{ user, token }`
  for **any** role. `services/authService.ts` rejects non-admin accounts client-side
  after login — the backend does not have a separate admin login route.
- `image` on both `Food` and `Category` is a plain trimmed string (a URL). The
  backend has **no file upload endpoint** — do not add a file picker or multipart
  upload without first adding that capability to the backend.
- `GET /api/foods` returns the entire list with no server-side search, filter or
  pagination. `GET /api/categories` is similarly unfiltered aside from
  `?activeOnly=true`. Search/filter for foods happens client-side in
  `app/dashboard/foods/page.tsx` — do not invent backend query params that don't
  exist.
- There is no `GET /api/foods/:id`. `foodService.getFoodById` fetches the full list
  and finds the item client-side. If the backend later adds a single-item endpoint,
  switch to it and drop this workaround.
- Admin order endpoints live under `/api/admin/orders` (list with
  `status/search/userId/startDate/endDate/page/limit/sort`, get-by-id, and
  `PUT /:id/status`). **Deleting** an order is the odd one out — it's
  `DELETE /api/orders/:id` from `orderRoutes`, not `/api/admin/orders/:id`.
- The backend only sorts orders by `createdAt` (`sort=asc|desc`). There is no
  total-price sort server-side. `hooks/useOrders.ts` fetches the page from the
  server and re-sorts that page client-side for "highest total"/"lowest total" —
  this is a known limitation (sort is only accurate within the current page), not
  a bug.
- Order status transitions are restricted:
  `pending → preparing|cancelled`, `preparing → completed|cancelled`,
  `completed`/`cancelled` are terminal. `utils/orderStatus.ts` mirrors
  `MYOP-backend/utils/orderStatus.js` exactly — keep them in sync. The UI must only
  ever offer a transition the backend will accept.
- `PUT /api/admin/orders/:id/status` accepts **only** `{ status }` — no other field.

## Authentication & Security

- JWT bearer token, attached by an axios request interceptor in `services/api.ts`.
- The session token is kept in `localStorage` **and** mirrored into a plain
  (non-httpOnly) cookie via `utils/tokenStorage.ts`, because a pure SPA calling an
  external API directly cannot set an httpOnly cookie without a backend-for-frontend
  proxy — which this project deliberately does not add (see Architecture Rules).
- `middleware.ts` checks only for that cookie's presence and redirects to `/login`
  before a protected page renders. It does **not** validate the token. Real
  authorization is enforced by the backend's `protect`/`restrictTo("admin")` on
  every request; a 401 anywhere triggers the axios response interceptor, which
  clears the session and redirects to `/login`.
- `app/dashboard/layout.tsx` adds a second, client-side redirect via `useAuth()` —
  this is UX (avoid a content flash), not the security boundary.
- Never add `NEXT_PUBLIC_*` env vars for anything that isn't safe to ship to the
  browser. Never add Firebase Admin SDK or service-account files to this project.

## Architecture Rules

- Folder structure:
  - `app/` — routes only (App Router). Pages compose hooks/services and components;
    they do not call axios directly.
  - `components/ui/` — generic, feature-agnostic primitives (Button, Input, Modal, …)
  - `components/layout/`, `components/categories/`, `components/foods/`,
    `components/orders/` — feature-specific composition of the `ui/` primitives.
  - `services/` — one module per backend resource, all HTTP calls live here.
  - `hooks/` — data-fetching + local state per feature (`useCategories`, `useFoods`,
    `useOrders`, `useDashboard`). Pages call these, not `services/` directly, except
    for one-off mutations (create/update/delete) triggered from event handlers.
  - `context/` — `AuthContext` only. Don't add more global providers unless a need
    genuinely spans unrelated routes.
  - `types/` — centralized interfaces mirroring the backend schemas.
  - `utils/` — pure helpers (formatting, error normalization, order-status rules,
    token storage). No React, no HTTP calls.
- No file may exceed **500 lines**. Split a page into sub-components before it does.
- Never import axios from a page or a `components/` file — go through `services/`.

## TypeScript & React Standards

- Functional components and hooks only. No class components.
- `"use client"` only where interactivity or browser APIs are required; the few
  purely presentational components (e.g. `OrderDetails`, tables) can stay server-safe
  but are currently rendered from client pages.
- Avoid `any`. Extend `types/index.ts` instead of inlining ad hoc shapes.
- Use `clsx` for conditional class names instead of manual string concatenation.

## Error Handling Standard

- Every service function throws a plain `Error` with the backend's `message`.
- `utils/errorHandler.ts#normalizeError` is the single place that turns any
  thrown value (Axios error, generic Error, unknown) into a
  `{ message, status, details }` shape. Call it in every catch block that shows an
  error to the admin — don't format Axios errors ad hoc in a component.
- Every list/detail page handles four states: loading (`LoadingSpinner`), error
  (`ErrorMessage` with retry), empty (`EmptyState`), and success.

## Naming Conventions

- Components: PascalCase file and export name, one component per file.
- Hooks: `useX.ts`, return an object (not a tuple) so call sites stay
  self-documenting.
- Services: `xService.ts`, exporting plain async functions (no default export, no
  class).
- Route folders under `app/` follow the backend resource name (`categories`,
  `foods`, `orders`), not the UI label.

## Before Finishing Work

- Run `npm run build` and confirm it compiles without TypeScript errors.
- Run `npm run lint`.
- Check that no file exceeds 500 lines.
- Check that no page/component imports axios directly.
- Confirm any new backend assumption was checked against
  `../MYOP-backend/docs/API.md` or the actual controller/service/middleware code,
  not guessed from this file or the original build spec.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
