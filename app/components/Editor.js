'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import {
  List,
  ListOrdered,
  Quote,
  Link2,
  ImageIcon,
  X,
} from 'lucide-react';
import Toolbar from './Toolbar';
import './Editor.css';

function getContentHtml(editor) {
  if (!editor || editor.isEmpty) return '';
  return editor.getHTML();
}

export default function Editor({ onDataChange, initialData }) {
  const titleRef = useRef(null);
  const fileInputRef = useRef(null);
  const onDataChangeRef = useRef(onDataChange);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  useEffect(() => {
    onDataChangeRef.current = onDataChange;
  }, [onDataChange]);

  const emitChange = useCallback((editorInstance) => {
    const title = titleRef.current?.value || '';
    const content = getContentHtml(editorInstance);
    onDataChangeRef.current?.({ title, content });
  }, []);

  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    extensions: [
      StarterKit.configure({
        heading: false,
        codeBlock: false,
        code: false,
        horizontalRule: false,
        link: {
          openOnClick: false,
          autolink: true,
          linkOnPaste: true,
          HTMLAttributes: {
            target: '_blank',
            rel: 'noopener noreferrer',
          },
        },
      }),
      Image.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: 'editor-image',
        },
      }),
      Placeholder.configure({
        placeholder: 'Tell your story…',
      }),
    ],
    content: initialData?.content || '',
    editorProps: {
      attributes: {
        class: 'editor-content',
      },
    },
    onUpdate: ({ editor: ed }) => {
      emitChange(ed);
    },
  });

  useEffect(() => {
    if (titleRef.current && initialData?.title != null) {
      titleRef.current.value = initialData.title || '';
    }
  }, [initialData]);

  useEffect(() => {
    if (!editor || initialData?.content == null) return;
    const next = initialData.content || '';
    const current = getContentHtml(editor);
    if (next !== current) {
      editor.commands.setContent(next, { emitUpdate: false });
    }
  }, [editor, initialData]);

  const handleTitleInput = () => {
    emitChange(editor);
  };

  const handleBold = () => editor?.chain().focus().toggleBold().run();
  const handleItalic = () => editor?.chain().focus().toggleItalic().run();
  const handleUnderline = () => editor?.chain().focus().toggleUnderline().run();
  const handleBulletList = () => editor?.chain().focus().toggleBulletList().run();
  const handleOrderedList = () => editor?.chain().focus().toggleOrderedList().run();
  const handleQuote = () => editor?.chain().focus().toggleBlockquote().run();

  const handleLink = () => {
    if (!editor) return;

    if (editor.isActive('link')) {
      editor.chain().focus().unsetLink().run();
      return;
    }

    const previous = editor.getAttributes('link').href || '';
    setLinkUrl(previous);
    setShowLinkDialog(true);
  };

  const insertLink = () => {
    if (!editor || !linkUrl.trim()) return;

    const href = linkUrl.trim();
    const { empty } = editor.state.selection;

    if (empty) {
      editor
        .chain()
        .focus()
        .insertContent(`<a href="${href.replace(/"/g, '&quot;')}">${href.replace(/</g, '&lt;')}</a>`)
        .run();
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href }).run();
    }

    setShowLinkDialog(false);
    setLinkUrl('');
  };

  const cancelLink = () => {
    setShowLinkDialog(false);
    setLinkUrl('');
    editor?.commands.focus();
  };

  const handleImage = () => {
    if (!editor) return;

    if (editor.isActive('image')) {
      editor.chain().focus().deleteSelection().run();
      return;
    }

    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !file.type.startsWith('image/') || !editor) return;

    const reader = new FileReader();
    reader.onload = () => {
      const src = typeof reader.result === 'string' ? reader.result : '';
      if (!src) return;
      editor.chain().focus().setImage({ src }).run();
    };
    reader.readAsDataURL(file);
  };

  const bold = !!editor?.isActive('bold');
  const italic = !!editor?.isActive('italic');
  const underline = !!editor?.isActive('underline');
  const bulletList = !!editor?.isActive('bulletList');
  const orderedList = !!editor?.isActive('orderedList');
  const quote = !!editor?.isActive('blockquote');
  const link = !!editor?.isActive('link');
  const image = !!editor?.isActive('image');

  return (
    <div className="editor-container">
      {showLinkDialog && (
        <div className="link-dialog-overlay">
          <div className="link-dialog" role="dialog" aria-labelledby="link-dialog-title">
            <div className="link-dialog-header">
              <h3 id="link-dialog-title" className="link-dialog-title">
                Insert Link
              </h3>
              <button
                onClick={cancelLink}
                className="link-dialog-close"
                type="button"
                aria-label="Close"
              >
                <X className="link-dialog-close-icon" aria-hidden="true" />
              </button>
            </div>
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  insertLink();
                } else if (e.key === 'Escape') {
                  cancelLink();
                }
              }}
              placeholder="Paste or type a link…"
              className="link-input"
              autoFocus
            />
            <div className="link-dialog-actions">
              <button onClick={cancelLink} className="link-cancel-btn" type="button">
                Cancel
              </button>
              <button
                onClick={insertLink}
                className="link-insert-btn"
                disabled={!linkUrl.trim()}
                type="button"
              >
                Insert
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="editor-toolbar-section">
        <Toolbar
          buttons={[
            [
              {
                label: 'B',
                onClick: handleBold,
                className: `toolbar-btn toolbar-btn-bold ${bold ? 'toolbar-btn-active' : ''}`,
                title: bold ? 'Remove bold (Ctrl+B)' : 'Bold (Ctrl+B)',
                pressed: bold,
              },
              {
                label: 'I',
                onClick: handleItalic,
                className: `toolbar-btn toolbar-btn-italic ${italic ? 'toolbar-btn-active' : ''}`,
                title: italic ? 'Remove italic (Ctrl+I)' : 'Italic (Ctrl+I)',
                pressed: italic,
              },
              {
                label: 'U',
                onClick: handleUnderline,
                className: `toolbar-btn toolbar-btn-underline ${underline ? 'toolbar-btn-active' : ''}`,
                title: underline ? 'Remove underline (Ctrl+U)' : 'Underline (Ctrl+U)',
                pressed: underline,
              },
              {
                icon: (
                  <List
                    className="toolbar-icon"
                    aria-hidden="true"
                    fill={bulletList ? 'currentColor' : 'none'}
                  />
                ),
                onClick: handleBulletList,
                className: `toolbar-btn toolbar-btn-icon ${bulletList ? 'toolbar-btn-active' : ''}`,
                title: bulletList ? 'Remove bullet list' : 'Bullet List',
                pressed: bulletList,
              },
              {
                icon: (
                  <ListOrdered
                    className="toolbar-icon"
                    aria-hidden="true"
                    fill={orderedList ? 'currentColor' : 'none'}
                  />
                ),
                onClick: handleOrderedList,
                className: `toolbar-btn toolbar-btn-icon ${orderedList ? 'toolbar-btn-active' : ''}`,
                title: orderedList ? 'Remove numbered list' : 'Numbered List',
                pressed: orderedList,
              },
              {
                icon: (
                  <Quote
                    className="toolbar-icon"
                    aria-hidden="true"
                    fill={quote ? 'currentColor' : 'none'}
                  />
                ),
                onClick: handleQuote,
                className: `toolbar-btn toolbar-btn-icon ${quote ? 'toolbar-btn-active' : ''}`,
                title: quote ? 'Remove quote' : 'Quote',
                pressed: quote,
              },
              {
                icon: (
                  <Link2
                    className="toolbar-icon"
                    aria-hidden="true"
                    fill={link ? 'currentColor' : 'none'}
                  />
                ),
                onClick: handleLink,
                className: `toolbar-btn toolbar-btn-icon ${link ? 'toolbar-btn-active' : ''}`,
                title: link ? 'Remove link' : 'Link',
                pressed: link,
              },
              {
                icon: (
                  <ImageIcon
                    className="toolbar-icon"
                    aria-hidden="true"
                    fill={image ? 'currentColor' : 'none'}
                  />
                ),
                onClick: handleImage,
                className: `toolbar-btn toolbar-btn-icon ${image ? 'toolbar-btn-active' : ''}`,
                title: image ? 'Remove image' : 'Image',
                pressed: image,
              },
            ],
          ]}
        />
      </div>

      <input
        ref={titleRef}
        type="text"
        placeholder="Title of your story…"
        className="editor-title"
        defaultValue={initialData?.title || ''}
        onInput={handleTitleInput}
      />

      <EditorContent editor={editor} />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
