export default function Button({
  children,
  className = "",
  type = "button",
  loading = false,
  disabled = false,
  ...props
}) {
  return (
    <button
      type={type}
      className={className}
      disabled={disabled || loading}
      {...props}
    >
      {children}
    </button>
  );
}
