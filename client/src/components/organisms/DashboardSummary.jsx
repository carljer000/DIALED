import SummaryCard from "../molecules/SummaryCard.jsx";

export default function DashboardSummary({ streak, onTarget }) {
  return (
    <div className="stat-grid">
      <SummaryCard label="Current streak" value={streak} unit="days" />
      <SummaryCard label="On-target days" value={onTarget} unit="total" variant="secondary" />
    </div>
  );
}
