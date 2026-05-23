"use client";
import "./styles.css";

export default function CustomButton({
  handleClick,
  children,
  variant = "primary",
  className = "",
  disabled = false,
}) {
  const variantClass = variant === "secondary" ? "custom-button-secondary" : "custom-button-primary";
  
  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={`custom-button ${variantClass} ${className}`}
    >
      {children}
    </button>
  );
}
