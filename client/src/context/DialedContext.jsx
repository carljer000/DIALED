import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { checkinsApi } from "../services/checkinsApi.js";

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

function loadPreferences() {
  try {
    const saved = JSON.parse(localStorage.getItem("dialed-preferences"));
    return saved ? { ...defaultPreferences, ...saved } : defaultPreferences;
  } catch {
    return defaultPreferences;
  }
}

export function DialedProvider({ children }) {
  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [preferences, setPreferences] = useState(loadPreferences);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setCheckins(await checkinsApi.list());
      setError("");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    document.documentElement.dataset.theme = preferences.theme;
    document.documentElement.style.colorScheme = preferences.theme;
  }, [preferences.theme]);

  const saveCheckin = useCallback(async (values) => {
    const saved = await checkinsApi.upsert(values);
    setCheckins((current) =>
      [saved, ...current.filter((checkin) => checkin.id !== saved.id)].sort(
        (a, b) => b.date.localeCompare(a.date),
      ),
    );
    return saved;
  }, []);

  const deleteCheckin = useCallback(async (id) => {
    await checkinsApi.remove(id);
    setCheckins((current) => current.filter((checkin) => checkin.id !== id));
  }, []);

  const savePreferences = useCallback((nextPreferences) => {
    const saved = { ...defaultPreferences, ...nextPreferences };
    localStorage.setItem("dialed-preferences", JSON.stringify(saved));
    setPreferences(saved);
  }, []);

  const value = useMemo(
    () => ({
      checkins,
      loading,
      error,
      preferences,
      refresh,
      saveCheckin,
      deleteCheckin,
      savePreferences,
    }),
    [
      checkins,
      loading,
      error,
      preferences,
      refresh,
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
