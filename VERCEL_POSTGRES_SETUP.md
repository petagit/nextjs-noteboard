# Vercel Postgres Setup Guide

This guide will help you set up Vercel Postgres for your noteboard application.

## Step 1: Create Vercel Postgres Database

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your project (or create a new one)
3. Go to the **Storage** tab
4. Click **Create Database** → Select **Postgres**
5. Choose a name for your database (e.g., "noteboard-db")
6. Select a region closest to your users
7. Click **Create**

## Step 2: Environment Variables

Vercel will automatically add these environment variables to your project:
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`

These are automatically available in your Vercel deployments.

## Step 3: Local Development Setup

For local development, you have two options:

### Option A: Use SQLite (Current Setup)
The app will automatically use SQLite locally if `POSTGRES_URL` is not set.

### Option B: Use Vercel Postgres Locally
1. In your Vercel dashboard, go to your Postgres database
2. Click on the **.env.local** tab
3. Copy the environment variables
4. Create a `.env.local` file in your project root:
```bash
POSTGRES_URL=your_postgres_url_here
POSTGRES_PRISMA_URL=your_prisma_url_here
POSTGRES_URL_NON_POOLING=your_non_pooling_url_here
```

## Step 4: Deploy

1. Push your code to GitHub:
```bash
git add .
git commit -m "Add Vercel Postgres support"
git push
```

2. Vercel will automatically:
   - Detect the environment variables
   - Build and deploy your app
   - Connect to your Postgres database

## Step 5: Verify

After deployment:
1. Visit your Vercel deployment URL
2. Create a test note
3. Refresh the page - the note should persist
4. Check your Vercel Postgres dashboard to see the data

## Troubleshooting

### Error: "relation 'notes' does not exist"
The table will be created automatically on first use. If you see this error:
1. Check that the database connection is working
2. Look at Vercel function logs for initialization errors
3. The `initVercelPostgres()` function runs automatically on first query

### Error: "Failed to fetch notes"
1. Check your Vercel dashboard → Storage → Postgres → Check connection
2. Verify environment variables are set correctly
3. Check function logs in Vercel dashboard

### Local Development Issues
- Make sure `.env.local` exists if using Postgres locally
- Or remove `POSTGRES_URL` from `.env.local` to use SQLite locally

## Database Schema

The following table is created automatically:

```sql
CREATE TABLE IF NOT EXISTS notes (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Migration from SQLite

If you had data in SQLite:
1. Export your SQLite data
2. Import it into Vercel Postgres using a migration script
3. Or manually recreate your notes in the new database

## Cost

Vercel Postgres has a generous free tier:
- **Hobby Plan**: Free for hobby projects
- **Pro Plan**: Included with Pro plan
- Check https://vercel.com/pricing for current pricing

## Support

- Vercel Postgres Docs: https://vercel.com/docs/storage/vercel-postgres
- Vercel Discord: https://vercel.com/discord

