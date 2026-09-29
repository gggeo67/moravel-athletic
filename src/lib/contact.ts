/**
 * Contact form state and validation. Kept out of the "use server" module,
 * which may only export async functions.
 */
import { contactForm } from "@/config/site";

export type ContactValues = {
  name: string;
  email: string;
  topic: string;
  message: string;
};

export type ContactState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | {
      status: "error";
      message: string;
      errors: Partial<Record<keyof ContactValues, string>>;
      values: ContactValues;
    };

export const initialContactState: ContactState = { status: "idle" };

export const MESSAGE_MIN = 10;
export const MESSAGE_MAX = 2000;

export function isValidEmail(value: string): boolean {
  if (value.length < 6 || value.length > 254) return false;
  return /^[^\s@,;]+@[^\s@,;.]+(\.[^\s@,;.]+)+$/.test(value);
}

export function validateContact(
  values: ContactValues,
): Partial<Record<keyof ContactValues, string>> {
  const errors: Partial<Record<keyof ContactValues, string>> = {};
  if (!values.name) errors.name = "Enter your name.";
  if (!values.email) errors.email = "Enter your email address.";
  else if (!isValidEmail(values.email))
    errors.email = "That doesn't look like an email address.";
  if (!(contactForm.topics as readonly string[]).includes(values.topic))
    errors.topic = "Choose a topic.";
  if (values.message.length < MESSAGE_MIN)
    errors.message = `Write at least ${MESSAGE_MIN} characters.`;
  else if (values.message.length > MESSAGE_MAX)
    errors.message = `Keep it under ${MESSAGE_MAX} characters.`;
  return errors;
}
