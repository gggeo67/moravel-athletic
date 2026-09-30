# Moravel Athletic — illustrated logo, round two

## Concept: Full stride

A running hare in a fully extended stride. Its long ears and forward silhouette carry the energy without a generic speed swoosh.

Two compositions were drawn: `public/brand/concept-side.svg` and `concept-integrated.svg`. The installed composition is **side**. The full illustration is `illustration.svg`; the smaller icon is simplified artwork, not an initial.

## Use

- Primary artwork: `wordmark.svg`. One-color artwork: `wordmark-mono.svg`, `wordmark-reversed.svg`. Corresponding transparent PNGs use the same names.
- Icons: `icon.svg`, `icon-mono.svg`, `icon-reversed.svg`. Browser favicon: `favicon.svg` / `favicon.ico`. Next.js icons live in `src/app/`.
- `BrandLogo` keeps its `className` and `compact` interface. The name inherits the surface’s foreground color; illustrations use the existing brand colors. Home links retain `Moravel Athletic home` accessible names.
- Installed desktop width: 184px; mobile width: 151px. Keep at least 8px clear space. Use the simplified icon at 16–48px. Do not stretch the artwork or add shadows and gradients.
- Existing ink `#111111`, accent `#1f5bff`, and light surface `#ffffff`. For a one-color dark placement, use the reversed asset. Full-color character artwork retains its established colors on both surfaces.

## Sources and iteration

Illustration contours are original vector drawings in `logo-review/scripts/illustrations.py`; editable SVG master: `logo-review/sources/illustrations/moravel_athletic.svg`. Character shapes for Jomli and Tuppo were referenced from the site's existing character artwork, without copying competitor artwork or introducing a new cast.

Supporting lettering uses the licensed source font bytes and notices in `logo-sources/`; no font is fetched by the logo component. Geometry and compositions are reproducible with `logo-review/scripts/generate.py`, then `bun logo-review/scripts/render.mjs`.

Round one, including the old site assets, components, and screenshots, is preserved in `logo-review/round-one/`. The installed identity is delivered through this repository’s `main` branch. Earlier review sheets and iteration archives are retained in the local `logo-review/` workspace.
