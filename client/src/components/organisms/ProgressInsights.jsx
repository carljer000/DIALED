import StateMessage from "../atoms/StateMessage.jsx";

function formatAverage(value) {
  return value === null ? "–" : value.toFixed(1);
}

export default function ProgressInsights({ insights }) {
  return (
    <section className="dashboard-card insights-card">
      <div className="card-heading">
        <div>
          <p className="eyebrow">RECENT PATTERNS</p>
          <h2>What the logs show</h2>
        </div>
        <span className="chart-unit">Last {insights.loggedDays || 0} logs</span>
      </div>

      {insights.loggedDays < 3 ? (
        <StateMessage kind="empty">
          Log at least three days to start seeing useful patterns.
        </StateMessage>
      ) : (
        <>
          <div className="consistency-bars">
            <div>
              <div className="insight-label">
                <span>Calories on target</span>
                <strong>{insights.calorieConsistency}%</strong>
              </div>
              <div className="progress-track"><i style={{ width: `${insights.calorieConsistency}%` }} /></div>
            </div>
            <div>
              <div className="insight-label">
                <span>Protein target reached</span>
                <strong>{insights.proteinConsistency}%</strong>
              </div>
              <div className="progress-track"><i style={{ width: `${insights.proteinConsistency}%` }} /></div>
            </div>
          </div>

          <div className="signal-grid">
            <article><span>Energy</span><strong>{formatAverage(insights.averages.energy)}</strong><small>/ 5 avg</small></article>
            <article><span>Hunger</span><strong>{formatAverage(insights.averages.hunger)}</strong><small>/ 5 avg</small></article>
            <article><span>Sleep</span><strong>{formatAverage(insights.averages.sleep)}</strong><small>/ 5 avg</small></article>
          </div>

          <div className="pattern-summary">
            <span>Most common challenge</span>
            <strong>{insights.commonChallenge || "Not enough data"}</strong>
          </div>
          <p className="pattern-message">{insights.message}</p>
        </>
      )}
    </section>
  );
}
