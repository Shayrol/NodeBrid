'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import TextAlign from '@tiptap/extension-text-align';

import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Undo2,
  Redo2,
  Heading1,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Heading3,
  Heading2,
} from 'lucide-react';
import { useEffect } from 'react';

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function PostEditor({ value, onChange }: Props) {
  const editor = useEditor({
    immediatelyRender: false,

    extensions: [
      StarterKit,

      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],

    content: value,

    editorProps: {
      attributes: {
        class: 'prose max-w-none min-h-[400px] p-5 outline-none',
      },
    },

    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;

    // 현재 에디터의 HTML 내용과 외부에서 들어온 value가 다를 때만 업데이트합니다.
    // (이 조건문이 없으면 커서가 맨 앞으로 튀는 현상이 발생할 수 있습니다)
    if (editor.getHTML() !== value) {
      editor.commands.setContent(value || '<p></p>');
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="overflow-hidden w-full rounded-lg border border-border bg-card ">
      {/* Toolbar */}
      <div
        className="
        flex items-center overflow-x-auto overscroll-x-contain
        whitespace-nowrap scrollbar-thin
        gap-2 border-b p-1"
      >
        {/* Bold */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`rounded-lg p-2 transition hover:bg-card-hover ${
            editor.isActive('bold') ? 'bg-card-hover' : ''
          }`}
        >
          <Bold size={18} />
        </button>

        {/* Italic */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`rounded-lg p-2 transition hover:bg-card-hover ${
            editor.isActive('italic') ? 'bg-card-hover' : ''
          }`}
        >
          <Italic size={18} />
        </button>

        {/* Strike */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`rounded-lg p-2 transition hover:bg-card-hover ${
            editor.isActive('strike') ? 'bg-card-hover' : ''
          }`}
        >
          <Strikethrough size={18} />
        </button>

        {/* Heading */}
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={`rounded-lg p-2 transition hover:bg-card-hover ${
            editor.isActive('heading', { level: 1 }) ? 'bg-card-hover' : ''
          }`}
        >
          <Heading1 size={18} />
        </button>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`rounded-lg p-2 transition hover:bg-card-hover ${
            editor.isActive('heading', { level: 2 }) ? 'bg-card-hover' : ''
          }`}
        >
          <Heading2 size={18} />
        </button>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={`rounded-lg p-2 transition hover:bg-card-hover ${
            editor.isActive('heading', { level: 3 }) ? 'bg-card-hover' : ''
          }`}
        >
          <Heading3 size={18} />
        </button>

        {/* Bullet List */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`rounded-lg p-2 transition hover:bg-card-hover ${
            editor.isActive('bulletList') ? 'bg-card-hover' : ''
          }`}
        >
          <List size={18} />
        </button>

        {/* Ordered List */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`rounded-lg p-2 transition hover:bg-card-hover ${
            editor.isActive('orderedList') ? 'bg-card-hover' : ''
          }`}
        >
          <ListOrdered size={18} />
        </button>

        {/* Quote */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`rounded-lg p-2 transition hover:bg-card-hover ${
            editor.isActive('blockquote') ? 'bg-card-hover' : ''
          }`}
        >
          <Quote size={18} />
        </button>

        {/* Align Left */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`rounded-lg p-2 transition hover:bg-card-hover ${
            editor.isActive({ textAlign: 'left' }) ? 'bg-card-hover0' : ''
          }`}
        >
          <AlignLeft size={18} />
        </button>

        {/* Align Center */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`rounded-lg p-2 transition hover:bg-card-hover ${
            editor.isActive({ textAlign: 'center' }) ? 'bg-card-hover' : ''
          }`}
        >
          <AlignCenter size={18} />
        </button>

        {/* Align Right */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`rounded-lg p-2 transition hover:bg-card-hover ${
            editor.isActive({ textAlign: 'right' }) ? 'bg-card-hover' : ''
          }`}
        >
          <AlignRight size={18} />
        </button>

        {/* Align Justify */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          className={`rounded-lg p-2 transition hover:bg-card-hover ${
            editor.isActive({ textAlign: 'justify' }) ? 'bg-card-hover' : ''
          }`}
        >
          <AlignJustify size={18} />
        </button>

        {/* Undo */}
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          className="rounded-lg p-2 transition hover:bg-card-hover"
        >
          <Undo2 size={18} />
        </button>

        {/* Redo */}
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          className="rounded-lg p-2 transition hover:bg-card-hover"
        >
          <Redo2 size={18} />
        </button>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} className="text-xs" />
    </div>
  );
}
