import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { checkinsApi } from "../services/checkinsApi.js";
import { isSupabaseConfigured, supabase } from "../services/supabase.js";

const AuthContext = createContext(null);
const MODE_KEY = "dialed-access-mode";

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [ownerStatus, setOwnerStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [authActionLoading, setAuthActionLoading] = useState(false);
  const [demoMode, setDemoMode] = useState(() => sessionStorage.getItem(MODE_KEY) === "demo");

  const verifyOwner = useCallback(async (nextSession) => {
    if (!nextSession) {
      setOwnerStatus("idle");
      return;
    }
    setOwnerStatus("checking");
    try {
      await checkinsApi.verifyOwner(nextSession.access_token);
      setOwnerStatus("allowed");
      setMessage("");
    } catch (error) {
      setOwnerStatus("denied");
      if (error.status === 403) {
        setMessage("This GitHub account is signed in, but it is not allowed to open the private journal.");
      } else if (error.status === 401) {
        setMessage("Your GitHub session expired. Sign out, then sign in again.");
      } else if (error.status === 503) {
        setMessage("Private access is not configured on the API yet. Check the deployment variables and redeploy.");
      } else {
        setMessage("DIALED could not verify private access. Check the connection and try again.");
      }
    }
  }, []);

  useEffect(() => {
    if (!supabase) {
      setSessionLoading(false);
      return undefined;
    }

    let active = true;
    supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;
      if (error) setMessage(error.message);
      const nextSession = data.session || null;
      setSession(nextSession);
      setSessionLoading(false);
      if (!demoMode) verifyOwner(nextSession);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setSessionLoading(false);
      if (!demoMode) verifyOwner(nextSession);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [demoMode, verifyOwner]);

  const signInWithGithub = useCallback(async () => {
    if (!supabase) {
      setMessage("GitHub sign-in is not configured yet. Add the Supabase variables, then redeploy.");
      return;
    }
    if (authActionLoading) return;
    setAuthActionLoading(true);
    setMessage("");
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: { redirectTo: `${window.location.origin}/` },
      });
      if (error) setMessage("GitHub sign-in could not start. Please try again.");
    } finally {
      setAuthActionLoading(false);
    }
  }, [authActionLoading]);

  const signOut = useCallback(async () => {
    if (authActionLoading) return;
    setAuthActionLoading(true);
    sessionStorage.removeItem(MODE_KEY);
    setDemoMode(false);
    setOwnerStatus("idle");
    setMessage("");
    try {
      if (supabase) {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      }
      setSession(null);
    } catch {
      setMessage("DIALED could not sign out. Check the connection and try again.");
    } finally {
      setAuthActionLoading(false);
    }
  }, [authActionLoading]);

  const enterDemo = useCallback(() => {
    sessionStorage.setItem(MODE_KEY, "demo");
    setDemoMode(true);
    setMessage("");
  }, []);

  const exitDemo = useCallback(() => {
    sessionStorage.removeItem(MODE_KEY);
    setDemoMode(false);
    setMessage("");
    if (session) setOwnerStatus("checking");
  }, [session]);

  const mode = demoMode ? "demo" : ownerStatus === "allowed" ? "owner" : null;
  const loading = sessionLoading || (!demoMode && ownerStatus === "checking");
  const value = useMemo(() => ({
    authActionLoading,
    accessToken: session?.access_token || "",
    configurationReady: isSupabaseConfigured,
    enterDemo,
    exitDemo,
    loading,
    message,
    mode,
    ownerStatus,
    session,
    signInWithGithub,
    signOut,
  }), [authActionLoading, enterDemo, exitDemo, loading, message, mode, ownerStatus, session, signInWithGithub, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
