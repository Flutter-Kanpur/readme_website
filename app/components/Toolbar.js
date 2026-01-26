export default function Toolbar({ onBold, onItalic, onUnderline, onQuote, onLink, onImage }) {
  const handleMouseDown = (e, callback) => {
    e.preventDefault();
    callback();
  };

  return (
    <div className="flex items-center justify-between border border-gray-200 rounded-full px-4 py-2.5 bg-white shadow-sm max-w-[580px]">

      <div className="flex items-center gap-2">
        <button 
          onMouseDown={(e) => handleMouseDown(e, onBold)}
          className="w-8 h-8 hover:bg-gray-100 rounded flex items-center justify-center font-semibold text-gray-700"
          title="Bold (Ctrl+B)"
          type="button"
        >
          B
        </button>
        <button 
          onMouseDown={(e) => handleMouseDown(e, onItalic)}
          className="w-8 h-8 hover:bg-gray-100 rounded flex items-center justify-center italic text-gray-700"
          title="Italic (Ctrl+I)"
          type="button"
        >
          I
        </button>
        <button 
          onMouseDown={(e) => handleMouseDown(e, onUnderline)}
          className="w-8 h-8 hover:bg-gray-100 rounded flex items-center justify-center underline text-gray-700"
          title="Underline (Ctrl+U)"
          type="button"
        >
          U
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button 
          onMouseDown={(e) => handleMouseDown(e, onQuote)}
          className="w-8 h-8 hover:bg-gray-100 rounded flex items-center justify-center text-gray-600" 
          title="Quote"
          type="button"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>
            <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/>
          </svg>
        </button>

        <button 
          onMouseDown={(e) => handleMouseDown(e, onLink)}
          className="w-8 h-8 hover:bg-gray-100 rounded flex items-center justify-center text-gray-600" 
          title="Link"
          type="button"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
          </svg>
        </button>

        <button 
          onMouseDown={(e) => handleMouseDown(e, onImage)}
          className="w-8 h-8 hover:bg-gray-100 rounded flex items-center justify-center text-gray-600" 
          title="Image"
          type="button"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
        </button>
      </div>

    </div>
  );
}
