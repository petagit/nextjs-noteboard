import { NextRequest, NextResponse } from 'next/server';
import { getAllNotes } from '@/lib/db';
import { syncAllNotesToNotion, syncNoteToNotion } from '@/lib/notion';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { notionToken, notionDatabaseId, noteId } = body;

    if (!notionToken || !notionDatabaseId) {
      return NextResponse.json(
        { error: 'Notion token and database ID are required' },
        { status: 400 }
      );
    }

    if (noteId) {
      // Sync single note
      const { getNoteById } = await import('@/lib/db');
      const note = await getNoteById(noteId);
      
      if (!note) {
        return NextResponse.json(
          { error: 'Note not found' },
          { status: 404 }
        );
      }

      const notionPageId = await syncNoteToNotion(note, notionDatabaseId, notionToken);
      
      return NextResponse.json({
        success: true,
        notionPageId,
        message: `Note "${note.title}" synced to Notion successfully`,
      });
    } else {
      // Sync all notes
      const notes = await getAllNotes();
      
      if (notes.length === 0) {
        return NextResponse.json(
          { error: 'No notes to sync' },
          { status: 400 }
        );
      }

      const result = await syncAllNotesToNotion(notes, notionDatabaseId, notionToken);
      
      return NextResponse.json({
        success: true,
        synced: result.success,
        failed: result.failed,
        errors: result.errors,
        message: `Synced ${result.success} note(s) to Notion. ${result.failed} failed.`,
      });
    }
  } catch (error: any) {
    console.error('Error syncing to Notion:', error);
    return NextResponse.json(
      {
        error: 'Failed to sync to Notion',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

