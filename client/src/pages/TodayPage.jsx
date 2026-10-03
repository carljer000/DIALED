import { Link } from "react-router-dom";
import CheckInForm from "../components/organisms/CheckInForm.jsx";
import PageHeader from "../components/molecules/PageHeader.jsx";

export default function TodayPage() {
  return (
    <section className="page today-page">
      <PageHeader
        eyebrow="DAILY CUT JOURNAL"
        title="Stay"
        accent="Dialed."
        subtitle="Small actions, visible proof."
        action={
          <Link className="settings-link" to="/settings" aria-label="Open settings">
            ⚙
          </Link>
        }
      />
      <CheckInForm />
    </section>
  );
}
