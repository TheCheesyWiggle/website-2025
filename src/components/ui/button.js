export function Button({ children, ...props }) {
  return (
    <button {...props} style={{ padding: "0.5rem 1rem", borderRadius: "4px", border: "none", background: "#e63946", color: "#fff", fontWeight: "bold" }}>
      {children}
    </button>
  );
}