import StateMessage from "../atoms/StateMessage.jsx";

function formatMonth(month) {
  if (!month) return "This month";
  return new Date(`${month}-01T00:00:00`).toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });
}

function SummaryMetric({ label, value, detail }) {
  return (
    <div className="monthly-summary-metric">
      <span>{label}</span>
      <strong>{value === null ? "—" : value}</strong>
      <small>{detail}</small>
    </div>
  );
}

export default function MonthlySummary({ summary }) {
  return (
    <section className="dashboard-card monthly-summary-card">
      <div className="card-heading">
        <div>
          <p className="eyebrow">MONTH TO DATE</p>
          <h2>Monthly progress</h2>
        </div>
        <span className="chart-unit">{formatMonth(summary.month)}</span>
      </div>

      {summary.loggedDays === 0 ? (
        <StateMessage kind="empty">No check-ins logged this month yet.</StateMessage>
      ) : (
        <div className="monthly-summary-grid">
          <SummaryMetric
            label="Logged days"
            value={summary.loggedDays}
            detail="check-ins"
          />
          <SummaryMetric
            label="Calories on target"
            value={summary.calorieConsistency === null ? null : `${summary.calorieConsistency}%`}
            detail={`${summary.calorieLoggedDays} days with calorie data`}
          />
          <SummaryMetric
            label="Protein on target"
            value={summary.proteinConsistency === null ? null : `${summary.proteinConsistency}%`}
            detail={`${summary.proteinLoggedDays} days with protein data`}
          />
          <SummaryMetric
            label="Step goal met"
            value={summary.stepConsistency === null ? null : `${summary.stepConsistency}%`}
            detail={summary.stepGoal === null
              ? "Set a step goal in Settings"
              : `${summary.stepLoggedDays} days with step data`}
          />
        </div>
      )}
    </section>
  );
}
