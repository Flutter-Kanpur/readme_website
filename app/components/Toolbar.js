import './Toolbar.css';

/**
 * `icon` is now a React node (e.g. <List />, <Quote /> from lucide-react),
 * not a {src, alt} object. The previous shape pointed at PNGs that don't
 * exist in /public, which is why the toolbar was rendering broken images.
 */
function ToolbarButton({ onClick, className, title, type = 'button', icon, pressed, children }) {
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onClick && onClick();
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
  };

  return (
    <button
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      className={className}
      title={title}
      type={type}
      aria-label={title}
      aria-pressed={typeof pressed === 'boolean' ? pressed : undefined}
    >
      {icon}
      {children}
    </button>
  );
}

export default function Toolbar({ buttons = [] }) {
  return (
    <div className="toolbar">
      {buttons.map((group, i) => (
        <div className="toolbar-group" key={i}>
          {group.map((btn, j) => (
            <ToolbarButton
              key={j}
              onClick={btn.onClick}
              className={btn.className}
              title={btn.title}
              icon={btn.icon}
              type={btn.type}
              pressed={btn.pressed}
            >
              {btn.label}
            </ToolbarButton>
          ))}
        </div>
      ))}
    </div>
  );
}

