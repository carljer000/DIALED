# DIALED repository guide

This guide explains what each part of the repository does and how data moves through the app.

## Runtime flow

```text
Browser
  -> GitHub OAuth through Supabase Auth
  -> owner token verification (real journal only)
  -> React page
  -> DialedContext
  -> checkinsApi
  -> Express route
  -> controller + validation
  -> PostgreSQL connection pool
  -> Supabase PostgreSQL
```

1. `client/src/main.jsx` starts React, the router, and `DialedProvider`.
2. `client/src/App.jsx` maps URLs to the Today, Dashboard, History, and Settings pages.
3. Pages read and update shared check-in state through `client/src/context/DialedContext.jsx`.
4. `client/src/services/checkinsApi.js` sends requests to the Express API. It uses `VITE_API_URL` when configured and otherwise uses `http://localhost:3001/api`.
5. `server/src/app.js` receives the request and forwards `/api/checkins` requests to the check-in router.
6. `server/src/routes/checkins.routes.js` selects the controller for listing, reading, saving, or deleting a check-in.
7. `server/src/controllers/checkins.controller.js` validates input and runs parameterized SQL through the shared pool.
8. `server/src/config/database.js` opens the SSL PostgreSQL connection using `DATABASE_URL` from `server/.env`.
9. Supabase stores the check-in. The saved result travels back through the API to React, and the context updates the screen without a reload.

Settings do not go through the server. `DialedContext` stores preferences and the selected theme in browser `localStorage` under `dialed-preferences`.

The public demo replaces the API adapter with `client/src/services/demoCheckins.js`. Demo check-ins and demo preferences use separate browser storage keys, so demo changes never reach Express or PostgreSQL.

## Screen flows

### Today: create or update a check-in

`TodayPage.jsx` -> `CheckInForm.jsx` -> input components -> `utils/checkins.js` serialization -> `DialedContext.saveCheckin()` -> `POST /api/checkins` -> PostgreSQL upsert.

The date is unique, so saving an existing date updates that day's row rather than adding a duplicate.

### Dashboard: calculate summaries

`DashboardPage.jsx` reads the already-loaded check-ins from `DialedContext`. Functions in `utils/checkins.js` calculate streaks, target consistency, monthly totals, goal progress, patterns, and weekly reflection data in the browser. Dashboard components only present those calculated results; they do not make separate API calls.

### History: filter or delete entries

`HistoryPage.jsx` filters the check-ins already held in context by date, Headspace, and result, so filtering is immediate and does not query the database again. `HistoryList.jsx` renders the matches. Deleting calls `DELETE /api/checkins/:id`, then removes the deleted item from context.

### Settings: save personal defaults

`SettingsPage.jsx` updates default targets, weight units, goals, training status, reflection prompts, and theme. These values stay in the current browser through `localStorage`. Weight-unit conversion uses helpers in `utils/checkins.js`.

## Folder and file purposes

| Path | Purpose |
| --- | --- |
| `client/` | React + Vite browser application. |
| `client/logo/` | Static logo files copied into the Vite build root by `publicDir` in `vite.config.js`. |
| `client/src/components/atoms/` | Small reusable controls and status messages. |
| `client/src/components/molecules/` | Groups of related controls or display elements. |
| `client/src/components/organisms/` | Larger feature sections such as the form, dashboard panels, history list, and navigation. |
| `client/src/pages/` | Route-level screens. |
| `client/src/context/` | Shared check-ins, settings, loading, and error state. |
| `client/src/services/` | Browser-to-API request code. |
| `client/src/context/AuthContext.jsx` | GitHub session, owner verification, and demo-mode selection. |
| `client/src/utils/` | Pure date, conversion, serialization, and summary functions. |
| `client/src/styles/` | Base, layout, feature, responsive, and theme styles imported by `styles/index.css`. |
| `client/test/` | Node tests for dates and check-in calculations. |
| `server/` | Express API and database scripts. |
| `server/src/app.js` | Express middleware, health route, API mounting, 404 response, and error handler. |
| `server/src/server.js` | Starts the API and verifies the database connection. |
| `server/src/routes/` | Maps HTTP methods and paths to controllers. |
| `server/src/controllers/` | Performs validation and database operations. |
| `server/src/validation/` | Accepted values and request validation rules. |
| `server/src/config/` | PostgreSQL pool configuration. |
| `server/src/middleware/requireOwner.js` | Verifies the Supabase bearer token and immutable owner UUID before journal access. |
| `server/certs/` | Certificate authority used to verify the Supabase PostgreSQL TLS connection. |
| `server/seed.js` | Optional sample-data generator. |
| `server/scripts/migrate-to-supabase.js` | Optional one-time copier for an older PostgreSQL database. |
| `server/test/` | API validation tests. |
| `supabase/migrations/` | Versioned database schema changes; these are the source of truth for schema setup. |
| `supabase/config.toml` | Local Supabase CLI configuration. |
| `screenshots/` | Images displayed in the README. |
| `AI-USAGE.md` | AI-assistance disclosure and supporting commit links. |
| `DEPLOYMENT.md` | GitHub OAuth, Vercel projects, environment variables, and deployment checks. |
| `REPORT.md` | Development journal/report retained as project documentation. |
| `package.json` | Root commands for installing, running, building, seeding, and managing Supabase. |
| `package-lock.json` | Reproducible root dependency versions; it should remain committed. |

## Generated or local-only files

These should not be committed:

- `node_modules/`: installed packages; recreate with `npm install`.
- `client/dist/`: production build output; recreate with `npm run build`.
- `server/.env` and client `.env.*.local` files: private local configuration.
- `supabase/.temp/`: Supabase CLI state.
- `tmp/` and `.presentation-build/`: temporary rendering/build artifacts.
- `*.log`: local command and server logs.

The files under `presentation/` and `PRESENTATION_HANDOFF.md` are separate presentation deliverables, not runtime application files. Keep them locally or commit them only if the presentation itself should be part of the public repository.

## Commands

| Command | Purpose |
| --- | --- |
| `npm install` | Installs root dependencies and then client/server dependencies. |
| `npm run dev` | Starts the Express API and Vite client together. |
| `npm run build` | Creates the production frontend in `client/dist/`. |
| `npm test --prefix client` | Runs client utility tests. |
| `npm test --prefix server` | Runs server validation tests. |
| `npm run seed` | Adds optional sample check-ins. |
| `npm run supabase:push` | Applies committed migrations to the linked Supabase project. |
| `npm run db:migrate-data` | Copies rows from an older database using `SOURCE_DATABASE_URL`. |
