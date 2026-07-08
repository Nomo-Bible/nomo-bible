import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import StarterKit from '@tiptap/starter-kit';
import { EditorContent, useEditor } from '@tiptap/react';
import {
  Bold,
  Eraser,
  Highlighter,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Underline as UnderlineIcon,
  Undo2,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { registerStudyNoteEditor } from '@/services/studyNoteEditorBridge';
import { noteBodyToEditorHtml } from '@/utils/noteContent';
import './RichTextNoteEditor.css';

const HIGHLIGHT_COLORS = [
  { id: 'yellow', label: 'Yellow', value: '#fef08a' },
  { id: 'green', label: 'Green', value: '#bbf7d0' },
  { id: 'blue', label: 'Blue', value: '#bfdbfe' },
  { id: 'pink', label: 'Pink', value: '#fbcfe8' },
  { id: 'orange', label: 'Orange', value: '#fed7aa' },
] as const;

interface RichTextNoteEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  ariaLabel?: string;
  remountKey?: string;
}

export function RichTextNoteEditor({
  value,
  onChange,
  placeholder = 'Write your study notes here…',
  ariaLabel = 'Study note body',
  remountKey = 'default',
}: RichTextNoteEditorProps) {
  const [, setToolbarRevision] = useState(0);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        codeBlock: false,
        code: false,
        horizontalRule: false,
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: 'noopener noreferrer',
          target: '_blank',
        },
      }),
      Highlight.configure({ multicolor: true }),
      Placeholder.configure({ placeholder }),
    ],
    content: noteBodyToEditorHtml(value),
    editorProps: {
      attributes: {
        class: 'rich-text-note-editor__content',
        'aria-label': ariaLabel,
      },
    },
    onUpdate: ({ editor: current }) => {
      onChange(current.getHTML());
    },
  }, [remountKey]);

  useEffect(() => {
    if (!editor) return;
    const bumpToolbar = () => setToolbarRevision((value) => value + 1);
    editor.on('selectionUpdate', bumpToolbar);
    editor.on('transaction', bumpToolbar);
    return () => {
      editor.off('selectionUpdate', bumpToolbar);
      editor.off('transaction', bumpToolbar);
    };
  }, [editor]);

  useEffect(() => {
    if (!editor) return;

    registerStudyNoteEditor({
      insertHtml: (html) => {
        const hasFocus = editor.isFocused;
        const chain = editor.chain().focus();
        if (!hasFocus) {
          chain.setTextSelection(editor.state.doc.content.size);
        }
        chain.insertContent(html).run();
      },
    });

    return () => registerStudyNoteEditor(null);
  }, [editor]);

  if (!editor) {
    return <div className="rich-text-note-editor rich-text-note-editor--loading" />;
  }

  const setLink = () => {
    const previous = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('Enter link URL', previous ?? 'https://');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const removeFormatting = () => {
    editor.chain().focus().unsetAllMarks().clearNodes().run();
  };

  return (
    <div className="rich-text-note-editor">
      <div className="rich-text-note-editor__toolbar" role="toolbar" aria-label="Note formatting">
        <button
          type="button"
          className={
            editor.isActive('bold')
              ? 'rich-text-note-editor__btn rich-text-note-editor__btn--active'
              : 'rich-text-note-editor__btn'
          }
          onClick={() => editor.chain().focus().toggleBold().run()}
          aria-label="Bold"
          aria-pressed={editor.isActive('bold')}
        >
          <Bold size={16} strokeWidth={2} aria-hidden="true" />
        </button>

        <button
          type="button"
          className={
            editor.isActive('italic')
              ? 'rich-text-note-editor__btn rich-text-note-editor__btn--active'
              : 'rich-text-note-editor__btn'
          }
          onClick={() => editor.chain().focus().toggleItalic().run()}
          aria-label="Italic"
          aria-pressed={editor.isActive('italic')}
        >
          <Italic size={16} strokeWidth={2} aria-hidden="true" />
        </button>

        <button
          type="button"
          className={
            editor.isActive('underline')
              ? 'rich-text-note-editor__btn rich-text-note-editor__btn--active'
              : 'rich-text-note-editor__btn'
          }
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          aria-label="Underline"
          aria-pressed={editor.isActive('underline')}
        >
          <UnderlineIcon size={16} strokeWidth={2} aria-hidden="true" />
        </button>

        <span className="rich-text-note-editor__divider" aria-hidden="true" />

        <div className="rich-text-note-editor__highlight-group" aria-label="Highlight color">
          <Highlighter size={16} strokeWidth={2} aria-hidden="true" className="rich-text-note-editor__highlight-icon" />
          {HIGHLIGHT_COLORS.map((color) => (
            <button
              key={color.id}
              type="button"
              className={
                editor.isActive('highlight', { color: color.value })
                  ? 'rich-text-note-editor__swatch rich-text-note-editor__swatch--active'
                  : 'rich-text-note-editor__swatch'
              }
              style={{ backgroundColor: color.value }}
              aria-label={`Highlight ${color.label}`}
              onClick={() =>
                editor.chain().focus().toggleHighlight({ color: color.value }).run()
              }
            />
          ))}
        </div>

        <button
          type="button"
          className="rich-text-note-editor__btn"
          onClick={removeFormatting}
          aria-label="Remove formatting"
        >
          <Eraser size={16} strokeWidth={2} aria-hidden="true" />
        </button>

        <span className="rich-text-note-editor__divider" aria-hidden="true" />

        <button
          type="button"
          className={
            editor.isActive('bulletList')
              ? 'rich-text-note-editor__btn rich-text-note-editor__btn--active'
              : 'rich-text-note-editor__btn'
          }
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          aria-label="Bulleted list"
          aria-pressed={editor.isActive('bulletList')}
        >
          <List size={16} strokeWidth={2} aria-hidden="true" />
        </button>

        <button
          type="button"
          className={
            editor.isActive('orderedList')
              ? 'rich-text-note-editor__btn rich-text-note-editor__btn--active'
              : 'rich-text-note-editor__btn'
          }
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          aria-label="Numbered list"
          aria-pressed={editor.isActive('orderedList')}
        >
          <ListOrdered size={16} strokeWidth={2} aria-hidden="true" />
        </button>

        <button
          type="button"
          className={
            editor.isActive('blockquote')
              ? 'rich-text-note-editor__btn rich-text-note-editor__btn--active'
              : 'rich-text-note-editor__btn'
          }
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          aria-label="Quote"
          aria-pressed={editor.isActive('blockquote')}
        >
          <Quote size={16} strokeWidth={2} aria-hidden="true" />
        </button>

        <button
          type="button"
          className={
            editor.isActive('link')
              ? 'rich-text-note-editor__btn rich-text-note-editor__btn--active'
              : 'rich-text-note-editor__btn'
          }
          onClick={setLink}
          aria-label="Link"
          aria-pressed={editor.isActive('link')}
        >
          <Link2 size={16} strokeWidth={2} aria-hidden="true" />
        </button>

        <span className="rich-text-note-editor__divider" aria-hidden="true" />

        <button
          type="button"
          className="rich-text-note-editor__btn"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          aria-label="Undo"
        >
          <Undo2 size={16} strokeWidth={2} aria-hidden="true" />
        </button>

        <button
          type="button"
          className="rich-text-note-editor__btn"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          aria-label="Redo"
        >
          <Redo2 size={16} strokeWidth={2} aria-hidden="true" />
        </button>
      </div>

      <EditorContent editor={editor} className="rich-text-note-editor__surface" />
    </div>
  );
}
