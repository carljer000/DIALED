import test from "node:test";
import assert from "node:assert/strict";
import {
  challenges,
  isValidIsoDate,
  isValidUuid,
  validateCheckin,
} from "../src/validation/checkins.js";

const validCheckin = {
  date: "2026-10-09",
  weight: 80.5,
  targetCalories: 2250,
  actualCalories: 2100,
  targetProtein: 180,
  actualProtein: 175,
  steps: 10000,
  motivation: "Dialed",
  energyLevel: 3,
  hungerLevel: 2,
  sleepQuality: 4,
  trainingStatus: "Completed",
  dailyWin: "Prepared meals before work.",
  reflectionPrompt: "What helped today?",
  reflectionNote: "Planning removed friction.",
};

test("accepts every Main Challenge shown by the client", () => {
  const expected = [
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
  ];

  assert.deepEqual([...challenges], expected);
  for (const mainChallenge of expected) {
    assert.deepEqual(validateCheckin({ ...validCheckin, mainChallenge }), [], mainChallenge);
  }
});

test("rejects impossible dates and malformed required values", () => {
  const errors = validateCheckin({
    ...validCheckin,
    date: "2026-02-31",
    targetCalories: 0,
    actualProtein: "",
    energyLevel: 6,
  });

  assert.ok(errors.includes("A valid date is required."));
  assert.ok(errors.includes("targetCalories must be an integer of at least 1."));
  assert.ok(errors.includes("actualProtein must be an integer of at least 0."));
  assert.ok(errors.includes("energyLevel must be an integer from 1 to 5."));
});

test("rejects oversized reflection text and non-object bodies", () => {
  assert.deepEqual(validateCheckin(null), ["A check-in object is required."]);
  assert.ok(validateCheckin({ ...validCheckin, dailyWin: "x".repeat(161) }).length > 0);
  assert.ok(validateCheckin({ ...validCheckin, reflectionNote: "x".repeat(501) }).length > 0);
});

test("validates route date and UUID parameters before database queries", () => {
  assert.equal(isValidIsoDate("2026-10-09"), true);
  assert.equal(isValidIsoDate("2026-02-31"), false);
  assert.equal(isValidUuid("123e4567-e89b-42d3-a456-426614174000"), true);
  assert.equal(isValidUuid("not-a-uuid"), false);
});
