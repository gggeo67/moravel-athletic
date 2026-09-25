import { beforeEach, expect, mock, test } from "bun:test";

let databaseFails = false;
const save = mock(async () => {
  if (databaseFails) throw new Error("Test database failure");
});
mock.module("@/lib/orders-db", () => ({
  getSql: () => ({}),
  insertOrder: save,
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

function submission() {
  const form = new FormData();
  for (const [key, value] of Object.entries({
    name: "Restock Test",
    email: "restock-test@example.com",
    address1: "1 Test Street",
    city: "Testville",
    state: "CA",
    zip: "94000",
    lines: JSON.stringify([
      { handle: "womens-training-legging", color: "Olive", size: "M", quantity: 1 },
    ]),
  }))
    form.set(key, value);
  return form;
}

beforeEach(() => {
  databaseFails = false;
  save.mockClear();
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
