import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir, writeFile } from "node:fs/promises";
import { getSql } from "../src/lib/orders-db";

const origin = process.env.QA_ORIGIN ?? "http://127.0.0.1:3019";
const output = "docs/qa/screens";
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const failures: string[] = [];
const report: unknown[] = [];
try {
  for (const width of [390, 1440]) {
    const context = await browser.newContext({
      viewport: { width, height: 1000 },
    });
    const page = await context.newPage();
    await page.goto(origin);
    await page.evaluate(() =>
      localStorage.setItem(
        "moravel-athletic.cart.v1",
        JSON.stringify([
          { handle: "womens-training-legging", size: "M", color: "Black", quantity: 1 },
        ]),
      ),
    );
    for (const [name, path] of [
      ["home", "/"],
      ["collection", "/collections/womens"],
      ["product", "/products/womens-training-legging"],
      ["checkout", "/checkout"],
      ["restock", "/checkout/payment"],
    ]) {
      await page.goto(origin + path);
      await page.waitForLoadState("networkidle");
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      );
      if (overflow) failures.push(`${name} overflows at ${width}px`);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      report.push({
        name,
        width,
        overflow,
        violations: results.violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          description: v.description,
          nodes: v.nodes.map((n) => n.target),
        })),
      });
      if (results.violations.length)
        failures.push(
          `${name} at ${width}px: ${results.violations.map((v) => v.id).join(", ")}`,
        );
      await page.screenshot({
        path: `${output}/${name}-${width}.png`,
        fullPage: true,
      });
    }
    await context.close();
  }
  if (process.argv.includes("--order")) {
    const sql = getSql();
    if (!sql) throw new Error("DATABASE_URL missing");
    const email = `restyle-qa-${Date.now()}@example.com`;
    const context = await browser.newContext();
    const page = await context.newPage();
    try {
      await page.goto(origin + "/products/womens-training-legging");
      await page.getByRole("button", { name: "Olive", exact: true }).click();
      await page.getByRole("button", { name: "M", exact: true }).click();
      await page
        .getByRole("button", { name: "Add to bag", exact: true })
        .click();
      await page.goto(origin + "/checkout");
      for (const [label, value] of [
        ["Name", "Storefront QA"],
        ["Email", email],
        ["Street address", "1 Test Street"],
        ["ZIP", "94000"],
        ["City", "Testville"],
        ["State", "CA"],
      ])
        await page.getByLabel(label, { exact: true }).fill(value);
      await page
        .getByRole("button", { name: "Notify me when available" })
        .click();
      await page.waitForURL("**/checkout/payment");
      await page.getByRole("heading", { name: "We’re restocking" }).waitFor();
      await page
        .getByText("You haven’t been charged.", { exact: true })
        .waitFor();
      const rows =
        (await sql`select product,size,color,quantity,unit_price,status from orders where email=${email}`) as {
          product: string;
          size: string;
          color: string;
          quantity: number;
          unit_price: number;
          status: string;
        }[];
      if (
        rows.length !== 1 ||
        rows[0].product !== "womens-training-legging" ||
        rows[0].color !== "Olive" ||
        rows[0].size !== "M" ||
        rows[0].quantity !== 1 ||
        Number(rows[0].unit_price) !== 98 ||
        rows[0].status !== "awaiting_restock"
      )
        throw new Error(
          "Checkout row did not match selected product, variant and price",
        );
      report.push({
        checkout: "Real browser submit and database read passed",
        row: rows[0],
      });
    } finally {
      await sql`delete from orders where email=${email} and email like '%@example.com'`;
      const remaining =
        (await sql`select count(*)::int as count from orders where email=${email}`) as {
          count: number;
        }[];
      if (remaining[0].count !== 0)
        throw new Error("Test order cleanup failed");
      await context.close();
    }
  }

  if (process.argv.includes("--order")) {
    const sql = getSql();
    if (!sql) throw new Error("DATABASE_URL missing");
    const email = `newsletter-qa-${Date.now()}@example.com`;
    const context = await browser.newContext();
    const page = await context.newPage();
    try {
      for (let attempt = 0; attempt < 2; attempt++) {
        await page.goto(origin);
        await page.getByLabel("Newsletter email", { exact: true }).fill(email);
        await page.getByRole("checkbox").check();
        await page
          .getByRole("button", { name: "Sign up", exact: true })
          .click();
        await page.getByText("You’re on the list.", { exact: true }).waitFor();
      }
      const rows =
        (await sql`select email,consent_text from subscribers where email=${email}`) as {
          email: string;
          consent_text: string;
        }[];
      if (rows.length !== 1 || !rows[0].consent_text)
        throw new Error("Newsletter capture or deduplication failed");
      report.push({
        newsletter:
          "Browser submit, consent persistence and duplicate handling passed",
      });
    } finally {
      await sql`delete from subscribers where email=${email} and email like '%@example.com'`;
      const rows =
        (await sql`select count(*)::int as count from subscribers where email=${email}`) as {
          count: number;
        }[];
      if (rows[0].count !== 0) throw new Error("Newsletter cleanup failed");
      await context.close();
    }
  }
} finally {
  await browser.close();
  await writeFile(
    "docs/qa/browser-results.json",
    JSON.stringify(
      { date: new Date().toISOString(), origin, failures, report },
      null,
      2,
    ) + "\n",
  );
}
if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log("STOREFRONT QA PASS");
