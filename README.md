# Moravel Athletic

Performance training and running gear, technical fabrics. Next.js on Bun, deployed on Vercel (`geo-test/moravel-athletic`), orders in Neon (`moravel-athletic-db`). Paired with Rennick & Hale; cloned from `rennick-hale@727d33d`.

```sh
bun install
bun run dev            # http://127.0.0.1:3019
bun run lint && bun run typecheck && bun test && bun run build
bun run check:crawlability   # against a running server
bun run db:orders            # apply the orders schema
bun run db:subscribers       # subscriber table and gift recipient order fields
bun run db:test-order        # prove the checkout write path, then clean up
bun run qa:storefront --order # running server, browser/database assertions and cleanup
```

Read `AGENTS.md` before changing anything, and `docs/brief.md` before writing copy.

## Storefront

The pages, routes, 12-product catalogue structure and checkout match Rennick & Hale. Product names, fabric-line names, colours, voice and imagery are open facts in the [brief](docs/brief.md); image slots render flat colour blocks until Moravel's own images are approved.

Checkout saves new requests as `awaiting_restock`, then shows the restock notification at `/checkout/payment` (HTTP 200, noindex). Newsletter signup saves consent; it does not send an email. Email dispatch is a separate follow-up and is not implemented.
