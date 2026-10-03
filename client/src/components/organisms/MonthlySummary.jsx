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
          <h2>Monthly Progress</h2>
        </div>
        <span className="chart-unit">{formatMonth(summary.month)}</span>
      </div>

      {summary.loggedDays === 0 ? (
        <StateMessage kind="empty">No check-ins logged this month yet.</StateMessage>
      ) : (
        <div className="monthly-summary-grid">
          <SummaryMetric
            label="Logged Days"
            value={summary.loggedDays}
            detail="Check-Ins"
          />
          <SummaryMetric
            label="Calories On Target"
            value={summary.calorieConsistency === null ? null : `${summary.calorieConsistency}%`}
            detail={`${summary.calorieLoggedDays} Days With Calorie Data`}
          />
          <SummaryMetric
            label="Protein On Target"
            value={summary.proteinConsistency === null ? null : `${summary.proteinConsistency}%`}
            detail={`${summary.proteinLoggedDays} Days With Protein Data`}
          />
          <SummaryMetric
            label="Step Goal Met"
            value={summary.stepConsistency === null ? null : `${summary.stepConsistency}%`}
            detail={summary.stepGoal === null
              ? "Set A Step Goal In Settings"
              : `${summary.stepLoggedDays} Days With Step Data`}
          />
        </div>
      )}
    </section>
  );
}
