import { useState } from "react";
import PageHeader from "../components/molecules/PageHeader.jsx";
import StateMessage from "../components/atoms/StateMessage.jsx";
import HistoryList from "../components/organisms/HistoryList.jsx";
import { useDialed } from "../context/DialedContext.jsx";

export default function HistoryPage() {
  const { checkins, loading, error, deleteCheckin } = useDialed();

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [headspaceFilter, setHeadspaceFilter] = useState("all");
  const [resultFilter, setResultFilter] = useState("all");

  return (
    <section className="page">
      <PageHeader
        eyebrow="THE RECEIPTS"
        title="Your"
        accent="history."
        subtitle="Every logged day counts as evidence."
      />

      <label>
        From
        <input
          type="date"
          value={fromDate}
          onChange={(event) => setFromDate(event.target.value)}
        />
      </label>

      <label>
        To
        <input
          type="date"
          value={toDate}
          onChange={(event) => setToDate(event.target.value)}
        />
      </label>

      <label>
        Headspace
        <select
          value={headspaceFilter}
          onChange={(event) => setHeadspaceFilter(event.target.value)}
        >
          <option value="all">All</option>
          <option value="Low">Low</option>
          <option value="Neutral">Neutral</option>
          <option value="Dialed">Dialed</option>
        </select>
      </label>

      <label>
        Result
        <select
          value={resultFilter}
          onChange={(event) => setResultFilter(event.target.value)}
        >
          <option value="all">All</option>
          <option value="on-target">On target</option>
          <option value="over-target">Over target</option>
        </select>
      </label>

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
