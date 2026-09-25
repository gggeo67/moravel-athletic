/**
 * Indexing environment resolution.
 *
 * Indexing is OFF by default. It is permitted when the deployment is explicitly
 * opted in AND the configured origin is a real production HTTPS origin.
 *
 * robots.txt is not access control. A crawler blocked in robots.txt cannot read
 * a page's noindex directive, because it never fetches the page. The two
 * mechanisms are emitted together deliberately: see AGENTS.md.
 */

import { site } from "./site";

export type IndexingEnvironment = {
  /** Whether public pages may be indexed. */
  indexable: boolean;
  /** Whether AI training crawlers (e.g. GPTBot) are permitted. Independent of indexing. */
  allowAiTraining: boolean;
  /** Reasons indexing is disabled. Empty when indexable. */
  blockers: string[];
  origin: string;
};

const FORBIDDEN_ORIGIN_HOSTS = [
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "example.com",
  "example.org",
  "example.net",
];

function isTruthy(value: string | undefined): boolean {
  return value === "true" || value === "1";
}

/** Validates an origin is usable as a production canonical base. */
export function validateOrigin(origin: string): string[] {
  const blockers: string[] = [];
  let url: URL;
  try {
    url = new URL(origin);
  } catch {
    return [`Origin "${origin}" is not a valid URL.`];
  }
  if (url.protocol !== "https:") {
    blockers.push(`Origin must use HTTPS, got "${url.protocol}".`);
  }
  if (FORBIDDEN_ORIGIN_HOSTS.some((h) => url.hostname === h || url.hostname.endsWith(`.${h}`))) {
    blockers.push(`Origin host "${url.hostname}" is a development or example host.`);
  }
  if (origin.endsWith("/")) {
    blockers.push("Origin must not have a trailing slash.");
  }
  return blockers;
}

export function environment(): IndexingEnvironment {
  const origin = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? site.origin;
  const optedIn = isTruthy(process.env.NEXT_PUBLIC_ENABLE_INDEXING);
  const allowAiTraining = isTruthy(process.env.NEXT_PUBLIC_ALLOW_AI_TRAINING);

  const blockers: string[] = [];
  if (!optedIn) blockers.push("NEXT_PUBLIC_ENABLE_INDEXING is not set to true.");
  blockers.push(...validateOrigin(origin));

  return {
    indexable: blockers.length === 0,
    allowAiTraining,
    blockers,
    origin,
  };
}
