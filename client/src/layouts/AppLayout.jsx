import { Outlet, useLocation } from "react-router-dom";
import BottomNav from "../components/organisms/BottomNav.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function AppLayout() {
  const { exitDemo, mode } = useAuth();
  const location = useLocation();
  const showDemoExit = mode === "demo" && location.pathname !== "/settings";

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <main id="main-content" tabIndex="-1">
        <Outlet />
      </main>
      {showDemoExit && (
        <footer className="demo-exit-footer" aria-label="Demo session controls">
          <button type="button" onClick={exitDemo}>Exit demo</button>
        </footer>
      )}
      <BottomNav />
    </div>
  );
}
