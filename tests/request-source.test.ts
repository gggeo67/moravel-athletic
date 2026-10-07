import { describe, expect, test } from "bun:test";
import {
  arrivalSource,
  parseRequestSource,
  sourceEligible,
} from "../src/lib/request-source";
describe("current-request source", () => {
  test("ChatGPT tag is distinguished from referrer evidence", () => {
    expect(
      arrivalSource(
        "https://getkeffo.com/pricing?utm_source=chatgpt.com&email=secret",
        "https://google.com/q/private",
      )?.source,
    ).toBe("chatgpt.com");
    expect(
      arrivalSource("https://getkeffo.com/", "https://chatgpt.com/c/private")
        ?.evidence,
    ).toBe("referrer");
    expect(
      JSON.stringify(
        arrivalSource(
          "https://getkeffo.com/pricing?email=secret",
          "https://chatgpt.com/c/private",
        ),
      ),
    ).not.toContain("private");
  });
  test("unknown is honest; lookalike hosts are not ChatGPT", () => {
    expect(arrivalSource("https://getkeffo.com/", "")?.source).toBe("unknown");
    expect(
      arrivalSource("https://getkeffo.com/", "https://chatgpt.com.evil.com")
        ?.source,
    ).toBe("chatgpt.com.evil.com");
    expect(
      arrivalSource("https://getkeffo.com/", "https://sub.chatgpt.com")?.source,
    ).toBe("chatgpt.com");
  });
  test("malformed, oversized, expired, and private data rejected", () => {
    expect(parseRequestSource("{")).toBeNull();
    expect(parseRequestSource("x".repeat(1025))).toBeNull();
    expect(arrivalSource("https://getkeffo.com/confirmation", "")).toBeNull();
    const a = arrivalSource("https://getkeffo.com/", "", 0);
    expect(parseRequestSource(JSON.stringify(a), 86400001)).toBeNull();
  });
  test("eligibility fails closed and honors privacy signals", () => {
    expect(sourceEligible("US", null, null, true)).toBe(true);
    for (const country of [null, "GB", "DE", "us"])
      expect(sourceEligible(country, null, null, true)).toBe(false);
    expect(sourceEligible("US", "1", null, true)).toBe(false);
    expect(sourceEligible("US", null, "1", true)).toBe(false);
    expect(sourceEligible("US", null, null, false)).toBe(false);
  });
});
