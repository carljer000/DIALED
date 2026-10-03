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

  const resetFilters = () => {
    setFromDate("");
    setToDate("");
    setHeadspaceFilter("all");
    setResultFilter("all");
  };

  const filteredCheckins = (checkins ?? []).filter((checkin) => {
    if (fromDate && checkin.date < fromDate) {
      return false;
    }

    if (toDate && checkin.date > toDate) {
      return false;
    }

    if (headspaceFilter !== "all" && checkin.motivation !== headspaceFilter) {
      return false;
    }

    if (resultFilter !== "all") {
      const isOnTarget = checkin.actualCalories <= checkin.targetCalories;

      if (resultFilter === "on-target" && !isOnTarget) {
        return false;
      }

      if (resultFilter === "over-target" && isOnTarget) {
        return false;
      }
    }

    return true;
  });

  const invalidDateRange = Boolean(fromDate && toDate && fromDate > toDate);
  const hasNoMatches = checkins?.length > 0 && filteredCheckins.length === 0;

  return (
    <section className="page">
      <PageHeader
        eyebrow="THE RECEIPTS"
        title="Your"
        accent="history."
        subtitle="Every logged day counts as evidence."
      />

      <section className="history-filters" aria-label="Filter check-ins">
        <div className="history-filters-heading">
          <h2>Filter Check-Ins</h2>
          <span>
            {filteredCheckins.length} {filteredCheckins.length === 1 ? "day" : "days"}
          </span>
        </div>

        <div className="history-filter-grid">
          <label className="history-filter-field">
            <span>From</span>
            <input
              type="date"
              value={fromDate}
              onChange={(event) => setFromDate(event.target.value)}
            />
          </label>

          <label className="history-filter-field">
            <span>To</span>
            <input
              type="date"
              value={toDate}
              onChange={(event) => setToDate(event.target.value)}
            />
          </label>

          <label className="history-filter-field">
            <span>Headspace</span>
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

          <label className="history-filter-field">
            <span>Result</span>
            <select
              value={resultFilter}
              onChange={(event) => setResultFilter(event.target.value)}
            >
              <option value="all">All</option>
              <option value="on-target">On Target</option>
              <option value="over-target">Over Target</option>
            </select>
          </label>
        </div>

        <button className="history-filter-reset" type="button" onClick={resetFilters}>
          Reset filters
        </button>
      </section>

      {loading ? (
        <StateMessage kind="loading">Loading history…</StateMessage>
      ) : error ? (
        <StateMessage kind="error">{error}</StateMessage>
      ) : invalidDateRange ? (
        <StateMessage kind="error">
          From date must be on or before To date.
        </StateMessage>
      ) : hasNoMatches ? (
        <StateMessage kind="empty">
          No check-ins match your filters.
        </StateMessage>
      ) : (
        <HistoryList checkins={filteredCheckins} onDelete={deleteCheckin} />
      )}
    </section>
  );
}
