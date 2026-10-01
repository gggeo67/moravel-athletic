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

function page(href: string, title: string, description?: string): SitePage {
  return { href, title, description: description ?? describe(title) };
}

/**
 * Collections. Women and men are the two shop pages, then the three fabric
 * lines: Tempo Jersey, Surge Knit and Stride Woven. (Renamed from the working
 * names line-one/two/three on 2026-09-29; next.config.ts redirects the old URLs.)
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
    handle: "tempo-jersey",
    title: "Tempo Jersey",
    description:
      "Stretch jersey for tees, joggers and layers. Warm-up to cooldown, one fabric.",
  },
  {
    handle: "surge-knit",
    title: "Surge Knit",
    description:
      "Close-fitting leggings, sports bras and bike shorts in one coordinated stretch knit.",
  },
  {
    handle: "stride-woven",
    title: "Stride Woven",
    description:
      "Light woven stretch for our training short. Built for intervals, laps and long runs.",
  },
];

/** Every public, indexable page other than the home page, collections and products. */
export const pages = {
  giftGuide: page("/pages/gift-guide", "Holiday gift guide"),
  sizeGuide: page("/pages/size-guide", "Size & fit guide"),
  ourStory: page("/pages/our-story", "Our story"),
  materials: page("/pages/materials", "Materials"),
  journal: page("/blogs/journal", "Journal"),
  shipping: page(
    "/pages/shipping",
    "Shipping",
    `Free standard shipping on US orders over $75, 2-day delivery and 2026 holiday order cut-offs at ${NAME}.`,
  ),
  returns: page(
    "/pages/returns",
    "Returns",
    `30-day returns, free exchanges and free holiday returns through January 31, 2027 at ${NAME}.`,
  ),
  faq: page(
    "/pages/faq",
    "FAQ",
    `Answers on fabrics, fit, shipping, holiday deadlines, returns and gift cards at ${NAME}.`,
  ),
  contact: page(
    "/pages/contact",
    "Contact",
    `Send ${NAME} a message about an order, sizing or a return. We reply within 2 business days.`,
  ),
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

  /** Stable brand key stored on every list and contact row. */
  key: "moravel-athletic",

  /**
   * Who runs the site: the brand name only. No company registration, street
   * address or phone number is published.
   */
  operator: NAME,

  /** No email address is published; every contact route points to the form. */
  contact: {
    email: null as string | null,
    form: "/pages/contact",
  },
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
    handle: "tempo-jersey",
    name: "Tempo Jersey",
    description: "Stretch jersey that keeps pace from the first rep to the last lap.",
    composition: "89% polyester / 11% elastane",
    image: "/images/editorial/collection-line-one.webp",
    alt: "Model carrying dumbbells in a White Moravel training tee",
    macro: "/images/materials/line-one.webp",
  },
  {
    handle: "surge-knit",
    name: "Surge Knit",
    description: "Close-fitting stretch that locks in for every set.",
    composition: "87% polyester / 13% elastane",
    image: "/images/editorial/collection-line-two.webp",
    alt: "Model wearing a Black Moravel sports bra in a gym",
    macro: "/images/materials/line-two.webp",
  },
  {
    handle: "stride-woven",
    name: "Stride Woven",
    description: "Light woven stretch with zip side pockets, made for the stride.",
    composition: "86% polyester / 14% elastane · 137 GSM",
    image: "/images/editorial/collection-line-three.webp",
    alt: "Model running on a blue track in Black Moravel training shorts",
    macro: "/images/materials/line-three.webp",
  },
];

