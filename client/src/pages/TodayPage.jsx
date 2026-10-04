import { flushSync } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import CheckInForm from "../components/organisms/CheckInForm.jsx";
import PageHeader from "../components/molecules/PageHeader.jsx";

export default function TodayPage() {
  const navigate = useNavigate();

  function openSettings(event) {
    event.preventDefault();
    const root = document.documentElement;
    const goToSettings = () => flushSync(() => navigate("/settings"));

    if (typeof document.startViewTransition !== "function") {
      goToSettings();
      return;
    }

    root.dataset.pageTransition = "settings-in";
    const transition = document.startViewTransition(goToSettings);
    transition.finished.finally(() => {
      delete root.dataset.pageTransition;
    });
  }

  return (
    <section className="page today-page">
      <PageHeader
        eyebrow="DAILY CUT JOURNAL"
        title="Stay"
        accent="Dialed."
        subtitle="Small actions, visible proof."
        action={
          <Link
            className="settings-link"
            to="/settings"
            aria-label="Open settings"
            viewTransition
            onClick={openSettings}
          >
            ⚙
          </Link>
        }
      />
      <CheckInForm />
    </section>
  );
}
