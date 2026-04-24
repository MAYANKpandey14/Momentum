# Momentum

Mobile-first Habit + Workout + Journal MVP built with React, Tailwind, Supabase Auth, Postgres RLS, and Deno Edge Functions.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy environment placeholders:

   ```bash
   Copy-Item .env.example .env.local
   ```

3. Add your Supabase values:

   ```txt
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_ANON_KEY=...
   ```

4. Apply Supabase migrations and deploy/serve functions with the Supabase CLI:

   ```bash
   npx supabase db push
   npx supabase functions deploy toggle-habit
   npx supabase functions deploy save-workout
   npx supabase functions deploy save-journal
   npx supabase functions deploy sync-daily-score
   ```

5. Run the app:

   ```bash
   npm run dev
   ```

## Edge Function Secrets

Set these secrets in Supabase for deployed functions:

```txt
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

The service role key is only used inside Edge Functions.
