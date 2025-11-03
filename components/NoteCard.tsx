'use client';

import React from 'react';
import { Note } from '@/types';

interface NoteCardProps {
  note: Note;
  onSelect: (note: Note) => void;
  onDelete: (id: number) => void;
}

export default function NoteCard({ note, onSelect, onDelete }: NoteCardProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this note?')) {
      onDelete(note.id);
    }
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
        <button
          onClick={handleDelete}
          className="text-red-500 hover:text-red-700 text-sm font-medium"
        >
          删除 (Delete)
        </button>
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

