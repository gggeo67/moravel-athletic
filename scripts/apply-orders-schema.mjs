#!/usr/bin/env node
/**
 * One-off schema apply for scripts/orders-schema.sql.
 *
 * Uses the UNPOOLED connection per Neon guidance: DDL is session-level work
 * and should not run through the PgBouncer pooler.
 */
import { neon } from "@neondatabase/serverless";
import { readFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const dir = dirname(fileURLToPath(import.meta.url));

// Minimal .env.local loader, so this works without a dotenv dependency.
const envPath = join(dir, "..", ".env.local");
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^([A-Z_]+)="?([^"]*)"?$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

const url =
  process.env.DATABASE_URL_UNPOOLED ?? process.env.POSTGRES_URL_NON_POOLING;
if (!url) {
  console.error(
    "No unpooled connection string found. Set DATABASE_URL_UNPOOLED in .env.local.",
  );
  process.exit(1);
}

const sql = neon(url);

// Strip comments BEFORE splitting on ";" so a semicolon inside a comment
// cannot split mid-comment and produce a garbage statement.
const ddl = readFileSync(
  join(dir, process.argv[2] ?? "orders-schema.sql"),
  "utf8",
)
  .replace(/--[^\n]*/g, "")
  .split(";")
  .map((s) => s.trim())
  .filter(Boolean);

for (const stmt of ddl) await sql.query(stmt);

const [{ count }] = await sql`select count(*)::int as count from orders`;
console.log(`Schema applied. orders table holds ${count} row(s).`);
