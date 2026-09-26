import { NavLink } from "react-router-dom";

const items = [
  { to: "/", label: "Today", icon: "◎" },
  { to: "/dashboard", label: "Dashboard", icon: "⌁" },
  { to: "/history", label: "History", icon: "≡" },
];

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
          <span aria-hidden="true">{item.icon}</span>
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
