import { useDialed } from "../../context/DialedContext.jsx";

const themes = [
  { value: "light", icon: "☀", label: "Use light mode" },
  { value: "dark", icon: "☾", label: "Use dark mode" },
];

export default function ThemeToggle() {
  const { preferences, savePreferences } = useDialed();

  function selectTheme(theme) {
    if (preferences.theme === theme) return;
    savePreferences({ ...preferences, theme });
  }

  return (
    <div className="theme-toggle" role="group" aria-label="Color theme">
      {themes.map((theme) => (
        <button
          key={theme.value}
          type="button"
          className={preferences.theme === theme.value ? "selected" : ""}
          aria-label={theme.label}
          aria-pressed={preferences.theme === theme.value}
          title={theme.label}
          onClick={() => selectTheme(theme.value)}
        >
          <span aria-hidden="true">{theme.icon}</span>
        </button>
      ))}
    </div>
  );
}
