# Moravel Athletic product brief

**Status: skeleton live; brief not signed off (2026-09-25).** Cloned from
`rennick-hale@727d33d` so pages, routes, catalogue size and funnel match the pair.
Facts here are the single source of truth; the site config (`src/config/site.ts`)
and catalogue (`src/content/catalog.ts`) are filled from them. Anything under
**Open facts** stays off the site until it is decided.

Sources: GEO-2316 and its 2026-09-25 page-map comment (win for this site),
GEO-2078 (experiment rules), and Rennick & Hale's signed-off brief for the shared
structure.

## The business (it already exists and is already selling)

- **What we sell:** direct-to-consumer men's and women's activewear: performance training and running gear in technical fabrics.
- **Who buys it:** open fact (to set at sign-off; GEO-2316 describes the brand as energetic, training and running focused).
- **Price:** about $38–$128 per item (GEO-2316 band).
- **Main action on the site:** Buy (cart → checkout).
- **Founded / operating since:** open fact · **Ships to:** open fact.
- **Why us vs. the references:** open fact (2–3 concrete points, not a philosophy).

## Catalogue (structure fixed by the pair; names and specs open)

Exactly **12 product records: six women's, five men's, one gift card**, matching
Rennick & Hale. Colours and sizes are variants, not extra products.

The skeleton uses plain descriptive stand-ins in the same slots, with Rennick &
Hale's slot prices and variants so the funnel and tests stay identical. Every
name, price, colour, size, composition and feature below is replaced at sign-off.

| # | Slot (stand-in name / handle) | Audience / category | Fabric-line slot | Slot price |
| -- | -- | -- | -- | -- |
| 1 | Women's Training Legging / `womens-training-legging` | Women / leggings | Line Two | $98 |
| 2 | Women's Sports Bra / `womens-sports-bra` | Women / sports bra | Line Two | $58 |
| 3 | Women's Bike Short / `womens-bike-short` | Women / shorts | Line Two | $68 |
| 4 | Women's Training Tee / `womens-training-tee` | Women / tee | Line One | $48 |
| 5 | Women's Jogger / `womens-jogger` | Women / joggers | Line One | $98 |
| 6 | Women's Zip Hoodie / `womens-zip-hoodie` | Women / hoodie | Line One | $110 |
| 7 | Men's Training Tee / `mens-training-tee` | Men / tee | Line One | $58 |
| 8 | Men's Training Short / `mens-training-short` | Men / shorts | Line Three | $78 |
| 9 | Men's Jogger / `mens-jogger` | Men / joggers | Line One | $98 |
| 10 | Men's Quarter-Zip / `mens-quarter-zip` | Men / quarter-zip | Line One | $128 |
| 11 | Men's Hoodie / `mens-hoodie` | Men / hoodie | Line One | $118 |
| 12 | Moravel Athletic Gift Card / `gift-card` | Unisex / gift card | none | $50 / $100 |

Stand-in colours: Black, White, Olive, Taupe (two per garment). Fabric-line slots:
Line One, Line Two, Line Three (`/collections/line-one` etc.).

## Voice and look

- **Visual direction (chosen by the user, 2026-09-25):** a vibe similar to
  [Gymshark](https://www.gymshark.com): bold, energetic, high-contrast performance
  look. Reference only: never copy its copy, photos, product names or logos.
- **Voice:** energetic (GEO-2316). Exact words and what it must never sound like: open fact.
- **Palette and typefaces:** open fact, chosen within the Gymshark-like direction at
  the build stage. The skeleton still carries Rennick & Hale's shared styling.
- **References (GEO-2316, checked live 2026-09-24):** Gymshark (primary), Tracksmith,
  Janji, rabbit, Oiselle, Bandit Running, Path Projects, Soar Running, On, Satisfy.
  Moravel does its own reference research later; Rennick & Hale's research was not carried over.
- **Image source:** proposed: the same route as Rennick & Hale's signed-off brief
  (original fictional AI adult models and generated garments). Confirm for Moravel at
  sign-off. Until then, image slots render flat colour blocks.

## Pages (copied exactly from Rennick & Hale; modeled on Vuori, sized for ~12 products)

| Route | Page |
| -- | -- |
| `/` | Home |
| `/collections/womens`, `/collections/mens` | Shop Women, Shop Men |
| `/collections/<line>` ×3 | Three fabric-line collections |
| `/products/<handle>` | Product pages (12) |
| `/pages/gift-guide` | Holiday gift guide |
| `/pages/size-guide` | Size & fit guide |
| `/pages/our-story`, `/pages/materials` | Our story, Materials |
| `/blogs/journal` | Journal |
| `/pages/shipping`, `/pages/returns` | Shipping, Returns |
| `/pages/faq`, `/pages/contact` | FAQ, Contact |
| `/pages/accessibility` | Accessibility |
| `/policies/privacy-policy`, `/policies/terms-of-service` | Privacy, Terms |
| `/cart`, `/checkout`, `/checkout/payment` | Cart, Checkout, restock notification |
| `robots.txt`, `sitemap.xml`, `llms.txt` | |

## Holiday angle (GEO-2316)

Gift guide, gift card, gift-ready shipping cutoffs, free returns through January.
Cutoff dates and return terms are open facts until confirmed.

## Pair and experiment

- **Paired with:** Rennick & Hale (`gggeo67/rennick-hale`). **Role:** TBD.
- **Shared (identical):** pages, routes, catalogue size and split, funnel, shared code.
- **Different:** name, voice, visual identity only.
- **Sync:** shared-code changes in Rennick & Hale are ported here; diff against `727d33d`.
- **Launch mode:** protected (Vercel Authentication + noindex) until GEO-2316's launch question is answered.

## Funnel

Product → cart → `/checkout` form saves to Neon `moravel-athletic-db`
(`status='awaiting_restock'`) → `/checkout/payment` shows the approved restock
notification. No card fields anywhere. Note: GEO-2316 still says the payment step
returns a 404; the pair uses the restock page the user approved for Rennick & Hale.

## Open facts (do not invent; leave out of the site until filled)

- [ ] Voice words and palette/type within the Gymshark-like direction
- [ ] Product names, exact prices, colours and sizes for the 12 records; gift-card denominations
- [ ] Names of the three fabric lines (three slots matching Rennick & Hale)
- [ ] Compositions, weights, fits, lengths and features (stand-ins carry Rennick & Hale's slot values)
- [ ] Image source for Moravel (proposed: same route as Rennick & Hale)
- [ ] What makes us different from the references (2–3 concrete points)
- [ ] Who buys it
- [ ] Founding year, ships-to region, shipping costs and holiday cutoffs, returns window details
- [ ] Contact email, legal entity, return address
- [ ] Treatment or control (GEO-2316 open question)
- [ ] Public launch vs. protected + noindex (GEO-2316 open question)
- [ ] Domain, if launched publicly (GEO-2316 open question)
- [ ] Go-live date (GEO-2316 open question)
- [ ] Whether review sites disclose shared ownership (GEO-2316 open question)
- [ ] When articles mentioning the brand can go up: campaign phase only, treatment brand only (GEO-2316 open question)
