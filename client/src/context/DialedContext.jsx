import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { checkinsApi } from "../services/checkinsApi.js";
import { demoCheckinsApi } from "../services/demoCheckins.js";

const DialedContext = createContext(null);

const defaultPreferences = {
  targetCalories: "2250",
  targetProtein: "180",
  stepGoal: "10000",
  weightUnit: "kg",
  startingWeight: "",
  goalWeight: "",
  defaultTrainingStatus: "",
  reflectionPrompts: true,
  theme: "dark",
};

function preferencesKey(mode) {
  return mode === "demo" ? "dialed-demo-preferences" : "dialed-preferences";
}

function loadPreferences(mode) {
  try {
    const saved = JSON.parse(localStorage.getItem(preferencesKey(mode)));
    return saved ? { ...defaultPreferences, ...saved } : defaultPreferences;
  } catch {
    return defaultPreferences;
  }
}

export function DialedProvider({ children, mode, accessToken = "" }) {
  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [preferences, setPreferences] = useState(() => loadPreferences(mode));
  const repository = mode === "demo" ? demoCheckinsApi : checkinsApi;

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setCheckins(await repository.list(accessToken));
      setError("");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, [accessToken, repository]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    document.documentElement.dataset.theme = preferences.theme;
    document.documentElement.style.colorScheme = preferences.theme;
  }, [preferences.theme]);

  const saveCheckin = useCallback(async (values) => {
    const saved = await repository.upsert(values, accessToken);
    setCheckins((current) =>
      [saved, ...current.filter((checkin) => checkin.id !== saved.id)].sort(
        (a, b) => b.date.localeCompare(a.date),
      ),
    );
    return saved;
  }, [accessToken, repository]);

  const deleteCheckin = useCallback(async (id) => {
    await repository.remove(id, accessToken);
    setCheckins((current) => current.filter((checkin) => checkin.id !== id));
  }, [accessToken, repository]);

  const savePreferences = useCallback((nextPreferences) => {
    const saved = { ...defaultPreferences, ...nextPreferences };
    localStorage.setItem(preferencesKey(mode), JSON.stringify(saved));
    setPreferences(saved);
  }, [mode]);

  const resetDemo = useCallback(async () => {
    if (mode !== "demo") return;
    const resetCheckins = await demoCheckinsApi.reset();
    localStorage.removeItem(preferencesKey("demo"));
    setPreferences(defaultPreferences);
    setCheckins(resetCheckins);
    setError("");
    return defaultPreferences;
  }, [mode]);

  const value = useMemo(
    () => ({
      checkins,
      loading,
      error,
      isDemo: mode === "demo",
      preferences,
      refresh,
      resetDemo,
      saveCheckin,
      deleteCheckin,
      savePreferences,
    }),
    [
      checkins,
      loading,
      error,
      mode,
      preferences,
      refresh,
      resetDemo,
      saveCheckin,
      deleteCheckin,
      savePreferences,
    ],
  );

  return <DialedContext.Provider value={value}>{children}</DialedContext.Provider>;
}

export function useDialed() {
  const context = useContext(DialedContext);
  if (!context) {
    throw new Error("useDialed must be used inside DialedProvider");
  }
  return context;
}
