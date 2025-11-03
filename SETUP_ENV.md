# Quick Setup: Neon Postgres

## Step 1: Create `.env.local` for Local Development

Create a file named `.env.local` in the project root with:

```bash
POSTGRES_URL=postgresql://neondb_owner:npg_sSXEanV6v4Id@ep-cold-feather-a459gugj-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
```

## Step 2: Set Environment Variable in Vercel

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add:
   - **Name:** `POSTGRES_URL`
   - **Value:** `postgresql://neondb_owner:npg_sSXEanV6v4Id@ep-cold-feather-a459gugj-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require`
   - **Environments:** Production, Preview, Development
5. Click **Save**
6. Redeploy your project

## Step 3: Test

After deployment, create a note - it will be stored in Neon Postgres!

## Notes

- For local dev without Postgres, delete `.env.local` to use SQLite
- The database table is created automatically on first use
- See `NEON_SETUP.md` for detailed instructions

