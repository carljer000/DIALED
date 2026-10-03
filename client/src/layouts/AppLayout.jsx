import { Outlet } from "react-router-dom";
import BottomNav from "../components/organisms/BottomNav.jsx";

export default function AppLayout() {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <main id="main-content" tabIndex="-1">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
