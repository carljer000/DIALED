import Button from "../atoms/Button.jsx";

const units = ["kg", "lb"];

export default function WeightInput({ value, unit, onChange, onUnitChange }) {
  const [whole, decimal] = String(value).split(".");
  const groupedWhole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const displayValue = value === "" ? "" : decimal === undefined ? groupedWhole : `${groupedWhole}.${decimal}`;

  function changeValue(event) {
    const cleaned = event.target.value.replace(/,/g, "").replace(/[^\d.]/g, "");
    const [whole = "", ...decimals] = cleaned.split(".");
    const numericValue = decimals.length ? `${whole}.${decimals.join("")}` : whole;
    onChange({ target: { name: "weight", value: numericValue } });
  }

  return (
    <>
      <div className="weight-heading">
        <span>Body Weight</span>
        <div className="unit-toggle" role="group" aria-label="Weight unit">
          {units.map((option) => (
            <Button
              className={unit === option ? "selected" : ""}
              key={option}
              onClick={() => onUnitChange(option)}
            >
              {option}
            </Button>
          ))}
        </div>
      </div>
      <div className="weight-value-row">
        <input
          required
          aria-label="Body weight"
          type="text"
          inputMode="decimal"
          pattern="[0-9,]*[.]?[0-9]*"
          name="weight"
          value={displayValue}
          onChange={changeValue}
        />
        <small>{unit}</small>
      </div>
    </>
  );
}
