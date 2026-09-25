"use client";
import { useActionState } from "react";
import { subscribe, type SubscribeState } from "@/app/actions/subscribe";
import { storefront } from "@/config/site";
const initial: SubscribeState = { status: "idle", message: "" };
export function Newsletter() {
  const [state, action, pending] = useActionState(subscribe, initial);
  return (
    <section className="newsletter">
      <h2>{storefront.newsletter.title}</h2>
      <p>{storefront.newsletter.text}</p>
      <form action={action}>
        <div className="newsletter-form">
          <label className="sr-only" htmlFor="newsletter-email">
            Newsletter email
          </label>
          <input
            id="newsletter-email"
            name="newsletter-email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            placeholder="Email address"
          />
          <button className="shop-button" type="submit" disabled={pending}>
            {pending ? "Saving…" : "Sign up"}
          </button>
        </div>
        <input
          name="website"
          className="sr-only"
          aria-hidden="true"
          tabIndex={-1}
          autoComplete="off"
        />
        <label className="newsletter-consent">
          <input type="checkbox" name="consent" required />
          {storefront.newsletter.consent}
        </label>
        <p role="status">{state.message}</p>
      </form>
    </section>
  );
}
