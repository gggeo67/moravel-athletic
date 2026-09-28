# Moravel Athletic design research

Checked **2026-09-28**, using a real Chromium browser at **390px and 1440px**. This is visual research, not permission to reproduce another brand's assets or claims. No reference screenshot was sent to an image model.

## Evidence

Screenshots live outside this repo: `/Users/tjmcgovern/websites/references/gymshark/`. The matching `computed-styles-2026-09-28.json` contains sampled headings, buttons, chrome and image dimensions for both widths. Secondary reference screenshots live in `/Users/tjmcgovern/websites/references/other-brands/`. These files are local research artifacts and must not be committed.

| Surface | URL | Screenshot stem |
| --- | --- | --- |
| Home | https://www.gymshark.com/ | `gymshark-home` |
| Women | https://www.gymshark.com/collections/all-products/womens | `gymshark-womens` |
| Men | https://www.gymshark.com/collections/all-products/mens | `gymshark-mens` |
| Legging | https://www.gymshark.com/products/gymshark-everyday-seamless-leggings-black-aw23 | `gymshark-legging` |
| Short | https://www.gymshark.com/products/gymshark-arrival-7-shorts-black-ss22 | `gymshark-short` |
| Hoodie | https://www.gymshark.com/products/gymshark-crest-oversized-hoodie-light-grey-marl-ss24 | `gymshark-hoodie` |
| Cart | https://www.gymshark.com/cart | `gymshark-cart` |
| Menus / empty bag drawer | Header controls on home/product pages | `gymshark-menu`, `gymshark-cart-drawer` |

Each stem has `-390.png` and `-1440.png` captures. Full home screenshots include the footer. Cart research inspected the empty state; it did not place an order. Secondary reference captures can include privacy overlays; their typography samples come from underlying computed styles, not assumptions about obscured content. The site is campaign-dependent: these observations describe this date, not a permanent Gymshark design specification.

## Gymshark findings and decisions

| Pattern | Observed evidence | Moravel decision |
| --- | --- | --- |
| Palette | White surfaces; sampled primary text `rgb(13,16,18)`; secondary text `rgb(118,122,127)`; black/white controls. The current campaign includes a green promotion bar. | **Adapt:** white/Black/Slate foundation, with Moravel Signal Blue. Do not import campaign green or assume all reference combinations pass AA. |
| Display type | Proprietary Plaak Gymshark, sampled weight 800; home/collection display text 48px desktop and approximately 32.25px mobile. Smaller section headings sampled at 20px/18.04px, weight 500. | **Adapt:** free Barlow Condensed 800, larger 72/48px home display and clear 48/36px page headings. No proprietary font files. |
| Body type | Proprietary SN Skandia, usually 14px/400 in sampled product/navigation text. Product names use restrained normal case on cards; prominent page titles are condensed. | **Adapt:** Barlow 400/600; 16px body for legibility, 14px secondary information. |
| Case/tracking | Many display strings are uppercase in content; computed `text-transform` often remains `none`. Sampled display tracking is normal or -0.01px, not widely spaced. | **Adapt:** uppercase presentation for major headings, tight tracking; retain sentence case in body and card names. |
| Spacing | Home CTA padding 16px 24px, 8px internal gap, 52px height. Mobile header controls sample 44px targets. Collection content has approximately 40px desktop gutters. | **Adapt:** explicit 4/8/12/16/24/32/48/64/96 scale; 40px desktop and 16px mobile gutters. |
| Buttons | Sampled campaign CTAs are rectangular, 0px radius, 14px body type; light solid and outlined treatments. | **Adapt:** 52px solid high-contrast CTAs, 2px radius, weight 600; selected states cannot rely on colour alone. |
| Product cards | Image dominates; title, price, colour/fit information follow. Reference also adds review/social-proof/promotion elements. | **Adapt:** preserve Moravel name, price and two-colour information; second image on hover and keyboard focus. **Skip** unsupported proof/badges. |
| Grids/ratios | Desktop collection category rail shows five tiles; sampled tiles measure 264×329 (approximately 4:5). Home category imagery samples 337×421 desktop and 170×212 mobile. | **Adapt:** catalogue-size-appropriate four-column desktop/two-column mobile product grid; native 4:5 products and full 2:3 Moravel editorial portraits. |
| Header and menus | Centred proprietary wordmark; women/men navigation; account/search/wishlist/bag tools. Mobile uses a drawer with grouped categories. | **Adapt:** own typographic mark, simple strong navigation, accessible mobile overlay and bag count. **Skip** account/search/wishlist features absent from Moravel. |
| Announcement | Rotating/promotional messages and an active sale countdown were visible. | **Adapt:** one static factual training/running message. **Skip** countdowns, sales and unsupported shipping promises. |
| Home order | Campaign hero → gender promotion/category rails → more campaign features → category discovery → footer. | **Adapt:** hero → categories → Women/Men shopping rail → brand banner → fabric lines → footer. No invented campaign/drop content. |
| Collection order | Heading/count/description → categories → filtering/sorting and products. Large reference catalogue has substantially more controls. | **Adapt:** existing category/size filters and sort only; move Moravel materials editorial after the product grid. |
| Product order | Desktop image mosaic next to title/price, description, colour thumbnails, size grid and purchase action; additional details/reviews below. Mobile image comes first, with a fixed purchase affordance visible. | **Adapt:** existing gallery/purchase/detail structure with stronger hierarchy. **Skip** review blocks, social-proof counters and additional floating purchase controls for this restyle. |
| Cart | White drawer over dimmed background, condensed heading and clear shopping actions in the empty state; separate cart URL exists. | **Adapt:** visual clarity on Moravel's existing cart page. **Skip** adding a drawer so the established funnel remains intact. |
| Footer | Dense help/company navigation; mobile grouped disclosure patterns. Reference includes payment, social and app ecosystems. | **Adapt:** existing footer groups and newsletter only. **Skip** missing platform/payment/social claims. |
| Motion | Sampled interactive background-colour transitions around 0.2s; overlays and campaign media. | **Adapt:** brief user-triggered feedback. **Skip** autoplay, rotating announcements and reveal-on-scroll; disable transitions under reduced motion. |

