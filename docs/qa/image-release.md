# Moravel image release QA — 2026-09-28

Installed 72 newly generated Moravel sources and 26 derivative crops. The 13-image test set and palette were user-approved; fit-description alignment was separately approved. Manifest: `docs/images/manifest.json`.

- Asset audit: all 170 selected files (72 PNG sources + 98 WebPs) meet dimensions; all configured paths exist; no selected file hash matches an R&H asset.
- Lint and type checking passed.
- Bun tests: 31 passed, zero failed. Retired Olive fixtures were updated to Slate; no checkout implementation changes.
- Production build passed.
- Crawlability against port 3019: 176/176 passed in existing non-indexable mode.
- Browser QA: 52 captures across home, both collections, all 12 products, all garment colours, at 390px and 1440px. Zero broken images, page errors or horizontal overflow. Full results in `image-site-results.json`.
- Visual review: source images, detail/editorial contact sheets, and home/collection/product screenshots at both widths. New palette swatches display correctly; galleries show the selected colour. Existing responsive gallery scrolling and editorial image containers are retained.
- Screenshots are local under `docs/qa/screens/images/` (gitignored). Existing dev-server capture timed out once; final successful captures use the production build on port 3019. QA script was corrected to skip the nonexistent gift-card colour button.

Only imagery, related catalogue/configuration text, palette swatch selectors, image tooling/docs and matching test/QA colour fixtures changed. Prices, sizes, compositions, pages, routes and checkout logic are unchanged. Existing protected/noindex launch mode remains in place.

Generated imagery uses visually matched fictional identities and tonal condensed lettering. Small letterform/seam variation remains inherent in the generated sources; exact physical measurements and colourimetry are not certified from pixels.
