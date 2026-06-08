'use client';

import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import WriteActionBar from './WriteActionBar';

export default function WriteMobileHeader(props) {
  const router = useRouter();

  const handleClose = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
      return;
    }
    router.push('/drafts');
  };

  return (
    <header className="write-mobile-header">
      <button
        type="button"
        onClick={handleClose}
        className="write-mobile-header__close"
        aria-label="Close editor"
      >
        <X className="write-mobile-header__close-icon" aria-hidden="true" />
      </button>
      <WriteActionBar {...props} className="write-mobile-header__actions" />
    </header>
  );
}
