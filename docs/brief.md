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
Hale's slot prices and variants so the funnel and tests stay identical. Remaining
name, price, size and composition facts are still open; colours and the image-aligned fit updates were approved separately on 2026-09-28.

| # | Slot (stand-in name / handle) | Audience / category | Fabric-line slot | Slot price |
| -- | -- | -- | -- | -- |
| 1 | Women's Training Legging / `womens-training-legging` | Women / leggings | Surge Knit | $98 |
| 2 | Women's Sports Bra / `womens-sports-bra` | Women / sports bra | Surge Knit | $58 |
| 3 | Women's Bike Short / `womens-bike-short` | Women / shorts | Surge Knit | $68 |
| 4 | Women's Training Tee / `womens-training-tee` | Women / tee | Tempo Jersey | $48 |
| 5 | Women's Jogger / `womens-jogger` | Women / joggers | Tempo Jersey | $98 |
| 6 | Women's Zip Hoodie / `womens-zip-hoodie` | Women / hoodie | Tempo Jersey | $110 |
| 7 | Men's Training Tee / `mens-training-tee` | Men / tee | Tempo Jersey | $58 |
| 8 | Men's Training Short / `mens-training-short` | Men / shorts | Stride Woven | $78 |
| 9 | Men's Jogger / `mens-jogger` | Men / joggers | Tempo Jersey | $98 |
| 10 | Men's Quarter-Zip / `mens-quarter-zip` | Men / quarter-zip | Tempo Jersey | $128 |
| 11 | Men's Hoodie / `mens-hoodie` | Men / hoodie | Tempo Jersey | $118 |
| 12 | Moravel Athletic Gift Card / `gift-card` | Unisex / gift card | none | $50 / $100 |

Approved colours (2026-09-28): Black #111111, White #F2F2F0, Slate #4A4F57, Signal Blue #1F5BFF (two per garment). Fabric lines (named 2026-09-29):
Tempo Jersey, Surge Knit, Stride Woven (`/collections/tempo-jersey` etc.).

## Voice and look

