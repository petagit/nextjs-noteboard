'use client';

import React from 'react';
import { Note } from '@/types';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Trash2 } from 'lucide-react';

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
    <Card
      onClick={() => onSelect(note)}
      className="cursor-pointer hover:shadow-md transition-shadow mb-3 border-gray-200"
    >
      <CardHeader className="p-4 pb-2 flex-row justify-between items-start space-y-0">
        <CardTitle className="text-lg font-semibold text-gray-800 line-clamp-1">{note.title}</CardTitle>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDownload}
            className="h-8 w-8 text-orange-500 hover:text-orange-600 hover:bg-orange-50"
            title="下载为 Markdown (Download as Markdown)"
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
            title="删除 (Delete)"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-gray-600 text-sm line-clamp-2">{getPreview(note.content)}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex flex-col items-start gap-0.5 mt-auto">
        <p className="text-gray-400 text-[10px]">
          <span className="font-medium">Created:</span> {formatDate(note.created_at)}
        </p>
        <p className="text-gray-400 text-[10px]">
          <span className="font-medium">Updated:</span> {formatDate(note.updated_at)}
        </p>
      </CardFooter>
    </Card>
  );
}
