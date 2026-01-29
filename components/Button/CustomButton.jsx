"use client";

import { useRouter } from "next/navigation";

export default function CustomButton({ href, children, className = "" }) {
  const router = useRouter();

  const handleClick = () => {
    router.push(href);
  };

  return (
    <button
      onClick={handleClick}
      className={`bg-black text-white px-4 py-2 rounded-full text-sm cursor-pointer hover:opacity-90 transition ${className}`}
    >
      {children}
    </button>
  );
}
