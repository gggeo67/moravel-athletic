"use client";

import { useActionState } from "react";
import { optInRestock, type RestockOptInState } from "@/app/actions/restock";
import { listConsent, restock } from "@/config/site";
import { Button } from "@/components/ui/button";

const initial: RestockOptInState = { status: "idle", message: "" };

export function RestockOptIn({ orderRef }: { orderRef: string }) {
  const [state, action, pending] = useActionState(optInRestock, initial);
  if (state.status === "success")
    return (
      <p role="status" className="restock-note">
        {restock.optInSaved}
      </p>
    );
  return (
    <form action={action} id="restock-optin" className="restock-optin">
      <input type="hidden" name="ref" value={orderRef} />
      <label className="consent-check">
        <input type="checkbox" name="restock_optin" required />
        <span>{listConsent.restock}</span>
      </label>
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : restock.optInSubmit}
      </Button>
      <p aria-live="polite" className="text-sm text-destructive">
        {state.status === "error" ? state.message : ""}
      </p>
    </form>
  );
}
