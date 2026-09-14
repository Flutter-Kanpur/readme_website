'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollToTopOnNavigate() {
  const pathname = usePathname();

  useEffect(() => {
    const scrollContainer = document.getElementById('app-scroll');
    if (scrollContainer) {
      scrollContainer.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}
