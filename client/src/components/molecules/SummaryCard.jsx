export default function SummaryCard({ label, value, unit, variant = "default" }) {
  return (
    <article className={variant === "secondary" ? "secondary" : ""}>
      <span>{label}</span>
      <strong>
        {value}
        <small> {unit}</small>
      </strong>
    </article>
  );
}