## Contrast references

- **Tracksmith** — https://www.tracksmith.com/ — heritage serif campaign type, script mark, olive/tan accents and widely tracked compact navigation (sampled 10px, 1px tracking). **Skip** this identity for Moravel because it resembles the R&H direction. Retain only the principle of giving photography room. Screenshots: `other-brands/tracksmith-{width}.png`.
- **On** — https://www.on.com/en-us/ — restrained black/white foundation, large image-led hero, rounded controls; sampled heading approximately 49.58px/700 and CTA 48px high. **Adapt** clear hierarchy and sparse chrome. **Skip** its proprietary type/logo and athlete campaign content. Screenshots: `other-brands/on-{width}.png`.
- **Janji** — https://janji.com/ — immersive outdoor campaign photography; sampled hero heading 66px and smaller image-card headings 22px, with compact category navigation. **Adapt** photographic scale and direct gender shopping paths; **skip** offer, membership and adventure claims not supported by Moravel. Screenshots: `other-brands/janji-{width}.png`.

## Free type choice and licences

Use Barlow Condensed 800 and Barlow 400/600, not an attempted clone of Plaak or Skandia. Both are published through Google Fonts under SIL OFL 1.1. Preserve the notices when self-hosting via next/font.

- https://raw.githubusercontent.com/google/fonts/main/ofl/barlowcondensed/OFL.txt
- https://raw.githubusercontent.com/google/fonts/main/ofl/barlow/OFL.txt
- Font family source: https://github.com/jpt/barlow

## Baseline and approval boundary

Baseline `bun run build` passed before restyling. The 25-entry app-path manifest (including framework internal entries) is retained outside the repo at `/Users/tjmcgovern/websites/references/moravel-before-restyle-routes.json`; the build generated 39 static pages. Compare normalized route keys and public routes after implementation, not chunk filenames.

This research feeds the pending **Design direction** in `../brief.md`. A/B previews are standalone local documents outside the application, using only Moravel assets/data. No restyle edits to `src/`, product data, checkout, SEO or indexing are authorized until the visual choice stop point is satisfied.
