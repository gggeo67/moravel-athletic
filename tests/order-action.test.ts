import { beforeEach, expect, mock, test } from "bun:test";

let databaseFails = false;
const save = mock(async () => {
  if (databaseFails) throw new Error("Test database failure");
});
mock.module("@/lib/orders-db", () => ({
  getSql: () => ({}),
  insertOrder: save,
}));
const subscribe = mock(async () => ({ id: "sub-1", token: "t".repeat(32) }));
// Bun's module mocks are process-wide: keep the real exports for other test files.
const realList = { ...(await import("@/lib/list-db")) };
mock.module("@/lib/list-db", () => ({ ...realList, upsertSubscriber: subscribe }));
mock.module("@/lib/email", () => ({
  sendEmail: async () => ({ sent: false, reason: "not-configured" }),
}));
mock.module("@/lib/turnstile", () => ({
  verifyTurnstile: async () => ({ ok: true }),
}));
mock.module("next/navigation", () => ({
  redirect: (path: string) => {
    throw new Error(`REDIRECT:${path}`);
  },
}));
const { submitOrder } = await import("@/app/actions/order");
const { initialOrderState } = await import("@/lib/order");

function submission(extra: Record<string, string> = {}) {
  const form = new FormData();
  for (const [key, value] of Object.entries(extra)) form.set(key, value);
  for (const [key, value] of Object.entries({
    name: "Restock Test",
    email: "restock-test@example.com",
    address1: "1 Test Street",
    city: "Testville",
    state: "CA",
    zip: "94000",
    lines: JSON.stringify([
      { handle: "womens-training-legging", color: "Slate", size: "M", quantity: 1 },
    ]),
  }))
    form.set(key, value);
  return form;
}

beforeEach(() => {
  databaseFails = false;
  save.mockClear();
  subscribe.mockClear();
});

test("checkout saves selected variants before redirecting to restock confirmation", async () => {
  await expect(submitOrder(initialOrderState, submission())).rejects.toThrow(
    "REDIRECT:/checkout/payment",
  );
  expect(save).toHaveBeenCalledTimes(1);
});

test("database failure returns an error without a success redirect", async () => {
  databaseFails = true;
  const result = await submitOrder(initialOrderState, submission());
  expect(result.status).toBe("error");
  expect(result.message).toContain("saving your request");
  expect(result.values?.email).toBe("restock-test@example.com");
});

test("the order saves without the restock opt-in and writes no list row", async () => {
  await expect(submitOrder(initialOrderState, submission())).rejects.toThrow(
    /REDIRECT:\/checkout\/payment\?ref=[0-9a-f-]{36}$/,
  );
  expect(save).toHaveBeenCalledTimes(1);
  expect(subscribe).not.toHaveBeenCalled();
});

test("a ticked restock box stores consent linked to the order", async () => {
  let redirected = "";
  try {
    await submitOrder(initialOrderState, submission({ restock_optin: "on" }));
  } catch (e) {
    redirected = (e as Error).message;
  }
  expect(subscribe).toHaveBeenCalledTimes(1);
  const input = (subscribe.mock.calls[0] as unknown as [unknown, Record<string, string>])[1];
  expect(input.source).toBe("restock");
  expect(input.email).toBe("restock-test@example.com");
  expect(input.consentText).toBe("Email me when my items are back in stock");
  expect(input.product).toBeTruthy();
  expect(redirected).toBe(`REDIRECT:/checkout/payment?ref=${input.orderRef}`);
});