export const categories = [
  {
    name: "Leggings",
    value: "leggings",
    audience: "womens",
    image: "/images/editorial/category-leggings.webp",
    garmentImage: "/images/products/womens-training-legging/master-black-front.webp",
  },
  {
    name: "Joggers",
    value: "joggers",
    audience: "womens",
    image: "/images/editorial/category-joggers.webp",
    garmentImage: "/images/products/womens-jogger/master-slate-front.webp",
  },
  {
    name: "Shorts",
    value: "shorts",
    audience: "mens",
    image: "/images/editorial/category-shorts.webp",
    garmentImage: "/images/products/mens-training-short/master-signal-blue-front.webp",
  },
  {
    name: "Tees",
    value: "tee",
    audience: "mens",
    image: "/images/editorial/category-tees.webp",
    garmentImage: "/images/products/mens-training-tee/master-white-front.webp",
  },
  {
    name: "Sports bras",
    value: "sports bra",
    audience: "womens",
    image: "/images/editorial/category-bras.webp",
    garmentImage: "/images/products/womens-sports-bra/master-black-front.webp",
  },
  {
    name: "Quarter-zips",
    value: "quarter-zip",
    audience: "mens",
    image: "/images/editorial/category-quarter-zips.webp",
    garmentImage: "/images/products/mens-quarter-zip/master-black-front.webp",
  },
  {
    name: "Hoodies",
    value: "hoodie",
    audience: "womens",
    image: "/images/editorial/category-hoodies.webp",
    garmentImage: "/images/products/womens-zip-hoodie/master-slate-front.webp",
  },
];

export const storefront = {
  wordmark: "MORAVEL",
  categoryTitle: "Shop by category.",
  announcement: "Training and running gear for women and men",
  hero: {
    title: "Built for the next session.",
    text: "Training and running gear in technical fabrics, for women and men.",
    image: "/images/editorial/home-hero.webp?v=track-action-2",
    alt: "Two runners viewed from the side on a sunlit blue-grey track, wearing Black Moravel leggings and joggers",
  },
  newArrivals: {
    title: "Find your training gear.",
    text: "Leggings, shorts, tees, sports bras and layers.",
  },
  fabrics: {
    title: "Three fabric lines.",
    text: "Each line has its composition stated plainly.",
  },
  banner: {
    title: "Put your gear to work.",
    text: "Technical fabrics, clear fits and two colors for every garment.",
    image: "/images/editorial/brand-banner.webp",
    alt: "Two models training in a sunlit gym in Black Moravel gear",
  },
  newsletter: {
    title: "Keep up with Moravel.",
    text: "New pieces and fabric notes from Moravel Athletic.",
    consent: "Sign me up for emails from Moravel Athletic.",
  },
  story: {
    title: "Gear up. Get moving.",
    intro:
      "Moravel Athletic makes performance training and running gear in technical fabrics.",
    blocks: [
      {
        title: "Your training range.",
        text: "Six pieces for women and five for men, from leggings and sports bras to shorts, tees and layers.",
        image: "/images/editorial/story-1.webp",
        alt: "Model stepping onto a gym box in Black Moravel joggers",
      },
      {
        title: "Start with the fabric.",
        text: "Tempo Jersey for tees, joggers and layers. Surge Knit for close-fitting leggings, sports bras and bike shorts. Stride Woven for the training short. Every composition is stated plainly on the product page.",
        image: "/images/editorial/story-2.webp",
        alt: "Model jogging in a White Moravel raglan training tee",
      },
      {
        title: "Two colors for every garment.",
        text: "Black, White, Slate and Signal Blue. Select a color on any product page to see it.",
        image: "/images/editorial/story-3.webp",
        alt: "Model walking on a blue track in Black Moravel bike shorts",
      },
      {
        title: "Details you can check.",
        text: "Fit, sizes, inseams and features are listed on each product page.",
        image: "/images/editorial/story-4.webp",
        alt: "Model running in Black Moravel training shorts",
      },
    ],
  },
  giftGuide: {
    title: "Gifts for training and running.",
    text: "A layer, a pair of shorts, or the choice of a gift card.",
    image: "/images/products/gift-card/artwork.webp",
    alt: "Black Moravel Athletic gift card on a grey background",
  },
  journal: {
    title: "Fabric & fit guides",
    text: "Know your gear. Guides to the three fabric lines in our range: what each is made of, how it performs in training and which pieces use it.",
    cardPrefix: "The",
    cardSuffix: "guide",
    cta: "Read the guide",
  },
} as const;

