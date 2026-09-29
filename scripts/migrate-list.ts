/**
 * Applies scripts/list-schema.sql, then copies legacy newsletter rows from
 * `subscribers` into `email_subscribers` (source 'newsletter', consent_version
 * 'legacy-newsletter', fresh unsubscribe tokens). Idempotent: rows already
 * copied are skipped. The legacy table is never dropped.
 *
 *   bun run db:list
 *
 * Uses DATABASE_URL_UNPOOLED from .env.local (Bun loads it automatically).
 */
import { neon } from "@neondatabase/serverless";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { site } from "../src/config/site";
import { isTestEmail, newToken } from "../src/lib/list-db";

const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.POSTGRES_URL_NON_POOLING;
if (!url) {
  console.error("Set DATABASE_URL_UNPOOLED in .env.local.");
  process.exit(1);
}
const sql = neon(url);

const ddl = readFileSync(join(import.meta.dir, "list-schema.sql"), "utf8")
  .replace(/--[^\n]*/g, "")
  .split(";")
  .map((s) => s.trim())
  .filter(Boolean);
for (const stmt of ddl) await sql.query(stmt);
console.log("list schema applied");

const [{ exists }] = (await sql`select to_regclass('public.subscribers') is not null as exists`) as { exists: boolean }[];
let copied = 0;
if (exists) {
  const legacy = (await sql`select email, consent_text, created_at from subscribers order by id`) as {
    email: string;
    consent_text: string;
    created_at: string;
  }[];
  for (const row of legacy) {
    const email = row.email.trim().toLowerCase();
    const result = (await sql`
      insert into email_subscribers
        (brand, email, source, product, consent_text, consent_version, consented_at, unsubscribe_token, is_test, created_at)
      values
        (${site.key}, ${email}, 'newsletter', null, ${row.consent_text}, 'legacy-newsletter', ${row.created_at},
         ${newToken()}, ${isTestEmail(email)}, ${row.created_at})
      on conflict (brand, email, source, product) do nothing
      returning id
    `) as { id: string }[];
    copied += result.length;
  }
  console.log(`legacy subscribers: ${legacy.length}, newly copied: ${copied}`);
}

const counts = await sql`select source, status, count(*)::int as n from email_subscribers group by 1, 2 order by 1, 2`;
console.log("email_subscribers:", counts);
const [{ n }] = (await sql`select count(*)::int as n from contact_messages`) as { n: number }[];
console.log(`contact_messages: ${n} row(s)`);
