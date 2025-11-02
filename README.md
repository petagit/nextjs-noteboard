# Next.js Noteboard

A simple noteboard application built with Next.js, featuring a rich text editor and SQLite database persistence.

## Features

- ✅ Rich text editor with formatting (bold, italic, underline)
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

The SQLite database is stored in the `data/notes.db` file. This file persists across code pushes and will not be included in git (though the directory structure is maintained).

## Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Slate.js** - Rich text editor
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

