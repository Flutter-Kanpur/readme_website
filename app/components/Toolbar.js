import Icon from './Icon';
import './Toolbar.css';

export default function Toolbar({ onBold, onItalic, onUnderline, onQuote, onLink, onImage }) {
  const handleMouseDown = (e, callback) => {
    e.preventDefault();
    callback();
  };

  return (
    <div className="toolbar">

      <div className="toolbar-group">
        <button 
          onMouseDown={(e) => handleMouseDown(e, onBold)}
          className="toolbar-btn toolbar-btn-bold"
          title="Bold (Ctrl+B)"
          type="button"
        >
          B
        </button>
        <button 
          onMouseDown={(e) => handleMouseDown(e, onItalic)}
          className="toolbar-btn toolbar-btn-italic"
          title="Italic (Ctrl+I)"
          type="button"
        >
          I
        </button>
        <button 
          onMouseDown={(e) => handleMouseDown(e, onUnderline)}
          className="toolbar-btn toolbar-btn-underline"
          title="Underline (Ctrl+U)"
          type="button"
        >
          U
        </button>
      </div>

      <div className="toolbar-group">
        <button 
          onMouseDown={(e) => handleMouseDown(e, onQuote)}
          className="toolbar-btn toolbar-btn-icon"
          title="Quote"
          type="button"
        >
          <Icon src="/assets/icons/quote.png" alt="Quote" />
        </button>

        <button 
          onMouseDown={(e) => handleMouseDown(e, onLink)}
          className="toolbar-btn toolbar-btn-icon"
          title="Link"
          type="button"
        >
          <Icon src="/assets/icons/link.png" alt="Link" />
        </button>

        <button 
          onMouseDown={(e) => handleMouseDown(e, onImage)}
          className="toolbar-btn toolbar-btn-icon"
          title="Image"
          type="button"
        >
          <Icon src="/assets/icons/image.png" alt="Image" />
        </button>
      </div>

    </div>
  );
}
