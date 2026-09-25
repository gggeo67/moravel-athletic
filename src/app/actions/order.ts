"use server";

import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { parseLines, resolveLines, type ResolvedLine } from "@/lib/cart";
import { verifyTurnstile } from "@/lib/turnstile";
import { getSql, insertOrder } from "@/lib/orders-db";
import type { OrderState } from "@/lib/order";

/**
 * Checkout capture.
 *
 * HARD CONSTRAINT: no card fields anywhere in this flow until real payment
 * processing exists.
 *
 * Stores the restock request (status 'awaiting_restock') and redirects to
 * /checkout/payment, which shows restock information. The row is written BEFORE the
 * redirect, so nothing is lost at that step. No confirmation email is sent:
 * nothing has been paid for yet.
 *
 * If DATABASE_URL is unset this fails loudly rather than dropping the order.
 */

function isValidEmail(value: string): boolean {
  if (value.length < 6 || value.length > 254) return false;
  return /^[^\s@,;]+@[^\s@,;.]+(\.[^\s@,;.]+)+$/.test(value);
}

function field(formData: FormData, name: string, max = 200): string {
  return ((formData.get(name) as string) ?? "").trim().slice(0, max);
}

export async function submitOrder(
  _prevState: OrderState,
  formData: FormData,
): Promise<OrderState> {
  // Honeypot: take the success path so a bot learns nothing, and write nothing.
  if (field(formData, "company") !== "") redirect("/checkout/payment");

  const name = field(formData, "name");
  const email = field(formData, "email").toLowerCase();
  const address1 = field(formData, "address1");
  const address2 = field(formData, "address2");
  const city = field(formData, "city");
  const state = field(formData, "state", 40);
  const zip = field(formData, "zip", 20);

  // Lines come from the client cart and are re-resolved here: the browser says
  // what the customer wants, the catalogue says what it costs.
  let lines: ResolvedLine[];
  try {
    const raw: unknown = JSON.parse(field(formData, "lines", 24000) || "[]");
    const parsed = parseLines(raw);
    lines =
      Array.isArray(raw) && parsed.length === raw.length
        ? resolveLines(parsed)
        : [];
  } catch {
    lines = [];
  }

  // Echoed back on every error path so nothing the customer typed is lost.
  const values = { name, email, address1, address2, city, state, zip };

  if (lines.length === 0) {
    return {
      status: "error",
      message: "Your bag is empty. Add something before checking out.",
      values,
    };
  }
  if (lines.some((l) => !l.available)) {
    return {
      status: "error",
      message:
        "A selection in your bag is unavailable. Review it and try again.",
      values,
    };
  }

  const required: Array<[string, string, string]> = [
    ["name", name, "Enter your name."],
    ["email", email, "Enter an email address."],
    ["address1", address1, "Enter a street address."],
    ["city", city, "Enter a city."],
    ["state", state, "Enter a state."],
    ["zip", zip, "Enter a ZIP code."],
  ];
  for (const [key, value, message] of required) {
    if (!value) return { status: "error", message, field: key, values };
  }
  if (!isValidEmail(email)) {
    return {
      status: "error",
      message: "That doesn't look like an email address.",
      field: "email",
      values,
    };
  }

  // After field validation: Turnstile tokens are single-use.
  const captcha = await verifyTurnstile(formData.get("cf-turnstile-response"));
  if (!captcha.ok) {
    console.error("[order] turnstile rejected:", captcha.reason);
    return {
      status: "error",
      message: "Could not verify you're human. Reload the page and try again.",
      field: "captcha",
      values,
    };
  }

  const sql = getSql();
  if (!sql) {
    console.error("[order] DATABASE_URL is not set — order dropped.");
    return {
      status: "error",
      message: "We couldn't save your request. Try again in a few minutes.",
      values,
    };
  }

  try {
    await insertOrder(
      sql,
      randomUUID(),
      { name, email, address1, address2: address2 || null, city, state, zip },
      lines.map((l) => ({
        product: l.handle,
        size: l.size,
        color: l.color,
        quantity: l.quantity,
        unitPrice: l.unitPrice,
        recipientName: l.recipientName,
        recipientEmail: l.recipientEmail,
      })),
    );
  } catch (error) {
    console.error("[order] insert failed:", error);
    return {
      status: "error",
      message: "Something went wrong saving your request. Try again.",
      values,
    };
  }

  redirect("/checkout/payment");
}
