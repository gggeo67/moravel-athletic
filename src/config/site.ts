/**
 * Central brand configuration.
 *
 * Everything user-facing about the brand lives here: name, line, the page map,
 * navigation and footer. Pages, the sitemap, llms.txt and the tests all read
 * from this file, so adding a page means adding it here first.
 *
 * Fields typed `| null` are unset open facts (see docs/brief.md). The UI omits
 * them rather than inventing a value.
 */

export type NavItem = { label: string; href: string };

export type SitePage = {
  href: string;
  title: string;
  description: string;
};

export type Collection = {
  handle: string;
  title: string;
  description: string;
};

const NAME = "Moravel Athletic";
const LINE = "Performance training and running gear in technical fabrics.";

/** A unique, factual description for a page until its real copy is written. */
function describe(title: string): string {
  return `${title} at ${NAME}. ${LINE}`;
}

function page(href: string, title: string): SitePage {
  return { href, title, description: describe(title) };
}

/**
 * Collections. Women and men are the two shop pages. The three fabric-line
 * collections are added here once their names are signed off in docs/brief.md.
 */
export const collections: Collection[] = [
  {
    handle: "womens",
    title: "Shop Women",
    description:
      "Leggings, sports bras, shorts, tees and layers. Training and running gear for women.",
  },
  {
    handle: "mens",
    title: "Shop Men",
    description:
      "Training shorts, tees, joggers and layers. Training and running gear for men.",
  },
  {
    handle: "line-one",
    title: "Line One",
    description:
      "Stretch jersey for tees, joggers and layers.",
  },
  {
    handle: "line-two",
    title: "Line Two",
    description: "Close-fitting pieces in a coordinated stretch knit.",
  },
  {
    handle: "line-three",
    title: "Line Three",
    description: "Light woven stretch fabric for our training short.",
  },
];

/** Every public, indexable page other than the home page, collections and products. */
export const pages = {
  giftGuide: page("/pages/gift-guide", "Holiday gift guide"),
  sizeGuide: page("/pages/size-guide", "Size & fit guide"),
  ourStory: page("/pages/our-story", "Our story"),
  materials: page("/pages/materials", "Materials"),
  journal: page("/blogs/journal", "Journal"),
  shipping: page("/pages/shipping", "Shipping"),
  returns: page("/pages/returns", "Returns"),
  faq: page("/pages/faq", "FAQ"),
  contact: page("/pages/contact", "Contact"),
  accessibility: page("/pages/accessibility", "Accessibility"),
  privacy: page("/policies/privacy-policy", "Privacy policy"),
  terms: page("/policies/terms-of-service", "Terms of service"),
} satisfies Record<string, SitePage>;

export const site = {
  name: NAME,
  line: LINE,

  /** Canonical public origin, no trailing slash. Overridden by NEXT_PUBLIC_SITE_URL. */
  origin: "https://moravel-athletic.vercel.app",

  locale: "en-US",
  lang: "en",

  description: LINE,

  navigation: [
    { label: "Women", href: "/collections/womens" },
    { label: "Men", href: "/collections/mens" },
    { label: "Gift guide", href: pages.giftGuide.href },
    { label: "Journal", href: pages.journal.href },
    { label: "Our story", href: pages.ourStory.href },
  ] as NavItem[],

  footerGroups: [
    {
      title: "Shop",
      items: [
        { label: "Women", href: "/collections/womens" },
        { label: "Men", href: "/collections/mens" },
        { label: pages.giftGuide.title, href: pages.giftGuide.href },
      ],
    },
    {
      title: "Help",
      items: [
        pages.sizeGuide,
        pages.shipping,
        pages.returns,
        pages.faq,
        pages.contact,
      ].map((p) => ({ label: p.title, href: p.href })),
    },
    {
      title: "Company",
      items: [pages.ourStory, pages.materials, pages.journal].map((p) => ({
        label: p.title,
        href: p.href,
      })),
    },
    {
      title: "Legal",
      items: [pages.privacy, pages.terms, pages.accessibility].map((p) => ({
        label: p.title,
        href: p.href,
      })),
    },
  ] as { title: string; items: NavItem[] }[],

  contact: {
    email: null as string | null,
  },

  /** Registered company behind the brand. When null, Organization JSON-LD is omitted. */
  legalEntity: null as string | null,
} as const;

