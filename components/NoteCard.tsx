'use client';

import React from 'react';
import { Note } from '@/types';

interface NoteCardProps {
  note: Note;
  onSelect: (note: Note) => void;
  onDelete: (id: number) => void;
  onDownload: (note: Note) => void;
}

export default function NoteCard({ note, onSelect, onDelete, onDownload }: NoteCardProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this note?')) {
      onDelete(note.id);
    }
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDownload(note);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDateShort = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Extract plain text preview from Quill HTML content
  const getPreview = (content: string) => {
    if (!content) return '';
    
    // Strip HTML tags using regex (works in SSR)
    const text = content
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
      .replace(/&[a-z]+;/gi, '') // Remove other HTML entities
      .trim();
    
    return text.length > 100 ? text.substring(0, 100) + '...' : text;
  };

  return (
    <div
      onClick={() => onSelect(note)}
      className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-800">{note.title}</h3>
        <div className="flex gap-2">
          <button
            onClick={handleDownload}
            className="text-blue-500 hover:text-blue-700 text-sm font-medium"
            title="下载为 Markdown (Download as Markdown)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700 text-sm font-medium"
          >
            删除 (Delete)
          </button>
        </div>
      </div>
      <p className="text-gray-600 text-sm mb-2 line-clamp-2">{getPreview(note.content)}</p>
      <div className="flex flex-col gap-1 mt-2">
        <p className="text-gray-400 text-xs">
          <span className="font-medium">Created:</span> {formatDate(note.created_at)}
        </p>
        <p className="text-gray-400 text-xs">
          <span className="font-medium">Updated:</span> {formatDate(note.updated_at)}
        </p>
      </div>
    </div>
  );
}

