import "dotenv/config";
import { pool } from "./src/config/database.js";

const notes = ["Kept it simple and hit the plan.", "Energy dipped late, but stayed on track.", "Good training session and easy steps.", "Weekend meal out—got right back to routine.", "Focused on the next rep, not perfection.", "Solid day. Momentum feels real."];
const motivations = ["Dialed", "Neutral", "Dialed", "Neutral", "Low", "Dialed"];
const prompts = [
  "What made staying on plan easier today?",
  "What was the hardest moment, and how did you respond?",
  "What affected your energy, hunger, or focus today?",
  "What would make tomorrow's check-in easier?",
  "What are you proud of today, even if the plan was not perfect?",
];

for (let offset = 20; offset >= 0; offset -= 1) {
  const date = new Date();
  date.setDate(date.getDate() - offset);
  const index = 20 - offset;
  const actualCalories = 2130 + ((index * 43) % 280) - (index % 6 === 4 ? 190 : 0);
  await pool.query(`
    INSERT INTO checkins (
      date, weight, target_calories, actual_calories, target_protein,
      actual_protein, steps, motivation, energy_level, hunger_level,
      sleep_quality, training_status, main_challenge, daily_win,
      reflection_prompt, reflection_note
    )
    VALUES ($1,$2,2250,$3,180,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
    ON CONFLICT (date) DO UPDATE SET weight=EXCLUDED.weight, actual_calories=EXCLUDED.actual_calories,
      actual_protein=EXCLUDED.actual_protein, steps=EXCLUDED.steps, motivation=EXCLUDED.motivation,
      energy_level=EXCLUDED.energy_level, hunger_level=EXCLUDED.hunger_level,
      sleep_quality=EXCLUDED.sleep_quality, training_status=EXCLUDED.training_status,
      main_challenge=EXCLUDED.main_challenge, daily_win=EXCLUDED.daily_win,
      reflection_prompt=EXCLUDED.reflection_prompt, reflection_note=EXCLUDED.reflection_note,
      updated_at=NOW()`,
    [
      date.toISOString().slice(0, 10),
      (84.8 - index * 0.09 + (index % 4) * 0.16).toFixed(1),
      actualCalories,
      172 + ((index * 7) % 21),
      7800 + ((index * 613) % 4300),
      motivations[index % motivations.length],
      2 + (index % 4),
      1 + (index % 5),
      2 + ((index + 1) % 4),
      index % 4 === 0 ? "Rest day" : "Completed",
      index % 5 === 0 ? "Stress" : null,
      index % 3 === 0 ? "Kept the promise to check in." : "",
      prompts[index % prompts.length],
      notes[index % notes.length],
    ]
  );
}

console.log("Seeded 21 days of Dialed check-ins.");
await pool.end();
