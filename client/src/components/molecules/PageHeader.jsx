export default function PageHeader({ eyebrow, title, accent, subtitle }) {
  return (
    <header className="page-header">
      <p className="eyebrow">{eyebrow}</p>
      <h1>
        {title} <em>{accent}</em>
      </h1>
      <p className="subtle">{subtitle}</p>
    </header>
  );
}
