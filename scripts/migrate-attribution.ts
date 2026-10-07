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
    `ALTER TABLE public.${t} ADD COLUMN IF NOT EXISTS attribution jsonb`,
  );
  const fields = await sql.query(
    "select data_type from information_schema.columns where table_schema='public' and table_name=$1 and column_name='attribution'",
    [t],
  );
  if (fields[0]?.data_type !== "jsonb")
    throw new Error("Attribution column verification failed");
  console.log(t + ": attribution jsonb verified");
}
