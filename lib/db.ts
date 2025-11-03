// Unified database adapter - uses Vercel Postgres on Vercel, SQLite locally
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { sql } from '@vercel/postgres';

// Check if we're in a serverless environment (Vercel)
const isServerless = process.env.VERCEL === '1' || process.env.POSTGRES_URL;

let db: Database.Database | null = null;
let dbQueries: {
  getAllNotes: Database.Statement;
  getNoteById: Database.Statement;
  createNote: Database.Statement;
  updateNote: Database.Statement;
  deleteNote: Database.Statement;
} | null = null;

// Initialize Vercel Postgres schema
async function initVercelPostgres() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS notes (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
  } catch (error: any) {
    // Table might already exist, ignore error
    if (!error.message?.includes('already exists')) {
      console.error('Schema initialization error:', error);
    }
  }
}

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

// Unified query interface
export async function getAllNotes() {
  if (isServerless) {
    await initVercelPostgres();
    const result = await sql`SELECT * FROM notes ORDER BY updated_at DESC`;
    return result.rows.map((row: any) => ({
      id: row.id as number,
      title: row.title as string,
      content: row.content as string,
      created_at: row.created_at as string,
      updated_at: row.updated_at as string,
    }));
  } else {
    const queries = getDbQueries();
    return queries.getAllNotes.all() as any[];
  }
}

export async function getNoteById(id: number) {
  if (isServerless) {
    await initVercelPostgres();
    const result = await sql`SELECT * FROM notes WHERE id = ${id}`;
    
    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      id: row.id as number,
      title: row.title as string,
      content: row.content as string,
      created_at: row.created_at as string,
      updated_at: row.updated_at as string,
    };
  } else {
    const queries = getDbQueries();
    return queries.getNoteById.get(id) as any;
  }
}

export async function createNote(title: string, content: string) {
  if (isServerless) {
    await initVercelPostgres();
    const result = await sql`
      INSERT INTO notes (title, content) 
      VALUES (${title}, ${content}) 
      RETURNING *
    `;
    
    if (result.rows.length === 0) {
      throw new Error('Failed to create note');
    }

    const row = result.rows[0];
    return {
      id: row.id as number,
      title: row.title as string,
      content: row.content as string,
      created_at: row.created_at as string,
      updated_at: row.updated_at as string,
    };
  } else {
    const queries = getDbQueries();
    const result = queries.createNote.run(title, content);
    return queries.getNoteById.get(result.lastInsertRowid) as any;
  }
}

export async function updateNote(id: number, title: string, content: string) {
  if (isServerless) {
    await initVercelPostgres();
    const result = await sql`
      UPDATE notes 
      SET title = ${title}, content = ${content}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ${id}
      RETURNING *
    `;
    
    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      id: row.id as number,
      title: row.title as string,
      content: row.content as string,
      created_at: row.created_at as string,
      updated_at: row.updated_at as string,
    };
  } else {
    const queries = getDbQueries();
    queries.updateNote.run(title, content, id);
    return queries.getNoteById.get(id) as any;
  }
}

export async function deleteNote(id: number) {
  if (isServerless) {
    await initVercelPostgres();
    await sql`DELETE FROM notes WHERE id = ${id}`;
  } else {
    const queries = getDbQueries();
    queries.deleteNote.run(id);
  }
}

// Legacy support for synchronous queries (local only)
export function getDbQueries() {
  if (isServerless) {
    throw new Error('Synchronous queries not supported in serverless environment. Use async functions instead.');
  }
  if (!dbQueries) {
    getDb();
  }
  if (!dbQueries) {
    throw new Error('Database queries not initialized');
  }
  return dbQueries;
}

export default getDb;
