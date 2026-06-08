'use client';

import { useEffect, useState } from 'react';

const KEYBOARD_HEIGHT_THRESHOLD = 120;

function isTextInput(el) {
  if (!el || !(el instanceof HTMLElement)) return false;
  const tag = el.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || el.isContentEditable;
}

function isKeyboardVisible() {
  const vv = window.visualViewport;
  if (!vv) return false;
  return window.innerHeight - vv.height > KEYBOARD_HEIGHT_THRESHOLD;
}

export default function useMobileKeyboardOpen() {
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(min-width: 768px)').matches) return;

    const scrollRoot = document.getElementById('app-scroll');
    let focusTimeout;

    const syncState = (open) => {
      setKeyboardOpen(open);
      scrollRoot?.classList.toggle('keyboard-open', open);
    };

    const handleViewportChange = () => {
      syncState(isKeyboardVisible());
    };

    const handleFocusIn = (e) => {
      if (isTextInput(e.target)) {
        clearTimeout(focusTimeout);
        syncState(true);
      }
    };

    const handleFocusOut = () => {
      clearTimeout(focusTimeout);
      focusTimeout = setTimeout(() => {
        if (isTextInput(document.activeElement)) return;
        syncState(isKeyboardVisible());
      }, 100);
    };

    window.visualViewport?.addEventListener('resize', handleViewportChange);
    window.visualViewport?.addEventListener('scroll', handleViewportChange);
    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('focusout', handleFocusOut);

    return () => {
      clearTimeout(focusTimeout);
      window.visualViewport?.removeEventListener('resize', handleViewportChange);
      window.visualViewport?.removeEventListener('scroll', handleViewportChange);
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('focusout', handleFocusOut);
      scrollRoot?.classList.remove('keyboard-open');
    };
  }, []);

  return keyboardOpen;
}
