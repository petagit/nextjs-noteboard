'use client';

import React, { useState, useEffect } from 'react';
import RichTextEditor from '@/components/RichTextEditor';
import NoteCard from '@/components/NoteCard';
import { Note } from '@/types';

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await fetch('/api/notes');
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      alert('Please enter both title and content');
      return;
    }

    setIsLoading(true);
    try {
      if (selectedNote) {
        // Update existing note
        await fetch(`/api/notes/${selectedNote.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, content }),
        });
      } else {
        // Create new note
        await fetch('/api/notes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, content }),
        });
      }
      
      setTitle('');
      setContent('');
      setSelectedNote(null);
      fetchNotes();
    } catch (error) {
      console.error('Error saving note:', error);
      alert('Failed to save note');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectNote = (note: Note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
  };

  const handleDeleteNote = async (id: number) => {
    try {
      await fetch(`/api/notes/${id}`, {
        method: 'DELETE',
      });
      if (selectedNote?.id === id) {
        setSelectedNote(null);
        setTitle('');
        setContent('');
      }
      fetchNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('Failed to delete note');
    }
  };

  const handleNewNote = () => {
    setSelectedNote(null);
    setTitle('');
    setContent('');
  };

  const convertHtmlToMarkdown = (html: string): string => {
    if (!html) return '';
    
    // Simple HTML to Markdown converter
    let markdown = html
      // Headers
      .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n')
      .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n')
      .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n')
      .replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n')
      .replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1\n\n')
      .replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1\n\n')
      // Bold
      .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
      .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
      // Italic
      .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
      .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
      // Underline (not standard markdown, but we'll keep it as-is)
      .replace(/<u[^>]*>(.*?)<\/u>/gi, '$1')
      // Links
      .replace(/<a[^>]*href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gi, '[$2]($1)')
      // Lists
      .replace(/<ul[^>]*>/gi, '\n')
      .replace(/<\/ul>/gi, '\n')
      .replace(/<ol[^>]*>/gi, '\n')
      .replace(/<\/ol>/gi, '\n')
      .replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n')
      // Paragraphs
      .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
      .replace(/<div[^>]*>(.*?)<\/div>/gi, '$1\n')
      // Line breaks
      .replace(/<br[^>]*>/gi, '\n')
      // Remove remaining HTML tags
      .replace(/<[^>]*>/g, '')
      // Decode HTML entities
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      // Clean up extra whitespace
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    return markdown;
  };

  const handleExportAll = () => {
    if (notes.length === 0) {
      alert('No notes to export');
      return;
    }

    // Create markdown content
    let markdown = `# Noteboard Export\n\n`;
    markdown += `Exported on: ${new Date().toLocaleString()}\n\n`;
    markdown += `Total notes: ${notes.length}\n\n`;
    markdown += `---\n\n`;

    notes.forEach((note, index) => {
      const createdDate = new Date(note.created_at).toLocaleString();
      const updatedDate = new Date(note.updated_at).toLocaleString();
      markdown += `## ${note.title}\n\n`;
      markdown += `*Created: ${createdDate}*\n`;
      markdown += `*Last updated: ${updatedDate}*\n\n`;
      markdown += `${convertHtmlToMarkdown(note.content)}\n\n`;
      markdown += `---\n\n`;
    });

    // Create blob and download
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `noteboard-export-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Noteboard</h1>
          <p className="text-gray-600">Create and manage your notes</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Notes List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Notes</h2>
                <div className="flex gap-2">
                  {notes.length > 0 && (
                    <button
                      onClick={handleExportAll}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                      title="Export all notes as Markdown"
                    >
                      Export .md
                    </button>
                  )}
                  <button
                    onClick={handleNewNote}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    New Note
                  </button>
                </div>
              </div>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {notes.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No notes yet. Create your first note!</p>
                ) : (
                  notes.map((note) => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      onSelect={handleSelectNote}
                      onDelete={handleDeleteNote}
                    />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Editor */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-4">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Note title..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xl font-semibold"
                />
              </div>
              {selectedNote && (
                <div className="mb-4 flex gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium text-gray-700">Created:</span>{' '}
                    {new Date(selectedNote.created_at).toLocaleString()}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Updated:</span>{' '}
                    {new Date(selectedNote.updated_at).toLocaleString()}
                  </div>
                </div>
              )}
              <div className="mb-4">
                <RichTextEditor value={content} onChange={setContent} />
              </div>
              <div className="flex justify-end gap-2">
                {selectedNote && (
                  <button
                    onClick={handleNewNote}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                )}
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Saving...' : selectedNote ? 'Update' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

