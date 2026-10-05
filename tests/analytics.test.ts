import { describe, expect, test } from "bun:test";
import {
  allowedProperties,
  parseAnalyticsCookie,
  safeCampaign,
  safePath,
  safeReferrer,
} from "../src/lib/experiment-analytics";
describe("analytics data boundaries", () => {
  test("drops customer fields and profile updates even when supplied alongside valid metrics", () => {
    expect(
      allowedProperties({
        site_id: "keffo",
        email: "private@example.com",
        name: "Private",
        address: "123 Road",
        $set: { email: "private@example.com" },
        $initial_current_url: "https://example.test/?token=secret",
      }),
    ).toEqual({ site_id: "keffo" });
  });
  test("removes receipt/query tokens and rejects email-like attribution", () => {
    expect(safePath("/checkout/payment?ref=private#secret")).toBe(
      "/checkout/payment",
    );
    expect(safePath("/unsubscribe/user%40example.com")).toBe("/redacted");
    expect(
      safeReferrer("https://referrer.test/private?email=secret@example.com"),
    ).toBe("https://referrer.test");
    expect(safeReferrer("javascript:alert(1)")).toBe("");
    expect(safeCampaign("secret@example.com")).toBeUndefined();
    expect(safeCampaign("google")).toBe("google");
  });
  test("only accepts two anonymous UUIDs for consented conversion linkage", () => {
    expect(parseAnalyticsCookie()).toBeNull();
    expect(parseAnalyticsCookie("email@example.com")).toBeNull();
    expect(parseAnalyticsCookie("x.y.z")).toBeNull();
    expect(
      parseAnalyticsCookie(
        "01234567-89ab-cdef-0123-456789abcdef.01234567-89ab-cdef-0123-456789abcdef",
      ),
    ).not.toBeNull();
  });
});
