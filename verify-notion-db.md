# Verify Your Notion Database Setup

To sync notes from your noteboard to Notion, your database needs:

## ✅ Required Setup

### 1. **Title Property** (CRITICAL)
Your database **must** have a property named **"Title"** (or "Name" in some cases).

**How to check:**
- Open your "Costight links database"
- Look at the column headers at the top
- There should be a column called **"Title"** or **"Name"**
- This is usually the first column and is required for creating pages

**If missing:**
- Click the "+" button to add a new property
- Select **"Title"** type
- This will become the page title when syncing

### 2. **Integration Connected**
Your "Noteboard Sync" integration must be connected to the database.

**How to check:**
- In your database, click the **"..."** menu (top right)
- Go to **"Connections"** → **"Add connections"**
- Your "Noteboard Sync" integration should be listed
- If not connected, add it now

### 3. **Database ID Format**
The Database ID should be 32 characters (with or without hyphens).

**How to get it:**
1. Open your database in a web browser
2. Look at the URL - it will be like:
   ```
   https://www.notion.so/workspace/a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6?v=...
   ```
3. The 32-character string after the last `/` and before `?v=` is your Database ID
4. You can use it with or without hyphens

**Example:**
- With hyphens: `a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6`
- Without hyphens: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`
- Both work!

## Quick Checklist

- [ ] Database has a "Title" property column
- [ ] "Noteboard Sync" integration is connected to the database
- [ ] You have the Database ID (32 characters)
- [ ] You have the Integration Token (starts with `ntn_` or `secret_`)

## Common Issues

### Issue: "Validation error: property title is missing"
**Solution:** Add a "Title" property to your database

### Issue: "Database not found" or "Unauthorized"
**Solution:** 
1. Make sure the integration is connected to the database
2. Verify the Database ID is correct
3. Check that you're using the right integration token

### Issue: Database shows "New database"
**Solution:** This is normal - it means the database is empty. You can still sync to it. Just make sure:
- It has a Title property
- The integration is connected

## Test Your Setup

Once everything is configured:
1. Go to your noteboard app
2. Click "同步 Notion (Sync Notion)"
3. Enter your token (`ntn_...`) and Database ID
4. Click "开始同步 (Start Sync)"
5. Check your Notion database - you should see new pages appear!




