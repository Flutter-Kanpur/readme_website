'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
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
  const [formatStates, setFormatStates] = useState({
    bold: false,
    italic: false,
    underline: false
  });

  // Undo/Redo state management
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [isUndoRedoOperation, setIsUndoRedoOperation] = useState(false);

  // Save state to undo stack
  const saveState = useCallback(() => {
    if (isUndoRedoOperation) return;
    
    const editor = editorRef.current;
    const title = titleRef.current;
    if (!editor || !title) return;

    const state = {
      content: editor.innerHTML,
      title: title.value,
      timestamp: Date.now()
    };

    setUndoStack(prev => {
      const newStack = [...prev, state];
      // Keep only last 50 states to prevent memory issues
      return newStack.slice(-50);
    });
    
    // Clear redo stack when new action is performed
    setRedoStack([]);
  }, [isUndoRedoOperation]);

  // Undo function
  const performUndo = useCallback(() => {
    if (undoStack.length === 0) return;

    const editor = editorRef.current;
    const title = titleRef.current;
    if (!editor || !title) return;

    // Save current state to redo stack
    const currentState = {
      content: editor.innerHTML,
      title: title.value,
      timestamp: Date.now()
    };

    const prevState = undoStack[undoStack.length - 1];
    
    setIsUndoRedoOperation(true);
    
    // Restore previous state
    editor.innerHTML = prevState.content;
    title.value = prevState.title;
    
    // Update stacks
    setUndoStack(prev => prev.slice(0, -1));
    setRedoStack(prev => [...prev, currentState]);
    
    // Trigger data change
    onDataChange?.({ title: prevState.title, content: prevState.content });
    
    setTimeout(() => {
      setIsUndoRedoOperation(false);
    }, 0);
  }, [undoStack, onDataChange]);

  // Redo function
  const performRedo = useCallback(() => {
    if (redoStack.length === 0) return;

    const editor = editorRef.current;
    const title = titleRef.current;
    if (!editor || !title) return;

    // Save current state to undo stack
    const currentState = {
      content: editor.innerHTML,
      title: title.value,
      timestamp: Date.now()
    };

    const nextState = redoStack[redoStack.length - 1];
    
    setIsUndoRedoOperation(true);
    
    // Restore next state
    editor.innerHTML = nextState.content;
    title.value = nextState.title;
    
    // Update stacks
    setRedoStack(prev => prev.slice(0, -1));
    setUndoStack(prev => [...prev, currentState]);
    
    // Trigger data change
    onDataChange?.({ title: nextState.title, content: nextState.content });
    
    setTimeout(() => {
      setIsUndoRedoOperation(false);
    }, 0);
  }, [redoStack, onDataChange]);

  useEffect(() => {
    const handleChange = () => {
      if (isUndoRedoOperation) return;
      
      const title = titleRef.current?.value || '';
      const content = editorRef.current?.innerHTML || '';
      onDataChange?.({ title, content });
      
      // Save state with debouncing
      const timeoutId = setTimeout(() => {
        saveState();
      }, 500);
      
      return () => clearTimeout(timeoutId);
    };

    // Handle input to apply formatting to new text
    const handleInput = (e) => {
      if (isUndoRedoOperation) return;
      
      // Apply formatting to newly typed text based on toggle states
      setTimeout(() => {
        if (formatStates.bold || formatStates.italic || formatStates.underline) {
          const selection = window.getSelection();
          if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            
            if (range.collapsed) {
              // For future typing, apply the formatting commands to set the state
              try {
                if (formatStates.bold && !document.queryCommandState('bold')) {
                  document.execCommand('bold', false, null);
                }
                if (formatStates.italic && !document.queryCommandState('italic')) {
                  document.execCommand('italic', false, null);
                }
                if (formatStates.underline && !document.queryCommandState('underline')) {
                  document.execCommand('underline', false, null);
                }
                
                // Also handle turning off formatting when toggles are off
                if (!formatStates.bold && document.queryCommandState('bold')) {
                  document.execCommand('bold', false, null);
                }
                if (!formatStates.italic && document.queryCommandState('italic')) {
                  document.execCommand('italic', false, null);
                }
                if (!formatStates.underline && document.queryCommandState('underline')) {
                  document.execCommand('underline', false, null);
                }
              } catch (error) {
                console.warn('Could not maintain formatting state:', error);
              }
            }
          }
        }
      }, 0);
      
      handleChange();
    };

    const titleElement = titleRef.current;
    const editorElement = editorRef.current;

    titleElement?.addEventListener('input', handleChange);
    editorElement?.addEventListener('input', handleInput);

    // Save initial state
    saveState();

    return () => {
      titleElement?.removeEventListener('input', handleChange);
      editorElement?.removeEventListener('input', handleInput);
    };
  }, [onDataChange, saveState, isUndoRedoOperation, formatStates]);

  const handleFormat = (command) => {
    const editor = editorRef.current;
    if (!editor) return;

    editor.focus();

    // Toggle the format state manually - this stays active until clicked again
    const newState = !formatStates[command];
    setFormatStates(prev => ({
      ...prev,
      [command]: newState
    }));

    // Save state before making changes
    saveState();

    try {
      let execCommand;
      switch (command) {
        case 'bold':
          execCommand = 'bold';
          break;
        case 'italic':
          execCommand = 'italic';
          break;
        case 'underline':
          execCommand = 'underline';
          break;
        default:
          return;
      }
      
      // Apply formatting using execCommand
      document.execCommand(execCommand, false, null);
      
    } catch (error) {
      console.error('Format command failed:', error);
    }
  };

  const handleOrderedList = () => {
    const editor = editorRef.current;
    if (!editor) return;
    
    // Save state before making changes
    saveState();
    
    editor.focus();
    // Use execCommand for better undo/redo integration
    document.execCommand('insertOrderedList', false, null);
  };

  const handleUnorderedList = () => {
    const editor = editorRef.current;
    if (!editor) return;
    
    // Save state before making changes
    saveState();
    
    editor.focus();
    // Use execCommand for better undo/redo integration
    document.execCommand('insertUnorderedList', false, null);
  };

  const handleQuote = () => {
    const editor = editorRef.current;
    if (!editor) return;
    
    const selection = window.getSelection();
    if (selection.rangeCount > 0 && selection.toString().trim()) {
      // Save state before making changes
      saveState();
      
      editor.focus();
      
      // Try to use formatBlock for better undo integration
      try {
        document.execCommand('formatBlock', false, 'blockquote');
        
        // Apply custom styling to the blockquote
        setTimeout(() => {
          const blockquotes = editor.querySelectorAll('blockquote');
          const lastBlockquote = blockquotes[blockquotes.length - 1];
          if (lastBlockquote && !lastBlockquote.hasAttribute('data-styled')) {
            lastBlockquote.style.borderLeft = '4px solid #ccc';
            lastBlockquote.style.paddingLeft = '16px';
            lastBlockquote.style.marginLeft = '0';
            lastBlockquote.style.marginTop = '8px';
            lastBlockquote.style.marginBottom = '8px';
            lastBlockquote.style.color = '#666';
            lastBlockquote.style.fontStyle = 'italic';
            lastBlockquote.setAttribute('data-styled', 'true');
          }
          checkFormatStates();
        }, 0);
        
      } catch (error) {
        // Fallback to manual method if formatBlock fails
        console.warn('formatBlock failed, using manual method:', error);
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
      }
      
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

    // Save state before making changes
    saveState();

    if (savedSelection) {
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(savedSelection.cloneRange());
      
      // Focus the editor to ensure the command works properly
      editorRef.current?.focus();
      
      try {
        // Try to use createLink command for better undo integration
        document.execCommand('createLink', false, linkUrl);
        
        // Apply custom styling to the link
        setTimeout(() => {
          const links = editorRef.current?.querySelectorAll('a[href]');
          if (links && links.length > 0) {
            const lastLink = links[links.length - 1];
            if (lastLink && !lastLink.hasAttribute('data-styled')) {
              lastLink.target = '_blank';
              lastLink.rel = 'noopener noreferrer';
              lastLink.style.color = '#3b82f6';
              lastLink.style.textDecoration = 'underline';
              lastLink.setAttribute('data-styled', 'true');
            }
          }
        }, 0);
        
      } catch (error) {
        // Fallback to manual method if createLink fails
        console.warn('createLink failed, using manual method:', error);
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
      }
      
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
      // Save state before making changes
      saveState();
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const imgUrl = event.target.result;
        
        const img = document.createElement('img');
        img.src = imgUrl;
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        img.style.resize = 'both';
        img.style.display = 'block';
        img.style.margin = '0';
        img.contentEditable = 'false';
        
        const wrapper = document.createElement('div');
        wrapper.contentEditable = 'false';
        wrapper.style.display = 'block';
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
          
          // Insert the image wrapper
          range.insertNode(wrapper);
          
          // Create a line break and a new paragraph after the image
          const lineBreak = document.createElement('br');
          const newParagraph = document.createElement('div');
          newParagraph.innerHTML = '<br>'; // Ensures the div has content for cursor placement
          newParagraph.style.minHeight = '1.5em'; // Minimum height to prevent collapse
          
          // Insert line break and new paragraph after the wrapper
          if (wrapper.nextSibling) {
            wrapper.parentNode.insertBefore(lineBreak, wrapper.nextSibling);
            wrapper.parentNode.insertBefore(newParagraph, lineBreak.nextSibling);
          } else {
            wrapper.parentNode.appendChild(lineBreak);
            wrapper.parentNode.appendChild(newParagraph);
          }
          
          // Position cursor in the new paragraph
          const newRange = document.createRange();
          newRange.setStart(newParagraph, 0);
          newRange.collapse(true);
          selection.removeAllRanges();
          selection.addRange(newRange);
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
    // Handle Enter key for better line break behavior after images
    if (e.key === 'Enter') {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const container = range.startContainer;
        
        // Check if we're right after an image wrapper
        if (container.nodeType === Node.ELEMENT_NODE) {
          const prevSibling = container.previousSibling;
          if (prevSibling && prevSibling.classList && prevSibling.classList.contains('editor-image-wrapper')) {
            e.preventDefault();
            
            // Create a new paragraph with proper spacing
            const newParagraph = document.createElement('div');
            newParagraph.innerHTML = '<br>';
            newParagraph.style.minHeight = '1.5em';
            
            range.insertNode(newParagraph);
            
            // Position cursor in the new paragraph
            const newRange = document.createRange();
            newRange.setStart(newParagraph, 0);
            newRange.collapse(true);
            selection.removeAllRanges();
            selection.addRange(newRange);
            
            return;
          }
        }
      }
    }
    
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
        case 'z':
          // Handle Undo (Ctrl+Z)
          if (!e.shiftKey) {
            e.preventDefault();
            performUndo();
          }
          break;
        case 'y':
          // Handle Redo (Ctrl+Y)
          e.preventDefault();
          performRedo();
          break;
        case 'Z':
          // Handle Redo (Ctrl+Shift+Z) - alternative redo shortcut
          if (e.shiftKey) {
            e.preventDefault();
            performRedo();
          }
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
              { label: 'B', onClick: () => handleFormat('bold'), className: `toolbar-btn toolbar-btn-bold ${formatStates.bold ? 'toolbar-btn-active' : ''}`, title: 'Bold (Ctrl+B)' },
              { label: 'I', onClick: () => handleFormat('italic'), className: `toolbar-btn toolbar-btn-italic ${formatStates.italic ? 'toolbar-btn-active' : ''}`, title: 'Italic (Ctrl+I)' },
              { label: 'U', onClick: () => handleFormat('underline'), className: `toolbar-btn toolbar-btn-underline ${formatStates.underline ? 'toolbar-btn-active' : ''}`, title: 'Underline (Ctrl+U)' },
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