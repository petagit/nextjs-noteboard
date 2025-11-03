# Deployment Guide

## Important: SQLite Database Limitations

This application uses `better-sqlite3` which requires:
- Native bindings that must be compiled for the target platform
- A persistent filesystem to store the database file

## Compatible Deployment Platforms

### ✅ Recommended Platforms (with persistent storage):

1. **Railway** - Full support for SQLite
   - Database persists in `/data` directory
   - Native bindings compile automatically
   - https://railway.app

2. **Render** - Supports persistent disks
   - Add a persistent disk for the `/data` directory
   - https://render.com

3. **DigitalOcean App Platform** - Supports persistent storage
   - Configure persistent volume for `/data`
   - https://www.digitalocean.com/products/app-platform

4. **Fly.io** - Supports volumes
   - Mount a volume for persistent storage
   - https://fly.io

5. **Self-hosted VPS** - Full control
   - Works perfectly on any VPS with Node.js

### ❌ Platforms with Limitations:

- **Vercel** - Ephemeral filesystem, database won't persist
- **Netlify** - Ephemeral filesystem, database won't persist
- **AWS Lambda** - Ephemeral filesystem, native bindings may not work

## Deployment Steps for Railway (Recommended)

1. Push your code to GitHub
2. Go to https://railway.app
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Railway will automatically detect Next.js and deploy
6. The `/data` directory will persist across deployments

## Deployment Steps for Render

1. Push your code to GitHub
2. Go to https://render.com
3. Create a new "Web Service"
4. Connect your GitHub repository
5. Build command: `npm install && npm run build`
6. Start command: `npm start`
7. Add a persistent disk for `/data` directory in settings

## Troubleshooting

### Database initialization errors

If you see errors like "Database initialization failed", check:

1. **Platform supports native modules**: Ensure your platform can compile native Node.js modules
2. **Persistent storage**: Verify the `/data` directory persists across deployments
3. **Build logs**: Check build logs for compilation errors with better-sqlite3

### Error: "Module not found" or "Cannot find module better-sqlite3"

This usually means:
- Native bindings didn't compile correctly
- Platform doesn't support native modules
- Try a different deployment platform (Railway recommended)

## Alternative: Using a Cloud Database

For platforms like Vercel/Netlify, consider migrating to:
- **Supabase** (PostgreSQL) - Free tier available
- **PlanetScale** (MySQL) - Free tier available  
- **Turso** (SQLite over LibSQL) - Serverless SQLite alternative

See `DEPLOYMENT_CLOUD_DB.md` for migration guide (if created).

