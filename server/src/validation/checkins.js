const requiredNumbers = ["targetCalories", "actualCalories", "targetProtein", "actualProtein", "steps"];
const motivations = new Set(["Low", "Neutral", "Dialed"]);
const trainingStatuses = new Set(["Rest day", "Completed", "Missed"]);

export const challenges = new Set([
  "Hunger",
  "Cravings",
  "Low energy",
  "Low motivation",
  "Boredom",
  "Social event",
  "Stress",
  "Time",
  "Injury",
  "Other",
]);

export function isValidIsoDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

export function isValidUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value || "");
}

export function validateCheckin(payload = {}) {
  const errors = [];
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return ["A check-in object is required."];
  }
  if (!isValidIsoDate(payload.date)) errors.push("A valid date is required.");
  if (payload.weight !== null && payload.weight !== undefined && (!Number.isFinite(Number(payload.weight)) || Number(payload.weight) <= 0)) errors.push("Weight must be positive.");
  for (const field of requiredNumbers) {
    const value = payload[field];
    const minimum = field.startsWith("target") ? 1 : 0;
    if (value === null || value === undefined || value === "" || !Number.isInteger(Number(value)) || Number(value) < minimum) {
      errors.push(`${field} must be an integer of at least ${minimum}.`);
    }
  }
  if (!motivations.has(payload.motivation)) errors.push("Motivation must be Low, Neutral, or Dialed.");
  for (const field of ["energyLevel", "hungerLevel", "sleepQuality"]) {
    const value = payload[field];
    if (value !== null && value !== undefined && value !== "" && (!Number.isInteger(Number(value)) || Number(value) < 1 || Number(value) > 5)) {
      errors.push(`${field} must be an integer from 1 to 5.`);
    }
  }
  if (payload.trainingStatus && !trainingStatuses.has(payload.trainingStatus)) errors.push("Training status is invalid.");
  if (payload.mainChallenge && !challenges.has(payload.mainChallenge)) errors.push("Main challenge is invalid.");
  if (payload.dailyWin !== undefined && typeof payload.dailyWin !== "string") errors.push("Daily win must be text.");
  if (typeof payload.dailyWin === "string" && payload.dailyWin.length > 160) errors.push("Daily win must be 160 characters or fewer.");
  if (payload.reflectionPrompt !== undefined && typeof payload.reflectionPrompt !== "string") errors.push("Reflection prompt must be text.");
  if (payload.reflectionNote !== undefined && typeof payload.reflectionNote !== "string") errors.push("Reflection note must be text.");
  if (typeof payload.reflectionNote === "string" && payload.reflectionNote.length > 500) errors.push("Reflection must be 500 characters or fewer.");
  return errors;
}
