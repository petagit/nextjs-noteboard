import { NextRequest, NextResponse } from 'next/server';
import { getNotes, createNote } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'main';
    const notes = await getNotes(type);
    return NextResponse.json(notes);
  } catch (error: any) {
    console.error('Error fetching notes:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch notes',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, type } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const note = await createNote(title, content, type || 'main');
    return NextResponse.json(note, { status: 201 });
  } catch (error: any) {
    console.error('Error creating note:', error);
    return NextResponse.json(
      {
        error: 'Failed to create note',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
