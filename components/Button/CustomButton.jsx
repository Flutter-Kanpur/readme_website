"use client";
export default function CustomButton({ handleClick, children, className = "" }) {

  return (
    <button
      onClick={handleClick}
      className={`bg-black text-white px-4 py-2 rounded-full text-sm cursor-pointer hover:opacity-90 transition ${className}`}
    >
      {children}
    </button>
  );
}
