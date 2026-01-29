import Image from "next/image";

export default function GoogleButton({ children = "Continue with Google" }) {
  return (
    <button
      type="button"
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        borderRadius: 12,
        border: "1px solid #E5E7EB",
        backgroundColor: "#fff",
        padding: "12px 16px",
        color: "#111827",
        fontSize: 14,
        fontWeight: 600,
        cursor: "pointer",
      }}
    >
      <Image src="/google.png" alt="Google" width={20} height={20} />
      {children}
    </button>
  );
}
