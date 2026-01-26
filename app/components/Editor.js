'use client';

import { useRef, useState } from 'react';
import Toolbar from "./Toolbar";

export default function Editor() {
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [savedSelection, setSavedSelection] = useState(null);

  const handleFormat = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
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
        
        img.style.width = '100%';
        img.style.height = 'auto';
        img.style.border = 'none';
        
        wrapper.appendChild(img);
        
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

  return (
    <div className="relative">

      {showLinkDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-[400px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Insert Link</h3>
              <button
                onClick={cancelLink}
                className="text-gray-400 hover:text-gray-600"
                type="button"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
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
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={cancelLink}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={insertLink}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                disabled={!linkUrl.trim()}
                type="button"
              >
                Insert
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6">
        <Toolbar 
          onBold={() => handleFormat('bold')}
          onItalic={() => handleFormat('italic')}
          onUnderline={() => handleFormat('underline')}
          onQuote={handleQuote}
          onLink={handleLink}
          onImage={handleImage}
        />
      </div>

      <input
        type="text"
        placeholder="Title of your story..."
        className="
          w-full
          text-[42px]
          font-serif
          font-semibold
          placeholder-gray-300
          focus:outline-none
          leading-tight
        "
      />

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handlePlaceholder}
        onFocus={handlePlaceholder}
        onBlur={handlePlaceholder}
        onClick={handleEditorClick}
        data-empty="true"
        className="
          w-full
          mt-4
          text-lg
          text-gray-700
          focus:outline-none
          min-h-[400px]
          leading-8
          relative
          [&[data-empty='true']]:before:content-['Start_your_story...']
          [&[data-empty='true']]:before:text-gray-400
          [&[data-empty='true']]:before:absolute
          [&_img]:max-w-full
          [&_img]:h-auto
          [&_blockquote]:border-l-4
          [&_blockquote]:border-gray-300
          [&_blockquote]:pl-4
          [&_blockquote]:italic
          [&_blockquote]:text-gray-600
          [&_a]:text-blue-600
          [&_a]:underline
          [&_a]:cursor-pointer
        "
        style={{ whiteSpace: 'pre-wrap' }}
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
