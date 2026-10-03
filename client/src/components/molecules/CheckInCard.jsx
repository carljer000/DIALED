import Button from "../atoms/Button.jsx";
import { longDate } from "../../utils/dates.js";

export default function CheckInCard({ checkin, deleting, onDelete }) {
  const hitCalories = checkin.actualCalories <= checkin.targetCalories;
  const hitProtein = checkin.actualProtein >= checkin.targetProtein;
  const result = hitCalories && hitProtein
    ? "Macros Hit"
    : hitCalories
      ? "Calories Hit"
      : "Reset Tomorrow";

  return (
    <article className="history-item">
      <div className="history-top">
        <div>
          <time dateTime={checkin.date}>{longDate(checkin.date)}</time>
          <span className={`result-badge ${hitCalories && hitProtein ? "hit" : "missed"}`}>
            {result}
          </span>
        </div>
        <Button
          className="delete-button"
          onClick={() => onDelete(checkin.id)}
          loading={deleting}
          aria-label={`Delete ${longDate(checkin.date)}`}
        >
          ×
        </Button>
      </div>
      <div className="history-metrics">
        <span>{checkin.weight || "—"}<small>kg</small></span>
        <span>{checkin.actualCalories}<small>/{checkin.targetCalories} kcal</small></span>
        <span>{checkin.actualProtein}<small>/{checkin.targetProtein}g</small></span>
        <span>{checkin.steps.toLocaleString()}<small>steps</small></span>
      </div>
      <div className="history-headspace" aria-label="Headspace details">
        <strong>{checkin.motivation}</strong>
        {checkin.energyLevel && <span>Energy {checkin.energyLevel}/5</span>}
        {checkin.hungerLevel && <span>Hunger {checkin.hungerLevel}/5</span>}
        {checkin.sleepQuality && <span>Sleep {checkin.sleepQuality}/5</span>}
        {checkin.trainingStatus && <span>{checkin.trainingStatus}</span>}
        {checkin.mainChallenge && <span>Challenge: {checkin.mainChallenge}</span>}
      </div>
      {checkin.dailyWin && <p className="daily-win"><strong>Win:</strong> {checkin.dailyWin}</p>}
      {checkin.reflectionNote && <p>“{checkin.reflectionNote}”</p>}
    </article>
  );
}
