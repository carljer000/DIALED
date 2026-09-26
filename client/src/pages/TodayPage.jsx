import CheckInForm from "../components/organisms/CheckInForm.jsx";
import PageHeader from "../components/molecules/PageHeader.jsx";

export default function TodayPage() {
  return (
    <section className="page">
      <PageHeader
        eyebrow="DAILY CUT JOURNAL"
        title="Stay"
        accent="Dialed."
        subtitle="Small actions, visible proof."
      />
      <CheckInForm />
    </section>
  );
}
