import StateMessage from "../atoms/StateMessage.jsx";

export default function WeeklyReflection({ summary }) {
  return (
    <section className="dashboard-card weekly-card">
      <div className="card-heading">
        <div>
          <p className="eyebrow">LATEST SEVEN LOGS</p>
          <h2>Weekly Reflection</h2>
        </div>
        <span className="chart-unit">{summary.loggedDays}/7 logged</span>
      </div>

      {summary.loggedDays < 3 ? (
        <StateMessage kind="empty">
          Log at least three days to generate a useful weekly reflection.
        </StateMessage>
      ) : (
        <>
          <div className="weekly-snapshot">
            <div><span>Calories</span><strong>{summary.calorieConsistency}%</strong></div>
            <div><span>Protein</span><strong>{summary.proteinConsistency}%</strong></div>
            {summary.stepConsistency !== null && (
              <div><span>Steps</span><strong>{summary.stepConsistency}%</strong></div>
            )}
          </div>

          <dl className="weekly-details">
            <div><dt>Headspace</dt><dd>{summary.commonHeadspace || "Not enough data"}</dd></div>
            <div><dt>Main Challenge</dt><dd>{summary.commonChallenge || "Not enough data"}</dd></div>
            <div><dt>Win To Remember</dt><dd>{summary.bestWin || "Add a daily win to capture it here."}</dd></div>
          </dl>

          <div className="weekly-focus">
            <span>Focus For The Next Seven Logs</span>
            <p>{summary.focus}</p>
          </div>
        </>
      )}
    </section>
  );
}
