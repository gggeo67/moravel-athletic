import { neon } from "@neondatabase/serverless";
const tables = ["orders", "email_subscribers"];
const url =
  process.env.DATABASE_URL_UNPOOLED ??
  process.env.POSTGRES_URL_NON_POOLING ??
  process.env.DATABASE_URL ??
  process.env.POSTGRES_URL;
if (!url) throw new Error("Own-site database connection missing");
const sql = neon(url);
// Validate every target before changing schema. No customer records are read or changed.
const found = await sql.query(
  "select table_name from information_schema.tables where table_schema='public' and table_name = ANY($1::text[])",
  [tables],
);
if (found.length !== tables.length)
  throw new Error("Target schema does not match this site's submission tables");
for (const t of tables) {
  await sql.query(
    `ALTER TABLE public.${t} ADD COLUMN IF NOT EXISTS request_source jsonb`,
  );
  const fields = await sql.query(
    "select data_type from information_schema.columns where table_schema='public' and table_name=$1 and column_name='request_source'",
    [t],
  );
  if (fields[0]?.data_type !== "jsonb")
    throw new Error("Request source column verification failed");
  console.log(t + ": request_source jsonb verified");
}

const migration = await Bun.file(
  new URL("../db/migrations/20261006_request_source.sql", import.meta.url),
).text();
for (const statement of migration
  .split(";")
  .map((s) => s.trim())
  .filter(Boolean))
  await sql.query(statement);
console.log("Daily source totals and report health tables verified");
