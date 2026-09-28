# Restyle proposal review — 2026-09-28

Status: user selected B / Signal Blue. Implemented with the recommended single-line MORAVEL wordmark; see `restyle-implementation.md` for QA and release status.

## Review package

Open http://localhost:3039/ while the local scratch server is running. Files are outside the application at `/Users/tjmcgovern/websites/references/moravel-restyle/`.

- `home-a.html`, `product-a.html`: monochrome option.
- `home-b.html`, `product-b.html`: Signal Blue option, recommended.
- `index.html`: comparison board, two wordmarks, palette/contrast, typography, before screenshots and full specifications.
- `screens/`: eight full-page option screenshots at 390px and 1440px, matching viewport captures, four current-site before screenshots, comparison board and wordmark samples.
- `preview-qa.json`: font loading, image loading, JavaScript errors and overflow checks for all eight captures.
- Local Barlow/Barlow Condensed fonts and OFL notices are retained with the scratch package.

## Validation

All eight option captures pass: no page errors, broken images or document horizontal overflow, with intended fonts loaded. Desktop/mobile screenshots were visually inspected for heading wrapping, portrait framing, product selectors, CTA hierarchy and complete page rhythm. The prototype preserves full portraits in category/fabric tiles. It intentionally previews one product; links and form controls are not a replacement commerce implementation and send no orders or newsletter requests.

A SHA-256 inventory of every `src/` file before and after this phase matches exactly. Prior local hero/crop work remains intact. Baseline application build passed during research; its route manifest is saved outside the repo for the eventual before/after comparison. Full application, accessibility, Lighthouse and database release QA belong to the approved implementation phase and have not been claimed for these static previews.

## Proposed choice

Option B with wordmark 1 (`MORAVEL` on one line). A and B share the same structure, imagery and fonts; primary controls, selected states and newsletter treatment make the colour comparison clear. Copy proposals are shown beside the existing text in the Design direction section of `docs/brief.md`.

## Release status

No application restyle edits. No commit, push or deployment in this phase. Approval is still required at the user's explicit design stop point. R&H is unchanged. The earlier image revision is still local and uncommitted.
