import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { shortDate } from "../../utils/dates.js";
import StateMessage from "../atoms/StateMessage.jsx";
import { weightFromKg } from "../../utils/checkins.js";

const axisTick = {
  fill: "#8a909b",
  fontFamily: '"IBM Plex Mono", Consolas, monospace',
  fontSize: 11,
};

export default function WeightTrendChart({ checkins, unit = "kg" }) {
  const chartData = checkins
    .filter((checkin) => Number(checkin.weight) > 0)
    .map((checkin) => ({
      ...checkin,
      displayWeight: Number(weightFromKg(checkin.weight, unit).toFixed(1)),
    }));

  return (
    <section className="dashboard-card">
      <div className="card-heading">
        <div>
          <p className="eyebrow">LAST 30 DAYS</p>
          <h2>Weight Trend</h2>
        </div>
        <span className="chart-unit">{unit}</span>
      </div>
      {chartData.length > 1 ? (
        <div className="chart">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData} margin={{ top: 12, right: 4, left: -20, bottom: 0 }}>
              <XAxis dataKey="date" tickFormatter={(date) => shortDate(date).toUpperCase()} tick={axisTick} axisLine={false} tickLine={false} interval="preserveStartEnd" />
              <YAxis dataKey="displayWeight" tick={axisTick} axisLine={false} tickLine={false} domain={["dataMin - 0.5", "dataMax + 0.5"]} />
              <Tooltip labelFormatter={shortDate} formatter={(value) => [`${value} ${unit}`, "Weight"]} contentStyle={{ background: "#171a1f", border: "1px solid #2a3038", borderRadius: 12 }} />
              <Line type="monotone" dataKey="displayWeight" stroke="#b82030" strokeWidth={3} dot={false} activeDot={{ r: 5, fill: "#b82030" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <StateMessage kind="empty">Log at least two weigh-ins to see your trend.</StateMessage>
      )}
    </section>
  );
}
