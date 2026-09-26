import { Outlet } from "react-router-dom";
import BottomNav from "../components/organisms/BottomNav.jsx";

export default function AppLayout() {
  return (
    <div className="app-shell">
      <main>
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
