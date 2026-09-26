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

export function DialedProvider({ children }) {
  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const value = useMemo(
    () => ({ checkins, loading, error, refresh, saveCheckin, deleteCheckin }),
    [checkins, loading, error, refresh, saveCheckin, deleteCheckin],
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
