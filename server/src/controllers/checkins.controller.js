import { pool } from "../config/database.js";
import { isValidIsoDate, isValidUuid, validateCheckin } from "../validation/checkins.js";

const SELECT_FIELDS = `
  id, date::text, weight, target_calories AS "targetCalories",
  actual_calories AS "actualCalories", target_protein AS "targetProtein",
  actual_protein AS "actualProtein", steps, motivation,
  energy_level AS "energyLevel", hunger_level AS "hungerLevel",
  sleep_quality AS "sleepQuality", training_status AS "trainingStatus",
  main_challenge AS "mainChallenge", daily_win AS "dailyWin",
  reflection_prompt AS "reflectionPrompt", reflection_note AS "reflectionNote",
  created_at AS "createdAt", updated_at AS "updatedAt"`;

export async function listCheckins(_request, response, next) {
  try {
    const { rows } = await pool.query(`SELECT ${SELECT_FIELDS} FROM checkins ORDER BY date DESC`);
    response.json(rows);
  } catch (error) { next(error); }
}

export async function getCheckinByDate(request, response, next) {
  if (!isValidIsoDate(request.params.date)) {
    return response.status(400).json({ error: "Date must use a real YYYY-MM-DD calendar date." });
  }
  try {
    const { rows } = await pool.query(`SELECT ${SELECT_FIELDS} FROM checkins WHERE date = $1`, [request.params.date]);
    if (!rows[0]) return response.status(404).json({ error: "No check-in found for that date." });
    response.json(rows[0]);
  } catch (error) { next(error); }
}

export async function upsertCheckin(request, response, next) {
  const errors = validateCheckin(request.body);
  if (errors.length) return response.status(400).json({ error: errors.join(" ") });
  const {
    date, weight = null, targetCalories, actualCalories, targetProtein,
    actualProtein, steps, motivation, energyLevel = null, hungerLevel = null,
    sleepQuality = null, trainingStatus = null, mainChallenge = null,
    dailyWin = "", reflectionPrompt = "", reflectionNote = "",
  } = request.body;
  try {
    const { rows } = await pool.query(`
      INSERT INTO checkins (
        date, weight, target_calories, actual_calories, target_protein,
        actual_protein, steps, motivation, energy_level, hunger_level,
        sleep_quality, training_status, main_challenge, daily_win,
        reflection_prompt, reflection_note
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
      ON CONFLICT (date) DO UPDATE SET weight = EXCLUDED.weight, target_calories = EXCLUDED.target_calories,
        actual_calories = EXCLUDED.actual_calories, target_protein = EXCLUDED.target_protein,
        actual_protein = EXCLUDED.actual_protein, steps = EXCLUDED.steps, motivation = EXCLUDED.motivation,
        energy_level = EXCLUDED.energy_level, hunger_level = EXCLUDED.hunger_level,
        sleep_quality = EXCLUDED.sleep_quality, training_status = EXCLUDED.training_status,
        main_challenge = EXCLUDED.main_challenge, daily_win = EXCLUDED.daily_win,
        reflection_prompt = EXCLUDED.reflection_prompt,
        reflection_note = EXCLUDED.reflection_note, updated_at = NOW()
      RETURNING ${SELECT_FIELDS}`,
      [
        date, weight, targetCalories, actualCalories, targetProtein,
        actualProtein, steps, motivation,
        energyLevel === "" ? null : energyLevel,
        hungerLevel === "" ? null : hungerLevel,
        sleepQuality === "" ? null : sleepQuality,
        trainingStatus || null, mainChallenge || null, dailyWin.trim(),
        reflectionPrompt.trim(), reflectionNote.trim(),
      ]
    );
    response.status(201).json(rows[0]);
  } catch (error) { next(error); }
}

export async function deleteCheckin(request, response, next) {
  if (!isValidUuid(request.params.id)) {
    return response.status(400).json({ error: "Check-in ID is invalid." });
  }
  try {
    const { rowCount } = await pool.query("DELETE FROM checkins WHERE id = $1", [request.params.id]);
    if (!rowCount) return response.status(404).json({ error: "Check-in not found." });
    response.status(204).end();
  } catch (error) { next(error); }
}
