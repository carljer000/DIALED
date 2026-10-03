import SummaryCard from "../molecules/SummaryCard.jsx";

export default function DashboardSummary({ streak, onTarget }) {
  return (
    <div className="stat-grid">
      <SummaryCard label="Current Streak" value={streak} unit="days" />
      <SummaryCard label="On-Target Days" value={onTarget} unit="total" variant="secondary" />
    </div>
  );
}
