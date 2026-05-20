"use client";
import "./styles.css";

export default function CustomButton({ handleClick, children, variant = "primary", className = "" }) {
  const variantClass = variant === "secondary" ? "custom-button-secondary" : "custom-button-primary";
  
  return (
    <button
      onClick={handleClick}
      className={`custom-button ${variantClass} ${className}`}
    >
      {children}
    </button>
  );
}
