
import Icon from './Icon';
import './Toolbar.css';

function ToolbarButton({ onClick, className, title, type = 'button', children }) {
  const handleMouseDown = (e) => {
    e.preventDefault();
    onClick();
  };
  return (
    <button
      onMouseDown={handleMouseDown}
      className={className}
      title={title}
      type={type}
    >
      {children}
    </button>
  );
}

export default function Toolbar({ onBold, onItalic, onUnderline, onQuote, onLink, onImage }) {
  return (
    <div className="toolbar">
      <div className="toolbar-group">
        <ToolbarButton onClick={onBold} className="toolbar-btn toolbar-btn-bold" title="Bold (Ctrl+B)">B</ToolbarButton>
        <ToolbarButton onClick={onItalic} className="toolbar-btn toolbar-btn-italic" title="Italic (Ctrl+I)">I</ToolbarButton>
        <ToolbarButton onClick={onUnderline} className="toolbar-btn toolbar-btn-underline" title="Underline (Ctrl+U)">U</ToolbarButton>
      </div>
      <div className="toolbar-group">
        <ToolbarButton onClick={onQuote} className="toolbar-btn toolbar-btn-icon" title="Quote">
          <Icon src="/assets/icons/quote.png" alt="Quote" />
        </ToolbarButton>
        <ToolbarButton onClick={onLink} className="toolbar-btn toolbar-btn-icon" title="Link">
          <Icon src="/assets/icons/link.png" alt="Link" />
        </ToolbarButton>
        <ToolbarButton onClick={onImage} className="toolbar-btn toolbar-btn-icon" title="Image">
          <Icon src="/assets/icons/image.png" alt="Image" />
        </ToolbarButton>
      </div>
    </div>
  );
}
