import { localIsoDate, shortDate } from "../../utils/dates.js";

export default function ConsistencyHeatmap({ checkins }) {
  const cells = Array.from({ length: 21 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (20 - index));
    const day = localIsoDate(date);
    return { day, checkin: checkins.find((item) => item.date === day) };
  });

  return (
    <section className="dashboard-card">
      <div className="card-heading">
        <div>
          <p className="eyebrow">LAST 21 DAYS</p>
          <h2>Consistency</h2>
        </div>
        <span className="lime-dot" />
      </div>
      <div className="heatmap" aria-label="21-day calorie consistency">
        <div className="heatmap-days">
          {cells.map(({ day, checkin }) => {
            const result = checkin
              ? checkin.actualCalories <= checkin.targetCalories
                ? "hit"
                : "missed"
              : "empty";
            const description = result === "hit" ? "on target" : result === "missed" ? "over target" : "no check-in";
            return (
              <div
                key={day}
                title={`${shortDate(day)}: ${description}`}
                className={`heatmap-cell ${result}`}
              />
            );
          })}
        </div>
        <div className="legend">
          <span><i className="hit" />On Target</span>
          <span><i className="missed" />Over</span>
          <span><i className="empty" />No Log</span>
        </div>
      </div>
    </section>
  );
}
