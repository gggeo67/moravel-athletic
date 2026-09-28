# Hero and portrait correction — 2026-09-28

Status: implemented and served locally at http://localhost:3019. Approved by the user (“cool cool”); included with the approved B restyle.

## Changes

Home and journal fabric tiles now preserve 2:3 portrait framing at every breakpoint. Gift guide has a dedicated full-portrait modifier; the home landscape banner is unchanged. Heads and feet are visible in reviewed portrait captures. The new hero uses the same fictional Moravel adults in fresh side-angle track action, with a right-biased mobile crop keeping both runners visible. Page copy, catalogue, routes and checkout are unchanged.

New alt text: “Two runners viewed from the side on a sunlit blue-grey track, wearing Black Moravel leggings and joggers”.

## Evidence

- `image-revision-results.json`: 12 full-page captures across home, journal and gift guide at 390, 1440 and 2048px; additional 2048px DPR-2 captures. Section screenshots are under `screens/image-revision/`.
- All pages return 200, all images decode, no page errors or horizontal overflow; all targeted portrait containers measure 2:3.
- Mobile hero delivery corrected from a 640px response stretched across an 818px cover image to an 828px response. Desktop optimizer delivers all 1672 native source pixels at quality 85.
- Lint, typecheck, 31 Bun tests and production build pass. Crawlability passes 176/176 checks in the existing non-indexable mode.
- All 98 selected asset hashes verified. Only the hero PNG and WebP changed among tracked public images.
- Screenshot review: mobile portraits show complete heads and feet; both hero faces and bodies are visible on mobile. Desktop hero retains its existing shallow banner crop, with faces visible and lower legs outside the banner. Headline and CTA remain readable. Desktop gift section is intentionally taller to display its entire portrait.

## Image provenance and limits

Built-in image_gen, two new attempts, only the accepted Moravel model/outfit references supplied. No competitor images were uploaded and R&H was not changed. First attempt rejected as too frontal; second selected and approved. Prompt: `../images/prompts/home-hero.txt`. Provenance and previous hero retained in the manifest and revision records.

Both generation calls requested 3840×2160 but returned 1672×941. No higher-resolution master exists and no upscaled file was created. At 2048px DPR 2 the source is below the ideal 4096px width; wide-screen sharpness remains limited. Approval is for the shown result with this limitation, not a claim of native 4K output.

Publication is tracked with the Signal Blue restyle in `restyle-implementation.md`.
