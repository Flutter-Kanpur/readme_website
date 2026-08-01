'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import {
  List,
  ListOrdered,
  Quote,
  Link2,
  ImageIcon,
  X,
} from 'lucide-react';
import Toolbar from "./Toolbar";
import './Editor.css';

export default function Editor({ onDataChange, initialData }) {
  const editorRef = useRef(null);
  const titleRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (initialData) {
      if (titleRef.current) titleRef.current.value = initialData.title || '';
      if (editorRef.current) {
        editorRef.current.innerHTML = initialData.content || '';
        const isEmpty = editorRef.current.textContent.trim() === '';
        editorRef.current.setAttribute('data-empty', isEmpty);
      }
    }
  }, [initialData]);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [savedSelection, setSavedSelection] = useState(null);
  const selectedImageRef = useRef(null);
  const [formatStates, setFormatStates] = useState({
    bold: false,
    italic: false,
    underline: false,
    bulletList: false,
    orderedList: false,
    quote: false,
    link: false,
    image: false,
  });

  const getAncestor = useCallback((node, predicate) => {
    const editor = editorRef.current;
    if (!editor || !node) return null;
    let el = node.nodeType === Node.TEXT_NODE ? node.parentElement : node;
    while (el && el !== editor) {
      if (predicate(el)) return el;
      el = el.parentElement;
    }
    return null;
  }, []);

  const getBlockquoteAncestor = useCallback(
    (node) => getAncestor(node, (el) => el.nodeName === 'BLOCKQUOTE'),
    [getAncestor]
  );

  const getLinkAncestor = useCallback(
    (node) => getAncestor(node, (el) => el.nodeName === 'A' && !!el.href),
    [getAncestor]
  );

  const getListAncestor = useCallback(
    (node, type) => getAncestor(node, (el) => el.nodeName === type),
    [getAncestor]
  );

  const getImageWrapperAncestor = useCallback(
    (node) => getAncestor(node, (el) => el.classList?.contains('editor-image-wrapper')),
    [getAncestor]
  );

  const applyBlockquoteStyles = useCallback((el) => {
    if (!el || el.hasAttribute('data-styled')) return;
    el.style.borderLeft = '4px solid #ccc';
    el.style.paddingLeft = '16px';
    el.style.marginLeft = '0';
    el.style.marginTop = '8px';
    el.style.marginBottom = '8px';
    el.style.color = '#666';
    el.style.fontStyle = 'italic';
    el.setAttribute('data-styled', 'true');
  }, []);

  const unwrapBlockquote = useCallback((blockquote) => {
    const parent = blockquote.parentNode;
    if (!parent) return;

    const selection = window.getSelection();
    const range = selection?.rangeCount ? selection.getRangeAt(0) : null;
    const marker = document.createTextNode('\u200B');

    if (range && blockquote.contains(range.startContainer)) {
      blockquote.insertBefore(marker, blockquote.firstChild);
    }

    while (blockquote.firstChild) {
      parent.insertBefore(blockquote.firstChild, blockquote);
    }
    parent.removeChild(blockquote);

    if (marker.parentNode && selection) {
      const restore = document.createRange();
      restore.setStartAfter(marker);
      restore.collapse(true);
      selection.removeAllRanges();
      selection.addRange(restore);
      marker.parentNode.removeChild(marker);
    }
  }, []);

  const updateFormatStates = useCallback(() => {
    const editor = editorRef.current;
    const empty = {
      bold: false,
      italic: false,
      underline: false,
      bulletList: false,
      orderedList: false,
      quote: false,
      link: false,
      image: false,
    };

    if (!editor) {
      setFormatStates((prev) => {
        const same = Object.keys(empty).every((key) => prev[key] === empty[key]);
        return same ? prev : empty;
      });
      return;
    }

    const selection = window.getSelection();
    const anchor = selection?.anchorNode;
    const inEditor = !!(selection && selection.rangeCount > 0 && anchor && editor.contains(anchor));

    let next = { ...empty };

    if (inEditor) {
      try {
        next.bold = document.queryCommandState('bold');
        next.italic = document.queryCommandState('italic');
        next.underline = document.queryCommandState('underline');
        next.bulletList = document.queryCommandState('insertUnorderedList');
        next.orderedList = document.queryCommandState('insertOrderedList');
      } catch {
        // queryCommandState can throw in some browsers
      }

      next.quote = !!getBlockquoteAncestor(anchor);
      next.link = !!getLinkAncestor(anchor);
      next.bulletList = next.bulletList || !!getListAncestor(anchor, 'UL');
      next.orderedList = next.orderedList || !!getListAncestor(anchor, 'OL');
    }

    const selectedImage = selectedImageRef.current;
    next.image = !!(selectedImage && editor.contains(selectedImage));

    setFormatStates((prev) => {
      const same = Object.keys(next).every((key) => prev[key] === next[key]);
      return same ? prev : next;
    });
  }, [getBlockquoteAncestor, getLinkAncestor, getListAncestor]);

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
    saveState();

    try {
      const commands = { bold: 'bold', italic: 'italic', underline: 'underline' };
      const execCommand = commands[command];
      if (!execCommand) return;
      document.execCommand(execCommand, false, null);
      updateFormatStates();
    } catch (error) {
      console.error('Format command failed:', error);
    }
  };

  const handleOrderedList = () => {
    const editor = editorRef.current;
    if (!editor) return;

    saveState();
    editor.focus();
    document.execCommand('insertOrderedList', false, null);
    updateFormatStates();
  };

  const handleUnorderedList = () => {
    const editor = editorRef.current;
    if (!editor) return;

    saveState();
    editor.focus();
    document.execCommand('insertUnorderedList', false, null);
    updateFormatStates();
  };

  const handleQuote = () => {
    const editor = editorRef.current;
    if (!editor) return;

    editor.focus();

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    if (!editor.contains(range.commonAncestorContainer)) return;

    const existingQuote =
      getBlockquoteAncestor(range.commonAncestorContainer) ||
      getBlockquoteAncestor(selection.anchorNode);

    saveState();

    if (existingQuote) {
      unwrapBlockquote(existingQuote);
      const title = titleRef.current?.value || '';
      onDataChange?.({ title, content: editor.innerHTML });
      updateFormatStates();
      return;
    }

    try {
      document.execCommand('formatBlock', false, 'blockquote');
      setTimeout(() => {
        const quoted =
          getBlockquoteAncestor(window.getSelection()?.anchorNode) ||
          editor.querySelector('blockquote:not([data-styled])');
        if (quoted) applyBlockquoteStyles(quoted);
        const title = titleRef.current?.value || '';
        onDataChange?.({ title, content: editor.innerHTML });
        updateFormatStates();
      }, 0);
    } catch (error) {
      console.warn('formatBlock failed, using manual method:', error);
      const selectedContent = range.extractContents();
      const blockquote = document.createElement('blockquote');
      applyBlockquoteStyles(blockquote);
      blockquote.appendChild(selectedContent);
      range.insertNode(blockquote);
      range.selectNodeContents(blockquote);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
      const title = titleRef.current?.value || '';
      onDataChange?.({ title, content: editor.innerHTML });
      updateFormatStates();
    }
  };

  const handleLink = () => {
    const editor = editorRef.current;
    if (!editor) return;

    editor.focus();
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const existingLink = getLinkAncestor(selection.anchorNode);
    if (existingLink) {
      saveState();
      const range = document.createRange();
      range.selectNodeContents(existingLink);
      selection.removeAllRanges();
      selection.addRange(range);
      document.execCommand('unlink', false, null);
      const title = titleRef.current?.value || '';
      onDataChange?.({ title, content: editor.innerHTML });
      updateFormatStates();
      return;
    }

    let range = selection.getRangeAt(0);
    if (range.collapsed) {
      const node = selection.anchorNode;
      if (node && node.nodeType === Node.TEXT_NODE && node.textContent) {
        const text = node.textContent;
        let start = selection.anchorOffset;
        let end = selection.anchorOffset;
        while (start > 0 && /\S/.test(text[start - 1])) start -= 1;
        while (end < text.length && /\S/.test(text[end])) end += 1;
        if (start !== end) {
          range = document.createRange();
          range.setStart(node, start);
          range.setEnd(node, end);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }
    }

    setSavedSelection(range.cloneRange());
    setLinkUrl('');
    setShowLinkDialog(true);
  };

  const styleLink = (anchor) => {
    if (!anchor || anchor.hasAttribute('data-styled')) return;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    anchor.style.color = '#3b82f6';
    anchor.style.textDecoration = 'underline';
    anchor.setAttribute('data-styled', 'true');
  };

  const insertLink = () => {
    if (!linkUrl.trim()) return;

    saveState();

    const editor = editorRef.current;
    if (savedSelection && editor) {
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(savedSelection.cloneRange());
      editor.focus();

      const selectedText = savedSelection.toString().trim();

      if (!selectedText) {
        const anchor = document.createElement('a');
        anchor.href = linkUrl;
        anchor.textContent = linkUrl;
        styleLink(anchor);
        savedSelection.insertNode(anchor);
        const newRange = document.createRange();
        newRange.setStartAfter(anchor);
        newRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(newRange);
      } else {
        try {
          document.execCommand('createLink', false, linkUrl);
          setTimeout(() => {
            editor.querySelectorAll('a[href]').forEach(styleLink);
            updateFormatStates();
          }, 0);
        } catch (error) {
          console.warn('createLink failed, using manual method:', error);
          const anchor = document.createElement('a');
          anchor.href = linkUrl;
          anchor.textContent = selectedText;
          styleLink(anchor);
          savedSelection.deleteContents();
          savedSelection.insertNode(anchor);
          const newRange = document.createRange();
          newRange.setStartAfter(anchor);
          newRange.collapse(true);
          selection.removeAllRanges();
          selection.addRange(newRange);
        }
      }

      editor.focus();
      updateFormatStates();
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
    const editor = editorRef.current;
    const selectedImage = selectedImageRef.current;

    if (selectedImage && editor?.contains(selectedImage)) {
      saveState();
      selectedImage.remove();
      selectedImageRef.current = null;
      const title = titleRef.current?.value || '';
      onDataChange?.({ title, content: editor.innerHTML });
      editor.focus();
      updateFormatStates();
      return;
    }

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
        
        selectedImageRef.current = wrapper;
        editorRef.current?.focus();
        updateFormatStates();
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
    const deleteBtn = e.target.closest('.editor-image-delete');
    if (deleteBtn) {
      e.preventDefault();
      e.stopPropagation();
      if (confirm('Are you sure you want to delete this image?')) {
        const wrapper = deleteBtn.closest('.editor-image-wrapper');
        if (wrapper) {
          saveState();
          if (selectedImageRef.current === wrapper) selectedImageRef.current = null;
          wrapper.remove();
          const title = titleRef.current?.value || '';
          const content = editorRef.current?.innerHTML || '';
          onDataChange?.({ title, content });
          editorRef.current?.focus();
          updateFormatStates();
        }
      }
      return;
    }

    const imageWrapper = getImageWrapperAncestor(e.target);
    selectedImageRef.current =
      imageWrapper && editorRef.current?.contains(imageWrapper) ? imageWrapper : null;

    const target = e.target.closest('a');
    if (target && target.href && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      window.open(target.href, '_blank', 'noopener,noreferrer');
    }

    updateFormatStates();
  };

  const handleEditorMouseUp = () => {
    updateFormatStates();
  };

  const handleEditorKeyUp = () => {
    selectedImageRef.current = null;
    updateFormatStates();
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
                aria-label="Close"
              >
                <X className="link-dialog-close-icon" aria-hidden="true" />
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
              {
                label: 'B',
                onClick: () => handleFormat('bold'),
                className: `toolbar-btn toolbar-btn-bold ${formatStates.bold ? 'toolbar-btn-active' : ''}`,
                title: formatStates.bold ? 'Remove bold (Ctrl+B)' : 'Bold (Ctrl+B)',
                pressed: formatStates.bold,
              },
              {
                label: 'I',
                onClick: () => handleFormat('italic'),
                className: `toolbar-btn toolbar-btn-italic ${formatStates.italic ? 'toolbar-btn-active' : ''}`,
                title: formatStates.italic ? 'Remove italic (Ctrl+I)' : 'Italic (Ctrl+I)',
                pressed: formatStates.italic,
              },
              {
                label: 'U',
                onClick: () => handleFormat('underline'),
                className: `toolbar-btn toolbar-btn-underline ${formatStates.underline ? 'toolbar-btn-active' : ''}`,
                title: formatStates.underline ? 'Remove underline (Ctrl+U)' : 'Underline (Ctrl+U)',
                pressed: formatStates.underline,
              },
              {
                icon: (
                  <List
                    className="toolbar-icon"
                    aria-hidden="true"
                    fill={formatStates.bulletList ? 'currentColor' : 'none'}
                  />
                ),
                onClick: handleUnorderedList,
                className: `toolbar-btn toolbar-btn-icon toolbar-btn-bullet-list ${formatStates.bulletList ? 'toolbar-btn-active' : ''}`,
                title: formatStates.bulletList ? 'Remove bullet list' : 'Bullet List',
                pressed: formatStates.bulletList,
              },
              {
                icon: (
                  <ListOrdered
                    className="toolbar-icon"
                    aria-hidden="true"
                    fill={formatStates.orderedList ? 'currentColor' : 'none'}
                  />
                ),
                onClick: handleOrderedList,
                className: `toolbar-btn toolbar-btn-icon toolbar-btn-numbered-list ${formatStates.orderedList ? 'toolbar-btn-active' : ''}`,
                title: formatStates.orderedList ? 'Remove numbered list' : 'Numbered List',
                pressed: formatStates.orderedList,
              },
              {
                icon: (
                  <Quote
                    className="toolbar-icon"
                    aria-hidden="true"
                    fill={formatStates.quote ? 'currentColor' : 'none'}
                  />
                ),
                onClick: handleQuote,
                className: `toolbar-btn toolbar-btn-icon ${formatStates.quote ? 'toolbar-btn-active' : ''}`,
                title: formatStates.quote ? 'Remove quote' : 'Quote',
                pressed: formatStates.quote,
              },
              {
                icon: (
                  <Link2
                    className="toolbar-icon"
                    aria-hidden="true"
                    fill={formatStates.link ? 'currentColor' : 'none'}
                  />
                ),
                onClick: handleLink,
                className: `toolbar-btn toolbar-btn-icon ${formatStates.link ? 'toolbar-btn-active' : ''}`,
                title: formatStates.link ? 'Remove link' : 'Link',
                pressed: formatStates.link,
              },
              {
                icon: (
                  <ImageIcon
                    className="toolbar-icon"
                    aria-hidden="true"
                    fill={formatStates.image ? 'currentColor' : 'none'}
                  />
                ),
                onClick: handleImage,
                className: `toolbar-btn toolbar-btn-icon ${formatStates.image ? 'toolbar-btn-active' : ''}`,
                title: formatStates.image ? 'Remove image' : 'Image',
                pressed: formatStates.image,
              },
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
        onMouseUp={handleEditorMouseUp}
        onKeyUp={handleEditorKeyUp}
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