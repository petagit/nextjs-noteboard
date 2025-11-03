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
  const [showNotionModal, setShowNotionModal] = useState(false);
  const [notionToken, setNotionToken] = useState('');
  const [notionDatabaseId, setNotionDatabaseId] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

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

  const downloadNoteAsMarkdown = (note: Note) => {
    const createdDate = new Date(note.created_at).toLocaleString();
    const updatedDate = new Date(note.updated_at).toLocaleString();
    
    let markdown = `# ${note.title}\n\n`;
    markdown += `*Created: ${createdDate}*\n`;
    markdown += `*Last updated: ${updatedDate}*\n\n`;
    markdown += `${convertHtmlToMarkdown(note.content)}\n`;

    // Create blob and download
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    // Sanitize filename by removing special characters
    const sanitizedTitle = note.title.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    a.download = `${sanitizedTitle}-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSyncToNotion = async () => {
    if (!notionToken || !notionDatabaseId) {
      alert('请填写 Notion Token 和 Database ID (Please fill in Notion Token and Database ID)');
      return;
    }

    setIsSyncing(true);
    try {
      const response = await fetch('/api/notion/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notionToken,
          notionDatabaseId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to sync');
      }

      alert(`成功同步 ${data.synced} 条笔记到 Notion\n成功: ${data.synced}, 失败: ${data.failed}\n(Successfully synced ${data.synced} note(s) to Notion)`);
      setShowNotionModal(false);
      setNotionToken('');
      setNotionDatabaseId('');
    } catch (error: any) {
      console.error('Error syncing to Notion:', error);
      alert(`同步失败: ${error.message}\n(Sync failed: ${error.message})`);
    } finally {
      setIsSyncing(false);
    }
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
                    <>
                      <button
                        onClick={handleExportAll}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                        title="导出所有笔记为 Markdown 文件 (Export all notes as Markdown)"
                      >
                        导出 .md (Export .md)
                      </button>
                      <button
                        onClick={() => setShowNotionModal(true)}
                        className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                        title="同步到 Notion (Sync to Notion)"
                      >
                        同步 Notion (Sync Notion)
                      </button>
                    </>
                  )}
                  <button
                    onClick={handleNewNote}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    新建笔记 (New Note)
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
                      onDownload={downloadNoteAsMarkdown}
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
                    取消 (Cancel)
                  </button>
                )}
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? '保存中... (Saving...)' : selectedNote ? '更新 (Update)' : '保存 (Save)'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notion Sync Modal */}
      {showNotionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-4">同步到 Notion (Sync to Notion)</h2>
            <p className="text-sm text-gray-600 mb-4">
              输入您的 Notion 集成凭证以同步所有笔记 (Enter your Notion integration credentials to sync all notes)
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notion Integration Token
              </label>
              <input
                type="password"
                value={notionToken}
                onChange={(e) => setNotionToken(e.target.value)}
                placeholder="secret_..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notion Database ID
              </label>
              <input
                type="text"
                value={notionDatabaseId}
                onChange={(e) => setNotionDatabaseId(e.target.value)}
                placeholder="32字符的数据库ID (32-character database ID)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setShowNotionModal(false);
                  setNotionToken('');
                  setNotionDatabaseId('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消 (Cancel)
              </button>
              <button
                onClick={handleSyncToNotion}
                disabled={isSyncing || !notionToken || !notionDatabaseId}
                className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSyncing ? '同步中... (Syncing...)' : '开始同步 (Start Sync)'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

