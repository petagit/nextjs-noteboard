import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Create data directory if it doesn't exist
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'notes.db');

// Initialize database
const db = new Database(dbPath);

// Create notes table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Prepare statements for better performance
export const dbQueries = {
  getAllNotes: db.prepare('SELECT * FROM notes ORDER BY updated_at DESC'),
  getNoteById: db.prepare('SELECT * FROM notes WHERE id = ?'),
  createNote: db.prepare('INSERT INTO notes (title, content) VALUES (?, ?)'),
  updateNote: db.prepare('UPDATE notes SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'),
  deleteNote: db.prepare('DELETE FROM notes WHERE id = ?'),
};

export default db;

