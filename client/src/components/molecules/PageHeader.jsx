export default function PageHeader({ eyebrow, title, accent, subtitle, action }) {
  return (
    <header className="page-header">
      <div className="page-header-top">
        <p className="eyebrow">{eyebrow}</p>
        {action}
      </div>
      <h1>
        {title} <em>{accent}</em>
      </h1>
      <p className="subtle">{subtitle}</p>
    </header>
  );
}
