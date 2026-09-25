import { existsSync } from "node:fs";
import { describe, expect, test } from "bun:test";
import { addLine, parseLines, resolveLines, subtotal } from "../src/lib/cart";
import { allProducts, getProduct } from "../src/content/catalog";
import { productSchema } from "../src/lib/seo";

describe("approved catalog and purchasing", () => {
  test("all twelve approved products are purchasable with source images", () => {
    expect(allProducts()).toHaveLength(12);
    expect(allProducts().filter((p) => p.audience === "womens")).toHaveLength(
      6,
    );
    expect(allProducts().filter((p) => p.audience === "mens")).toHaveLength(5);
    for (const p of allProducts()) {
      expect(p.images.length).toBeGreaterThan(0);
      for (const c of p.colors)
        for (const image of c.images)
          expect(existsSync(`public${image.src}`)).toBe(true);
    }
  });
  test("different colors remain distinct through persistence and checkout resolution", () => {
    let lines = addLine([], "womens-training-legging", "M", 1, { color: "Black" });
    lines = addLine(lines, "womens-training-legging", "M", 2, { color: "Olive" });
    const resolved = resolveLines(
      parseLines(JSON.parse(JSON.stringify(lines))),
    );
    expect(resolved).toHaveLength(2);
    expect(resolved.map((l) => [l.color, l.quantity, l.unitPrice])).toEqual([
      ["Black", 1, 98],
      ["Olive", 2, 98],
    ]);
    expect(subtotal(resolved)).toBe(294);
  });
  test("the selected gift denomination determines server-side price", () => {
    const lines = addLine([], "gift-card", "100", 1, {
      recipientName: "Gift Test",
      recipientEmail: "gift@example.com",
    });
    const resolved = resolveLines(parseLines(lines));
    expect(resolved).toHaveLength(1);
    expect(resolved[0].unitPrice).toBe(100);
    expect(resolved[0].recipientEmail).toBe("gift@example.com");
  });
  test("untrusted prices do not affect checkout totals", () => {
    const resolved = resolveLines(
      parseLines([
        {
          handle: "mens-jogger",
          size: "M",
          color: "Black",
          quantity: 1,
          unitPrice: 1,
        },
      ]),
    );
    expect(resolved[0].unitPrice).toBe(98);
  });
  test("invalid sizes, colors, denominations and non-finite quantities cannot be purchased", () => {
    for (const item of [
      { handle: "womens-training-legging", size: "INVALID", color: "Black", quantity: 1 },
      { handle: "womens-training-legging", size: "M", color: "Purple", quantity: 1 },
      { handle: "gift-card", size: "1", quantity: 1 },
      { handle: "womens-training-legging", size: "M", color: "Black", quantity: NaN },
      { handle: "womens-training-legging", size: "M", color: "Black", quantity: Infinity },
    ])
      expect(parseLines([item])).toEqual([]);
  });
  test("legacy cart items without color resolve to the primary color", () => {
    expect(
      resolveLines(
        parseLines([{ handle: "womens-training-legging", size: "M", quantity: 1 }]),
      )[0].color,
    ).toBe("Black");
  });
  test("product schema price and gallery match catalog facts without invented ratings", () => {
    const p = getProduct("womens-training-legging")!;
    const schema = productSchema(p);
    expect((schema.offers as { price: number }).price).toBe(p.priceUsd);
    expect(schema.image).toHaveLength(p.images.length);
    expect(JSON.stringify(schema)).not.toMatch(
      /aggregateRating|reviewCount|ratingValue/,
    );
  });
});
