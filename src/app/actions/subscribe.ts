"use server";
import { getSql } from "@/lib/orders-db";
import { storefront } from "@/config/site";
export type SubscribeState = {
  status: "idle" | "success" | "error";
  message: string;
};
export async function subscribe(
  _previous: SubscribeState,
  form: FormData,
): Promise<SubscribeState> {
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
    await sql`insert into subscribers(email,consent_text) values(${email},${storefront.newsletter.consent}) on conflict(email) do nothing`;
    return { status: "success", message: "You’re on the list." };
  } catch {
    console.error("[newsletter] insert failed");
    return {
      status: "error",
      message: "We couldn’t save your email. Please try again.",
    };
  }
}
