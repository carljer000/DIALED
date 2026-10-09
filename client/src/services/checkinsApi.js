const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

async function request(path, options = {}, accessToken = "") {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 15_000);
  let response;

  try {
    response = await fetch(`${baseUrl}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...options.headers,
      },
      signal: controller.signal,
    });
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("DIALED took too long to respond. Please try again.");
    }
    throw new Error("DIALED could not connect to the server. Check your connection and try again.");
  } finally {
    window.clearTimeout(timeout);
  }

  if (response.status === 204) return null;

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.error || "Unable to reach DIALED.");
    error.status = response.status;
    throw error;
  }

  return data;
}

export const checkinsApi = {
  verifyOwner: (accessToken) => request("/auth/me", {}, accessToken),
  list: (accessToken) => request("/checkins", {}, accessToken),
  upsert: (checkin, accessToken) =>
    request("/checkins", {
      method: "POST",
      body: JSON.stringify(checkin),
    }, accessToken),
  remove: (id, accessToken) => request(`/checkins/${id}`, { method: "DELETE" }, accessToken),
};
