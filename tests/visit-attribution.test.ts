import { test, expect } from "bun:test";
import {
  advanceAttribution,
  parseAttribution,
  touchFor,
  webAnalyticsEvent,
} from "../src/lib/visit-attribution";
const now = Date.now();
test("first referral survives browsing and a later direct visit", () => {
  const first = touchFor(
    "https://brand.com/?utm_source=chatgpt.com&utm_content=citation",
    "",
    now,
  );
  const a = advanceAttribution(null, first, true);
  expect(
    advanceAttribution(
      a,
      touchFor("https://brand.com/pricing", "https://brand.com/", now + 100),
      false,
    ),
  ).toEqual(a);
  const next = advanceAttribution(
    a,
    touchFor("https://brand.com/", "", now + 200),
    true,
  );
  expect(next.first.source).toBe("chatgpt.com");
  expect(next.latest.source).toBe("direct_unknown");
  expect(next.last_non_direct?.source).toBe("chatgpt.com");
});
test("latest external referral updates independently", () => {
  const a = advanceAttribution(
    null,
    touchFor("https://brand.com/", "https://google.com/search?q=private", now),
    true,
  );
  const b = advanceAttribution(
    a,
    touchFor(
      "https://brand.com/start",
      "https://perplexity.ai/search/private",
      now + 100,
    ),
    true,
  );
  expect(b.first.referrer).toBe("https://google.com");
  expect(b.latest.source).toBe("perplexity.ai");
  expect(b.latest.referrer).toBe("https://perplexity.ai");
});
test("does not infer AI from Google or unknown, strips sensitive URL values", () => {
  expect(
    touchFor(
      "https://brand.com/?utm_source=person%40example.com&token=secret",
      "",
      now,
    ).source,
  ).toBe("direct_unknown");
  const e = webAnalyticsEvent({
    url: "https://brand.com/?token=secret&utm_source=chatgpt.com#private",
  });
  expect(e?.url).toBe("https://brand.com/?utm_source=chatgpt.com");
  expect(
    webAnalyticsEvent({
      url: "https://brand.com/start/confirmation?ref=private",
    }),
  ).toBeNull();
});
test("validates untrusted cookies, expiration, future timestamps and ordering", () => {
  expect(parseAttribution("garbage")).toBeNull();
  const a = advanceAttribution(
    null,
    touchFor("https://brand.com/", "", now),
    true,
  );
  expect(parseAttribution(JSON.stringify(a), now)).toEqual(a);
  expect(parseAttribution(JSON.stringify(a), now + 91 * 86400000)).toBeNull();
  a.first.at = new Date(now + 120000).toISOString();
  expect(parseAttribution(JSON.stringify(a), now)).toBeNull();
});
