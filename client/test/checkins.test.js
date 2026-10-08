import test from "node:test";
import assert from "node:assert/strict";
import {
  calculateDashboardInsights,
  calculateDashboardStats,
  calculateMonthlySummary,
  calculateWeeklyReflection,
  convertWeightValue,
  serializeCheckin,
} from "../src/utils/checkins.js";

const checkin = (date, overrides = {}) => ({
  id: date,
  date,
  targetCalories: 2000,
  actualCalories: 1900,
  targetProtein: 150,
  actualProtein: 155,
  steps: 10000,
  motivation: "Dialed",
  energyLevel: 4,
  hungerLevel: 2,
  sleepQuality: 4,
  mainChallenge: "Low energy",
  dailyWin: "Stayed prepared",
  ...overrides,
});

test("dashboard streak stops at a missing calendar day", () => {
  const stats = calculateDashboardStats([
    checkin("2026-10-09"),
    checkin("2026-10-08"),
    checkin("2026-10-06"),
  ]);
  assert.equal(stats.streak, 2);
});

test("dashboard streak stops at the first over-target day", () => {
  const stats = calculateDashboardStats([
    checkin("2026-10-09"),
    checkin("2026-10-08", { actualCalories: 2200 }),
    checkin("2026-10-07"),
  ]);
  assert.equal(stats.streak, 1);
});

test("summary calculations handle empty and complete datasets", () => {
  assert.equal(calculateMonthlySummary([], "2026-10", 10000).calorieConsistency, null);
  const rows = [checkin("2026-10-09"), checkin("2026-10-08", { actualProtein: 100, steps: 5000 })];
  assert.equal(calculateDashboardInsights(rows, 10000).calorieConsistency, 100);
  assert.equal(calculateWeeklyReflection(rows, 10000).proteinConsistency, 50);
  assert.equal(calculateMonthlySummary(rows, "2026-10", 10000).stepConsistency, 50);
});

test("serialization preserves challenge values and converts pounds to kilograms", () => {
  const serialized = serializeCheckin({
    ...checkin("2026-10-09"),
    weight: "176.4",
    mainChallenge: "Boredom",
  }, "lb");
  assert.equal(serialized.mainChallenge, "Boredom");
  assert.ok(Math.abs(serialized.weight - 80.013) < 0.01);
});

test("weight unit toggles do not drift after a round trip", () => {
  const kilograms = convertWeightValue("245", "lb", "kg");
  assert.equal(kilograms, "111.13");
  assert.equal(convertWeightValue(kilograms, "kg", "lb"), "245");

  const pounds = convertWeightValue("80.1", "kg", "lb");
  assert.equal(convertWeightValue(pounds, "lb", "kg"), "80.1");
});
