/**
 * Server-side Turnstile verification. Server actions only.
 *
 * An unset TURNSTILE_SECRET_KEY skips the check with a warning, so an
 * unconfigured environment degrades to honeypot-only rather than bricking the
 * form. With the secret set, failures fail CLOSED: bots are the threat model,
 * and a siteverify outage should not quietly open the gate.
 */
export async function verifyTurnstile(
  token: FormDataEntryValue | null,
): Promise<{ ok: boolean; reason?: string }> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return { ok: true };

  const value = typeof token === "string" ? token.trim() : "";
  if (!value) return { ok: false, reason: "missing-token" };

  try {
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ secret, response: value }),
      },
    );
    const data = (await res.json()) as {
      success: boolean;
      "error-codes"?: string[];
    };
    if (data.success) return { ok: true };
    return { ok: false, reason: (data["error-codes"] ?? []).join(",") };
  } catch (error) {
    console.error("[turnstile] siteverify unreachable:", error);
    return { ok: false, reason: "siteverify-unreachable" };
  }
}
