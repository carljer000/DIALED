import ThemeToggle from "./ThemeToggle.jsx";

export default function PageHeader({ eyebrow, title, accent, subtitle, action }) {
  return (
    <header className="page-header">
      <div className="page-header-top">
        <p className="eyebrow">{eyebrow}</p>
        <div className="page-header-actions">
          <ThemeToggle />
          {action}
        </div>
      </div>
      <h1>
        {title} <em>{accent}</em>
      </h1>
      <p className="subtle">{subtitle}</p>
    </header>
  );
}
