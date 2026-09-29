import { getSql } from "@/lib/orders-db";
import { absoluteUrl, site } from "@/config/site";

/**
 * Outbound email. DORMANT until a sending domain is verified.
 *
 * Unless RESEND_API_KEY and EMAIL_FROM_DOMAIN are both set this returns
 * { sent: false, reason: "not-configured" } and never throws. When configured it
 * sends through Resend from hello@EMAIL_FROM_DOMAIN, adds a List-Unsubscribe
 * header and an unsubscribe link, and marks the list row email_notified.
 * Callers must never let a send failure break their flow; this never throws.
 */

export type SendResult =
  | { sent: true; id: string | null }
  | { sent: false; reason: "not-configured" | "error" };

export type EmailInput = {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
  /** email_subscribers.unsubscribe_token; adds the unsubscribe link and header. */
  unsubscribeToken?: string;
};

export function emailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM_DOMAIN);
}

export async function sendEmail(input: EmailInput): Promise<SendResult> {
  const key = process.env.RESEND_API_KEY;
  const domain = process.env.EMAIL_FROM_DOMAIN;
  if (!key || !domain) return { sent: false, reason: "not-configured" };

  try {
    const unsubscribeUrl = input.unsubscribeToken
      ? absoluteUrl(`/unsubscribe?token=${encodeURIComponent(input.unsubscribeToken)}`)
      : null;
    const text = unsubscribeUrl
      ? `${input.text}\n\n—\nUnsubscribe from ${site.name} emails: ${unsubscribeUrl}`
      : input.text;

    const { Resend } = await import("resend");
    const { data, error } = await new Resend(key).emails.send({
      from: `${site.name} <hello@${domain}>`,
      to: input.to,
      subject: input.subject,
      text,
      ...(input.replyTo ? { replyTo: input.replyTo } : {}),
      ...(unsubscribeUrl
        ? { headers: { "List-Unsubscribe": `<${unsubscribeUrl}>` } }
        : {}),
    });
    if (error) {
      console.error("[email] send failed:", error.name);
      return { sent: false, reason: "error" };
    }

    if (input.unsubscribeToken) {
      const sql = getSql();
      if (sql)
        await sql`update email_subscribers set email_notified = true where unsubscribe_token = ${input.unsubscribeToken}`;
    }
    return { sent: true, id: data?.id ?? null };
  } catch (err) {
    console.error("[email] send threw:", (err as Error).name);
    return { sent: false, reason: "error" };
  }
}
