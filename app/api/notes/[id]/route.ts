import { NextRequest, NextResponse } from 'next/server';
import { getDbQueries } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const dbQueries = getDbQueries();
    const note = dbQueries.getNoteById.get(parseInt(params.id));
    
    if (!note) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(note);
  } catch (error: any) {
    console.error('Error fetching note:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch note',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { title, content } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const dbQueries = getDbQueries();
    dbQueries.updateNote.run(title, content, parseInt(params.id));
    const note = dbQueries.getNoteById.get(parseInt(params.id));

    return NextResponse.json(note);
  } catch (error: any) {
    console.error('Error updating note:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update note',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const dbQueries = getDbQueries();
    dbQueries.deleteNote.run(parseInt(params.id));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting note:', error);
    return NextResponse.json(
      { 
        error: 'Failed to delete note',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

