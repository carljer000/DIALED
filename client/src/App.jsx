import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import AppLayout from "./layouts/AppLayout.jsx";
import HistoryPage from "./pages/HistoryPage.jsx";
import TodayPage from "./pages/TodayPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import StateMessage from "./components/atoms/StateMessage.jsx";
import AccessPage from "./components/organisms/AccessPage.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import { DialedProvider } from "./context/DialedContext.jsx";

const DashboardPage = lazy(() => import("./pages/DashboardPage.jsx"));

function LazyDashboard() {
  return (
    <Suspense fallback={<section className="page"><StateMessage kind="loading">Loading dashboard…</StateMessage></section>}>
      <DashboardPage />
    </Suspense>
  );
}

export default function App() {
  const { accessToken, loading, mode } = useAuth();

  if (loading) return <AccessPage loading />;
  if (!mode) return <AccessPage />;

  return (
    <DialedProvider key={mode} mode={mode} accessToken={accessToken}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<TodayPage />} />
          <Route path="/dashboard" element={<LazyDashboard />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </DialedProvider>
  );
}
