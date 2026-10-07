import { currentRequestSource } from "@/lib/request-source-server";
import { submissionAttribution } from "@/lib/visit-attribution-server";
import { randomBytes } from "node:crypto";
import type { neon } from "@neondatabase/serverless";

/**
 * Email list and contact-message persistence (shared building blocks 1 and 2).
 *
 * Nothing is written to email_subscribers without an explicit, unticked-by-
 * default consent checkbox. The exact label text is stored as consent_text.
 * Rows from @example.com addresses are flagged is_test and left out of exports.
 */

type Sql = ReturnType<typeof neon>;

export const CONSENT_VERSION = "list-v1";

export type ListSource = "newsletter" | "restock";

export function isTestEmail(email: string): boolean {
  return email.trim().toLowerCase().endsWith("@example.com");
}

export function newToken(): string {
  return randomBytes(24).toString("base64url");
}

/** Tokens are 32 base64url characters; anything else is rejected before a query. */
export function isToken(value: unknown): value is string {
  return typeof value === "string" && /^[A-Za-z0-9_-]{20,64}$/.test(value);
}

export type SubscriberInput = {
  brand: string;
  email: string;
  source: ListSource;
  product?: string | null;
  orderRef?: string | null;
  consentText: string;
};

/**
 * Inserts a consented subscription, or re-subscribes an existing one with fresh
 * consent (status back to subscribed, new consent text/version/time).
 */
export async function upsertSubscriber(
  sql: Sql,
  input: SubscriberInput,
): Promise<{ id: string; token: string }> {
  const email = input.email.trim().toLowerCase();
  const rows = (await sql`
    insert into email_subscribers
      (brand, email, source, product, order_ref, consent_text, consent_version, unsubscribe_token, is_test, attribution, request_source)
    values
      (${input.brand}, ${email}, ${input.source}, ${input.product ?? null}, ${input.orderRef ?? null},
       ${input.consentText}, ${CONSENT_VERSION}, ${newToken()}, ${isTestEmail(email)}, ${await submissionAttribution()}::jsonb, ${currentRequestSource()}::jsonb)
    on conflict (brand, email, source, product) do update set
      attribution = case when excluded.attribution is null then email_subscribers.attribution when email_subscribers.attribution is null then excluded.attribution else excluded.attribution || jsonb_build_object('first', email_subscribers.attribution->'first') end,
      status = 'subscribed',
      consent_text = excluded.consent_text,
      consent_version = excluded.consent_version,
      consented_at = now(),
      unsubscribed_at = null,
      order_ref = coalesce(excluded.order_ref, email_subscribers.order_ref)
    returning id, unsubscribe_token
  `) as { id: string; unsubscribe_token: string }[];
  return { id: rows[0].id, token: rows[0].unsubscribe_token };
}

/**
 * Unsubscribes every list row for the token's email at this brand, so one link
 * stops all mail. Returns false for an unknown token.
 */
export async function unsubscribeByToken(
  sql: Sql,
  brand: string,
  token: string,
): Promise<boolean> {
  const rows = (await sql`
    with target as (
      select email from email_subscribers
      where unsubscribe_token = ${token} and brand = ${brand}
    )
    update email_subscribers s
    set status = 'unsubscribed',
        unsubscribed_at = coalesce(s.unsubscribed_at, now())
    from target
    where s.brand = ${brand} and s.email = target.email
    returning s.id
  `) as { id: string }[];
  return rows.length > 0;
}

export type ContactInput = {
  brand: string;
  name: string;
  email: string;
  topic: string;
  message: string;
};

/** Messages from this email in the last 24 hours, for the 5-per-day limit. */
export async function recentContactCount(
  sql: Sql,
  email: string,
): Promise<number> {
  const [{ n }] = (await sql`
    select count(*)::int as n from contact_messages
    where email = ${email} and created_at > now() - interval '1 day'
  `) as { n: number }[];
  return n;
}

export async function insertContactMessage(
  sql: Sql,
  input: ContactInput,
): Promise<string> {
  const rows = (await sql`
    insert into contact_messages (brand, name, email, topic, message, is_test)
    values (${input.brand}, ${input.name}, ${input.email}, ${input.topic}, ${input.message},
            ${isTestEmail(input.email)})
    returning id
  `) as { id: string }[];
  return rows[0].id;
}
