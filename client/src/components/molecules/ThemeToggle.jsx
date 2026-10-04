import { useDialed } from "../../context/DialedContext.jsx";

const themes = [
  { value: "light", icon: "☀", label: "Use light mode" },
  { value: "dark", icon: "☾", label: "Use dark mode" },
];

export default function ThemeToggle() {
  const { preferences, savePreferences } = useDialed();

  function selectTheme(theme, event) {
    if (preferences.theme === theme) return;

    const toggleBounds = event.currentTarget.getBoundingClientRect();
    const originX = toggleBounds.left + toggleBounds.width / 2;
    const originY = toggleBounds.top + toggleBounds.height / 2;
    const root = document.documentElement;
    root.style.setProperty("--theme-origin-x", `${originX}px`);
    root.style.setProperty("--theme-origin-y", `${originY}px`);

    const applyTheme = () => {
      root.dataset.theme = theme;
      root.style.colorScheme = theme;
      savePreferences({ ...preferences, theme });
    };

    if (typeof document.startViewTransition === "function") {
      root.dataset.themeTransition = "true";
      const transition = document.startViewTransition(applyTheme);
      transition.finished.finally(() => {
        delete root.dataset.themeTransition;
      });
      return;
    }

    applyTheme();
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
          onClick={(event) => selectTheme(theme.value, event)}
        >
          <span aria-hidden="true">{theme.icon}</span>
        </button>
      ))}
    </div>
  );
}
