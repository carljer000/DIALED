import ThemeToggle from "./ThemeToggle.jsx";

export default function PageHeader({ eyebrow, title, accent, subtitle, action }) {
  return (
    <header className="page-header">
      <div className="page-header-top">
        <div className="page-header-brand">
          <span className="page-header-logo-frame" aria-hidden="true">
            <img className="page-header-logo" src="/dialed-logo.png" alt="" />
          </span>
          <p className="eyebrow">{eyebrow}</p>
        </div>
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
