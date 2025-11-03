# Next.js Noteboard

A simple noteboard application built with Next.js, featuring a rich text editor and SQLite database persistence.

## Features

- ✅ Rich text editor with formatting (bold, italic, underline, headers, lists, colors, links)
- ✅ Create, read, update, and delete notes
- ✅ SQLite database for persistent storage
- ✅ Beautiful UI with Tailwind CSS
- ✅ No authentication required - anyone can post

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database

The SQLite database is stored in the `data/notes.db` file. The database file is currently tracked in git, which means it will persist across code pushes. However, this approach has limitations:

- **Local Development**: Works great - the database persists in your local `data/` directory
- **Git Tracking**: Currently the database is committed to git, which allows persistence but can cause issues as it grows
- **Production Deployments**: Most hosting platforms (Vercel, Netlify) use ephemeral filesystems, so file-based databases won't persist. For production, consider using a hosted database service like Supabase, PlanetScale, or AWS RDS.

To exclude the database from git (recommended for production), uncomment the line in `.gitignore`:
```
/data/notes.db
```

## Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Quill (react-quill)** - Rich text editor
- **better-sqlite3** - SQLite database

## Project Structure

```
├── app/
│   ├── api/notes/          # API routes for notes
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Main page
├── components/
│   ├── RichTextEditor.tsx  # Rich text editor component
│   └── NoteCard.tsx        # Note card component
├── lib/
│   └── db.ts              # Database setup and queries
├── types/
│   └── index.ts           # TypeScript types
└── data/
    └── notes.db           # SQLite database (created automatically)
```

