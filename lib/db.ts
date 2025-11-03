import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

let db: Database.Database | null = null;
let dbQueries: {
  getAllNotes: Database.Statement;
  getNoteById: Database.Statement;
  createNote: Database.Statement;
  updateNote: Database.Statement;
  deleteNote: Database.Statement;
} | null = null;

function getDb(): Database.Database {
  if (db) {
    return db;
  }

  try {
    // Create data directory if it doesn't exist
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const dbPath = path.join(dataDir, 'notes.db');

    // Initialize database
    db = new Database(dbPath);

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
    dbQueries = {
      getAllNotes: db.prepare('SELECT * FROM notes ORDER BY updated_at DESC'),
      getNoteById: db.prepare('SELECT * FROM notes WHERE id = ?'),
      createNote: db.prepare('INSERT INTO notes (title, content) VALUES (?, ?)'),
      updateNote: db.prepare('UPDATE notes SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'),
      deleteNote: db.prepare('DELETE FROM notes WHERE id = ?'),
    };

    return db;
  } catch (error) {
    console.error('Database initialization error:', error);
    throw new Error(
      'Database initialization failed. This may be due to serverless environment limitations. ' +
      'better-sqlite3 requires native bindings and a persistent filesystem.'
    );
  }
}

export function getDbQueries() {
  if (!dbQueries) {
    getDb();
  }
  if (!dbQueries) {
    throw new Error('Database queries not initialized');
  }
  return dbQueries;
}

export default getDb;

