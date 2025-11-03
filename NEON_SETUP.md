# Neon Postgres Setup Guide

This guide will help you connect your noteboard application to Neon Postgres.

## Step 1: Get Your Neon Connection String

You've already received your Neon connection strings. Here's what you need:

### For Vercel Deployment (Recommended):
Use the **POSTGRES_URL** from your Neon dashboard:
```
POSTGRES_URL=postgresql://neondb_owner:npg_sSXEanV6v4Id@ep-cold-feather-a459gugj-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
```

### For Local Development:
Create a `.env.local` file in your project root:
```bash
POSTGRES_URL=postgresql://neondb_owner:npg_sSXEanV6v4Id@ep-cold-feather-a459gugj-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
```

## Step 2: Set Environment Variables in Vercel

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add the following variables:

   **Variable Name:** `POSTGRES_URL`  
   **Value:** `postgresql://neondb_owner:npg_sSXEanV6v4Id@ep-cold-feather-a459gugj-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require`  
   **Environment:** Production, Preview, Development

5. Click **Save**

## Step 3: Deploy

1. Push your code to GitHub (if not already done):
```bash
git add .
git commit -m "Add Neon Postgres support"
git push
```

2. Vercel will automatically:
   - Build and deploy your app
   - Use the POSTGRES_URL environment variable
   - Connect to your Neon database

## Step 4: Verify

After deployment:
1. Visit your Vercel deployment URL
2. Create a test note
3. Refresh the page - the note should persist
4. Check your Neon dashboard to see the data

## Local Development

### Option A: Use Neon Postgres Locally

1. Create `.env.local` file:
```bash
POSTGRES_URL=postgresql://neondb_owner:npg_sSXEanV6v4Id@ep-cold-feather-a459gugj-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
```

2. Run your dev server:
```bash
npm run dev
```

### Option B: Use SQLite Locally (Default)

If you don't set `POSTGRES_URL` in `.env.local`, the app will automatically use SQLite for local development.

## Database Schema

The following table is created automatically on first use:

```sql
CREATE TABLE IF NOT EXISTS notes (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Troubleshooting

### Error: "PostgreSQL connection string not found"
- Make sure `POSTGRES_URL` is set in your Vercel environment variables
- For local development, check that `.env.local` exists and contains `POSTGRES_URL`

### Error: "relation 'notes' does not exist"
- The table is created automatically on first use
- Check Neon dashboard → Query to verify the table exists
- You can also manually create it using the SQL above

### Connection timeout errors
- Try using `POSTGRES_URL_NON_POOLING` instead for serverless functions
- Check that your Neon project is active (free tier pauses after inactivity)

### SSL connection errors
- Make sure `?sslmode=require` is in your connection string
- Neon requires SSL connections

## Your Neon Connection Details

**Pooled Connection (Recommended):**
```
POSTGRES_URL=postgresql://neondb_owner:npg_sSXEanV6v4Id@ep-cold-feather-a459gugj-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
```

**Non-Pooled Connection (For migrations/special cases):**
```
POSTGRES_URL_NON_POOLING=postgresql://neondb_owner:npg_sSXEanV6v4Id@ep-cold-feather-a459gugj.us-east-1.aws.neon.tech/neondb?sslmode=require
```

## Security Notes

⚠️ **Important:** Never commit your `.env.local` file to git. It's already in `.gitignore`.

⚠️ Keep your connection strings secure. If exposed, rotate your password in the Neon dashboard.

## Neon Dashboard

- Access your Neon dashboard: https://console.neon.tech
- View your database, run queries, and monitor usage
- Free tier includes generous limits for development

## Support

- Neon Docs: https://neon.tech/docs
- Neon Discord: https://discord.gg/neondatabase