- **Visual direction (chosen by the user, 2026-09-25):** a vibe similar to
  [Gymshark](https://www.gymshark.com): bold, energetic, high-contrast performance
  look. Reference only: never copy its copy, photos, product names or logos.
- **Voice:** energetic (GEO-2316). Exact words and what it must never sound like: open fact.
- **Image palette (approved 2026-09-28):** Black, White, Slate and Signal Blue. Small tonal MORAVEL garment marks use a condensed sans treatment. Site typography is unchanged in this image-only release.
- **References (GEO-2316, checked live 2026-09-24):** Gymshark (primary), Tracksmith,
  Janji, rabbit, Oiselle, Bandit Running, Path Projects, Soar Running, On, Satisfy.
  Moravel does its own reference research later; Rennick & Hale's research was not carried over.
- **Image source (approved 2026-09-28):** original AI-generated Moravel garments and fictional adult models. The same adult identity per paired product slot; R&H model photographs used only for identity, never garments or backgrounds. New gym, track and city scenes. 72 generated sources plus 26 crops; lineage, prompts and QA in `images/manifest.json`.
- **Fit-description alignment (approved 2026-09-28):** user approved updating fit, length and visible features to match the supplied silhouette references and generated garments. Bike short: 8-inch inseam; women’s tee: regular hip length; zip hoodie: slim hip length; men’s tee and short: slim; men’s hoodie: oversized. No changes to prices, sizes, fabric compositions or checkout.

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

- [ ] Voice words and site type within the Gymshark-like direction (image palette approved)
- [ ] Product names, exact prices, colours and sizes for the 12 records; gift-card denominations
- [ ] Names of the three fabric lines (three slots matching Rennick & Hale)
- [ ] Compositions, weights, fits, lengths and features (stand-ins carry Rennick & Hale's slot values)
- [x] Image source and palette approved 2026-09-28; full brief remains unsigned
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

## Design direction — approved B / Signal Blue (2026-09-28)

**Status:** The user selected **B / Signal Blue** after the A/B home and product previews. Implemented with the recommended single-line MORAVEL wordmark and the headline changes shown below. This section does not sign off the remaining business facts. Research: [design references](research/design-references.md). Review package: `/Users/tjmcgovern/websites/references/moravel-restyle/`, served locally on port 3039 when available.

### Palette and contrast

The image palette stays unchanged. Use pure white for the main page to replace R&H's cream; retain the approved near-white only for secondary surfaces. Slate is readable secondary text, not a faint placeholder grey. Ratios use WCAG relative luminance, rounded to two decimals.

| Role | Hex | Pair and ratio | Use |
| --- | --- | --- | --- |
| Page | `#FFFFFF` | Black text 18.88:1 | Main shopping/content surface |
| Surface | `#F2F2F0` | Black text 16.85:1 | Image fallback, summaries, quiet secondary panels |
| Text / dark section | `#111111` | White text 18.88:1 | Primary text; announcement/footer |
| Muted text | `#4A4F57` | On white 8.24:1; surface 7.36:1 | Descriptions and secondary labels |
| Accent | `#1F5BFF` | White text 5.25:1; on surface 4.69:1 | Option B primary actions; selected states |
| Accent hover | `#1749D1` | White text 7.22:1 | Hover/active blue control |
| Control border | `#767C85` | White 4.21:1; surface 3.75:1 | Input/control boundaries, not body text |
| Error | `#B42318` | White 6.57:1; surface 5.87:1 | Error text and invalid control borders |
| Focus | `#1F5BFF` plus white separation | Blue/white 5.25:1; blue/black 3.60:1 | 3px outline, 3px white separation; visible across light/dark surfaces |

Black text on Signal Blue is only 3.60:1: do not use for normal-sized text. All selectable states also use a border, weight, underline or check treatment. Preserve colour names and accessible state attributes. Error messages include text. Hero text gets an opaque contrasting backing rather than relying on unmeasured photograph colours.

### Typography and wordmarks

- **Display:** Barlow Condensed 800, uppercase, -0.01em tracking. Product-card names remain mixed case in body type. No artificial font stretching.
- **Body:** Barlow 400; buttons/navigation/emphasis Barlow 600. Body tracking normal, control tracking 0.02em. Load only Latin subsets and these weights via `next/font/google`, with swap.
- Both families are SIL OFL 1.1; licences and source links are documented in the research file and included with the standalone review fonts. DM Sans and Libre Caslon are replaced by these approved fonts.

| Element | Desktop size/line height | Mobile size/line height |
| --- | --- | --- |
| Hero | 72px / .95 | 48px / 1 |
| Page H1 | 48px / 1 | 36px / 1.05 |
| Section H2 | 40px / 1.05 | 30px / 1.1 |
| Product H1 | 36px / 1.05 | 28px / 1.1 |
| Small heading | 24px / 1.15 | 22px / 1.15 |
| Body | 16px / 24px | 16px / 24px |
| Secondary / controls | 14px / 20px | 14px / 20px |
| Utility | 12px / 18px | 12px / 18px |

**Wordmark 1:** `MORAVEL`, single-line Barlow Condensed 800, 36px desktop/30px mobile, 0.01em tracking. Recommended for compact recognition and compatibility with the condensed garment mark. Generated garment letterforms are not an exact certified font match.

**Wordmark 2:** `MORAVEL` over `ATHLETIC`, using 32px condensed 800 over 10px Barlow 600 with 0.18em tracking. Type only, no icon or signature graphic. Accessible home label remains “Moravel Athletic home” in both options.

### A/B options and before/after

Both options use the same layout, photos, data and fonts so differences are easy to judge. White product/content surfaces are common to both.

| Element | Current inherited design | A: black and white | B: Signal Blue (recommended) |
| --- | --- | --- | --- |
| Palette | Cream/olive/stone | White/Black/Slate | White/Black/Slate with blue action hierarchy |
| Type | DM Sans; serif wordmark | Heavy condensed display + Barlow | Same |
| Header | Quiet centred serif mark | Compact white chrome; bold condensed mark | Same |
| Main CTAs | Quiet square dark buttons | Black solid, weight 600, 52px high | Signal Blue solid, weight 600, 52px high |
| Selected tabs | Fine underline | Black solid/underline | Blue solid/underline |
| Newsletter | Cream footer column | Black section with white text | Blue section with white text |
| Home rhythm | Products → fabric → categories → story | Categories → products → story → fabric | Same |

A is the closest monochrome performance reference. B makes Moravel more recognisable while using a colour already present in its garments. Neither borrows Gymshark assets or recreates its wordmark.

### Component specifications

- **Spacing/layout:** 4/8/12/16/24/32/48/64/96px scale; 40px desktop gutters, 16px mobile; shopping/content maximum width 1600px. Section spacing 64px desktop/40px mobile; 8–16px shopping-grid gaps. Display content is left aligned; long prose stays within 70ch.
- **Announcement:** static factual existing text, Black background, white 12px text, minimum 32px height. No carousel, countdown, shipping promise or sale message.
- **Header:** sticky white, 76px desktop/64px mobile, bottom divider; condensed mark, bold existing nav and bag count. Header stays visible without hiding focus targets; account for its height in scroll margins and sticky purchase panel offsets.
- **Mobile navigation:** labelled menu control with at least 44px target, grouped existing links in a white overlay, visible close control, Escape dismissal, focus containment while modal and restoration on close. No new routes or duplicate fake search/account controls.
- **Hero:** existing wide photo full bleed; 72/48px heading; solid Shop Women/Shop Men controls; opaque white copy backing on desktop and dark text block below the photo on mobile. Preserve image version, native-resolution caveat, both faces and mobile sizing hint. No new image generation in this restyle.
- **Product cards:** 4:5 imagery, no crop changes to product assets; second image on pointer hover and keyboard focus. Name at 14px/600, price at 14px/600, accurate colours below; small labelled colour samples. Preserve clear product link boundaries. Do not add quick-buy, favourite, ratings or invented badges.
- **Product rail:** existing Women/Men state and Shop all link. Four visible cards desktop, two mobile, scroll-snap with visible overflow affordance; correct accessible labels. Do not call the data best sellers or new arrivals.
- **Categories:** 2:3 full portrait tiles, existing category query links, bold text below. Horizontal rail on mobile; compact desktop rail. Fabric/editorial portraits retain the approved complete 2:3 framing.
- **Collection:** left-aligned title/count/description, category navigation, existing category/size/select controls and sort, four-column desktop/two-column mobile grid. Keep filter empty-state recovery. Materials editorial follows the grid rather than interrupting it.
- **Product detail:** two-column image gallery and sticky purchase panel desktop; swipe gallery then purchase details mobile. Title/price → current summary → colour → size/fit link → full-width action → status → shipping/returns links → existing feature/fit/fabric accordions. Preserve colour-specific galleries, gift denominations/recipient fields and all validation. No sticky mobile buy bar in this scope.
- **Cart/checkout:** existing pages and actions; white surface, dark headings, visible item/quantity controls, near-white summary, clear form labels and text errors. Minimum 48px inputs and 52px submit control. Preserve localStorage key, server validation, `awaiting_restock`, notice text and confirmation path. No drawer or payment fields.
- **Footer/newsletter:** newsletter panel (Black in A, blue in B), labelled email and consent controls, existing pending/success/error feedback. Existing four navigation groups below on white. Preserve all links without adding payment/social/app claims.
- **Buttons/inputs:** 2px radius, 52px primary buttons, 48px inputs, minimum 44px interactive targets. Strong disabled and selected states; no hover-only information. Text links underlined. Primary blue hover is `#1749D1`; neutral hover uses Slate with white text.
- **Accordion/breadcrumb:** native accessible details/summary remains; strong dividing line, clear plus/minus state, 56px summaries. Breadcrumb remains semantic navigation with JSON-LD unchanged.
- **Motion:** 120–180ms opacity/background transitions on direct interaction only. No autoplay, parallax, flashing, or reveal-on-scroll. Reduced-motion removes transitions and smooth scrolling.

### Page layouts

| Page | Module order |
| --- | --- |
| Home | Hero → categories → Women/Men shopping rail → brand banner → fabric lines → footer |
| Collection | Heading/count → categories → filters/sort → products → materials editorial → footer |
| Product | Breadcrumb → gallery/purchase/details → existing supporting content → footer |
| Our story | Title/introduction → existing four image/text chapters → footer |
| Materials | Heading → three macro/composition sections and existing links → footer |
| Gift guide | Heading → complete portrait/gift-card feature → under-$50 rail → under-$100 rail → footer |
| Size guide | Heading → existing tables and fit guidance → existing related links → footer |
| Journal | Heading → existing fabric tiles or approved existing articles → footer |
| Help/legal/FAQ | Left-aligned heading → current readable text or accordions → current related links → footer |
| Cart | Heading → items/empty state + order summary → footer |
| Checkout | Heading → current form + order summary → footer |
| Restock/404 | Existing message and existing actions in the new type/palette; real 404 retained |

### Copy for review, not yet applied

Facts and product descriptions remain unchanged. The following headline changes were shown in the scratch previews and are included in the approved B implementation. Navigation/action wording remains direct and functional.

| Field | Existing | Proposed |
| --- | --- | --- |
| Hero | Built for the next session. | **Keep existing text**, styled uppercase |
| Product rail | Shop the range | Find your training gear. |
| Categories | Make it your own | Shop by category. |
| Fabric section | Three fabric lines. | **Keep existing text**, styled uppercase |
| Brand banner | Gear for training and running. | Put your gear to work. |
| Newsletter | News from Moravel Athletic. | Keep up with Moravel. |
| Story title | Training and running gear. | Gear up. Get moving. |
| Story chapter 1 | Eleven garments and a gift card. | Your training range. |
| Other story headings | Start with the fabric. / Two colors for every garment. / Details you can check. | **Keep existing text**, styled uppercase |

Move any changed presentation copy currently in component literals into `src/config/site.ts` during the approved build. Do not change prices, sizes, compositions, fit descriptions, product names, SEO descriptions or restock messaging.

### Approval, QA and release

Present home and Women's Training Legging for A and B at 390px and 1440px (eight captures), the wordmark board, palette, component specs and this copy table. Wait for an explicit A/B/wordmark choice before restyle changes to `src/`. No push at this stop point.

After choice: implement tokens/fonts → chrome → shared components → page layouts; verify incrementally. Run lint, typecheck, tests, build and 3019 crawlability; compare the pre/post route manifests and unchanged twelve-product data. Axe must show zero violations on home/collection/product/populated checkout. Review screenshots of home/collection/product/cart/checkout at both widths against Gymshark and R&H, plus journal/gift crop regression checks. Check keyboard/focus, mobile menu, filters, variants, gift fields, cart editing, checkout errors, reduced motion and image loading. Lighthouse performance/accessibility must each reach 90 on home and a product under the production build.

Submit one unique `@example.com` checkout, read back `awaiting_restock` in Moravel's own Neon database, then delete that exact test order. Keep noindex and Vercel protection unchanged. Commit as gggeo67, push only the approved completed release to main, verify the exact deployed commit with `verify.sh ... --db`, and report commit/push/deploy status. No page, route, public API, JSON-LD, catalogue schema, database schema or checkout-flow changes. R&H remains read-only.
