# Email list and contact messages

Everything is stored in this brand's own Neon database. Sending is **dormant**: nothing is emailed until a domain is verified and two env vars are set.

## Tables

Schema: `scripts/list-schema.sql`. Apply with `bun run db:list` (uses `DATABASE_URL_UNPOOLED` from `.env.local`; additive only). The same command copies any legacy `subscribers` rows into `email_subscribers` with `consent_version = 'legacy-newsletter'` and fresh unsubscribe tokens. The legacy `subscribers` table is kept, not dropped.

- `email_subscribers`: one row per brand + email + source + product (`unique nulls not distinct`).
  - `source = 'newsletter'`: the footer sign-up. `product` is null.
  - `source = 'restock'`: the unticked "Email me when my items are back in stock" box at checkout, or the same box on the restock page afterwards. `product` is the order's product slugs (comma-separated, sorted) and `order_ref` is the order's `order_ref` in `orders`.
  - `consent_text` is the exact checkbox label; `consent_version` is `list-v1`.
  - Re-subscribing an unsubscribed row sets it back to `subscribed` with fresh consent.
  - `is_test` is true for `@example.com` addresses.
- `contact_messages`: the `/pages/contact` form (`/contact` redirects there). Five messages per email per day; a filled honeypot is dropped silently.

Nothing is written to `email_subscribers` unless the customer ticks a checkbox.

## Unsubscribe

`/unsubscribe?token=<unsubscribe_token>` sets every row for that email at this brand to `unsubscribed` and shows "You're unsubscribed from <Brand> emails." Unknown tokens get a neutral message. The page is noindex.

## Export

```
bun run list:export                 # real rows only
bun run list:export --include-test  # include @example.com rows
```

Writes `exports/<brand>-subscribers.csv` and `exports/<brand>-contact-messages.csv`. `exports/` is gitignored.

## Switching sending on

`src/lib/email.ts` exposes `sendEmail({ to, subject, text, replyTo?, unsubscribeToken? })`. It returns `{ sent: false, reason: "not-configured" }` and never throws until both env vars exist. It is called after a restock opt-in is saved.

1. Verify the sending domain in Resend.
2. On the Vercel project, set `RESEND_API_KEY` and `EMAIL_FROM_DOMAIN` (the verified domain) for Production and Preview, then redeploy.

Mail then goes from `hello@<EMAIL_FROM_DOMAIN>` with a `List-Unsubscribe` header and an unsubscribe link, and the list row's `email_notified` is set to true.
