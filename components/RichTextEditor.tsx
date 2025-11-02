'use client';

import React, { useCallback, useMemo } from 'react';
import { createEditor, Descendant, Editor, Transforms, Text } from 'slate';
import { Slate, Editable, withReact, RenderLeafProps, RenderElementProps } from 'slate-react';
import { isHotkey } from 'is-hotkey';

type CustomElement = { type: 'paragraph' | 'heading'; children: CustomText[] };
type CustomText = { text: string; bold?: boolean; italic?: boolean; underline?: boolean };

declare module 'slate' {
  interface CustomTypes {
    Editor: Editor;
    Element: CustomElement;
    Text: CustomText;
  }
}

const HOTKEYS: Record<string, string> = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
};

const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
];

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder = 'Start typing...' }: RichTextEditorProps) {
  const editor = useMemo(() => withReact(createEditor()), []);
  
  const parsedValue = useMemo(() => {
    try {
      return value ? JSON.parse(value) : initialValue;
    } catch {
      return initialValue;
    }
  }, [value]);

  const renderLeaf = useCallback((props: RenderLeafProps) => {
    return <Leaf {...props} />;
  }, []);

  const renderElement = useCallback((props: RenderElementProps) => {
    switch (props.element.type) {
      case 'heading':
        return <h2 className="text-2xl font-bold mb-2" {...props.attributes}>{props.children}</h2>;
      default:
        return <p className="mb-2" {...props.attributes}>{props.children}</p>;
    }
  }, []);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    for (const hotkey in HOTKEYS) {
      if (isHotkey(hotkey, event)) {
        event.preventDefault();
        const mark = HOTKEYS[hotkey];
        toggleMark(editor, mark);
      }
    }
  }, [editor]);

  const handleChange = useCallback((val: Descendant[]) => {
    onChange(JSON.stringify(val));
  }, [onChange]);

  return (
    <div className="border border-gray-300 rounded-lg p-4 min-h-[200px] focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200">
      <Slate editor={editor} initialValue={parsedValue} onChange={handleChange}>
        <div className="mb-2 border-b border-gray-200 pb-2 flex gap-2">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              toggleMark(editor, 'bold');
            }}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded font-bold"
          >
            B
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              toggleMark(editor, 'italic');
            }}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded italic"
          >
            I
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              toggleMark(editor, 'underline');
            }}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded underline"
          >
            U
          </button>
        </div>
        <Editable
          renderLeaf={renderLeaf}
          renderElement={renderElement}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="outline-none"
        />
      </Slate>
    </div>
  );
}

function Leaf({ attributes, children, leaf }: RenderLeafProps) {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }
  if (leaf.italic) {
    children = <em>{children}</em>;
  }
  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
}

function toggleMark(editor: Editor, format: string) {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
}

function isMarkActive(editor: Editor, format: string) {
  const marks = Editor.marks(editor);
  return marks ? marks[format as keyof typeof marks] === true : false;
}

