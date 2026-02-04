
import Icon from './Icon';
import './Toolbar.css';

function ToolbarButton({ onClick, className, title, type = 'button', icon, children }) {
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
    >
      {icon && <Icon src={icon.src} alt={icon.alt} className="toolbar-icon" />}
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
            >
              {btn.label}
            </ToolbarButton>
          ))}
        </div>
      ))}
    </div>
  );
}

