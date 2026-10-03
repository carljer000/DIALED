import Button from "../atoms/Button.jsx";

const scales = [
  { name: "energyLevel", label: "Energy", low: "Drained", high: "Strong" },
  { name: "hungerLevel", label: "Hunger / Cravings", low: "Low", high: "High" },
  { name: "sleepQuality", label: "Sleep Quality", low: "Poor", high: "Great" },
];

const trainingOptions = ["Rest day", "Completed", "Missed"];
const challengeOptions = ["Hunger", "Low energy", "Social event", "Stress", "Time", "Injury", "Other"];

function ChoiceGroup({ label, options, value, onChange, className = "detail-options" }) {
  return (
    <fieldset className="headspace-fieldset">
      <legend>{label}</legend>
      <div className={className}>
        {options.map((option) => (
          <Button
            className={value === option ? "selected" : ""}
            key={option}
            aria-pressed={value === option}
            onClick={() => onChange(value === option ? "" : option)}
          >
            {option === "Low energy" ? "Low Energy" : option === "Social event" ? "Social Event" : option}
          </Button>
        ))}
      </div>
    </fieldset>
  );
}

export default function HeadspaceDetails({ form, onFieldChange }) {
  return (
    <div className="headspace-details">
      <p className="optional-heading">
        Daily Signals <span>Optional</span>
      </p>

      <div className="rating-list">
        {scales.map((scale) => (
          <fieldset className="rating-row" key={scale.name}>
            <legend>{scale.label}</legend>
            <div className="rating-scale">
            <div className="rating-options">
              {[1, 2, 3, 4, 5].map((rating) => (
                <Button
                  className={Number(form[scale.name]) === rating ? "selected" : ""}
                  key={rating}
                  aria-label={`${scale.label}: ${rating} out of 5`}
                  aria-pressed={Number(form[scale.name]) === rating}
                  onClick={() => onFieldChange(scale.name, Number(form[scale.name]) === rating ? "" : String(rating))}
                >
                  {rating}
                </Button>
              ))}
            </div>
              <div className="rating-captions">
                <span>{scale.low}</span>
                <span>{scale.high}</span>
              </div>
            </div>
          </fieldset>
        ))}
      </div>

      <ChoiceGroup
        label="Training"
        options={trainingOptions}
        value={form.trainingStatus}
        onChange={(value) => onFieldChange("trainingStatus", value)}
      />
      <ChoiceGroup
        label="Main Challenge"
        options={challengeOptions}
        value={form.mainChallenge}
        onChange={(value) => onFieldChange("mainChallenge", value)}
        className="detail-options challenge-options"
      />

      <label className="note-label compact-note">
        Win Today
        <input
          name="dailyWin"
          value={form.dailyWin}
          onChange={(event) => onFieldChange(event.target.name, event.target.value)}
          placeholder="One thing you did well"
          maxLength="160"
        />
      </label>
    </div>
  );
}
