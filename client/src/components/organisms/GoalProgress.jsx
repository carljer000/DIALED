import { Link } from "react-router-dom";
import StateMessage from "../atoms/StateMessage.jsx";

function displayWeight(value) {
  return Number(value).toFixed(1);
}

const displayFont = '"Bitcount Single", "DotGothic16", monospace';

const styles = {
  metrics: { marginTop: 20 },
  row: {
    alignItems: "center",
    borderTop: "1px solid var(--line-color, #2c2f34)",
    display: "flex",
    justifyContent: "space-between",
    minHeight: 68,
    padding: "8px 0",
  },
  label: { color: "var(--text-strong, #d5dbe3)", fontSize: "1.1rem", fontWeight: 700 },
  heading: { fontSize: "1.18rem", fontWeight: 800 },
  reading: { alignItems: "center", display: "flex", gap: 10 },
  value: {
    color: "var(--accent-ink, #b82030)",
    display: "block",
    fontFamily: displayFont,
    fontSize: "1.9rem",
    fontVariationSettings: "normal",
    fontWeight: 500,
    letterSpacing: "0.04em",
    lineHeight: 1.3,
    textAlign: "right",
  },
  unit: { color: "var(--text-muted, #8fa0b5)", fontSize: "0.82rem", minWidth: 18 },
  track: {
    background: "var(--track-bg, #252930)",
    height: 9,
    marginTop: 24,
    overflow: "hidden",
  },
  fill: { background: "var(--accent, #b82030)", display: "block", height: "100%" },
  summary: {
    alignItems: "baseline",
    display: "flex",
    flexWrap: "wrap",
    gap: "8px 18px",
    justifyContent: "space-between",
    marginTop: 14,
  },
  percentage: {
    color: "var(--accent-ink, #b82030)",
    fontFamily: displayFont,
    fontSize: "1.45rem",
    fontVariationSettings: "normal",
    fontWeight: 500,
    letterSpacing: "0.03em",
  },
  remaining: { color: "var(--text-muted, #aeb6c1)", fontSize: "0.9rem" },
  remainingNumber: {
    color: "var(--accent-ink, #b82030)",
    fontFamily: displayFont,
    fontSize: "1.2rem",
    fontVariationSettings: "normal",
    fontWeight: 500,
    letterSpacing: "0.03em",
  },
};

function GoalMetric({ label, value, unit }) {
  return (
    <div className="metric-input" style={styles.row}>
      <span style={styles.label}>{label}</span>
      <div style={styles.reading}>
        <output style={styles.value}>{displayWeight(value)}</output>
        <small style={styles.unit}>{unit}</small>
      </div>
    </div>
  );
}

export default function GoalProgress({ progress }) {
  return (
    <section className="dashboard-card goal-card">
      <div className="card-heading">
        <div>
          <p className="eyebrow">YOUR TARGET</p>
          <h2 style={styles.heading}>Goal Progress</h2>
        </div>
        <span className="chart-unit">{progress.unit}</span>
      </div>

      {!progress.available ? (
        <StateMessage kind="empty">
          Add a starting weight and goal weight in <Link to="/settings">Settings</Link>, then log a weigh-in.
        </StateMessage>
      ) : (
        <>
          <div className="goal-metrics" style={styles.metrics}>
            <GoalMetric label="Started" value={progress.startingWeight} unit={progress.unit} />
            <GoalMetric label="Current" value={progress.currentWeight} unit={progress.unit} />
            <GoalMetric label="Goal" value={progress.goalWeight} unit={progress.unit} />
          </div>
          <div
            className="goal-track"
            style={styles.track}
            aria-label={`${progress.progress}% toward weight goal`}
          >
            <i style={{ ...styles.fill, width: `${progress.progress}%` }} />
          </div>
          <div className="goal-caption" style={styles.summary}>
            <strong className="goal-percentage" style={styles.percentage}>
              {progress.progress}% complete
            </strong>
            <span className="goal-remaining" style={styles.remaining}>
              {progress.reached ? (
                "Goal reached"
              ) : (
                <><strong style={styles.remainingNumber}>{displayWeight(progress.remaining)}</strong>{` ${progress.unit} remaining`}</>
              )}
            </span>
          </div>
        </>
      )}
    </section>
  );
}
