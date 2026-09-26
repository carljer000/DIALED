import Button from "../atoms/Button.jsx";

const levels = ["Low", "Neutral", "Dialed"];

export default function HeadspaceSelector({ value, onChange }) {
  return (
    <div className="motivation" role="group" aria-label="Motivation level">
      {levels.map((level) => (
        <Button
          className={value === level ? "selected" : ""}
          key={level}
          aria-pressed={value === level}
          onClick={() => onChange(level)}
        >
          {level}
        </Button>
      ))}
    </div>
  );
}
