# Notion Integration Setup Guide

This guide will help you sync your notes from the noteboard to Notion, where each note becomes a page in your Notion database.

## Step 1: Create a Notion Integration

1. Go to https://www.notion.so/my-integrations
2. Click **"+ New integration"**
3. Fill in the details:
   - **Name**: Noteboard Sync (or any name you prefer)
   - **Logo**: Optional
   - **Associated workspace**: Select your workspace
4. Click **"Submit"**
5. Copy the **Internal Integration Token** (starts with `secret_`)
   - ⚠️ Keep this token secure! It's like a password.

## Step 2: Create a Notion Database

1. Open Notion and create a new page or go to an existing page
2. Type `/database` and select **"Table - Inline"** or **"Table - Full page"**
3. A new database will be created
4. You can customize the columns, but make sure there's a **"Title"** column (this is default)

## Step 3: Connect Integration to Database

1. Click the **"..."** menu (three dots) in the top right of your database
2. Select **"Connections"** → **"Add connections"**
3. Find and select your integration (e.g., "Noteboard Sync")
4. Click **"Confirm"**

## Step 4: Get Your Database ID

1. Open your Notion database in a web browser
2. Look at the URL - it will look like:
   ```
   https://www.notion.so/workspace/DATABASE_ID?v=...
   ```
3. The **Database ID** is the 32-character string in the URL (without hyphens)
   - Example: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`
   - It might also appear with hyphens: `a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6`
   - Use the version **without hyphens** (32 characters total)

### Alternative: Get Database ID from Database Settings

1. Open your database
2. Click the **"..."** menu → **"Settings"**
3. Scroll down to see the **"Database ID"** or check the URL

## Step 5: Sync Your Notes

1. In your noteboard app, click the **"同步 Notion (Sync Notion)"** button
2. Enter your **Notion Integration Token** (from Step 1)
3. Enter your **Notion Database ID** (from Step 4)
4. Click **"开始同步 (Start Sync)"**
5. All your notes will be synced to Notion as pages!

## How It Works

- Each note from your noteboard becomes a **page** in your Notion database
- The note **title** becomes the page title
- The note **content** (HTML) is converted to Notion blocks (paragraphs)
- Created and updated dates are preserved in the content

## Notes Format in Notion

When synced to Notion, each note appears as:
- **Page Title**: The note title
- **Page Content**: The note content converted to Notion blocks
  - HTML formatting is stripped
  - Content is split into paragraphs
  - Lists and basic formatting are preserved

## Troubleshooting

### Error: "Failed to sync to Notion"

**Common causes:**
1. **Invalid Token**: Make sure you copied the full token starting with `secret_`
2. **Invalid Database ID**: Check that the ID is exactly 32 characters (no hyphens)
3. **Integration not connected**: Make sure you connected the integration to the database (Step 3)
4. **Database permissions**: Ensure the integration has access to create pages

### Error: "notion.pages.create is not supported for this parent type"

- Make sure you're using a **Database ID**, not a Page ID
- The database must have a **Title** property (this is default)

### Notes not appearing in Notion

1. Check the sync status message - it will tell you how many succeeded/failed
2. Verify the database ID is correct
3. Make sure the integration is connected to the database
4. Check browser console for detailed error messages

## Security Best Practices

⚠️ **Important Security Notes:**

1. **Never commit your Notion token to git** - it's already in `.gitignore`
2. **Don't share your integration token** - it has full access to your Notion workspace
3. **Use environment variables** for production deployments:
   ```bash
   NOTION_TOKEN=secret_...
   NOTION_DATABASE_ID=your-database-id
   ```
4. **Rotate tokens** if exposed - go to integrations page and create a new one

## One-Way Sync

**Note**: Currently, this is a **one-way sync** (Noteboard → Notion). 
- Syncing again will create **duplicate pages** in Notion
- To avoid duplicates, sync once or manually delete synced pages before re-syncing
- Future versions may include two-way sync and duplicate detection

## API Rate Limits

Notion API has rate limits:
- **3 requests per second** per integration
- The sync function handles multiple notes sequentially to avoid rate limits
- Large numbers of notes may take some time to sync

## Support

- Notion API Docs: https://developers.notion.com
- Notion Integrations: https://www.notion.so/my-integrations
- Report issues: Check your browser console for detailed error messages

