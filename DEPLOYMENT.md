# Deploying DIALED to Vercel

DIALED uses two Vercel projects from the same GitHub repository:

- **DIALED client** — Root Directory: `client`
- **DIALED API** — Root Directory: `server`

The client presents GitHub owner access and an isolated browser-only demo. The API accepts database requests only when a valid Supabase session belongs to the configured owner UUID.

## 1. Configure GitHub OAuth

1. In Supabase, open **Authentication → Sign In / Providers → GitHub** and copy the callback URL. It looks like `https://PROJECT_REF.supabase.co/auth/v1/callback`.
2. In GitHub, open **Settings → Developer settings → OAuth Apps → New OAuth App**.
3. Use the production Vercel client URL as the homepage URL.
4. Use the Supabase callback URL from step 1 as the authorization callback URL.
5. Generate the GitHub client secret and enter the client ID and secret in Supabase's GitHub provider settings. Do not put the secret in this repository or in a `VITE_` variable.
6. In Supabase **Authentication → URL Configuration**, set the Site URL to the production client URL. Add `http://localhost:5173/**` for local development and the required Vercel preview pattern only if preview OAuth is needed.

## 2. Deploy the API project

Import the GitHub repository in Vercel and set **Root Directory** to `server`. Vercel detects the default Express export in `src/app.js`.

Add these Production environment variables:

```env
NODE_ENV=production
DATABASE_URL=postgresql://postgres.PROJECT_REF:PASSWORD@POOLER_HOST:6543/postgres
DB_POOL_MAX=1
CLIENT_ORIGIN=https://YOUR-CLIENT.vercel.app
SUPABASE_URL=https://PROJECT_REF.supabase.co
SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
OWNER_USER_ID=YOUR_SUPABASE_AUTH_USER_UUID
```

Use the **Transaction pooler** connection string from Supabase for Vercel. Keep `DB_POOL_MAX=1` because each warm serverless instance maintains its own pool.

The API's `/api/health` endpoint stays public for health checks. `/api/auth/me` and every `/api/checkins` route require the owner's bearer token.

## 3. Find the owner UUID

Temporarily deploy the client without `OWNER_USER_ID`, complete one GitHub sign-in, then find the account under **Supabase → Authentication → Users**. Copy its UUID—not the GitHub username—into the API project's `OWNER_USER_ID` variable and redeploy the API.

An alternative is to complete the first GitHub sign-in locally after adding the client variables, then copy the same UUID from Supabase.

## 4. Deploy the client project

Import the same repository again and set **Root Directory** to `client`. Use the Vite defaults:

- Build command: `npm run build`
- Output directory: `dist`

Add these Production environment variables:

```env
VITE_API_URL=https://YOUR-API.vercel.app/api
VITE_SUPABASE_URL=https://PROJECT_REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
```

`client/vercel.json` routes direct visits such as `/dashboard` and `/history` back to the React application.

## 5. Verify before sharing

1. Open the production client in a private window.
2. Choose **Try demo**, add and delete an entry, refresh, then reset the demo.
3. Confirm none of those actions appear in Supabase.
4. Exit the demo and sign in with the owner's GitHub account; confirm the real logs appear.
5. Sign out and try another GitHub account; it must receive the unauthorized-account message and no logs.
6. Send an unauthenticated request to `https://YOUR-API.vercel.app/api/checkins`; it must return HTTP `401`.
7. Confirm `server/.env`, the database password, and the GitHub OAuth secret are absent from GitHub and Vercel build logs.

The demo is intentionally public because it contains invented data and never reaches the API. Only the GitHub-authenticated owner UUID can access the real journal.
