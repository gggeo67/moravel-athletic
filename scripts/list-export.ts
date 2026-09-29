/**
 * Exports the email list and contact messages to CSV:
 *   exports/<brand>-subscribers.csv
 *   exports/<brand>-contact-messages.csv
 *
 *   bun run list:export                 # real rows only
 *   bun run list:export --include-test  # also @example.com test rows
 *
 * exports/ is gitignored: these files hold personal data.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { neon } from "@neondatabase/serverless";
import { site } from "../src/config/site";

const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
if (!url) {
  console.error("Set DATABASE_URL in .env.local.");
  process.exit(1);
}
const sql = neon(url);
const includeTest = process.argv.includes("--include-test");

function csv(rows: Record<string, unknown>[], columns: string[]): string {
  const cell = (v: unknown) => {
    const s = v == null ? "" : v instanceof Date ? v.toISOString() : String(v);
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [columns.join(","), ...rows.map((r) => columns.map((c) => cell(r[c])).join(","))].join("\n") + "\n";
}

const subscribers = (await sql`
  select email, source, product, order_ref, status, consent_text, consent_version, consented_at,
         unsubscribed_at, email_notified, is_test, created_at
  from email_subscribers
  where brand = ${site.key} and (${includeTest} or not is_test)
  order by created_at
`) as Record<string, unknown>[];

const messages = (await sql`
  select id, name, email, topic, message, is_test, created_at
  from contact_messages
  where brand = ${site.key} and (${includeTest} or not is_test)
  order by created_at
`) as Record<string, unknown>[];

const dir = join(import.meta.dir, "..", "exports");
mkdirSync(dir, { recursive: true });
const subsFile = join(dir, `${site.key}-subscribers.csv`);
const msgsFile = join(dir, `${site.key}-contact-messages.csv`);
writeFileSync(subsFile, csv(subscribers, Object.keys(subscribers[0] ?? {
  email: 0, source: 0, product: 0, order_ref: 0, status: 0, consent_text: 0, consent_version: 0,
  consented_at: 0, unsubscribed_at: 0, email_notified: 0, is_test: 0, created_at: 0,
})));
writeFileSync(msgsFile, csv(messages, Object.keys(messages[0] ?? {
  id: 0, name: 0, email: 0, topic: 0, message: 0, is_test: 0, created_at: 0,
})));
console.log(`${subscribers.length} subscriber row(s) → ${subsFile}`);
console.log(`${messages.length} contact message(s) → ${msgsFile}`);
if (!includeTest) console.log("(test rows excluded; pass --include-test to include them)");
