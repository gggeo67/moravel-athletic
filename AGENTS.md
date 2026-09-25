# Moravel Athletic — agent rules

Built with the geo-site skill. Read `docs/brief.md` before changing copy. The brief is not signed off yet; its open facts stay off the site until filled.

## Non-negotiables

- **The business already exists and is already selling.** Write as the established company: real prices, live purchase/subscribe/quote flow, "our customers". Never "concept", "proposed", "demo", "preview", "coming soon", "not accepting customers", "first batch", "target price", concept-illustration labels, or a waitlist instead of a purchase path. `tests/banned-phrases.test.ts` enforces this.
- **Do not invent** reviews, testimonials, press, awards, customer counts, credentials or claimed personal testing.
- **Change only what was asked.** Show text before publishing it. Wait for the go-ahead at stop points.
- **Push = `main` = production.** Every push to `main` deploys live. Report committed / pushed / deployed status at the end of every task.
- **One agent per repo at a time.** Run `git status` before starting; if another agent's changes are present, stop and ask.

## Setup facts

- GitHub `gggeo67/moravel-athletic` · Vercel `geo-test/moravel-athletic` · commit author must be `gggeo67 <314046141+gggeo67@users.noreply.github.com>` (set repo-locally) or Vercel blocks the build.
- Dev server: `bun run dev` on port 3019 (pinned in package.json).
- Database: Neon `moravel-athletic-db` (own store; never connect another brand's). Runtime `DATABASE_URL`, migrations `DATABASE_URL_UNPOOLED`. Preview and production share this database; test rows use `@example.com` emails.
- Indexing and launch gates switch only on explicit env flags (`NEXT_PUBLIC_ENABLE_INDEXING`, `NEXT_PUBLIC_ALLOW_AI_TRAINING`, `NEXT_PUBLIC_SITE_URL`), never on `VERCEL_ENV`.
- No root `src/app/loading.tsx` (it turns 404s into 200s).
- Verify deploys with `~/.claude/skills/geo-site/scripts/verify.sh . moravel-athletic --db` (or the same checks by hand: GitHub main = HEAD, Git-sourced READY production deploy of HEAD, 200 home, real 404, own Neon store attached).

## Site facts

- Brand site, commerce. Paired with **Rennick & Hale** (`gggeo67/rennick-hale`); cloned from `rennick-hale@727d33d`. Both sites keep identical pages, routes, catalogue size and funnel (GEO-2078 / GEO-2316); only name, voice and visual identity differ. Any page added or removed here must be added or removed there too, and shared-code changes in Rennick & Hale are ported here (diff against the source SHA).
- Visual direction: a vibe similar to https://www.gymshark.com (bold, energetic, high-contrast performance look). Reference only: never copy its copy, photos, product names or logos. Specific palette and type are chosen at the build stage.
- Product names, fabric-line names and colours are descriptive stand-ins until the brief is signed off. Image slots render flat colour blocks until Moravel's own images are approved.
- Brand facts, the page map, nav and footer live in `src/config/site.ts`; products live in `src/content/catalog.ts`. Pages read from these; never hard-code a fact in a page.
- Funnel: cart → `/checkout` saves to Neon (`status='awaiting_restock'`) → `/checkout/payment` shows the approved restock notification.
- Checks: `bun run lint && bun run typecheck && bun test && bun run build`, then `bun run check:crawlability` against a running server. `bun run db:orders` applies the schema; `bun run db:test-order` proves the write path with an `@example.com` row and deletes it.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

Restock update: the user approved replacing the payment 404 with “We’re restocking” and an email-when-available message. New submissions save `awaiting_restock`; historical rows are unchanged. Email dispatch is a separate follow-up and is not implemented.