/** Every public route that should return 200 and appear in the sitemap. */
export function publicRoutes(): SitePage[] {
  return [
    { href: "/", title: NAME, description: LINE },
    ...collections.map((c) => ({
      href: `/collections/${c.handle}`,
      title: c.title,
      description: c.description,
    })),
    ...Object.values(pages),
  ];
}

export function getPage(href: string): SitePage {
  const found = publicRoutes().find((p) => p.href === href);
  if (!found) throw new Error(`No page configured for ${href}`);
  return found;
}

/** Absolute URL for a site-relative path. No trailing slash except the root. */
export function absoluteUrl(path: string): string {
  if (path === "/") return site.origin;
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${site.origin}${clean.replace(/\/$/, "")}`;
}

export const fabricLines = [
  {
    handle: "line-one",
    name: "Line One",
    description:
      "Stretch jersey for tees, joggers and layers.",
    composition: "89% polyester / 11% elastane",
    image: "/images/editorial/collection-line-one.webp",
    alt: "Line One tee in White",
    macro: "/images/materials/line-one.webp",
  },
  {
    handle: "line-two",
    name: "Line Two",
    description: "Close-fitting stretch pieces, made to wear together.",
    composition: "87% polyester / 13% elastane",
    image: "/images/editorial/collection-line-two.webp",
    alt: "Line Two pieces in Black",
    macro: "/images/materials/line-two.webp",
  },
  {
    handle: "line-three",
    name: "Line Three",
    description: "Light woven stretch, with the details training calls for.",
    composition: "86% polyester / 14% elastane · 137 GSM",
    image: "/images/editorial/collection-line-three.webp",
    alt: "Line Three training shorts in Black",
    macro: "/images/materials/line-three.webp",
  },
];

export const categories = [
  {
    name: "Leggings",
    value: "leggings",
    audience: "womens",
    image: "/images/editorial/category-leggings.webp",
  },
  {
    name: "Joggers",
    value: "joggers",
    audience: "womens",
    image: "/images/editorial/category-joggers.webp",
  },
  {
    name: "Shorts",
    value: "shorts",
    audience: "mens",
    image: "/images/editorial/category-shorts.webp",
  },
  {
    name: "Tees",
    value: "tee",
    audience: "mens",
    image: "/images/editorial/category-tees.webp",
  },
  {
    name: "Sports bras",
    value: "sports bra",
    audience: "womens",
    image: "/images/editorial/category-bras.webp",
  },
  {
    name: "Quarter-zips",
    value: "quarter-zip",
    audience: "mens",
    image: "/images/editorial/category-quarter-zips.webp",
  },
  {
    name: "Hoodies",
    value: "hoodie",
    audience: "womens",
    image: "/images/editorial/category-hoodies.webp",
  },
];

export const storefront = {
  announcement: "Training and running gear for women and men",
  hero: {
    title: "Built for the next session.",
    text: "Training and running gear in technical fabrics, for women and men.",
    image: "/images/editorial/home-hero.webp",
    alt: "Moravel Athletic training and running gear",
  },
  newArrivals: {
    title: "Shop the range",
    text: "Leggings, shorts, tees, sports bras and layers.",
  },
  fabrics: {
    title: "Three fabric lines.",
    text: "Each line has its composition stated plainly.",
  },
  banner: {
    title: "Gear for training and running.",
    text: "Technical fabrics, clear fits and two colors for every garment.",
    image: "/images/editorial/brand-banner.webp",
    alt: "Moravel Athletic training gear",
  },
  newsletter: {
    title: "News from Moravel Athletic.",
    text: "New pieces and fabric notes from Moravel Athletic.",
    consent: "Sign me up for emails from Moravel Athletic.",
  },
  story: {
    title: "Training and running gear.",
    intro:
      "Moravel Athletic makes performance training and running gear in technical fabrics.",
    blocks: [
      {
        title: "Eleven garments and a gift card.",
        text: "Six pieces for women and five for men, from leggings and sports bras to shorts, tees and layers.",
        image: "/images/editorial/story-1.webp",
        alt: "Moravel Athletic training gear",
      },
      {
        title: "Start with the fabric.",
        text: "Three fabric lines, each with its composition stated plainly on every product page.",
        image: "/images/editorial/story-2.webp",
        alt: "Moravel Athletic fabric",
      },
      {
        title: "Two colors for every garment.",
        text: "Black, White, Olive and Taupe. Select a color on any product page to see it.",
        image: "/images/editorial/story-3.webp",
        alt: "Moravel Athletic garments in Black",
      },
      {
        title: "Details you can check.",
        text: "Fit, sizes, inseams and features are listed on each product page.",
        image: "/images/editorial/story-4.webp",
        alt: "Moravel Athletic training shorts",
      },
    ],
  },
  giftGuide: {
    title: "Gifts for training and running.",
    text: "A layer, a pair of shorts, or the choice of a gift card.",
    image: "/images/editorial/gift-guide.webp",
    alt: "Moravel Athletic gift ideas",
  },
  journal: {
    title: "Notes on fabric & fit",
    text: "A closer look at the materials and fits in our range.",
  },
} as const;

export const faqs = [
  {
    question: "How do the three fabric lines differ?",
    answer:
      "Line One is a stretch jersey with 89% polyester and 11% elastane. Line Two uses 87% polyester and 13% elastane for close-fitting pieces. Line Three is a 137 GSM woven fabric with 86% polyester and 14% elastane.",
  },
  {
    question: "Where can I find the fit and inseam?",
    answer:
      "Each product page lists its fit and available sizes. Inseams are listed for the leggings, bike shorts, training shorts and joggers.",
  },
  {
    question: "Which colors are available?",
    answer:
      "Every garment has two colors. Select a color on the product page to see the matching garment images.",
  },
  {
    question: "What gift-card amounts can I choose?",
    answer:
      "Gift cards are available in $50 and $100 denominations. Choose the amount and enter the recipient name and email on the product page.",
  },
];

export const helpContent: Record<string, { heading: string; text: string }[]> =
  {
    "/pages/shipping": [
      {
        heading: "Your order details",
        text: "Enter your contact and shipping address at checkout. Review the items, colors, sizes and quantities in your bag before continuing.",
      },
    ],
    "/pages/returns": [
      {
        heading: "Find the right fit",
        text: "Explore the size and fit guide, and check the individual fit notes and inseams on each product page.",
      },
    ],
    "/pages/contact": [
      {
        heading: "Help with your selection",
        text: "Our product pages include fabric compositions, garment features and available sizes. Explore the fit guide, materials page and frequently asked questions for more detail.",
      },
    ],
    "/pages/accessibility": [
      {
        heading: "Using this website",
        text: "Browse with a keyboard using Tab and Enter. Use the skip-to-content link to move past the navigation. Product controls include text labels for colors and sizes.",
      },
    ],
    "/policies/privacy-policy": [
      {
        heading: "Information you enter",
        text: "The checkout form records your contact information, shipping address and selected items. The newsletter form records the email address you submit. Your shopping bag is stored in your browser.",
      },
      {
        heading: "Payment details",
        text: "The checkout form does not collect card numbers.",
      },
    ],
    "/policies/terms-of-service": [
      {
        heading: "Your selection",
        text: "Product prices are shown in US dollars. Review the selected product, color, size, quantity and item subtotal in your bag before continuing to checkout.",
      },
    ],
  };

export type JournalArticle = {
  slug: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  paragraphs: string[];
};
// No invented articles, bylines or publication dates. Template is ready for approved editorial.
export const journalArticles: JournalArticle[] = [];

/** Approved checkout restock messaging; email dispatch is a separate integration. */
export const restock = {
  title: "We’re restocking",
  message:
    "Your selected items are being restocked. We’ll email you when they’re available again.",
  chargeNotice: "You haven’t been charged.",
  submitLabel: "Notify me when available",
  pendingLabel: "Saving request…",
  checkoutNotice:
    "We’ll save your selections and email you when they’re available again. You won’t be charged.",
};
