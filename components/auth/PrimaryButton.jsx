export default function PrimaryButton({ children, onClick, type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      style={{
        width: "100%",
        border: "none",
        borderRadius: 12,
        padding: "12px 16px",
        backgroundColor: "#000",
        color: "#fff",
        fontSize: 14,
        fontWeight: 600,
        cursor: "pointer",
        boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
      }}
    >
      {children}
    </button>
  );
}