/** Effective date shown on every service and policy page. */
export const policyEffectiveDate = "September 29, 2026";

/**
 * Service terms. Rennick & Hale and Moravel Athletic share these numbers
 * exactly (GEO-2316 pairing rule); only the wording differs.
 */
export const serviceTerms = {
  freeShippingOver: 75,
  standardRate: 7,
  expressRate: 18,
  returnDays: 30,
  returnLabelFee: 7,
  holidayOrderWindow: "November 1 to December 24, 2026",
  holidayReturnBy: "January 31, 2027",
  standardCutoff: "Wednesday, December 16, 2026",
  expressCutoff: "Monday, December 21, 2026",
  replyTime: "2 business days",
} as const;

export const faqs = [
  {
    question: "How do the three fabric lines differ?",
    answer:
      "Tempo Jersey is a stretch jersey with 89% polyester and 11% elastane. Surge Knit uses 87% polyester and 13% elastane for close-fitting pieces. Stride Woven is a 137 GSM woven fabric with 86% polyester and 14% elastane.",
  },
  {
    question: "Where can I find the fit and inseam?",
    answer:
      "Each product page lists its fit and available sizes. Inseams are listed for the leggings, bike shorts, training shorts and joggers. The size & fit guide has the full chart.",
  },
  {
    question: "Which colors are available?",
    answer:
      "Every garment has two colors. Select a color on the product page to see the matching garment images.",
  },
  {
    question: "How much is shipping?",
    answer:
      "Standard shipping (3–5 business days) is free on US orders over $75 and $7 below that. 2-day shipping is $18 on any order. We ship to all 50 US states and APO/FPO addresses.",
  },
  {
    question: "When should I order for the holidays?",
    answer:
      "For delivery by December 24, place standard orders by 1 p.m. ET on Wednesday, December 16, 2026, and 2-day orders by 1 p.m. ET on Monday, December 21, 2026. Digital gift cards have no cut-off.",
  },
  {
    question: "What is your return policy?",
    answer:
      "Return unworn, unwashed pieces with their tags within 30 days of delivery. Orders placed from November 1 to December 24, 2026 can be returned free until January 31, 2027. Start a return with our contact form.",
  },
  {
    question: "Can I exchange for a different size or color?",
    answer:
      "Yes. Exchanges are free. Tell us the order email, the piece and the size or color you want through our contact form, and we'll send a prepaid label.",
  },
  {
    question: "Why does checkout say you're restocking?",
    answer:
      "Some pieces are being restocked. Checkout saves your order details and you aren't charged. Tick the box at checkout if you'd like an email as soon as your items are back.",
  },
  {
    question: "What gift-card amounts can I choose?",
    answer:
      "Gift cards are available in $50 and $100 denominations. Choose the amount and enter the recipient name and email on the product page. Gift cards don't expire.",
  },
  {
    question: "How do I contact you?",
    answer:
      "Use the contact form on our Contact page. We reply within 2 business days, Monday to Friday.",
  },
  {
    question: "How do I stop emails from you?",
    answer:
      "Every email we send has an unsubscribe link. You can also ask us through the contact form and we'll take you off every list.",
  },
];

export type HelpSection = {
  heading: string;
  text: string;
  list?: string[];
  link?: NavItem;
};

const contactLink: NavItem = {
  label: "Use our contact form",
  href: "/pages/contact",
};

