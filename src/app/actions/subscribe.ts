"use server";
import { withRequestSource } from "@/lib/request-source-server";
import { getSql } from "@/lib/orders-db";
import { upsertSubscriber } from "@/lib/list-db";
import { listConsent, site } from "@/config/site";
export type SubscribeState = {
  status: "idle" | "success" | "error";
  message: string;
};
/**
 * Newsletter sign-up. Requires the unticked consent checkbox; stores the exact
 * label as consent_text in email_subscribers (source 'newsletter'). Signing up
 * again after unsubscribing re-subscribes with fresh consent.
 */
export async function subscribe(
  _previous: SubscribeState,
  form: FormData,
): Promise<SubscribeState> {
  return withRequestSource(form, async () => {
    const email = String(form.get("newsletter-email") ?? "")
      .trim()
      .toLowerCase();
    if (form.get("website"))
      return { status: "success", message: "You’re on the list." };
    if (!/^\S+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254)
      return { status: "error", message: "Enter a valid email address." };
    if (form.get("consent") !== "on")
      return {
        status: "error",
        message: "Confirm that you want to receive emails.",
      };
    const sql = getSql();
    if (!sql)
      return {
        status: "error",
        message: "We couldn’t save your email. Please try again later.",
      };
    try {
      await upsertSubscriber(sql, {
        brand: site.key,
        email,
        source: "newsletter",
        product: null,
        consentText: listConsent.newsletter,
      });
      return { status: "success", message: "You’re on the list." };
    } catch (error) {
      console.error("[newsletter] insert failed:", (error as Error).name);
      return {
        status: "error",
        message: "We couldn’t save your email. Please try again.",
      };
    }
  });
}
