"use server";
import { withRequestSource } from "@/lib/request-source-server";
import { captureConversion } from "@/lib/experiment-analytics-server";

import { listConsent, site } from "@/config/site";
import { findOrder, getSql } from "@/lib/orders-db";
import { upsertSubscriber } from "@/lib/list-db";
import { isOrderRef, restockProduct } from "@/lib/order";

/**
 * Restock opt-in after checkout, for customers who left the box unticked. The
 * order ref (an unguessable UUID from the redirect) identifies the order; the
 * email comes from the saved order, never from the form. Consent still needs
 * the unticked checkbox.
 */

export type RestockOptInState = {
  status: "idle" | "success" | "error";
  message: string;
};

export async function optInRestock(
  _prev: RestockOptInState,
  form: FormData,
): Promise<RestockOptInState> {
  return withRequestSource(form, async () => {
    const ref = form.get("ref");
    if (!isOrderRef(ref))
      return { status: "error", message: "We couldn't find that order." };
    if (form.get("restock_optin") !== "on")
      return { status: "error", message: "Tick the box to get the email." };

    const sql = getSql();
    if (!sql)
      return {
        status: "error",
        message: "We couldn't save that. Try again in a few minutes.",
      };
    try {
      const order = await findOrder(sql, ref);
      if (!order)
        return { status: "error", message: "We couldn't find that order." };
      await upsertSubscriber(sql, {
        brand: site.key,
        email: order.email,
        source: "restock",
        product: restockProduct(order.products),
        orderRef: ref,
        consentText: listConsent.restock,
      });
      await captureConversion("restock_signup_saved", ref, {
        is_test: /@example\.(com|org|net)$/i.test(order.email),
      });
      return { status: "success", message: "" };
    } catch (error) {
      console.error("[restock] opt-in failed:", error);
      return {
        status: "error",
        message: "Something went wrong saving that. Try again.",
      };
    }
  });
}
