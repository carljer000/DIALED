import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/atoms/Button.jsx";
import StateMessage from "../components/atoms/StateMessage.jsx";
import PageHeader from "../components/molecules/PageHeader.jsx";
import { useDialed } from "../context/DialedContext.jsx";

export default function SettingsPage() {
  const { preferences, savePreferences } = useDialed();
  const [form, setForm] = useState(preferences);
  const [message, setMessage] = useState("");

  function change(event) {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
    setMessage("");
  }

  function submit(event) {
    event.preventDefault();
    savePreferences(form);
    setMessage("Settings saved. Your next new check-in will use these defaults.");
  }

  function switchWeightUnit(nextUnit) {
    if (nextUnit === form.weightUnit) return;
    const factor = nextUnit === "lb" ? 2.20462 : 1 / 2.20462;
    const convert = (value) => value ? (Number(value) * factor).toFixed(1) : "";
    setForm((current) => ({
      ...current,
      weightUnit: nextUnit,
      startingWeight: convert(current.startingWeight),
      goalWeight: convert(current.goalWeight),
    }));
    setMessage("");
  }

  return (
    <section className="page settings-page">
      <PageHeader
        eyebrow="PERSONAL DEFAULTS"
        title="Your"
        accent="Settings."
        subtitle="Set it once. Adjust any individual day when life changes."
        action={
          <Link className="back-link" to="/">
            ← Today
          </Link>
        }
      />

      <form className="settings-form" onSubmit={submit}>
        <section className="form-card">
          <div className="settings-card-heading">
            <h2>Your Targets</h2>
            <span>New Check-Ins</span>
          </div>
          <label className="settings-row">
            <span>Calorie Target</span>
            <span className="settings-value">
              <input type="number" min="1" name="targetCalories" value={form.targetCalories} onChange={change} required />
              <small>kcal</small>
            </span>
          </label>
          <label className="settings-row">
            <span>Protein Target</span>
            <span className="settings-value">
              <input type="number" min="1" name="targetProtein" value={form.targetProtein} onChange={change} required />
              <small>g</small>
            </span>
          </label>
          <label className="settings-row">
            <span>Daily Step Goal</span>
            <span className="settings-value">
              <input type="number" min="0" name="stepGoal" value={form.stepGoal} onChange={change} />
              <small>steps</small>
            </span>
          </label>
        </section>

        <section className="form-card">
          <h2>Weight Preferences</h2>
          <div className="settings-row">
            <span>Preferred Unit</span>
            <div className="unit-toggle" role="group" aria-label="Preferred weight unit">
              {["kg", "lb"].map((unit) => (
                <button
                  key={unit}
                  type="button"
                  className={form.weightUnit === unit ? "selected" : ""}
                  aria-pressed={form.weightUnit === unit}
                  onClick={() => switchWeightUnit(unit)}
                >
                  {unit}
                </button>
              ))}
            </div>
          </div>
          <label className="settings-row">
            <span>Starting Weight</span>
            <span className="settings-value">
              <input type="number" min="1" step="0.1" name="startingWeight" value={form.startingWeight} onChange={change} placeholder="Optional" />
              <small>{form.weightUnit}</small>
            </span>
          </label>
          <label className="settings-row">
            <span>Goal Weight</span>
            <span className="settings-value">
              <input type="number" min="1" step="0.1" name="goalWeight" value={form.goalWeight} onChange={change} placeholder="Optional" />
              <small>{form.weightUnit}</small>
            </span>
          </label>
        </section>

        <section className="form-card">
          <h2>Check-In Preferences</h2>
          <label className="settings-row">
            <span>Default Training</span>
            <select name="defaultTrainingStatus" value={form.defaultTrainingStatus} onChange={change}>
              <option value="">Choose each day</option>
              <option value="Rest day">Rest day</option>
              <option value="Completed">Completed</option>
              <option value="Missed">Missed</option>
            </select>
          </label>
          <label className="settings-row settings-switch-row">
            <span>
              Reflection Prompts
              <small>Show the rotating question above your reflection.</small>
            </span>
            <input type="checkbox" name="reflectionPrompts" checked={form.reflectionPrompts} onChange={change} />
          </label>
        </section>

        <Button className="primary-button settings-save" type="submit">
          Save settings <span>→</span>
        </Button>
        {message && <StateMessage>{message}</StateMessage>}
      </form>
    </section>
  );
}
