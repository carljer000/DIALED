const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

async function request(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

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
