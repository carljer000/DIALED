import "dotenv/config";
import pg from "pg";

const { Pool } = pg;
const sourceUrl = process.env.SOURCE_DATABASE_URL;
const targetUrl = process.env.DATABASE_URL;

if (!sourceUrl || !targetUrl) {
  throw new Error(
    "SOURCE_DATABASE_URL and DATABASE_URL are required in server/.env.",
  );
}

if (sourceUrl === targetUrl) {
  throw new Error("Source and target database URLs must be different.");
}

const source = new Pool({
  connectionString: sourceUrl,
  max: 1,
  connectionTimeoutMillis: 10_000,
});
const target = new Pool({
  connectionString: targetUrl,
  max: 1,
  connectionTimeoutMillis: 10_000,
});

try {
  const { rows } = await source.query(`
    select
      id,
      date,
      weight,
      target_calories,
      actual_calories,
      target_protein,
      actual_protein,
      steps,
      motivation,
      reflection_note,
      created_at,
      updated_at
    from public.checkins
    order by date
  `);

  const client = await target.connect();
  try {
    await client.query("begin");

    for (const checkin of rows) {
      await client.query(
        `
          insert into public.checkins (
            id,
            date,
            weight,
            target_calories,
            actual_calories,
            target_protein,
            actual_protein,
            steps,
            motivation,
            reflection_note,
            created_at,
            updated_at
          )
          values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
          on conflict (date) do update set
            weight = excluded.weight,
            target_calories = excluded.target_calories,
            actual_calories = excluded.actual_calories,
            target_protein = excluded.target_protein,
            actual_protein = excluded.actual_protein,
            steps = excluded.steps,
            motivation = excluded.motivation,
            reflection_note = excluded.reflection_note,
            updated_at = excluded.updated_at
        `,
        [
          checkin.id,
          checkin.date,
          checkin.weight,
          checkin.target_calories,
          checkin.actual_calories,
          checkin.target_protein,
          checkin.actual_protein,
          checkin.steps,
          checkin.motivation,
          checkin.reflection_note,
          checkin.created_at,
          checkin.updated_at,
        ],
      );
    }

    const verification = await client.query(
      "select count(*)::integer as count from public.checkins",
    );
    await client.query("commit");

    console.log(
      `Migrated ${rows.length} local check-in(s). Supabase now contains ${verification.rows[0].count} check-in(s).`,
    );
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
  }
} finally {
  await Promise.all([source.end(), target.end()]);
}
