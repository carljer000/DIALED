export function createEmptyCheckin(date, preferences = {}) {
  return {
    date,
    weight: "",
    targetCalories: String(preferences.targetCalories || "2250"),
    actualCalories: "",
    targetProtein: String(preferences.targetProtein || "180"),
    actualProtein: "",
    steps: "",
    motivation: "Dialed",
    energyLevel: "",
    hungerLevel: "",
    sleepQuality: "",
    trainingStatus: preferences.defaultTrainingStatus || "",
    mainChallenge: "",
    dailyWin: "",
    reflectionPrompt: reflectionPromptForDate(date),
    reflectionNote: "",
  };
}

const reflectionPrompts = [
  "What made staying on plan easier today?",
  "What was the hardest moment, and how did you respond?",
  "What affected your energy, hunger, or focus today?",
  "What would make tomorrow's check-in easier?",
  "What are you proud of today, even if the plan was not perfect?",
];

export function reflectionPromptForDate(date) {
  const dayNumber = Math.floor(new Date(`${date}T00:00:00Z`).getTime() / 86400000);
  return reflectionPrompts[Math.abs(dayNumber) % reflectionPrompts.length];
}

export function toEditableCheckin(checkin, weightUnit = "kg") {
  const editable = Object.fromEntries(
    Object.entries(checkin)
      .filter(([key]) => !["id", "createdAt", "updatedAt"].includes(key))
      .map(([key, value]) => [key, value ?? ""]),
  );

  if (editable.weight && weightUnit === "lb") {
    editable.weight = (Number(editable.weight) * 2.20462).toFixed(1);
  }

  return editable;
}

export function serializeCheckin(form, weightUnit) {
  const weight = form.weight
    ? weightUnit === "lb"
      ? Number(form.weight) / 2.20462
      : Number(form.weight)
    : null;

  return {
    ...form,
    weight,
    targetCalories: Number(form.targetCalories),
    actualCalories: Number(form.actualCalories),
    targetProtein: Number(form.targetProtein),
    actualProtein: Number(form.actualProtein),
    steps: Number(form.steps),
    energyLevel: form.energyLevel === "" ? null : Number(form.energyLevel),
    hungerLevel: form.hungerLevel === "" ? null : Number(form.hungerLevel),
    sleepQuality: form.sleepQuality === "" ? null : Number(form.sleepQuality),
  };
}

export function calculateDashboardStats(checkins) {
  const ascending = [...checkins]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-30);
  const onTarget = checkins.filter(
    (checkin) => checkin.actualCalories <= checkin.targetCalories,
  ).length;
  const streak = [...ascending].reverse().reduce(
    (count, checkin, index) =>
      index === count && checkin.actualCalories <= checkin.targetCalories
        ? count + 1
        : count,
    0,
  );

  return { ascending, onTarget, streak };
}

function average(checkins, field) {
  const values = checkins
    .map((checkin) => Number(checkin[field]))
    .filter((value) => value >= 1 && value <= 5);

  if (!values.length) return null;
  return values.reduce((total, value) => total + value, 0) / values.length;
}

function mostCommonChallenge(checkins) {
  const counts = checkins.reduce((result, checkin) => {
    if (checkin.mainChallenge) {
      result[checkin.mainChallenge] = (result[checkin.mainChallenge] || 0) + 1;
    }
    return result;
  }, {});

  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
}

function buildPatternMessage(onTarget, overTarget) {
  if (onTarget.length < 2 || overTarget.length < 2) {
    return "Log at least two on-target and two over-target days with daily signals to reveal a comparison.";
  }

  const comparisons = [
    { field: "sleepQuality", label: "sleep quality", direction: 1 },
    { field: "energyLevel", label: "energy", direction: 1 },
    { field: "hungerLevel", label: "hunger", direction: -1 },
  ]
    .map((item) => {
      const onAverage = average(onTarget, item.field);
      const overAverage = average(overTarget, item.field);
      if (onAverage === null || overAverage === null) return null;
      return {
        ...item,
        onAverage,
        overAverage,
        strength: (onAverage - overAverage) * item.direction,
      };
    })
    .filter(Boolean)
    .sort((a, b) => Math.abs(b.strength) - Math.abs(a.strength));

  const strongest = comparisons[0];
  if (!strongest || Math.abs(strongest.strength) < 0.5) {
    return "No strong daily-signal pattern is visible yet. Keep logging honestly and let the trend develop.";
  }

  if (strongest.field === "hungerLevel") {
    return strongest.strength > 0
      ? "Your on-target days have tended to come with lower hunger."
      : "Higher hunger has not consistently pushed you over target so far.";
  }

  return strongest.strength > 0
    ? `Your on-target days have tended to come with better ${strongest.label}.`
    : `Your ${strongest.label} has not been higher on on-target days so far.`;
}

export function calculateDashboardInsights(checkins) {
  const recent = [...checkins]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 7);
  const window = [...checkins]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 30);
  const percentage = (hits, total) => (total ? Math.round((hits / total) * 100) : 0);
  const calorieLogs = recent.filter(
    (checkin) => Number(checkin.actualCalories) > 0 && Number(checkin.targetCalories) > 0,
  );
  const proteinLogs = recent.filter(
    (checkin) => Number(checkin.actualProtein) > 0 && Number(checkin.targetProtein) > 0,
  );
  const calorieHits = calorieLogs.filter(
    (checkin) => Number(checkin.actualCalories) <= Number(checkin.targetCalories),
  ).length;
  const proteinHits = proteinLogs.filter(
    (checkin) => Number(checkin.actualProtein) >= Number(checkin.targetProtein),
  ).length;
  const calorieWindow = window.filter(
    (checkin) => Number(checkin.actualCalories) > 0 && Number(checkin.targetCalories) > 0,
  );
  const onTarget = calorieWindow.filter(
      (checkin) => Number(checkin.actualCalories) <= Number(checkin.targetCalories),
    );
  const overTarget = calorieWindow.filter(
      (checkin) => Number(checkin.actualCalories) > Number(checkin.targetCalories),
    );

  return {
    loggedDays: recent.length,
    calorieConsistency: percentage(calorieHits, calorieLogs.length),
    proteinConsistency: percentage(proteinHits, proteinLogs.length),
    averages: {
      energy: average(window, "energyLevel"),
      hunger: average(window, "hungerLevel"),
      sleep: average(window, "sleepQuality"),
    },
    commonChallenge: mostCommonChallenge(window),
    message: buildPatternMessage(onTarget, overTarget),
  };
}