export const helpContent: Record<string, HelpSection[]> = {
  "/pages/shipping": [
    {
      heading: "Rates",
      text: "We ship to all 50 US states and APO/FPO addresses.",
      list: [
        "Standard, 3–5 business days: free on orders over $75, $7 below that",
        "2-day: $18 on any order (not available to APO/FPO addresses)",
        "Digital gift cards: no shipping charge",
      ],
    },
    {
      heading: "Carriers and dispatch",
      text: "Standard orders travel by UPS Ground or USPS Ground Advantage. 2-day orders travel by UPS 2nd Day Air. Orders placed by 1 p.m. ET on a business day leave our warehouse the same day; later orders leave the next business day. Tracking goes to the email on your order.",
    },
    {
      heading: "Holiday cut-offs for 2026",
      text: "To arrive by December 24:",
      list: [
        "Standard shipping: order by 1 p.m. ET, Wednesday, December 16, 2026",
        "2-day shipping: order by 1 p.m. ET, Monday, December 21, 2026",
        "Digital gift cards: any time, including December 24 and 25",
        "Our warehouse is closed December 25 and January 1; orders placed then leave on the next business day",
      ],
    },
    {
      heading: "Gifts",
      text: "Digital gift cards go to the recipient email you enter on the gift card page, so they skip shipping altogether. Pieces bought as holiday gifts can be returned or exchanged until January 31, 2027.",
    },
    {
      heading: "Items being restocked",
      text: "When a piece in your order is being restocked, checkout saves your order and you aren't charged. Nothing ships until your items are back and you've confirmed the order.",
    },
    {
      heading: "Questions about a delivery",
      text: "Tell us your order email and what happened, and we'll trace it with the carrier.",
      link: contactLink,
    },
  ],
  "/pages/returns": [
    {
      heading: "Our return window",
      text: "Return any piece within 30 days of delivery. It should be unworn and unwashed, with its tags attached.",
    },
    {
      heading: "Free holiday returns through January",
      text: "Orders placed from November 1 to December 24, 2026 can be returned or exchanged free until January 31, 2027, whether you bought for yourself or as a gift.",
    },
    {
      heading: "How to return or exchange",
      list: [
        "Send us your order email, the pieces you're returning and whether you'd like a refund or an exchange, using our contact form.",
        "We reply within 2 business days with a prepaid return label.",
        "Pack the pieces with their tags and drop the parcel with the carrier on the label.",
      ],
      text: "Three steps:",
      link: contactLink,
    },
    {
      heading: "Refunds and costs",
      text: "Exchanges for a different size or color are always free. Outside the holiday window, the $7 return label is deducted from your refund. Refunds go back to the original payment method within 5 business days of the parcel reaching us.",
    },
    {
      heading: "Gift returns",
      text: "If you received a piece as a gift, you can return it without the buyer knowing. We refund its value as a digital gift card sent to you, not to the buyer. Gift cards themselves can't be returned or exchanged for cash.",
    },
  ],
  "/pages/contact": [
    {
      heading: "Send us a message",
      text: "Use the form below for orders, sizing, returns or anything else. We reply by email within 2 business days, Monday to Friday. For a return or exchange, include the email you ordered with.",
    },
  ],
  "/pages/accessibility": [
    {
      heading: "Our standard",
      text: "We design and test this website against the Web Content Accessibility Guidelines (WCAG) 2.1, level AA. We check pages with automated tools and by keyboard at phone and desktop sizes.",
    },
    {
      heading: "What the site supports",
      list: [
        "A skip-to-content link and full keyboard navigation with Tab and Enter",
        "Text labels on every color and size control, not just swatches",
        "Descriptive alternative text on product and editorial images",
        "Text that resizes to 200% without losing content",
        "Form errors announced to screen readers, with what you typed kept in place",
      ],
      text: "Features you can rely on:",
    },
    {
      heading: "Tell us about a barrier",
      text: "If any part of the site doesn't work for you, tell us the page and what happened. We reply within 2 business days and can take your order details by message while we fix it.",
      link: contactLink,
    },
  ],
  "/policies/privacy-policy": [
    {
      heading: "Who we are",
      text: "Moravel Athletic runs this website. For any privacy question or request, use our contact form.",
      link: contactLink,
    },
    {
      heading: "What we collect",
      list: [
        "Orders: your name, email, shipping address, the items, colors, sizes and quantities you choose, and any gift recipient's name and email.",
        "Restock emails: if you tick the box at checkout, your email, the items and the order they belong to, the exact wording you agreed to and when.",
        "Newsletter: the email you submit, the wording you agreed to and when.",
        "Contact messages: your name, email, topic and message.",
        "Your bag is kept in your own browser's storage, not on our servers, until you check out.",
      ],
      text: "We only collect what you type into our forms:",
    },
    {
      heading: "What we don't collect",
      text: "Checkout does not ask for or store card numbers. We don't use advertising cookies or sell your information.",
    },
    {
      heading: "Where it's stored",
      text: "The site is hosted on Vercel. Orders, list sign-ups and contact messages are stored in a Neon Postgres database used only by Moravel Athletic. When we email you, it's delivered through our email provider.",
    },
    {
      heading: "How long we keep it",
      list: [
        "Orders: 3 years, for customer service, returns and tax records.",
        "Contact messages: 2 years.",
        "List sign-ups: until you unsubscribe. After that we keep only your email and the unsubscribe date, so we never email you again by mistake.",
      ],
      text: "Retention:",
    },
    {
      heading: "Unsubscribing and deletion",
      text: "Every email has an unsubscribe link that removes you from all our lists at once. To see, correct or delete the information we hold about you, send a request through our contact form. We act on it within 30 days.",
      link: contactLink,
    },
  ],
  "/policies/terms-of-service": [
    {
      heading: "About these terms",
      text: "These terms apply when you use this website or place an order with Moravel Athletic. For questions, use our contact form.",
      link: contactLink,
    },
    {
      heading: "Prices and orders",
      text: "Prices are in US dollars and are set by our catalogue at checkout, not by what your browser sends. When a piece in your order is being restocked, checkout saves your order and you aren't charged. We only take payment once your items are back and you've confirmed the order.",
    },
    {
      heading: "Shipping, returns and exchanges",
      text: "Rates, delivery times and holiday cut-offs are on our Shipping page. You can return unworn pieces within 30 days of delivery, and holiday orders placed from November 1 to December 24, 2026 until January 31, 2027; see our Returns page.",
    },
    {
      heading: "Gift cards",
      text: "Gift cards come in $50 and $100 amounts, don't expire and can be used on any product on this site. They can't be exchanged for cash except where the law requires it.",
    },
    {
      heading: "Product information",
      text: "We describe fabric, fit and color as accurately as we can. Colors can look slightly different on different screens. If a piece isn't what you expected, you can return or exchange it.",
    },
    {
      heading: "Liability",
      text: "To the extent the law allows, our liability for any order is limited to the amount you paid for it. Nothing here limits your rights under consumer protection law.",
    },
    {
      heading: "Changes",
      text: "If we change these terms we'll update the effective date on this page. The terms in force when you place an order apply to that order.",
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
// No invented articles, bylines or publication dates. The journal index shows
// the fabric guides; articles appear below them once written and approved.
export const journalArticles: JournalArticle[] = [];

/** Consent wording stored verbatim in email_subscribers.consent_text. */
export const listConsent = {
  restock: "Email me when my items are back in stock",
  newsletter: storefront.newsletter.consent,
} as const;

/** Approved checkout restock messaging ("We're restocking" stays). */
export const restock = {
  title: "We’re restocking",
  message: "Some of the items in your order are being restocked.",
  optedIn: "We’ll email you as soon as they’re back.",
  notOptedIn: "Your order details are saved; you haven’t been charged.",
  chargeNotice: "You haven’t been charged.",
  optInPrompt: "Want to know when they’re back?",
  optInLink: "Get an email when your items are back",
  optInSubmit: "Email me when they’re back",
  optInSaved: "Done. We’ll email you as soon as they’re back.",
  submitLabel: "Save my order",
  pendingLabel: "Saving your order…",
  checkoutNotice:
    "Some of our pieces are being restocked. We’ll save your order now; you won’t be charged.",
};

/** Contact form copy and topics. */
export const contactForm = {
  topics: [
    "Order question",
    "Product or sizing question",
    "Returns or exchanges",
    "Something else",
  ],
  success: "Thanks — we've got your message. We reply within 2 business days.",
};
