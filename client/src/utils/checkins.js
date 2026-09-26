export function createEmptyCheckin(date) {
  return {
    date,
    weight: "",
    targetCalories: "2250",
    actualCalories: "",
    targetProtein: "180",
    actualProtein: "",
    steps: "",
    motivation: "Dialed",
    energyLevel: "",
    hungerLevel: "",
    sleepQuality: "",
    trainingStatus: "",
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

export function toEditableCheckin(checkin) {
  return Object.fromEntries(
    Object.entries(checkin)
      .filter(([key]) => !["id", "createdAt", "updatedAt"].includes(key))
      .map(([key, value]) => [key, value ?? ""]),
  );
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
