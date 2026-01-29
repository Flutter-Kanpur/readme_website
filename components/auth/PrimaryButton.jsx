export default function PrimaryButton({
  children,
  onClick,
  type = "button",
  disabled = false,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%",
        border: "none",
        borderRadius: 12,
        padding: "12px 16px",
        backgroundColor: "#000",
        color: "#fff",
        fontSize: 14,
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
        boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
        transition: "opacity 0.2s ease",
      }}
    >
      {children}
    </button>
  );
}
