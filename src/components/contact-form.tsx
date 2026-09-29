"use client";

import { startTransition, useActionState, type FormEvent } from "react";
import { sendContactMessage } from "@/app/actions/contact";
import { contactForm } from "@/config/site";
import {
  initialContactState,
  MESSAGE_MAX,
  MESSAGE_MIN,
  type ContactValues,
} from "@/lib/contact";
import { Button } from "@/components/ui/button";

const inputClass =
  "mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-base outline-none focus-visible:ring-3 focus-visible:ring-ring/50 aria-[invalid=true]:border-destructive";

function FieldError({ id, message }: { id: string; message?: string }) {
  return message ? (
    <p id={`${id}-error`} className="mt-1 text-sm text-destructive">
      {message}
    </p>
  ) : null;
}

export function ContactForm() {
  const [state, action, pending] = useActionState(
    sendContactMessage,
    initialContactState,
  );
  // Submit manually so React's post-action form reset never clears what the
  // visitor typed (it also resets selects, which defaultValue can't restore).
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    startTransition(() => action(data));
  }

  if (state.status === "success")
    return (
      <p role="status" className="contact-success">
        {state.message}
      </p>
    );

  const err: Partial<Record<keyof ContactValues, string>> =
    state.status === "error" ? state.errors : {};
  const was = state.status === "error" ? state.values : undefined;

  return (
    <form
      action={action}
      onSubmit={onSubmit}
      className="contact-form space-y-4"
      noValidate
    >
      {/* Honeypot: visually hidden with the sr-only clip pattern, never a wide input. */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="website">Leave this empty</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div>
        <label htmlFor="contact-name" className="text-sm font-medium">
          Name
        </label>
        <input
          id="contact-name"
          name="name"
          autoComplete="name"
          required
          maxLength={120}
          defaultValue={was?.name}
          aria-invalid={Boolean(err.name)}
          aria-describedby={err.name ? "name-error" : undefined}
          className={inputClass}
        />
        <FieldError id="name" message={err.name} />
      </div>
      <div>
        <label htmlFor="contact-email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={254}
          defaultValue={was?.email}
          aria-invalid={Boolean(err.email)}
          aria-describedby={err.email ? "email-error" : undefined}
          className={inputClass}
        />
        <FieldError id="email" message={err.email} />
      </div>
      <div>
        <label htmlFor="contact-topic" className="text-sm font-medium">
          Topic
        </label>
        <select
          id="contact-topic"
          name="topic"
          required
          defaultValue={was?.topic ?? ""}
          aria-invalid={Boolean(err.topic)}
          aria-describedby={err.topic ? "topic-error" : undefined}
          className={inputClass}
        >
          <option value="" disabled>
            Choose a topic
          </option>
          {contactForm.topics.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <FieldError id="topic" message={err.topic} />
      </div>
      <div>
        <label htmlFor="contact-message" className="text-sm font-medium">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={6}
          minLength={MESSAGE_MIN}
          maxLength={MESSAGE_MAX}
          defaultValue={was?.message}
          aria-invalid={Boolean(err.message)}
          aria-describedby={err.message ? "message-error" : "message-hint"}
          className={inputClass}
        />
        <p id="message-hint" className="mt-1 text-sm text-muted-foreground">
          {MESSAGE_MIN} to {MESSAGE_MAX} characters.
        </p>
        <FieldError id="message" message={err.message} />
      </div>
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Sending…" : "Send message"}
      </Button>
      <p aria-live="polite" className="text-sm text-destructive">
        {state.status === "error" ? state.message : ""}
      </p>
    </form>
  );
}
