import test from "node:test";
import assert from "node:assert/strict";
import { createDemoCheckins } from "../src/services/demoCheckins.js";

test("demo data is invented, complete, and isolated from API identifiers", () => {
  const rows = createDemoCheckins();
  assert.ok(rows.length >= 7);
  assert.ok(rows.every((row) => row.id.startsWith("demo-")));
  assert.ok(rows.every((row) => /^\d{4}-\d{2}-\d{2}$/.test(row.date)));
  assert.ok(rows.every((row) => Number.isFinite(row.targetCalories)));
});
