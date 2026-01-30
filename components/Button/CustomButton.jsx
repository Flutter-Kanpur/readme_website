"use client";
import "./styles.css";

export default function CustomButton({ handleClick, children, styles }) {
  return (
    <button
      onClick={handleClick}
      className={!styles ? "custom-button" : ""}
      style={styles}
    >
      {children}
    </button>
  );
}
