# DIALED

[![Made with AI](https://img.shields.io/badge/Made_with-AI_assistance-blue)](AI-USAGE.md)

Built with Codex AI assistance throughout planning, implementation, testing, and interface refinement. See [AI-USAGE.md](AI-USAGE.md) for the full disclosure.

## Overview

DIALED is a daily cutting journal for lifters who want more structure and accountability while following a calorie deficit. It brings weight, calories, protein, steps, Headspace, and daily reflections into one check-in so users can see their consistency and progress over time.

It is designed for gym-goers who already know their calorie and protein targets but can lose motivation or consistency during a cut. The app helps make daily choices visible, rather than relying only on memory or motivation.

## Setup and installation

### Prerequisites

Install the following before running the project:

- Node.js `20.19.0` or newer, with npm.
- A Supabase account and project.
- The Supabase CLI. It is included in the project dependencies after installation.
- A Supabase **Session pooler** connection string.

### Get the code

1. Clone the repository:

   ```bash
   git clone YOUR_REPOSITORY_URL
   ```

2. Enter the project folder:

   ```bash
   cd dialed
   ```

### Install dependencies

Install the root, React client, Express server, and Supabase CLI dependencies:

```bash
npm install
```

### Environment and configuration

Copy `server/.env.example` to `server/.env`, then replace placeholder values with your own Supabase connection details:

```env
PORT=3001
DATABASE_URL=postgresql://postgres.PROJECT_REF:PASSWORD@POOLER_HOST:5432/postgres
DB_POOL_MAX=5
CLIENT_ORIGIN=http://localhost:5173
SOURCE_DATABASE_URL=postgresql://postgres:postgres@localhost:5432/dialed
```

`SOURCE_DATABASE_URL` is optional. It is only used when copying data from an old local database with `npm run db:migrate-data`.

Never commit real database URLs, passwords, or project credentials. Keep them in the untracked `server/.env` file.

### Set up and seed the database

1. Sign in and link the repository to your Supabase project:

   ```bash
   npm run supabase:login
   npm run supabase:link -- --project-ref YOUR_PROJECT_REF
   ```

2. Preview and apply the database migrations:

   ```bash
   npx supabase db push --linked --dry-run
   npm run supabase:push
   ```

3. Confirm that migrations were applied:

   ```bash
   npm run supabase:migrations
   ```

4. Optional: create 21 sample daily check-ins:

   ```bash
   npm run seed
   ```

## How to run it

Start the React client and Express API together:

```bash
npm run dev
```

Open `http://localhost:5173` in a browser. When the app is working, the first screen is the **Stay Dialed** daily check-in form.

The Express API runs on `http://localhost:3001`. Visit `http://localhost:3001/api/health` to check it; it should return:

```json
{ "status": "ok" }
```

The server and client can also be started separately:

```bash
npm run dev:server
npm run dev:client
```

## Features and usage

### Daily check-in

On the **Today** screen, select a date and enter body weight, calorie target, calories eaten, protein target, protein eaten, and steps. Weight can be logged in either kilograms or pounds.

Choose an overall Headspace status: **Low**, **Neutral**, or **Dialed**. The user can also optionally add energy, hunger/cravings, sleep quality, training status, the day's main challenge, a daily win, and a reflection based on a guided prompt.

Select **Log check-in** to save the entry. Saving the same date updates the existing check-in instead of creating a duplicate.

### Personal settings

Open the gear icon on the **Today** screen to set default calorie and protein targets, a daily step goal, preferred weight unit, optional starting and goal weights, default training status, and whether guided reflection prompts appear. These preferences are stored in the current browser and automatically apply to new check-ins; they can still be changed for an individual day.

Use the floating sun/moon control to switch between light and dark mode. The selected theme is saved in the current browser and restored on the next visit.

### Dashboard and history

Use **Dashboard** to see the current streak, on-target days, a 21-day calorie-consistency view, and a weight trend based on the latest 30 days of check-ins. The weight trend follows the selected kg/lb unit.

Dashboard also includes goal progress from the optional starting and goal weights, step-goal consistency, Recent Patterns insights, and a weekly reflection summary. The weekly summary reviews the latest seven logs, including calorie, protein, and step consistency, common Headspace, the main challenge, a daily win, and a suggested focus for the next week. Pattern comparisons only appear when enough check-ins have been recorded.

Use **History** to review past check-ins, including the saved Headspace details and reflections, or delete an entry when needed.

### Current endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | Returns a basic API health response. |
| `GET` | `/api/checkins` | Lists saved check-ins, newest first. |
| `GET` | `/api/checkins/:date` | Returns one check-in using a `YYYY-MM-DD` date. |
| `POST` | `/api/checkins` | Creates or updates a daily check-in. |
| `DELETE` | `/api/checkins/:id` | Deletes a check-in by ID. |

## Project structure

```text
dialed/
|-- client/                     # React + Vite frontend
|   `-- src/
|       |-- components/         # Atoms, molecules, and organisms
|       |-- context/            # Shared check-in state
|       |-- pages/              # Today, Dashboard, History, and Settings screens
|       |-- services/           # API request functions
|       |-- styles/             # Global styling and responsive rules
|       `-- utils/              # Date and check-in helpers
|-- server/                     # Express API and PostgreSQL connection
|   |-- src/controllers/        # Input validation and database operations
|   |-- src/routes/             # API route definitions
|   `-- seed.js                 # Optional sample check-ins
|-- supabase/migrations/        # Versioned database schema changes
|-- screenshots/                # README preview images
|-- REPORT.md                   # Weekly development report
`-- README.md                   # Project documentation
```

## Screenshots

### Today - Daily check-in

![DIALED Today mobile check-in screen](screenshots/today-checkin-mobile.png)

The Today screen records weight, calorie and protein targets, steps, Headspace signals, daily challenges, and reflection notes.

### Dashboard - Progress overview

![DIALED Dashboard mobile screen](screenshots/dashboard-mobile.png)

The Dashboard shows the current streak, on-target days, 21-day calorie consistency, goal progress, step consistency, and the weight-trend area.

### Headspace and Reflection detail

![DIALED Headspace and Reflection check-in](screenshots/headspace-checkin.png)

The Headspace section keeps the DIALED black, white, and red visual system while allowing optional detail when users need it.

## Known issues and next steps

### Known issues

- The Supabase database is deployed, but the React frontend and Express API are possibly not publicly deployed.
- The reflection flow works and now has a weekly summary, but it still needs further streamlining to make it more engaging and cohesive for daily use.

### Next steps

- Add History filters and monthly progress summaries.
- Improve the Headspace and Reflection flow and add more useful insight patterns to Dashboard.
- Research Gemini AI-assisted food tracking, including accuracy, privacy, and cost before possible implementation.
- Possibly deploy the React frontend and Express API so DIALED can work outside local development.

## AI Use

[![Built with AI assistance](https://img.shields.io/badge/Built_with-AI_assistance-blue)](AI-USAGE.md)

This project was built with help from OpenAI Codex for implementation support, debugging, and interface refinement. I chose the daily cutting-journal workflow, directed the feature and visual decisions, tested the app on desktop and mobile, and refined the results through feedback and screenshots. I also wrote and edited the CSS, History filters, and monthly dashboard summary described in the project record.

The full disclosure, including commit links, is in [AI-USAGE.md](AI-USAGE.md).


