import { useMemo, useState } from "react";
import { useDialed } from "../../context/DialedContext.jsx";
import {
  createEmptyCheckin,
  serializeCheckin,
  toEditableCheckin,
} from "../../utils/checkins.js";
import { todayIso } from "../../utils/dates.js";
import Button from "../atoms/Button.jsx";
import StateMessage from "../atoms/StateMessage.jsx";
import HeadspaceSelector from "../molecules/HeadspaceSelector.jsx";
import HeadspaceDetails from "../molecules/HeadspaceDetails.jsx";
import MetricInput from "../molecules/MetricInput.jsx";
import WeightInput from "../molecules/WeightInput.jsx";

export default function CheckInForm() {
  const { checkins, preferences, saveCheckin } = useDialed();
  const [form, setForm] = useState(() => createEmptyCheckin(todayIso(), preferences));
  const [weightUnit, setWeightUnit] = useState(preferences.weightUnit);
  const [message, setMessage] = useState("");
  const [messageKind, setMessageKind] = useState("status");
  const [saving, setSaving] = useState(false);

  const selected = useMemo(
    () => checkins.find((checkin) => checkin.date === form.date),
    [checkins, form.date],
  );

  function switchWeightUnit(nextUnit) {
    if (nextUnit === weightUnit) return;
    setForm((current) => ({
      ...current,
      weight: current.weight
        ? (nextUnit === "lb"
            ? Number(current.weight) * 2.20462
            : Number(current.weight) / 2.20462
          ).toFixed(1)
        : "",
    }));
    setWeightUnit(nextUnit);
  }

  function change(event) {
    const { name, value } = event.target;
    if (name === "date") {
      const existing = checkins.find((checkin) => checkin.date === value);
      setForm(
        existing
          ? toEditableCheckin(existing, weightUnit)
          : createEmptyCheckin(value, preferences),
      );
    } else {
      setForm((current) => ({ ...current, [name]: value }));
    }
    setMessage("");
  }

  function changeField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
    setMessage("");
  }

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      await saveCheckin(serializeCheckin(form, weightUnit));
      setMessage("Check-in logged. Keep stacking days.");
      setMessageKind("status");
    } catch (requestError) {
      setMessage(requestError.message);
      setMessageKind("error");
    } finally {
      setSaving(false);
    }
  }

  const caloriesOnTarget = Number(form.actualCalories) <= Number(form.targetCalories);

  return (
    <form onSubmit={submit} className="checkin-form">
      <div className="date-row">
        <label>
          Date
          <input type="date" name="date" value={form.date} onChange={change} />
        </label>
        <span className={selected ? "status-chip saved" : "status-chip"}>
          {selected ? "Editing logged day" : "New check-in"}
        </span>
      </div>

      <section className="form-card">
        <h2>Numbers</h2>
        <WeightInput
          value={form.weight}
          unit={weightUnit}
          onChange={change}
          onUnitChange={switchWeightUnit}
        />
        <div className="metric-grid">
          <MetricInput label="Calorie target" name="targetCalories" value={form.targetCalories} onChange={change} suffix="kcal" />
          <MetricInput label="Calories eaten" name="actualCalories" value={form.actualCalories} onChange={change} suffix="kcal" />
          <MetricInput label="Protein target" name="targetProtein" value={form.targetProtein} onChange={change} suffix="g" />
          <MetricInput label="Protein eaten" name="actualProtein" value={form.actualProtein} onChange={change} suffix="g" />
        </div>
        <MetricInput
          label={preferences.stepGoal ? `Steps · ${Number(preferences.stepGoal).toLocaleString()} goal` : "Steps"}
          name="steps"
          value={form.steps}
          onChange={change}
          suffix="steps"
        />
      </section>

      <section className="form-card">
        <h2>Headspace</h2>
        <HeadspaceSelector
          value={form.motivation}
          onChange={(motivation) => changeField("motivation", motivation)}
        />
        <HeadspaceDetails form={form} onFieldChange={changeField} />
        <label className="note-label">
          Reflection
          {preferences.reflectionPrompts && (
            <span className="reflection-prompt">{form.reflectionPrompt}</span>
          )}
          <textarea
            name="reflectionNote"
            value={form.reflectionNote}
            onChange={change}
            placeholder="Write a few honest lines..."
            maxLength="500"
          />
        </label>
      </section>

      <div className="checkin-footer">
        <span className={caloriesOnTarget ? "on-target" : "over-target"}>
          {form.actualCalories
            ? caloriesOnTarget
              ? "Within calorie target"
              : "Over calorie target"
            : "Enter today’s total"}
        </span>
        <Button className="primary-button" type="submit" loading={saving}>
          {saving ? "Saving…" : "Log check-in"} <span>→</span>
        </Button>
      </div>
      {message && <StateMessage kind={messageKind}>{message}</StateMessage>}
    </form>
  );
}
