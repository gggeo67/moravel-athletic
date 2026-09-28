# Signal Blue restyle — 2026-09-28

User approval: “B / Signal Blue”, with the recommended single-line MORAVEL wordmark. The headline changes were shown in the A/B proposal before implementation. Prior hero and portrait corrections were approved with “cool cool”.

## Implemented

Pure white pages, Black #111111 contrast sections, Slate #4A4F57 secondary text, near-white #F2F2F0 surfaces and Signal Blue #1F5BFF primary actions/newsletter. Barlow Condensed 800 headings/wordmark and Barlow 400/600 body/controls are self-hosted through next/font. Contrast ratios and font licences are recorded in the brief/research.

Adopted Gymshark's strong type hierarchy, dense product grids, clear shopping controls and high-contrast section rhythm. Adapted those principles to Moravel's existing catalogue, own photography, blue accent and original wordmark. Skipped sales, countdowns, reviews, endorsements, loyalty/app/account and wishlist patterns because the corresponding facts and flows do not exist here.

Updated sticky header, keyboard-contained mobile menu, product rails, cards, filters, gallery, selectors, cart/checkout presentation, editorial sections and footer. Home now orders hero → categories → Women/Men product rail → brand banner → fabrics. Collection fabric editorial follows the grid, with the complete landscape image beside its text. Full portrait framing remains on home/journal/gift guide/story. Brand facts and changed headline copy remain in site configuration.

## Verification

- `bun run lint`, `bun run typecheck`, `bun test`, `bun run build`: passed; 31 tests / 222 assertions, 39 generated static pages.
- Baseline and final app route manifests have identical 25 keys. No route added or removed.
- Catalogue data (12 products), checkout actions, cart persistence, database layer, SEO schema and indexing logic have no diff.
- `bun run check:crawlability`: 176/176 passed on port 3019, non-indexable mode.
- Axe default audit: zero violations at both 390px and 1440px on home, collection, product, cart, checkout, restock, journal, gift guide, story and materials (20 audits). No horizontal overflow.
- Lighthouse mobile production build: home 99 performance / 100 accessibility; product 99 / 100. Reports: `lighthouse-home.json`, `lighthouse-product.json`. HTML reports are local ignored files.
- Interaction checks passed: mobile Tab containment/Escape/focus return, Women/Men product switching, collection filters/reset/sort, required size, Slate variant/cart persistence and reduced motion.
- Image regression: 12 captures at 390/1440/2048px plus 2048px DPR 2; images load, portrait containers remain 2:3, no page errors/overflow. Native hero resolution remains 1672×941, not 4K.
- Screenshot review completed for home, collection, product, cart and checkout at both requested widths; additional journal/gift guide/story/materials captures inspected for editorial framing. Dense grids, uppercase condensed hierarchy and blue/black/white sections are visibly distinct from R&H's cream/serif treatment. The reviewed Gymshark screenshots informed hierarchy and rhythm only.

## Screenshots

Working site: http://localhost:3019. Before/after and reference comparison board: http://localhost:3039/implemented.html. Standalone board lives outside the repo at `/Users/tjmcgovern/websites/references/moravel-restyle/implemented.html`.

Application screenshots: `docs/qa/screens/{home,collection,product,cart,checkout}-{390,1440}.png` (ignored local artifacts). Gymshark screenshots remain outside the repo in `~/websites/references/gymshark/`; R&H was read-only.

## Database and release verification

The real checkout check passed on 2026-09-28 using the connection supplied by the user and stored only in ignored `.env.local`. Database `current_setting('neon.project_id')` returned `broad-wave-30001028`, matching the external resource ID of Vercel's `moravel-athletic-db` store. This verified ownership before any schema changes.

The correct database initially had no commerce tables. Applied the repository's existing `db:orders` and `db:subscribers` schemas; there were zero pre-existing orders. No schema definitions or application purchasing logic changed.

`bun run qa:storefront --order` passed: the browser selected Women's Training Legging / Slate / M, submitted checkout with an `@example.com` address, reached the restock confirmation and read back the correct product, variant, quantity, $98 unit price and `awaiting_restock` status. The exact test order was deleted and zero remaining rows verified. Newsletter capture, persisted consent and duplicate handling also passed; its exact test subscriber was deleted and cleanup verified. All 20 accessibility audits remained at zero violations.

Implementation commit: `94e9a78`, authored as gggeo67. This QA completion accompanies the authorized push to main. Post-push deployment validation uses `~/.claude/skills/geo-site/scripts/verify.sh . moravel-athletic --db`, checking the exact Git commit, READY production deployment, home 200, real 404 and Moravel's attached Neon store. The terminal result is reported to the user after the push; no environment credentials are committed.

Vercel protection was confirmed enabled for all deployments before release. No launch flags or domains changed; the site remains non-indexable.
