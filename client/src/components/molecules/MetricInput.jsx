export default function MetricInput({
  label,
  name,
  value,
  onChange,
  suffix,
  step = "1",
}) {
  const displayValue = value === "" ? "" : String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  function changeValue(event) {
    const numericValue = event.target.value.replace(/[^\d]/g, "");
    onChange({ target: { name, value: numericValue } });
  }

  return (
    <label className="metric-input">
      <span>{label}</span>
      <div>
        <input
          required
          type="text"
          inputMode="numeric"
          pattern="[0-9,]*"
          name={name}
          value={displayValue}
          onChange={changeValue}
        />
        <small>{suffix}</small>
      </div>
    </label>
  );
}
