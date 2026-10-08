const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

async function request(path, options = {}) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 15_000);
  let response;

  try {
    response = await fetch(`${baseUrl}${path}`, {
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      ...options,
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
    throw new Error(data.error || "Unable to reach DIALED.");
  }

  return data;
}

export const checkinsApi = {
  list: () => request("/checkins"),
  upsert: (checkin) =>
    request("/checkins", {
      method: "POST",
      body: JSON.stringify(checkin),
    }),
  remove: (id) => request(`/checkins/${id}`, { method: "DELETE" }),
};
