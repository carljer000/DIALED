import { localIsoDate } from "../utils/dates.js";

const STORAGE_KEY = "dialed-demo-checkins-v1";

function dateDaysAgo(days) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() - days);
  return localIsoDate(date);
}

function demoEntry(daysAgo, values) {
  const timestamp = new Date().toISOString();
  return {
    id: `demo-${daysAgo}`,
    date: dateDaysAgo(daysAgo),
    weight: null,
    targetCalories: 2200,
    actualCalories: 2100,
    targetProtein: 175,
    actualProtein: 180,
    steps: 10500,
    motivation: "Dialed",
    energyLevel: 4,
    hungerLevel: 2,
    sleepQuality: 4,
    trainingStatus: "Completed",
    mainChallenge: "Hunger",
    dailyWin: "Stayed prepared and finished the day on plan.",
    reflectionPrompt: "What made today easier to follow through on?",
    reflectionNote: "Planning meals early made the rest of the day feel automatic.",
    createdAt: timestamp,
    updatedAt: timestamp,
    ...values,
  };
}

export function createDemoCheckins() {
  return [
    demoEntry(0, { weight: 79.4, actualCalories: 2130, steps: 11240 }),
    demoEntry(1, { weight: 79.6, actualCalories: 2185, actualProtein: 177, steps: 9840 }),
    demoEntry(2, { weight: 79.7, actualCalories: 2260, motivation: "Neutral", energyLevel: 3, mainChallenge: "Low energy", dailyWin: "Still completed my training session." }),
    demoEntry(3, { weight: 79.8, actualCalories: 2080, actualProtein: 181, steps: 12420 }),
    demoEntry(4, { weight: 80, actualCalories: 2170, steps: 10310, trainingStatus: "Rest day" }),
    demoEntry(6, { weight: 80.1, actualCalories: 2195, actualProtein: 172, steps: 8900, motivation: "Neutral", mainChallenge: "Cravings" }),
    demoEntry(7, { weight: 80.2, actualCalories: 2050, actualProtein: 184, steps: 13100 }),
    demoEntry(9, { weight: 80.4, actualCalories: 2300, actualProtein: 169, steps: 7600, motivation: "Low", energyLevel: 2, mainChallenge: "Stress" }),
    demoEntry(10, { weight: 80.3, actualCalories: 2140, actualProtein: 179, steps: 10900 }),
    demoEntry(12, { weight: 80.6, actualCalories: 2160, actualProtein: 176, steps: 10150 }),
  ].sort((a, b) => b.date.localeCompare(a.date));
}

function write(checkins) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(checkins));
  return checkins;
}

function read() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : write(createDemoCheckins());
  } catch {
    return write(createDemoCheckins());
  }
}

function demoId() {
  return globalThis.crypto?.randomUUID?.() || `demo-${Date.now()}`;
}

export const demoCheckinsApi = {
  async list() {
    return read();
  },

  async upsert(checkin) {
    const current = read();
    const existing = current.find((entry) => entry.date === checkin.date);
    const now = new Date().toISOString();
    const saved = {
      ...existing,
      ...checkin,
      id: existing?.id || demoId(),
      createdAt: existing?.createdAt || now,
      updatedAt: now,
    };
    write([saved, ...current.filter((entry) => entry.id !== existing?.id)].sort((a, b) => b.date.localeCompare(a.date)));
    return saved;
  },

  async remove(id) {
    write(read().filter((entry) => entry.id !== id));
    return null;
  },

  async reset() {
    return write(createDemoCheckins());
  },
};
