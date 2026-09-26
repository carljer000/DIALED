export default function StateMessage({ children, kind = "status" }) {
  const className = kind === "loading" ? "loading" : kind === "empty" ? "empty-state" : "form-message";
  const role = kind === "error" ? "alert" : "status";

  return (
    <p className={className} role={role}>
      {children}
    </p>
  );
}
