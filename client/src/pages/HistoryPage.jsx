import PageHeader from "../components/molecules/PageHeader.jsx";
import StateMessage from "../components/atoms/StateMessage.jsx";
import HistoryList from "../components/organisms/HistoryList.jsx";
import { useDialed } from "../context/DialedContext.jsx";

export default function HistoryPage() {
  const { checkins, loading, error, deleteCheckin } = useDialed();

  return (
    <section className="page">
      <PageHeader
        eyebrow="THE RECEIPTS"
        title="Your"
        accent="history."
        subtitle="Every logged day counts as evidence."
      />
      {loading ? (
        <StateMessage kind="loading">Loading history…</StateMessage>
      ) : error ? (
        <StateMessage kind="error">{error}</StateMessage>
      ) : (
        <HistoryList checkins={checkins} onDelete={deleteCheckin} />
      )}
    </section>
  );
}
