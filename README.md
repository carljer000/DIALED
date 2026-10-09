# DIALED

[![Made with AI](https://img.shields.io/badge/Made_with-AI_assistance-blue)](AI-USAGE.md)

<p align="center">
  <img src="client/logo/dialed-favicon.svg" alt="DIALED cat logo on a red circular background" width="180">
</p>

DIALED is a private daily cutting journal for lifters who want structure, accountability, and a clearer view of their consistency. It combines nutrition, movement, Headspace, and reflection in one daily check-in.

## PROJECT LINKS

- Repository: [github.com/carljer000/DIALED](https://github.com/carljer000/DIALED)
- Live client: [dialed-kappa.vercel.app](https://dialed-kappa.vercel.app/)
- Deployment guide: [DEPLOYMENT.md](DEPLOYMENT.md)

## WHAT IT IS

DIALED is built for people following a calorie deficit who already know their targets but want to make the daily process visible. Each check-in can include:

- Body weight, with kilogram or pound support.
- Calorie and protein targets plus actual intake.
- Steps and daily step-goal progress.
- An overall Headspace status: Low, Neutral, or Dialed.
- Optional energy, hunger/cravings, sleep quality, and training details.
- The day’s main challenge, a daily win, and a guided reflection.

The production app has two intentionally separate experiences. **My Journal** is owner-only and contains the real check-ins. **Try Demo** uses invented sample data stored only in the visitor’s browser and does not call the API or change the Supabase database.

## BUILT WITH

- **Frontend:** React, Vite, and CSS with responsive desktop and mobile layouts.
- **Backend:** Express and PostgreSQL through the Supabase database.
- **Authentication:** Supabase Auth with GitHub OAuth for owner access.
- **Hosting:** Vercel, with the client and API deployed as separate projects from this repository.

## DEMO AND ACCESS

The landing page offers two access paths:

- **My Journal:** signs in through GitHub and opens the real owner journal. API check-in routes require a valid Supabase session and the configured owner UUID.
- **Try Demo:** opens an isolated sample journal. Demo entries use browser storage only, are intentionally invented, and never reach the API or Supabase.

This separation means visitors can explore the workflow without seeing or changing private check-ins. The current production model supports one configured owner; general multi-user ownership is listed as future work.

## HOW TO RUN IT

### PREREQUISITES

Install or create the following before starting:

- Node.js `20.19.0` or newer and npm.
- Git.
- A Supabase project.
- A Supabase **Transaction pooler** connection string for the deployed API, or a local PostgreSQL connection for local development.

### GET THE CODE

```bash
git clone https://github.com/carljer000/DIALED.git
cd DIALED
npm install
```

The root install runs the client and server installs through the project’s `postinstall` script. If needed, install them separately with `npm run install:all`.

### LINK SUPABASE AND APPLY THE DATABASE

1. Log in to the Supabase CLI and link the project:

   ```bash
   npm run supabase:login
   npm run supabase:link -- --project-ref YOUR_PROJECT_REF
   ```

2. Preview the pending changes, then apply them:

   ```bash
   npx supabase db push --linked --dry-run
   npm run supabase:push
   ```

3. Confirm the migration status:

   ```bash
   npm run supabase:migrations
   ```

The migrations in `supabase/migrations/` create the check-in schema and add the Headspace and reflection fields. There is an optional local sample-data command:

```bash
npm run seed
```

The production demo does not use this seed. It creates its own browser-only sample data.

### CONFIGURE ENVIRONMENT VARIABLES

Copy the server example into an untracked environment file:

```bash
cp server/.env.example server/.env
```

For the client, create `client/.env.local` with:

```env
VITE_API_URL=http://localhost:3001/api
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
```

Update `server/.env` with your own values:

```env
PORT=3001
DATABASE_URL=postgresql://postgres.PROJECT_REF:PASSWORD@POOLER_HOST:6543/postgres
DB_POOL_MAX=5
CLIENT_ORIGIN=http://localhost:5173
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
OWNER_USER_ID=YOUR_SUPABASE_AUTH_USER_UUID
```

For local development, `OWNER_USER_ID` is the UUID of the Supabase Auth user who is allowed to access the real journal. Never commit passwords, OAuth secrets, or real environment files.

### START THE APP

Start both services together:

```bash
npm run dev
```

Or run them separately in two terminals:

```bash
npm run dev:server   # API on http://localhost:3001
npm run dev:client   # client on http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173). The API health endpoint should return `{ "status": "ok" }` at [http://localhost:3001/api/health](http://localhost:3001/api/health).

## HOW TO USE DIALED

### TODAY — DAILY CHECK-IN

Choose the date and enter the day’s weight, targets, food intake, and steps. Select one of the three Headspace states, then expand the optional details when you want to record energy, hunger, sleep, training, a challenge, a win, or a reflection.

Press **Log check-in** to save. Saving the same date updates that date’s existing entry instead of creating a duplicate. The settings control lets you choose default targets, units, goal weights, training status, and reflection-prompt behavior.

### DASHBOARD — PROGRESS AT A GLANCE

Dashboard summarizes the journal with the current streak, on-target days, calorie consistency, weight trend, goal progress, step consistency, and Recent Patterns. The weekly reflection summary reviews the latest seven logs and highlights common Headspace, challenges, wins, and a suggested focus for the next week.

### HISTORY — REVIEW AND EDIT THE JOURNAL

History lists saved check-ins so you can review the full nutrition, movement, Headspace, and reflection details. Use the date controls to find an entry and delete it when it is no longer wanted.

## ARCHITECTURE

The React/Vite client is served from Vercel and uses Supabase Auth for the GitHub sign-in flow. The client calls the Express API using `VITE_API_URL`. The API validates the Supabase bearer token, checks the configured owner UUID, and reads or writes check-ins in PostgreSQL through Supabase. CORS is limited to the configured client origin. The browser-only demo uses a separate local-data service and does not use this API path.

## DEPLOYMENT

DIALED is deployed as two Vercel projects from this repository:

- **Client:** root directory `client`, live at `https://dialed-kappa.vercel.app/`.
- **API:** root directory `server`, live at `https://dialed-api.vercel.app/`.

The client calls the API through `VITE_API_URL`. The API uses Supabase Auth bearer tokens and accepts real journal requests only for the configured `OWNER_USER_ID`; `/api/health` remains public for monitoring. See [DEPLOYMENT.md](DEPLOYMENT.md) for GitHub OAuth, Vercel environment variables, Supabase URLs, owner setup, and verification steps.

Every push to the connected `main` branch triggers a new Vercel deployment. After changing environment variables, redeploy the affected Vercel project because those values are applied at build/deployment time.

## API ENDPOINTS

| METHOD | PATH | PURPOSE |
| --- | --- | --- |
| `GET` | `/api/health` | Public API health response. |
| `GET` | `/api/auth/me` | Confirms the signed-in owner session. |
| `GET` | `/api/checkins` | Lists saved check-ins, newest first. |
| `GET` | `/api/checkins/:date` | Returns one check-in for a `YYYY-MM-DD` date. |
| `POST` | `/api/checkins` | Creates or updates a daily check-in. |
| `DELETE` | `/api/checkins/:id` | Deletes a check-in by ID. |

Check-in routes require a valid Supabase session belonging to the configured owner.

## PROJECT STRUCTURE

```text
DIALED/
|-- client/                  # React + Vite frontend
|   |-- logo/                # Logo and favicon assets
|   `-- src/
|       |-- components/      # Reusable UI components
|       |-- context/         # Auth and journal state
|       |-- pages/           # Today, Dashboard, History, Settings
|       |-- services/        # Supabase and API clients
|       |-- styles/          # Responsive visual system
|       `-- utils/           # Date and check-in helpers
|-- server/                  # Express API and PostgreSQL access
|   |-- src/controllers/     # Validation and database operations
|   |-- src/routes/          # API route definitions
|   `-- seed.js              # Optional local sample data
|-- supabase/migrations/     # Versioned database schema
|-- screenshots/             # README preview images
|-- DEPLOYMENT.md            # Production setup and verification
|-- AI-USAGE.md              # AI-assistance disclosure
|-- REPOSITORY_GUIDE.md      # Detailed file and flow guide
`-- README.md                # Project documentation
```

## SCREENSHOTS

### DESKTOP VIEWS — DARK MODE

<table>
  <tr>
    <td align="center"><img src="screenshots/today-checkin-desktop-dark.png" alt="DIALED Today daily check-in — desktop dark mode" width="360"><br><strong>Today — desktop (dark mode)</strong></td>
    <td align="center"><img src="screenshots/dashboard-desktop-dark.png" alt="DIALED Dashboard progress overview — desktop dark mode" width="360"><br><strong>Dashboard — desktop (dark mode)</strong></td>
  </tr>
  <tr>
    <td align="center"><img src="screenshots/history-desktop-dark.png" alt="DIALED History — desktop dark mode" width="360"><br><strong>History — desktop (dark mode)</strong></td>
    <td align="center"><img src="screenshots/settings-desktop-dark.png" alt="DIALED Settings — desktop dark mode" width="360"><br><strong>Settings — desktop (dark mode)</strong></td>
  </tr>
</table>

The desktop views show the full check-in flow, progress summaries, history filters and saved reflections, plus the default targets and preferences.

### MOBILE VIEWS — LIGHT MODE

<table>
  <tr>
    <td align="center"><img src="screenshots/today-checkin-mobile-light.png" alt="DIALED Today daily check-in — mobile light mode" width="180"><br><strong>Today — mobile (light mode)</strong></td>
    <td align="center"><img src="screenshots/dashboard-mobile-light.png" alt="DIALED Dashboard progress overview — mobile light mode" width="180"><br><strong>Dashboard — mobile (light mode)</strong></td>
  </tr>
  <tr>
    <td align="center"><img src="screenshots/history-mobile-light.png" alt="DIALED History — mobile light mode" width="180"><br><strong>History — mobile (light mode)</strong></td>
    <td align="center"><img src="screenshots/settings-mobile-light.png" alt="DIALED Settings — mobile light mode" width="180"><br><strong>Settings — mobile (light mode)</strong></td>
  </tr>
</table>

The mobile views show the responsive layout in light mode. Captions identify the screen, viewport, and theme so the screenshots are easy to compare.

## KNOWN LIMITATIONS AND NEXT STEPS

- Preferences are stored in the current browser and do not yet sync between devices.
- The production journal currently supports one configured owner rather than general multi-user ownership.
- The demo is intentionally separate from real data and should not be treated as a database seed.
- Future work could add broader account support, per-user ownership, and additional reflection or trend analysis.

## AI USE

DIALED was built with OpenAI Codex assistance for implementation support, debugging, testing, deployment guidance, and interface refinement. The product direction, daily cutting-journal workflow, feature decisions, visual decisions, and final testing remained human-directed. See [AI-USAGE.md](AI-USAGE.md) for the detailed disclosure and commit links.

## LICENCE

MIT, see [LICENSE](https://github.com/carljer000/DIALED/blob/main/LICENSE).
