import { expect, mock, test } from "bun:test";
mock.module("server-only", () => ({}));
const { withRequestSource, requestSourceOptedOut } = await import("../src/lib/request-source-server");
const { submissionAttribution } = await import("../src/lib/visit-attribution-server");
test("request opt-out suppresses consented attribution and stays request-local", async () => {
  const yes = new FormData(); yes.set("request_source_opt_out", "on");
  const no = new FormData();
  await Promise.all([
    withRequestSource(yes, async () => {
      await new Promise(resolve => setTimeout(resolve, 5));
      expect(requestSourceOptedOut()).toBe(true);
      expect(await submissionAttribution()).toBeNull();
    }),
    withRequestSource(no, async () => {
      expect(requestSourceOptedOut()).toBe(false);
      await new Promise(resolve => setTimeout(resolve, 10));
      expect(requestSourceOptedOut()).toBe(false);
    }),
  ]);
  expect(requestSourceOptedOut()).toBe(false);
});
