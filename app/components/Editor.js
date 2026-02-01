'use client';

import { useRef, useState, useEffect } from 'react';
import Toolbar from "./Toolbar";
import Icon from './Icon';
import './Editor.css';

export default function Editor({ onDataChange }) {
  const editorRef = useRef(null);
  const titleRef = useRef(null);
  const fileInputRef = useRef(null);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [savedSelection, setSavedSelection] = useState(null);

  useEffect(() => {
    const handleChange = () => {
      const title = titleRef.current?.value || '';
      const content = editorRef.current?.innerHTML || '';
      onDataChange?.({ title, content });
    };

    const titleElement = titleRef.current;
    const editorElement = editorRef.current;

    titleElement?.addEventListener('input', handleChange);
    editorElement?.addEventListener('input', handleChange);

    return () => {
      titleElement?.removeEventListener('input', handleChange);
      editorElement?.removeEventListener('input', handleChange);
    };
  }, [onDataChange]);

  const handleFormat = (command) => {
    const editor = editorRef.current;
    if (!editor) return;

    editor.focus();

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    if (range.collapsed) {
      alert('Select some text first');
      return;
    }

    const fragment = range.extractContents();

    let wrapper;
    if (command === 'bold') {
      wrapper = document.createElement('strong');
    } else if (command === 'italic') {
      wrapper = document.createElement('em');
    } else if (command === 'underline') {
      wrapper = document.createElement('u');
    } else {
      return;
    }

    wrapper.appendChild(fragment);

    const resetSpan = document.createElement('span');
    resetSpan.style.fontWeight = 'normal';
    resetSpan.style.fontStyle = 'normal';
    resetSpan.style.textDecoration = 'none';

    const zwsp = document.createTextNode('\u200B');
    resetSpan.appendChild(zwsp);

    range.insertNode(wrapper);

    if (wrapper.nextSibling) {
      wrapper.parentNode.insertBefore(resetSpan, wrapper.nextSibling);
    } else {
      wrapper.parentNode.appendChild(resetSpan);
    }

    const newRange = document.createRange();
    newRange.setStart(zwsp, 0);
    newRange.collapse(true);

    selection.removeAllRanges();
    selection.addRange(newRange);

    resetSpan.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  };

  const handleOrderedList = () => {
    editorRef.current?.focus();
    document.execCommand('insertOrderedList', false, null);
  };

  const handleUnorderedList = () => {
    editorRef.current?.focus();
    document.execCommand('insertUnorderedList', false, null);
  };

  const handleQuote = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0 && selection.toString().trim()) {
      const range = selection.getRangeAt(0);
      const selectedContent = range.extractContents();
      
      const blockquote = document.createElement('blockquote');
      blockquote.style.borderLeft = '4px solid #ccc';
      blockquote.style.paddingLeft = '16px';
      blockquote.style.marginLeft = '0';
      blockquote.style.marginTop = '8px';
      blockquote.style.marginBottom = '8px';
      blockquote.style.color = '#666';
      blockquote.style.fontStyle = 'italic';
      blockquote.appendChild(selectedContent);
      
      range.insertNode(blockquote);
      range.setStartAfter(blockquote);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
      
      editorRef.current?.focus();
    } else {
      alert('Please select some text to quote');
    }
  };

  const handleLink = () => {
    const selection = window.getSelection();
    const selectedText = selection.toString();
    
    if (!selectedText) {
      alert('Please select text first to create a link');
      return;
    }
    
    if (selection.rangeCount > 0) {
      setSavedSelection(selection.getRangeAt(0));
    }
    
    setLinkUrl('');
    setShowLinkDialog(true);
  };

  const insertLink = () => {
    if (!linkUrl.trim()) {
      return;
    }

    if (savedSelection) {
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(savedSelection.cloneRange());
      
      const anchor = document.createElement('a');
      anchor.href = linkUrl;
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
      anchor.style.color = '#3b82f6';
      anchor.style.textDecoration = 'underline';
      anchor.textContent = savedSelection.toString();
      
      savedSelection.deleteContents();
      savedSelection.insertNode(anchor);
      
      const newRange = document.createRange();
      newRange.setStartAfter(anchor);
      newRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(newRange);
      
      editorRef.current?.focus();
    }
    
    setShowLinkDialog(false);
    setLinkUrl('');
    setSavedSelection(null);
  };

  const cancelLink = () => {
    setShowLinkDialog(false);
    setLinkUrl('');
    setSavedSelection(null);
    editorRef.current?.focus();
  };

  const handleImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imgUrl = event.target.result;
        
        const img = document.createElement('img');
        img.src = imgUrl;
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        img.style.resize = 'both';
        img.style.display = 'block';
        img.style.margin = '10px 0';
        img.contentEditable = 'false';
        
        const wrapper = document.createElement('div');
        wrapper.contentEditable = 'false';
        wrapper.style.display = 'inline-block';
        wrapper.style.position = 'relative';
        wrapper.style.maxWidth = '100%';
        wrapper.style.resize = 'both';
        wrapper.style.overflow = 'auto';
        wrapper.style.border = '1px dashed #ccc';
        wrapper.style.padding = '2px';
        wrapper.style.margin = '10px 0';
        wrapper.className = 'editor-image-wrapper';
        
        img.style.width = '100%';
        img.style.height = 'auto';
        img.style.border = 'none';
        
        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '×';
        deleteButton.className = 'editor-image-delete';
        deleteButton.type = 'button';
        deleteButton.title = 'Delete image';
        deleteButton.style.position = 'absolute';
        deleteButton.style.top = '5px';
        deleteButton.style.right = '5px';
        deleteButton.style.width = '24px';
        deleteButton.style.height = '24px';
        deleteButton.style.borderRadius = '50%';
        deleteButton.style.border = 'none';
        deleteButton.style.backgroundColor = 'rgba(239, 68, 68, 0.9)';
        deleteButton.style.color = 'white';
        deleteButton.style.fontSize = '16px';
        deleteButton.style.fontWeight = 'bold';
        deleteButton.style.cursor = 'pointer';
        deleteButton.style.display = 'flex';
        deleteButton.style.alignItems = 'center';
        deleteButton.style.justifyContent = 'center';
        deleteButton.style.opacity = '0';
        deleteButton.style.transition = 'opacity 0.2s ease';
        deleteButton.style.zIndex = '10';
        
        deleteButton.addEventListener('click', (event) => {
          event.preventDefault();
          event.stopPropagation();
          if (confirm('Are you sure you want to delete this image?')) {
            wrapper.remove();
            editorRef.current?.focus();
          }
        });
        
        wrapper.addEventListener('mouseenter', () => {
          deleteButton.style.opacity = '1';
        });
        
        wrapper.addEventListener('mouseleave', () => {
          deleteButton.style.opacity = '0';
        });
        
        wrapper.appendChild(img);
        wrapper.appendChild(deleteButton);
        
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          range.insertNode(wrapper);
          range.setStartAfter(wrapper);
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);
        }
        
        editorRef.current?.focus();
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const handlePlaceholder = (e) => {
    const isEmpty = e.currentTarget.textContent.trim() === '';
    e.currentTarget.setAttribute('data-empty', isEmpty);
  };

  const handleEditorClick = (e) => {
    const target = e.target.closest('a');
    if (target && target.href) {
      e.preventDefault();
      window.open(target.href, '_blank', 'noopener,noreferrer');
    }
  };

  const handleKeyDown = (e) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          handleFormat('bold');
          break;
        case 'i':
          e.preventDefault();
          handleFormat('italic');
          break;
        case 'u':
          e.preventDefault();
          handleFormat('underline');
          break;
        default:
          break;
      }
    }
  };

  return (
    <div className="editor-container">

      {showLinkDialog && (
        <div className="link-dialog-overlay">
          <div className="link-dialog">
            <div className="link-dialog-header">
              <h3 className="link-dialog-title">Insert Link</h3>
              <button
                onClick={cancelLink}
                className="link-dialog-close"
                type="button"
              >
                <Icon src="/assets/icons/close.png" alt="Close" className="link-dialog-close-icon" />
              </button>
            </div>
            <input
              type="text"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  insertLink();
                } else if (e.key === 'Escape') {
                  cancelLink();
                }
              }}
              placeholder="Paste or type a link..."
              className="link-input"
              autoFocus
            />
            <div className="link-dialog-actions">
              <button
                onClick={cancelLink}
                className="link-cancel-btn"
                type="button"
              >
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
              { label: 'B', onClick: () => handleFormat('bold'), className: 'toolbar-btn toolbar-btn-bold', title: 'Bold (Ctrl+B)' },
              { label: 'I', onClick: () => handleFormat('italic'), className: 'toolbar-btn toolbar-btn-italic', title: 'Italic (Ctrl+I)' },
              { label: 'U', onClick: () => handleFormat('underline'), className: 'toolbar-btn toolbar-btn-underline', title: 'Underline (Ctrl+U)' },
              { icon: { src: '/assets/icons/bullet-list.png', alt: 'Bullet List' }, onClick: handleUnorderedList, className: 'toolbar-btn toolbar-btn-icon toolbar-btn-bullet-list', title: 'Bullet List' },
              { icon: { src: '/assets/icons/numbered-list.png', alt: 'Numbered List' }, onClick: handleOrderedList, className: 'toolbar-btn toolbar-btn-icon toolbar-btn-numbered-list', title: 'Numbered List' },
              { icon: { src: '/assets/icons/quote.png', alt: 'Quote' }, onClick: handleQuote, className: 'toolbar-btn toolbar-btn-icon', title: 'Quote' },
              { icon: { src: '/assets/icons/link.png', alt: 'Link' }, onClick: handleLink, className: 'toolbar-btn toolbar-btn-icon', title: 'Link' },
              { icon: { src: '/assets/icons/image.png', alt: 'Image' }, onClick: handleImage, className: 'toolbar-btn toolbar-btn-icon', title: 'Image' },
            ]
          ]}
        />
      </div>

      <input
        ref={titleRef}
        type="text"
        placeholder="Title of your story..."
        className="editor-title"
      />

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handlePlaceholder}
        onFocus={handlePlaceholder}
        onBlur={handlePlaceholder}
        onClick={handleEditorClick}
        onKeyDown={handleKeyDown}
        data-empty="true"
        className="editor-content"
      />
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