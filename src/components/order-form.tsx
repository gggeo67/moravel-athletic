"use client";

import { restock } from "@/config/site";
import { useActionState } from "react";
import { submitOrder } from "@/app/actions/order";
import { initialOrderState } from "@/lib/order";
import type { CartLine } from "@/lib/cart";
import { Button } from "@/components/ui/button";

/**
 * Checkout form: contact and shipping details only. NO card fields.
 *
 * Saves a restock request before showing the restock page.
 */

function Field({
  id,
  label,
  autoComplete,
  type = "text",
  required = true,
  invalid = false,
  defaultValue,
}: {
  id: string;
  label: string;
  autoComplete?: string;
  type?: string;
  required?: boolean;
  invalid?: boolean;
  defaultValue?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        aria-invalid={invalid}
        className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50 aria-[invalid=true]:border-destructive"
      />
    </div>
  );
}

export function OrderForm({ lines }: { lines: CartLine[] }) {
  const [state, action, pending] = useActionState(
    submitOrder,
    initialOrderState,
  );
  const bad = (f: string) => state.status === "error" && state.field === f;
  // Errors reset uncontrolled fields; echoed values restore what was typed.
  const was = (f: string) => state.values?.[f];

  return (
    <form action={action} className="checkout-form space-y-4">
      {/* Re-resolved against the catalogue on the server; prices never come from the client. */}
      <input type="hidden" name="lines" value={JSON.stringify(lines)} />
      {/* Honeypot. */}
      <input
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="sr-only"
      />

      <Field
        id="name"
        label="Name"
        autoComplete="name"
        invalid={bad("name")}
        defaultValue={was("name")}
      />
      <Field
        id="email"
        label="Email"
        type="email"
        autoComplete="email"
        invalid={bad("email")}
        defaultValue={was("email")}
      />
      <Field
        id="address1"
        label="Street address"
        autoComplete="address-line1"
        invalid={bad("address1")}
        defaultValue={was("address1")}
      />
      <Field
        id="address2"
        label="Apt, suite, etc. (optional)"
        autoComplete="address-line2"
        required={false}
        defaultValue={was("address2")}
      />
      <div className="grid grid-cols-3 gap-3">
        <Field
          id="zip"
          label="ZIP"
          autoComplete="postal-code"
          invalid={bad("zip")}
          defaultValue={was("zip")}
        />
        <Field
          id="city"
          label="City"
          autoComplete="address-level2"
          invalid={bad("city")}
          defaultValue={was("city")}
        />
        <Field
          id="state"
          label="State"
          autoComplete="address-level1"
          invalid={bad("state")}
          defaultValue={was("state")}
        />
      </div>

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? restock.pendingLabel : restock.submitLabel}
      </Button>

      <p aria-live="polite" className="text-sm text-destructive">
        {state.status === "error" ? state.message : ""}
      </p>
      <p className="text-sm text-muted-foreground">{restock.checkoutNotice}</p>
    </form>
  );
}
