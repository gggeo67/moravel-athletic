/**
 * Proves the checkout write path against the real database: inserts one test
 * order through the same insertOrder() the server action uses, reads it back,
 * then deletes it. Test rows always use an @example.com address because
 * preview and production share this database.
 *
 *   bun run db:test-order
 *
 * Bun loads .env.local automatically.
 */
import { randomUUID } from "node:crypto";
import { getSql, insertOrder } from "../src/lib/orders-db";

const sql = getSql();
if (!sql) {
  console.error("DATABASE_URL is not set. Run `vercel env pull .env.local` first.");
  process.exit(1);
}

const ref = randomUUID();
await insertOrder(
  sql,
  ref,
  {
    name: "Checkout Test",
    email: "checkout-test@example.com",
    address1: "1 Test Street",
    address2: null,
    city: "Testville",
    state: "CA",
    zip: "94000",
  },
  [{ product: "test-item", size: "M", color: "test", quantity: 1, unitPrice: 1 }],
);

type Row = { order_ref: string; email: string; status: string; product: string };
const rows = (await sql`select order_ref, email, status, product from orders where order_ref = ${ref}`) as Row[];
console.log("read back:", rows);
const ok = rows.length === 1 && rows[0].status === "awaiting_restock";

await sql`delete from orders where order_ref = ${ref} and email like '%@example.com'`;
const [{ count }] = (await sql`select count(*)::int as count from orders where order_ref = ${ref}`) as { count: number }[];
console.log(`deleted test order; ${count} row(s) left for ${ref}`);

if (!ok || count !== 0) {
  console.error("TEST ORDER FAILED");
  process.exit(1);
}
console.log("TEST ORDER PASS");
