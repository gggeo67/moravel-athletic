"use server";

import { contactForm, site } from "@/config/site";
import { getSql } from "@/lib/orders-db";
import { insertContactMessage, isTestEmail, recentContactCount } from "@/lib/list-db";
import { validateContact, type ContactState, type ContactValues } from "@/lib/contact";

/**
 * Contact form. Server actions reject cross-origin posts (Next compares the
 * Origin header with the host). A filled honeypot gets the success message and
 * nothing is stored. Five messages per email per day; @example.com rows are
 * flagged is_test and skip the limit.
 */

const DAILY_LIMIT = 5;

function text(form: FormData, name: string, max: number): string {
  return String(form.get(name) ?? "").trim().slice(0, max);
}

export async function sendContactMessage(
  _prev: ContactState,
  form: FormData,
): Promise<ContactState> {
  if (text(form, "website", 200) !== "")
    return { status: "success", message: contactForm.success };

  const values: ContactValues = {
    name: text(form, "name", 120),
    email: text(form, "email", 254).toLowerCase(),
    topic: text(form, "topic", 80),
    // Slightly over the max so an over-long message is reported, not truncated.
    message: text(form, "message", 2100),
  };

  const errors = validateContact(values);
  if (Object.keys(errors).length > 0)
    return {
      status: "error",
      message: "Check the highlighted fields.",
      errors,
      values,
    };

  const sql = getSql();
  if (!sql) {
    console.error("[contact] DATABASE_URL is not set; message refused.");
    return {
      status: "error",
      message: "We couldn't send your message. Try again in a few minutes.",
      errors: {},
      values,
    };
  }

  try {
    if (!isTestEmail(values.email)) {
      const recent = await recentContactCount(sql, values.email);
      if (recent >= DAILY_LIMIT)
        return {
          status: "error",
          message:
            "You've sent several messages today. We'll reply to those first; try again tomorrow.",
          errors: {},
          values,
        };
    }
    const id = await insertContactMessage(sql, { brand: site.key, ...values });
    console.log("[contact] saved", { id });
    return { status: "success", message: contactForm.success };
  } catch (error) {
    console.error("[contact] insert failed:", (error as Error).name);
    return {
      status: "error",
      message: "Something went wrong sending your message. Try again.",
      errors: {},
      values,
    };
  }
}
