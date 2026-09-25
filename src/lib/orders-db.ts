import { neon } from "@neondatabase/serverless";

/**
 * Order persistence, kept apart from the server action so the same insert can
 * be exercised by scripts/test-order.ts against the real database.
 *
 * No card data is ever written here; card details belong with the processor.
 */

export type OrderContact = {
  name: string;
  email: string;
  address1: string;
  address2: string | null;
  city: string;
  state: string;
  zip: string;
};

export type OrderLine = {
  product: string;
  size: string;
  color: string;
  quantity: number;
  unitPrice: number;
  recipientName?: string;
  recipientEmail?: string;
};

type Sql = ReturnType<typeof neon>;

/** Lazily constructed: module scope is evaluated at build time without env vars. */
export function getSql(): Sql | null {
  const url = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;
  return url ? neon(url) : null;
}

/**
 * One row per line item, sharing orderRef. Sequential rather than batched
 * because neon-http has no transaction; a partial write is recoverable by ref.
 */
export async function insertOrder(
  sql: Sql,
  orderRef: string,
  contact: OrderContact,
  lines: OrderLine[],
): Promise<void> {
  for (const line of lines) {
    await sql`
      insert into orders
        (status, order_ref, name, email, address1, address2, city, state, zip,
         product, size, color, quantity, unit_price, recipient_name, recipient_email)
      values
        ('awaiting_restock', ${orderRef}, ${contact.name}, ${contact.email}, ${contact.address1},
         ${contact.address2}, ${contact.city}, ${contact.state}, ${contact.zip},
         ${line.product}, ${line.size}, ${line.color}, ${line.quantity}, ${line.unitPrice}, ${line.recipientName ?? null}, ${line.recipientEmail ?? null})
    `;
  }
}
