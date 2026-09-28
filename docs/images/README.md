# Moravel Athletic image set

The user approved the 13-image test set, palette and full-batch continuation on 2026-09-28 ("looks fine"), and separately approved aligning fit descriptions with the images. The complete set contains **72 generated sources + 26 crops = 98 deliverables**.

## Files and sizes

- Products: 67 PNG sources (11 garments × six views, plus gift card), native 1122×1402.
- Home hero and brand banner: two PNG sources, native 1672×941.
- Fabric macros: three PNG sources, native 1254×1254.
- Details: 11 WebP crops, 561×561.
- Editorial tiles: 15 WebP crops, 934×1402.
- Each source also has a WebP delivery copy. Selected source PNGs were not resized, stretched, recoloured or upscaled.
- `public/images/` contains 72 PNGs and 98 WebPs in the existing product, editorial and materials layout. Retired colour filenames were removed.

## Provenance and approval

`manifest.json` records prompts, tool, date, input roles, SHA-256 hashes, source and delivery dimensions, lineage, QA and 13 rejected generated attempts. Every selected source was generated using the built-in `image_gen` tool. There was no CLI/API fallback. One initial sports-bra model call did not return an image; the successful retry is recorded, and no nonexistent output is counted.

Rennick & Hale was read-only. Only its fictional adult model-front photographs were supplied as identity references, one per matching garment slot. Its garments, backgrounds and hero were never supplied as generation references. New Moravel garments and model shots were used for consistency between subsequent views. No Gymshark photograph was uploaded. Supplied Gymshark links informed silhouette, fit and length only; garment seams and branding are original Moravel direction.

`test-set.html`, `test-set-manifest.json` and `review/` retain the approval-stage same-slot comparisons, palette and prompts. R&H photographs in that review are comparison evidence, not Moravel deliverables. The archived builder refuses to overwrite a completed full-batch manifest.

Hash checks found no selected Moravel source or delivery file identical to an R&H asset. Hash differences alone do not prove visual originality; the input records and visual comparisons provide the relevant supporting evidence.

## QA and limits

All selected images were visually reviewed for view, garment shape, framing, colour family and, where applicable, fictional identity, anatomy and new setting. Detail and editorial contact sheets are retained in `review/details.png` and `review/tiles.png`. The audit checks all 170 selected files and every catalogue/configured image path.

Black #111111, White #F2F2F0, Slate #4A4F57 and Signal Blue #1F5BFF are design targets. Generated lighting and cloth affect visible colour; exact dye colours, physical inseams and millimetre logo sizes cannot be certified from pixels. MORAVEL uses a small tonal condensed sans treatment, with some generated letterform and seam variation between views.

The catalogue changes cover the approved palette, image paths, descriptive alt text and necessary fit/length/visible-feature alignment. Prices, sizes, compositions, pages, routes and checkout implementation are unchanged. Existing test and QA fixtures now select Slate instead of retired Olive; the existing swatch CSS names now match Moravel's palette.

## Reproduction

From the repo root:

```sh
node docs/images/record-assets.mjs
node docs/images/derive-assets.mjs
bun docs/images/qa-site.mjs
```

The first two scripts are ported from R&H. They use retained Moravel sources and accepted records, generate WebP and crops, and refresh the manifest. Recreated crops are deliberately marked pending until visually reviewed again. `qa-site.mjs` expects the site on port 3019 and captures both viewport sizes and garment colours without submitting an order. Site QA results are in `docs/qa/image-site-results.json`; full screenshots are local ignored artifacts under `docs/qa/screens/images/`.
