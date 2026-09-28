# Homepage campaign banner framing — 2026-09-28

The homepage's “Put your gear to work” image used object-fit cover in a minimum-height grid cell. At wide desktop widths this cropped the top and bottom of the landscape source, including the man's head.

The homepage banner now has its own scoped class. Its photo cell keeps the native 1672:941 aspect ratio, has no minimum height, is vertically centered if the text needs more space, and uses object-fit contain. The entire original photo stays visible. The gift-guide portrait and other sections retain their existing styles. No image file, copy, route or purchasing logic changed.

Validated on the production build at 390, 768, 1440, 2048 and 2560px: native ratio retained, contain fit, no horizontal overflow. Desktop and mobile screenshots visually reviewed with complete heads and feet. Captures: `screens/banner-fix/home-{width}.png`; measurements: `banner-framing.json`.

Lint, typecheck, 31 tests / 222 assertions, production build and 176/176 crawlability checks passed. The authorized main push is followed by the standard exact-commit deployment verification.
