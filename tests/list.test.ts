import { describe, expect, test } from "bun:test";
import { CONSENT_VERSION, isTestEmail, isToken, newToken } from "../src/lib/list-db";
import { validateContact } from "../src/lib/contact";
import { isOrderRef, restockProduct } from "../src/lib/order";
import { contactForm, faqs, helpContent, listConsent, pages } from "../src/config/site";

describe("email list", () => {
  test("consent version and wording are fixed", () => {
    expect(CONSENT_VERSION).toBe("list-v1");
    expect(listConsent.restock).toBe("Email me when my items are back in stock");
  });

  test("unsubscribe tokens are unique and pass validation", () => {
    const a = newToken();
    expect(isToken(a)).toBe(true);
    expect(a).not.toBe(newToken());
    expect(isToken("'; drop table orders; --")).toBe(false);
    expect(isToken(undefined)).toBe(false);
  });

  test("example.com addresses are test rows", () => {
    expect(isTestEmail("qa+audit@example.com")).toBe(true);
    expect(isTestEmail("someone@gmail.com")).toBe(false);
  });

  test("restock product lists distinct slugs in order", () => {
    expect(restockProduct(["b", "a", "b"])).toBe("a,b");
  });

  test("order refs must be UUIDs", () => {
    expect(isOrderRef("0b4f4c1e-0c3b-4c63-9a55-6f3a0b9d2d11")).toBe(true);
    expect(isOrderRef("1 or 1=1")).toBe(false);
  });
});

describe("contact form validation", () => {
  const ok = {
    name: "QA",
    email: "qa@example.com",
    topic: contactForm.topics[0],
    message: "Where is my order?",
  };
  test("accepts a complete message", () => {
    expect(validateContact(ok)).toEqual({});
  });
  test("rejects short, long and unknown-topic messages", () => {
    expect(validateContact({ ...ok, message: "hi" }).message).toBeTruthy();
    expect(validateContact({ ...ok, message: "x".repeat(2001) }).message).toBeTruthy();
    expect(validateContact({ ...ok, topic: "Spam" }).topic).toBeTruthy();
    expect(validateContact({ ...ok, email: "nope" }).email).toBeTruthy();
  });
});

describe("service pages", () => {
  test("every service and policy page has real sections", () => {
    for (const p of [pages.shipping, pages.returns, pages.contact, pages.accessibility, pages.privacy, pages.terms]) {
      expect((helpContent[p.href] ?? []).length).toBeGreaterThan(0);
    }
  });
  test("the FAQ has about ten questions", () => {
    expect(faqs.length).toBeGreaterThanOrEqual(10);
  });
  test("the holiday terms are stated", () => {
    const blob = JSON.stringify(helpContent);
    expect(blob).toContain("January 31, 2027");
    expect(blob).toContain("December 16, 2026");
    expect(blob).toContain("December 21, 2026");
    expect(blob).toContain("$75");
  });
  test("no email address is published", () => {
    const blob = JSON.stringify({ helpContent, faqs });
    expect(blob).not.toMatch(/[\w.+-]+@[\w-]+\.[a-z]{2,}/i);
  });
});
