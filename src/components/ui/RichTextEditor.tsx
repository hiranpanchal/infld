"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import { useEffect } from "react";

interface Props {
  value: string;
  onChange: (html: string) => void;
}

const btnClass =
  "w-8 h-8 flex items-center justify-center text-xs border border-infld-grey-mid text-infld-grey-light hover:text-infld-white hover:border-infld-white transition-colors";
const activeBtnClass =
  "w-8 h-8 flex items-center justify-center text-xs border bg-infld-yellow text-infld-black border-infld-yellow";

export function RichTextEditor({ value, onChange }: Props) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "underline text-infld-yellow" } }),
    ],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "min-h-[260px] p-4 focus:outline-none text-infld-white text-sm leading-relaxed prose-sm max-w-none",
      },
    },
  });

  // Sync external value changes (e.g. on load)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  if (!editor) return null;

  const setLink = () => {
    const url = window.prompt("Enter URL:", editor.getAttributes("link").href ?? "https://");
    if (url === null) return;
    if (url === "") { editor.chain().focus().unsetLink().run(); return; }
    editor.chain().focus().setLink({ href: url }).run();
  };

  return (
    <div className="border-2 border-infld-grey-mid bg-[#0a0a0a] focus-within:border-infld-yellow transition-colors">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border-b border-infld-grey-mid bg-[#111]">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? activeBtnClass : btnClass} title="Bold">
          <strong>B</strong>
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? activeBtnClass : btnClass} title="Italic">
          <em>I</em>
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editor.isActive("underline") ? activeBtnClass : btnClass} title="Underline">
          <span style={{ textDecoration: "underline" }}>U</span>
        </button>
        <div className="w-px bg-infld-grey-mid mx-1" />
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive("heading", { level: 2 }) ? activeBtnClass : btnClass} title="Heading 2">
          H2
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive("heading", { level: 3 }) ? activeBtnClass : btnClass} title="Heading 3">
          H3
        </button>
        <div className="w-px bg-infld-grey-mid mx-1" />
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? activeBtnClass : btnClass} title="Bullet list">
          ≡
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? activeBtnClass : btnClass} title="Ordered list">
          #
        </button>
        <div className="w-px bg-infld-grey-mid mx-1" />
        <button type="button" onClick={setLink}
          className={editor.isActive("link") ? activeBtnClass : btnClass} title="Link">
          🔗
        </button>
        <button type="button" onClick={() => editor.chain().focus().unsetLink().run()}
          className={btnClass} title="Remove link" disabled={!editor.isActive("link")}>
          ✂
        </button>
        <div className="w-px bg-infld-grey-mid mx-1" />
        <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className={btnClass} title="Divider">
          —
        </button>
        <button type="button" onClick={() => editor.chain().focus().undo().run()}
          className={btnClass} title="Undo">↩</button>
        <button type="button" onClick={() => editor.chain().focus().redo().run()}
          className={btnClass} title="Redo">↪</button>
      </div>
      {/* Editor area */}
      <EditorContent editor={editor} />
    </div>
  );
}
