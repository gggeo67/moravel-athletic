// Brand sites present an existing, selling business. This test fails the build
// if copy that frames the product as unreal or unfinished creeps back in.
// Scope: rendered sources (src/, content/). Internal docs/ and tests are exempt.
import { describe, expect, test } from "bun:test";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOTS = ["src", "content"];
const EXTENSIONS = /\.(tsx?|mdx?|json|ya?ml|txt)$/;

const BANNED: RegExp[] = [
  /coming soon/i,
  /\bconcept (image|illustration|mockup|store|product|brand|site|photo)s?\b/i,
  /\bproposed (pricing|prices?|interface|plan)s?\b/i,
  /\bdemo (store|mode|site|shop|checkout)\b/i,
  /\bnot (yet )?accepting (customers|orders|sign-?ups)\b/i,
  /\bwhen (it|this|we) (is|are) real\b/i,
  /\bfirst batch\b/i,
  /\btarget price\b/i,
  /\bjoin (the|our) waitlist\b/i,
  /\blorem ipsum\b/i,
  /\b(placeholder|dummy) (text|copy|image|content)\b/i,
  /\bnot a real (company|brand|store|product)\b/i,
  /\bfictional (brand|company|store)\b/i,
  /\b(this|a) (preview|prototype) (site|store|build)\b/i,
  /\bpurchases? (are )?unavailable\b/i,
  // Readiness pass (GEO shared spec, building block 3).
  /\bnot quoting( yet)?\b/i,
  /\b(isn'?t|is not|not) open yet\b/i,
  /\bwill be (listed|published) here\b/i,
  /\bgoes here once\b/i,
  /\bnot confirmed\b/i,
  /\bdevelopment placeholder\b/i,
  /\bservice preview\b/i,
  /\bproposed\b/i,
  /\bproposal\b/i,
  /\bintended first\b/i,
  /\bfirst offering\b/i,
  /\bsample price\b/i,
  /\bconcept collection\b/i,
  /\bnot yet taking\b/i,
  // Visitor-facing "placeholder" only: not the HTML attribute or Tailwind variant.
  /(?<![-\w])placeholder\b(?!\s*[=:])/i,
  /\bfictional\b/i,
  /\beditorial draft\b/i,
  /\bnotify me when it'?s ready\b/i,
];

// Exact strings that are allowed despite matching a pattern (keep this short).
// The approved "We're restocking" checkout wording matches none of the patterns,
// so nothing needs allowing here.
const ALLOW: string[] = [];

function files(dir: string): string[] {
  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return [];
  }
  return entries.flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return files(path);
    return EXTENSIONS.test(name) && !/\.test\.tsx?$/.test(name) ? [path] : [];
  });
}

describe("site copy presents an existing business", () => {
  const sources = ROOTS.flatMap(files);

  test("there are sources to scan", () => {
    expect(sources.length).toBeGreaterThan(0);
  });

  test("no banned phrasing", () => {
    const hits: string[] = [];
    for (const file of sources) {
      readFileSync(file, "utf8").split("\n").forEach((line, i) => {
        // Code comments never render; only check copy a visitor can see.
        if (/^\s*(\/\/|\/\*|\*)/.test(line)) return;
        for (const pattern of BANNED) {
          const match = line.match(pattern);
          if (match && !ALLOW.some((a) => line.includes(a))) {
            hits.push(`${relative(".", file)}:${i + 1}  "${match[0]}"`);
          }
        }
      });
    }
    expect(hits).toEqual([]);
  });
});
