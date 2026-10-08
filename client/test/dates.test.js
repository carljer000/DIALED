import test from "node:test";
import assert from "node:assert/strict";
import { localIsoDate } from "../src/utils/dates.js";

test("formats a date from its local calendar fields without UTC conversion", () => {
  const value = new Date(2026, 9, 9, 0, 30);
  assert.equal(localIsoDate(value), "2026-10-09");
});
