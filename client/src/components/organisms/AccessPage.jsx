import Button from "../atoms/Button.jsx";
import StateMessage from "../atoms/StateMessage.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M12 .7a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2.22c-3.22.7-3.9-1.37-3.9-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.77 2.72 1.26 3.38.96.1-.75.4-1.26.74-1.55-2.57-.29-5.27-1.28-5.27-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.47.11-3.05 0 0 .97-.31 3.16 1.18a10.98 10.98 0 0 1 5.76 0c2.19-1.49 3.16-1.18 3.16-1.18.63 1.58.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.7 5.38-5.28 5.67.42.36.79 1.06.79 2.14v3.26c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .7Z" />
    </svg>
  );
}

export default function AccessPage({ loading = false }) {
  const { authActionLoading, configurationReady, enterDemo, message, ownerStatus, session, signInWithGithub, signOut } = useAuth();

  if (loading) {
    return (
      <main className="access-page access-loading" aria-live="polite">
        <img src="/dialed-logo.png" alt="" />
        <p>Checking access…</p>
      </main>
    );
  }

  return (
    <main className="access-page">
      <section className="access-panel" aria-labelledby="access-title">
        <div className="access-brand">
          <span className="access-logo-frame">
            <img src="/dialed-logo.png" alt="DIALED cat mascot holding a dumbbell and fork" />
          </span>
          <span>DAILY CUT JOURNAL</span>
        </div>
        <h1 id="access-title">Stay <strong>DIALED.</strong></h1>
        <p className="access-lede">REAL DATA FOR YOU. SAMPLE DATA FOR VISITORS.</p>

        <div className="access-actions">
          <section className="access-choice">
            <div>
              <h2>MY JOURNAL</h2>
              <p>OWNER ACCESS TO YOUR REAL CHECK-INS.</p>
            </div>
            {session && ownerStatus === "denied" ? (
              <Button className="secondary-button" onClick={signOut} loading={authActionLoading}>Sign out</Button>
            ) : (
              <Button className="primary-button access-button" onClick={signInWithGithub} disabled={!configurationReady} loading={authActionLoading}>
                <GithubIcon /> {authActionLoading ? "Opening GitHub…" : "Sign in with GitHub"}
              </Button>
            )}
          </section>

          <section className="access-choice demo-choice">
            <div>
              <h2>EXPLORE THE DEMO</h2>
              <p>SAMPLE DATA ONLY. YOUR JOURNAL STAYS UNTOUCHED.</p>
            </div>
            <Button className="secondary-button access-button" onClick={enterDemo}>Try demo <span>→</span></Button>
          </section>
        </div>

        {message && <StateMessage kind="error">{message}</StateMessage>}
        {!configurationReady && !message && (
          <StateMessage>GitHub access becomes available after the Supabase environment variables are configured.</StateMessage>
        )}
      </section>
    </main>
  );
}
