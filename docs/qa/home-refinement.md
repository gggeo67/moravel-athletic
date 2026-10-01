# Homepage refinement — October 1, 2026

Local implementation following rejection and rollback of the first Taste pass.

## Design decisions

- Reviewed the saved Gymshark and Janji homepage references and live Gymshark storefront. Adopted integrated campaign photography/copy, consistent category crops, and restrained shopping controls while retaining Moravel's approved Barlow typography, signal blue, original imagery and copy.
- Hero headline, supporting copy and shopping actions remain inside a single photographic composition. Mobile framing keeps both runners' faces visible.
- Seven category links use existing garment-only master photographs with consistent 4:5 frames. Existing collection-page category imagery is unchanged.
- Homepage shopping rails provide labeled previous/next buttons, native touch/trackpad/keyboard scrolling, and hidden native scrollbars. Reduced-motion users get immediate arrow scrolling.
- Women/Men switching resets the product track without remounting the buttons, preserving their DOM identity and keyboard focus.
- The existing “Put your gear to work” banner is unchanged.
- A compact fabric index uses the three existing macro photographs, descriptions and collection destinations.

## Scope

Homepage styles live in `src/app/home.css`; editorial components in `src/components/home-editorial.tsx`; scrolling controls in `src/components/shop-rail.tsx`. The shared non-home ProductRail remains unchanged. No changes to catalogue data, prices, checkout, database, route structure, indexing configuration or deployment settings.

## Verification

- Desktop and 390px/320px mobile preview reviewed in Chrome. Checked hero framing, garment crops, shopping navigation, material rows and preserved brand banner. Fixed the bag label wrapping at 320px.
- Product next-arrow scrolling and its end state reviewed visually; category initial previous-arrow state verified.
- Lint and TypeScript checks passed.
- Bun tests: 44 passed, 264 assertions.
- Production build passed before the final focus-preservation adjustment. The final rerun was blocked by the newly restricted environment: Turbopack's CSS worker could not bind a local port (`Operation not permitted`). Final lint and TypeScript checks passed.
- Crawlability: 176/176 checks passed in non-indexable mode against the local preview.
- Browser access became unavailable after the final focus-preservation adjustment, so that adjustment was code-reviewed and typechecked but not retested interactively. This pass does not claim a new full axe or Lighthouse audit.

## Release follow-up

The user authorized shipping this update, then requested image corrections on the journal and gift guide before release. Journal guide cards now use the existing fabric macro images in square frames. The gift-guide feature uses the existing gift-card product artwork at its native 4:5 ratio instead of a hoodie model. Both updated pages were visually checked in Chrome; their links and copy remain unchanged.

Release checks: lint, typecheck and all 44 tests pass. A production build with `next build --webpack` passes; the default local Turbopack build still encounters a worker port restriction. The project's default build configuration is unchanged. Checkout database verification read back `awaiting_restock` and deleted its exact test order, confirming zero remaining rows. Deployment verification is performed after the release commit is pushed.
