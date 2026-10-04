import { NavLink } from "react-router-dom";

const items = [
  { to: "/", label: "Today", icon: "journal" },
  { to: "/dashboard", label: "Dashboard", icon: "chart" },
  { to: "/history", label: "History", icon: "calendar" },
];

function NavIcon({ name }) {
  if (name === "journal") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="3.5" width="15" height="17" rx="2" />
        <path d="M8.5 3.5v17M11.5 8h5M11.5 12h5M11.5 16h3" />
      </svg>
    );
  }

  if (name === "chart") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3.5 20.5h17" />
        <rect x="5" y="12" width="3" height="6" rx="0.7" />
        <rect x="10.5" y="8" width="3" height="10" rx="0.7" />
        <rect x="16" y="4" width="3" height="14" rx="0.7" />
      </svg>
    );
  }

  if (name === "calendar") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3.5" y="5" width="17" height="16" rx="2" />
        <path d="M7.5 3v4M16.5 3v4M3.5 9h17M8 13h.01M12 13h.01M16 13h.01M8 17h.01M12 17h.01M16 17h.01" strokeWidth="2.4" />
      </svg>
    );
  }

  return name;
}

export default function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === "/"}
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          <span className="nav-icon" aria-hidden="true"><NavIcon name={item.icon} /></span>
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
