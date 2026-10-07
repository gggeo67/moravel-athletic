import { headers } from "next/headers";
import { parseRequestSource, sourceEligible } from "./request-source";
export async function requestSourceEligible() {
  try {
    const h = await headers();
    return sourceEligible(
      h.get("x-vercel-ip-country"),
      h.get("sec-gpc"),
      h.get("dnt"),
      process.env.REQUEST_SOURCE_ENABLED === "true" &&
        process.env.VERCEL === "1",
    );
  } catch {
    return false;
  }
}
export async function submissionRequestSource(
  raw: unknown,
): Promise<string | null> {
  try {
    if (!(await requestSourceEligible())) return null;
    const source = parseRequestSource(raw);
    return source ? JSON.stringify(source) : null;
  } catch {
    return null;
  }
}

// Request-local context isolates simultaneous submissions; no global visitor state.
import { AsyncLocalStorage } from "node:async_hooks";
const sourceContext = new AsyncLocalStorage<string | null>();
export async function withRequestSource<T>(
  form: FormData,
  work: () => Promise<T>,
): Promise<T> {
  const source =
    form.get("request_source_opt_out") === "on"
      ? null
      : await submissionRequestSource(form.get("request_source"));
  return sourceContext.run(source, work);
}
export function currentRequestSource(): string | null {
  return sourceContext.getStore() ?? null;
}
