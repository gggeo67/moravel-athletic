/** Approved product facts; shared by pages, cart, server checkout and structured data. */
export type Audience = "womens" | "mens" | "unisex";
export type ProductImage = { src: string; alt: string };
export type ProductColor = {
  name: string;
  hex: string;
  images: ProductImage[];
};
export type Product = {
  handle: string;
  name: string;
  audience: Audience;
  category: string;
  kind: "apparel" | "gift-card";
  collections: string[];
  fabricLine: string | null;
  summary: string;
  priceUsd: number;
  color: string;
  colors: ProductColor[];
  sizes: string[];
  status: "active" | "sold_out";
  images: ProductImage[];
  composition: string | null;
  weightGsm: number | null;
  fit: string | null;
  length: string | null;
  features: string[];
};

export const products: Product[] = [
  {
    handle: "womens-training-legging",
    name: "Women's Training Legging",
    audience: "womens",
    category: "leggings",
    kind: "apparel",
    collections: ["womens", "surge-knit"],
    fabricLine: "surge-knit",
    summary: "High-rise leggings with a wide waistband and a clean, close fit.",
    priceUsd: 98,
    color: "Black",
    colors: [
      {
        name: "Black",
        hex: "#111111",
        images: [
          {
            src: "/images/products/womens-training-legging/model-black-front.webp",
            alt: "Women's Training Legging in Black, front view on a model lunging in a sunlit gym",
          },
          {
            src: "/images/products/womens-training-legging/model-black-back.webp",
            alt: "Women's Training Legging in Black, back view on the same model",
          },
          {
            src: "/images/products/womens-training-legging/master-black-front.webp",
            alt: "Women's Training Legging in Black, ghost-mannequin front view on light grey",
          },
          {
            src: "/images/products/womens-training-legging/master-black-back.webp",
            alt: "Women's Training Legging in Black, ghost-mannequin back view on light grey",
          },
          {
            src: "/images/products/womens-training-legging/detail-black.webp",
            alt: "Women's Training Legging in Black, close-up of fabric and stitching",
          },
        ],
      },
      {
        name: "Slate",
        hex: "#4A4F57",
        images: [
          {
            src: "/images/products/womens-training-legging/master-slate-front.webp",
            alt: "Women's Training Legging in Slate, ghost-mannequin front view on light grey",
          },
          {
            src: "/images/products/womens-training-legging/master-slate-back.webp",
            alt: "Women's Training Legging in Slate, ghost-mannequin back view on light grey",
          },
        ],
      },
    ],
    sizes: ["XXS", "XS", "S", "M", "L", "XL", "XXL"],
    status: "active",
    images: [
      {
        src: "/images/products/womens-training-legging/model-black-front.webp",
        alt: "Women's Training Legging in Black, front view on a model lunging in a sunlit gym",
      },
      {
        src: "/images/products/womens-training-legging/model-black-back.webp",
        alt: "Women's Training Legging in Black, back view on the same model",
      },
      {
        src: "/images/products/womens-training-legging/master-black-front.webp",
        alt: "Women's Training Legging in Black, ghost-mannequin front view on light grey",
      },
      {
        src: "/images/products/womens-training-legging/master-black-back.webp",
        alt: "Women's Training Legging in Black, ghost-mannequin back view on light grey",
      },
      {
        src: "/images/products/womens-training-legging/detail-black.webp",
        alt: "Women's Training Legging in Black, close-up of fabric and stitching",
      },
    ],
    composition: "87% polyester / 13% elastane",
    weightGsm: null,
    fit: "Close fitting, high rise",
    length: "25-inch inseam",
    features: ["Wide waistband", "Clean rear waistband", "Four-way stretch"],
  },
  {
    handle: "womens-sports-bra",
    name: "Women's Sports Bra",
    audience: "womens",
    category: "sports bra",
    kind: "apparel",
    collections: ["womens", "surge-knit"],
    fabricLine: "surge-knit",
    summary:
      "A close-fitting sports bra with adjustable straps and removable cups.",
    priceUsd: 58,
    color: "Black",
    colors: [
      {
        name: "Black",
        hex: "#111111",
        images: [
          {
            src: "/images/products/womens-sports-bra/model-black-front.webp",
            alt: "Women's Sports Bra in Black, front view on a model holding dumbbells in a gym",
          },
          {
            src: "/images/products/womens-sports-bra/model-black-side.webp",
            alt: "Women's Sports Bra in Black, side view on the same model",
          },
          {
            src: "/images/products/womens-sports-bra/master-black-front.webp",
            alt: "Women's Sports Bra in Black, ghost-mannequin front view on light grey",
          },
          {
            src: "/images/products/womens-sports-bra/master-black-back.webp",
            alt: "Women's Sports Bra in Black, ghost-mannequin back view on light grey",
          },
          {
            src: "/images/products/womens-sports-bra/detail-black.webp",
            alt: "Women's Sports Bra in Black, close-up of fabric and stitching",
          },
        ],
      },
      {
        name: "Slate",
        hex: "#4A4F57",
        images: [
          {
            src: "/images/products/womens-sports-bra/master-slate-front.webp",
            alt: "Women's Sports Bra in Slate, ghost-mannequin front view on light grey",
          },
          {
            src: "/images/products/womens-sports-bra/master-slate-back.webp",
            alt: "Women's Sports Bra in Slate, ghost-mannequin back view on light grey",
          },
        ],
      },
    ],
    sizes: ["XXS", "XS", "S", "M", "L", "XL", "XXL"],
    status: "active",
    images: [
      {
        src: "/images/products/womens-sports-bra/model-black-front.webp",
        alt: "Women's Sports Bra in Black, front view on a model holding dumbbells in a gym",
      },
      {
        src: "/images/products/womens-sports-bra/model-black-side.webp",
        alt: "Women's Sports Bra in Black, side view on the same model",
      },
      {
        src: "/images/products/womens-sports-bra/master-black-front.webp",
        alt: "Women's Sports Bra in Black, ghost-mannequin front view on light grey",
      },
      {
        src: "/images/products/womens-sports-bra/master-black-back.webp",
        alt: "Women's Sports Bra in Black, ghost-mannequin back view on light grey",
      },
      {
        src: "/images/products/womens-sports-bra/detail-black.webp",
        alt: "Women's Sports Bra in Black, close-up of fabric and stitching",
      },
    ],
    composition: "87% polyester / 13% elastane",
    weightGsm: null,
    fit: "Close fitting",
    length: null,
    features: [
      "Adjustable straps",
      "Removable cups",
      "Self-lined construction",
    ],
  },
  {
    handle: "womens-bike-short",
    name: "Women's Bike Short",
    audience: "womens",
    category: "shorts",
    kind: "apparel",
    collections: ["womens", "surge-knit"],
    fabricLine: "surge-knit",
    summary: "High-waisted bike shorts with a smooth, seam-free front.",
    priceUsd: 68,
    color: "Black",
    colors: [
      {
        name: "Black",
        hex: "#111111",
        images: [
          {
            src: "/images/products/womens-bike-short/model-black-front.webp",
            alt: "Women's Bike Short in Black, front view on a model moving on a blue running track",
          },
          {
            src: "/images/products/womens-bike-short/model-black-back.webp",
            alt: "Women's Bike Short in Black, back view on the same model",
          },
          {
            src: "/images/products/womens-bike-short/master-black-front.webp",
            alt: "Women's Bike Short in Black, ghost-mannequin front view on light grey",
          },
          {
            src: "/images/products/womens-bike-short/master-black-back.webp",
            alt: "Women's Bike Short in Black, ghost-mannequin back view on light grey",
          },
          {
            src: "/images/products/womens-bike-short/detail-black.webp",
            alt: "Women's Bike Short in Black, close-up of fabric and stitching",
          },
        ],
      },
      {
        name: "Slate",
        hex: "#4A4F57",
        images: [
          {
            src: "/images/products/womens-bike-short/master-slate-front.webp",
            alt: "Women's Bike Short in Slate, ghost-mannequin front view on light grey",
          },
          {
            src: "/images/products/womens-bike-short/master-slate-back.webp",
            alt: "Women's Bike Short in Slate, ghost-mannequin back view on light grey",
          },
        ],
      },
    ],
    sizes: ["XXS", "XS", "S", "M", "L", "XL"],
    status: "active",
    images: [
      {
        src: "/images/products/womens-bike-short/model-black-front.webp",
        alt: "Women's Bike Short in Black, front view on a model moving on a blue running track",
      },
      {
        src: "/images/products/womens-bike-short/model-black-back.webp",
        alt: "Women's Bike Short in Black, back view on the same model",
      },
      {
        src: "/images/products/womens-bike-short/master-black-front.webp",
        alt: "Women's Bike Short in Black, ghost-mannequin front view on light grey",
      },
      {
        src: "/images/products/womens-bike-short/master-black-back.webp",
        alt: "Women's Bike Short in Black, ghost-mannequin back view on light grey",
      },
      {
        src: "/images/products/womens-bike-short/detail-black.webp",
        alt: "Women's Bike Short in Black, close-up of fabric and stitching",
      },
    ],
    composition: "87% polyester / 13% elastane",
    weightGsm: null,
    fit: "Fitted",
    length: "8-inch inseam",
    features: ["High waistband", "No front seam", "Four-way stretch"],
  },
  {
    handle: "womens-training-tee",
    name: "Women's Training Tee",
    audience: "womens",
    category: "tee",
    kind: "apparel",
    collections: ["womens", "tempo-jersey"],
    fabricLine: "tempo-jersey",
    summary: "A regular-fit raglan tee in softly brushed stretch jersey.",
    priceUsd: 48,
    color: "White",
    colors: [
      {
        name: "White",
        hex: "#F2F2F0",
        images: [
          {
            src: "/images/products/womens-training-tee/model-white-front.webp",
            alt: "Women's Training Tee in White, front view on a model jogging on a city training court",
          },
          {
            src: "/images/products/womens-training-tee/model-white-back.webp",
            alt: "Women's Training Tee in White, back view on the same model",
          },
          {
            src: "/images/products/womens-training-tee/master-white-front.webp",
            alt: "Women's Training Tee in White, ghost-mannequin front view on light grey",
          },
          {
            src: "/images/products/womens-training-tee/master-white-back.webp",
            alt: "Women's Training Tee in White, ghost-mannequin back view on light grey",
          },
          {
            src: "/images/products/womens-training-tee/detail-white.webp",
            alt: "Women's Training Tee in White, close-up of fabric and stitching",
          },
        ],
      },
      {
        name: "Signal Blue",
        hex: "#1F5BFF",
        images: [
          {
            src: "/images/products/womens-training-tee/master-signal-blue-front.webp",
            alt: "Women's Training Tee in Signal Blue, ghost-mannequin front view on light grey",
          },
          {
            src: "/images/products/womens-training-tee/master-signal-blue-back.webp",
            alt: "Women's Training Tee in Signal Blue, ghost-mannequin back view on light grey",
          },
        ],
      },
    ],
    sizes: ["XXS", "XS", "S", "M", "L", "XL", "XXL"],
    status: "active",
    images: [
      {
        src: "/images/products/womens-training-tee/model-white-front.webp",
        alt: "Women's Training Tee in White, front view on a model jogging on a city training court",
      },
      {
        src: "/images/products/womens-training-tee/model-white-back.webp",
        alt: "Women's Training Tee in White, back view on the same model",
      },
      {
        src: "/images/products/womens-training-tee/master-white-front.webp",
        alt: "Women's Training Tee in White, ghost-mannequin front view on light grey",
      },
      {
        src: "/images/products/womens-training-tee/master-white-back.webp",
        alt: "Women's Training Tee in White, ghost-mannequin back view on light grey",
      },
      {
        src: "/images/products/womens-training-tee/detail-white.webp",
        alt: "Women's Training Tee in White, close-up of fabric and stitching",
      },
    ],
    composition: "89% polyester / 11% elastane",
    weightGsm: null,
    fit: "Regular fit, hip length",
    length: null,
    features: ["Raglan sleeves", "Four-way stretch", "Moisture wicking"],
  },
  {
    handle: "womens-jogger",
    name: "Women's Jogger",
    audience: "womens",
    category: "joggers",
    kind: "apparel",
    collections: ["womens", "tempo-jersey"],
    fabricLine: "tempo-jersey",
    summary: "Softly brushed joggers with a relaxed leg and a cuffed ankle.",
    priceUsd: 98,
    color: "Black",
    colors: [
      {
        name: "Black",
        hex: "#111111",
        images: [
          {
            src: "/images/products/womens-jogger/model-black-front.webp",
            alt: "Women's Jogger in Black, front view on a model stepping onto a gym box",
          },
          {
            src: "/images/products/womens-jogger/model-black-back.webp",
            alt: "Women's Jogger in Black, back view on the same model",
          },
          {
            src: "/images/products/womens-jogger/master-black-front.webp",
            alt: "Women's Jogger in Black, ghost-mannequin front view on light grey",
          },
          {
            src: "/images/products/womens-jogger/master-black-back.webp",
            alt: "Women's Jogger in Black, ghost-mannequin back view on light grey",
          },
          {
            src: "/images/products/womens-jogger/detail-black.webp",
            alt: "Women's Jogger in Black, close-up of fabric and stitching",
          },
        ],
      },
      {
        name: "Slate",
        hex: "#4A4F57",
        images: [
          {
            src: "/images/products/womens-jogger/master-slate-front.webp",
            alt: "Women's Jogger in Slate, ghost-mannequin front view on light grey",
          },
          {
            src: "/images/products/womens-jogger/master-slate-back.webp",
            alt: "Women's Jogger in Slate, ghost-mannequin back view on light grey",
          },
        ],
      },
    ],
    sizes: ["XXS", "XS", "S", "M", "L", "XL", "XXL"],
    status: "active",
    images: [
      {
        src: "/images/products/womens-jogger/model-black-front.webp",
        alt: "Women's Jogger in Black, front view on a model stepping onto a gym box",
      },
      {
        src: "/images/products/womens-jogger/model-black-back.webp",
        alt: "Women's Jogger in Black, back view on the same model",
      },
      {
        src: "/images/products/womens-jogger/master-black-front.webp",
        alt: "Women's Jogger in Black, ghost-mannequin front view on light grey",
      },
      {
        src: "/images/products/womens-jogger/master-black-back.webp",
        alt: "Women's Jogger in Black, ghost-mannequin back view on light grey",
      },
      {
        src: "/images/products/womens-jogger/detail-black.webp",
        alt: "Women's Jogger in Black, close-up of fabric and stitching",
      },
    ],
    composition: "89% polyester / 11% elastane",
    weightGsm: null,
    fit: "Relaxed, tapered leg",
    length: "25-inch inseam",
    features: ["Drawcord waist", "Side pockets", "Cuffed ankles"],
  },
  {
    handle: "womens-zip-hoodie",
    name: "Women's Zip Hoodie",
    audience: "womens",
    category: "hoodie",
    kind: "apparel",
    collections: ["womens", "tempo-jersey"],
    fabricLine: "tempo-jersey",
    summary: "A slim full-zip layer in softly brushed stretch jersey.",
    priceUsd: 110,
    color: "Black",
    colors: [
      {
        name: "Black",
        hex: "#111111",
        images: [
          {
            src: "/images/products/womens-zip-hoodie/model-black-front.webp",
            alt: "Women's Zip Hoodie in Black, front view on a model walking along a concrete city walkway",
          },
          {
            src: "/images/products/womens-zip-hoodie/model-black-back.webp",
            alt: "Women's Zip Hoodie in Black, back view on the same model",
          },
          {
            src: "/images/products/womens-zip-hoodie/master-black-front.webp",
            alt: "Women's Zip Hoodie in Black, ghost-mannequin front view on light grey",
          },
          {
            src: "/images/products/womens-zip-hoodie/master-black-back.webp",
            alt: "Women's Zip Hoodie in Black, ghost-mannequin back view on light grey",
          },
          {
            src: "/images/products/womens-zip-hoodie/detail-black.webp",
            alt: "Women's Zip Hoodie in Black, close-up of fabric and stitching",
          },
        ],
      },
      {
        name: "Slate",
        hex: "#4A4F57",
        images: [
          {
            src: "/images/products/womens-zip-hoodie/master-slate-front.webp",
            alt: "Women's Zip Hoodie in Slate, ghost-mannequin front view on light grey",
          },
          {
            src: "/images/products/womens-zip-hoodie/master-slate-back.webp",
            alt: "Women's Zip Hoodie in Slate, ghost-mannequin back view on light grey",
          },
        ],
      },
    ],
    sizes: ["XXS", "XS", "S", "M", "L", "XL", "XXL"],
    status: "active",
    images: [
      {
        src: "/images/products/womens-zip-hoodie/model-black-front.webp",
        alt: "Women's Zip Hoodie in Black, front view on a model walking along a concrete city walkway",
      },
      {
        src: "/images/products/womens-zip-hoodie/model-black-back.webp",
        alt: "Women's Zip Hoodie in Black, back view on the same model",
      },
      {
        src: "/images/products/womens-zip-hoodie/master-black-front.webp",
        alt: "Women's Zip Hoodie in Black, ghost-mannequin front view on light grey",
      },
      {
        src: "/images/products/womens-zip-hoodie/master-black-back.webp",
        alt: "Women's Zip Hoodie in Black, ghost-mannequin back view on light grey",
      },
      {
        src: "/images/products/womens-zip-hoodie/detail-black.webp",
        alt: "Women's Zip Hoodie in Black, close-up of fabric and stitching",
      },
    ],
    composition: "89% polyester / 11% elastane",
    weightGsm: null,
    fit: "Slim fit, hip length",
    length: null,
    features: ["Full zip", "Side pockets", "Cord-free hood"],
  },
  {
    handle: "mens-training-tee",
    name: "Men's Training Tee",
    audience: "mens",
    category: "tee",
    kind: "apparel",
    collections: ["mens", "tempo-jersey"],
    fabricLine: "tempo-jersey",
    summary:
      "A brushed jersey tee with a slim athletic fit and four-way stretch.",
    priceUsd: 58,
    color: "White",
    colors: [
      {
        name: "White",
        hex: "#F2F2F0",
        images: [
          {
            src: "/images/products/mens-training-tee/model-white-front.webp",
            alt: "Men's Training Tee in White, front view on a model carrying dumbbells in a gym",
          },
          {
            src: "/images/products/mens-training-tee/model-white-back.webp",
            alt: "Men's Training Tee in White, back view on the same model",
          },
          {
            src: "/images/products/mens-training-tee/master-white-front.webp",
            alt: "Men's Training Tee in White, ghost-mannequin front view on light grey",
          },
          {
            src: "/images/products/mens-training-tee/master-white-back.webp",
            alt: "Men's Training Tee in White, ghost-mannequin back view on light grey",
          },
          {
            src: "/images/products/mens-training-tee/detail-white.webp",
            alt: "Men's Training Tee in White, close-up of fabric and stitching",
          },
        ],
      },
      {
        name: "Black",
        hex: "#111111",
        images: [
          {
            src: "/images/products/mens-training-tee/master-black-front.webp",
            alt: "Men's Training Tee in Black, ghost-mannequin front view on light grey",
          },
          {
            src: "/images/products/mens-training-tee/master-black-back.webp",
            alt: "Men's Training Tee in Black, ghost-mannequin back view on light grey",
          },
        ],
      },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    status: "active",
    images: [
      {
        src: "/images/products/mens-training-tee/model-white-front.webp",
        alt: "Men's Training Tee in White, front view on a model carrying dumbbells in a gym",
      },
      {
        src: "/images/products/mens-training-tee/model-white-back.webp",
        alt: "Men's Training Tee in White, back view on the same model",
      },
      {
        src: "/images/products/mens-training-tee/master-white-front.webp",
        alt: "Men's Training Tee in White, ghost-mannequin front view on light grey",
      },
      {
        src: "/images/products/mens-training-tee/master-white-back.webp",
        alt: "Men's Training Tee in White, ghost-mannequin back view on light grey",
      },
      {
        src: "/images/products/mens-training-tee/detail-white.webp",
        alt: "Men's Training Tee in White, close-up of fabric and stitching",
      },
    ],
    composition: "89% polyester / 11% elastane",
    weightGsm: null,
    fit: "Slim athletic fit",
    length: null,
    features: ["Brushed jersey", "Four-way stretch", "Moisture wicking"],
  },
  {
    handle: "mens-training-short",
    name: "Men's Training Short",
    audience: "mens",
    category: "shorts",
    kind: "apparel",
    collections: ["mens", "stride-woven"],
    fabricLine: "stride-woven",
    summary: "Light woven shorts with a slim fit and zip side pockets.",
    priceUsd: 78,
    color: "Black",
    colors: [
      {
        name: "Black",
        hex: "#111111",
        images: [
          {
            src: "/images/products/mens-training-short/model-black-front.webp",
            alt: "Men's Training Short in Black, front view on a model running on a blue track",
          },
          {
            src: "/images/products/mens-training-short/model-black-back.webp",
            alt: "Men's Training Short in Black, back view on the same model",
          },
          {
            src: "/images/products/mens-training-short/master-black-front.webp",
            alt: "Men's Training Short in Black, ghost-mannequin front view on light grey",
          },
          {
            src: "/images/products/mens-training-short/master-black-back.webp",
            alt: "Men's Training Short in Black, ghost-mannequin back view on light grey",
          },
          {
            src: "/images/products/mens-training-short/detail-black.webp",
            alt: "Men's Training Short in Black, close-up of fabric and stitching",
          },
        ],
      },
      {
        name: "Signal Blue",
        hex: "#1F5BFF",
        images: [
          {
            src: "/images/products/mens-training-short/master-signal-blue-front.webp",
            alt: "Men's Training Short in Signal Blue, ghost-mannequin front view on light grey",
          },
          {
            src: "/images/products/mens-training-short/master-signal-blue-back.webp",
            alt: "Men's Training Short in Signal Blue, ghost-mannequin back view on light grey",
          },
        ],
      },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    status: "active",
    images: [
      {
        src: "/images/products/mens-training-short/model-black-front.webp",
        alt: "Men's Training Short in Black, front view on a model running on a blue track",
      },
      {
        src: "/images/products/mens-training-short/model-black-back.webp",
        alt: "Men's Training Short in Black, back view on the same model",
      },
      {
        src: "/images/products/mens-training-short/master-black-front.webp",
        alt: "Men's Training Short in Black, ghost-mannequin front view on light grey",
      },
      {
        src: "/images/products/mens-training-short/master-black-back.webp",
        alt: "Men's Training Short in Black, ghost-mannequin back view on light grey",
      },
      {
        src: "/images/products/mens-training-short/detail-black.webp",
        alt: "Men's Training Short in Black, close-up of fabric and stitching",
      },
    ],
    composition: "86% polyester / 14% elastane",
    weightGsm: 137,
    fit: "Slim fit, unlined",
    length: "7-inch inseam",
    features: ["Drawcord waist", "Zip side pockets", "Four-way stretch"],
  },
  {
    handle: "mens-jogger",
    name: "Men's Jogger",
    audience: "mens",
    category: "joggers",
    kind: "apparel",
    collections: ["mens", "tempo-jersey"],
    fabricLine: "tempo-jersey",
    summary:
      "Slim, tapered joggers with zip pockets and an adjustable drawcord.",
    priceUsd: 98,
    color: "Black",
    colors: [
      {
        name: "Black",
        hex: "#111111",
        images: [
          {
            src: "/images/products/mens-jogger/model-black-front.webp",
            alt: "Men's Jogger in Black, front view on a model running through a concrete city plaza",
          },
          {
            src: "/images/products/mens-jogger/model-black-back.webp",
            alt: "Men's Jogger in Black, back view on the same model",
          },
          {
            src: "/images/products/mens-jogger/master-black-front.webp",
            alt: "Men's Jogger in Black, ghost-mannequin front view on light grey",
          },
          {
            src: "/images/products/mens-jogger/master-black-back.webp",
            alt: "Men's Jogger in Black, ghost-mannequin back view on light grey",
          },
          {
            src: "/images/products/mens-jogger/detail-black.webp",
            alt: "Men's Jogger in Black, close-up of fabric and stitching",
          },
        ],
      },
      {
        name: "Slate",
        hex: "#4A4F57",
        images: [
          {
            src: "/images/products/mens-jogger/master-slate-front.webp",
            alt: "Men's Jogger in Slate, ghost-mannequin front view on light grey",
          },
          {
            src: "/images/products/mens-jogger/master-slate-back.webp",
            alt: "Men's Jogger in Slate, ghost-mannequin back view on light grey",
          },
        ],
      },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    status: "active",
    images: [
      {
        src: "/images/products/mens-jogger/model-black-front.webp",
        alt: "Men's Jogger in Black, front view on a model running through a concrete city plaza",
      },
      {
        src: "/images/products/mens-jogger/model-black-back.webp",
        alt: "Men's Jogger in Black, back view on the same model",
      },
      {
        src: "/images/products/mens-jogger/master-black-front.webp",
        alt: "Men's Jogger in Black, ghost-mannequin front view on light grey",
      },
      {
        src: "/images/products/mens-jogger/master-black-back.webp",
        alt: "Men's Jogger in Black, ghost-mannequin back view on light grey",
      },
      {
        src: "/images/products/mens-jogger/detail-black.webp",
        alt: "Men's Jogger in Black, close-up of fabric and stitching",
      },
    ],
    composition: "89% polyester / 11% elastane",
    weightGsm: null,
    fit: "Slim, tapered fit",
    length: "28-inch inseam",
    features: ["Drawcord", "Zip pockets", "Elastic waistband"],
  },
  {
    handle: "mens-quarter-zip",
    name: "Men's Quarter-Zip",
    audience: "mens",
    category: "quarter-zip",
    kind: "apparel",
    collections: ["mens", "tempo-jersey"],
    fabricLine: "tempo-jersey",
    summary: "A mock-neck quarter-zip in softly brushed stretch jersey.",
    priceUsd: 128,
    color: "Black",
    colors: [
      {
        name: "Black",
        hex: "#111111",
        images: [
          {
            src: "/images/products/mens-quarter-zip/model-black-front.webp",
            alt: "Men's Quarter-Zip in Black, front view on a model jogging beside city steps",
          },
          {
            src: "/images/products/mens-quarter-zip/model-black-back.webp",
            alt: "Men's Quarter-Zip in Black, back view on the same model",
          },
          {
            src: "/images/products/mens-quarter-zip/master-black-front.webp",
            alt: "Men's Quarter-Zip in Black, ghost-mannequin front view on light grey",
          },
          {
            src: "/images/products/mens-quarter-zip/master-black-back.webp",
            alt: "Men's Quarter-Zip in Black, ghost-mannequin back view on light grey",
          },
          {
            src: "/images/products/mens-quarter-zip/detail-black.webp",
            alt: "Men's Quarter-Zip in Black, close-up of fabric and stitching",
          },
        ],
      },
      {
        name: "Signal Blue",
        hex: "#1F5BFF",
        images: [
          {
            src: "/images/products/mens-quarter-zip/master-signal-blue-front.webp",
            alt: "Men's Quarter-Zip in Signal Blue, ghost-mannequin front view on light grey",
          },
          {
            src: "/images/products/mens-quarter-zip/master-signal-blue-back.webp",
            alt: "Men's Quarter-Zip in Signal Blue, ghost-mannequin back view on light grey",
          },
        ],
      },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    status: "active",
    images: [
      {
        src: "/images/products/mens-quarter-zip/model-black-front.webp",
        alt: "Men's Quarter-Zip in Black, front view on a model jogging beside city steps",
      },
      {
        src: "/images/products/mens-quarter-zip/model-black-back.webp",
        alt: "Men's Quarter-Zip in Black, back view on the same model",
      },
      {
        src: "/images/products/mens-quarter-zip/master-black-front.webp",
        alt: "Men's Quarter-Zip in Black, ghost-mannequin front view on light grey",
      },
      {
        src: "/images/products/mens-quarter-zip/master-black-back.webp",
        alt: "Men's Quarter-Zip in Black, ghost-mannequin back view on light grey",
      },
      {
        src: "/images/products/mens-quarter-zip/detail-black.webp",
        alt: "Men's Quarter-Zip in Black, close-up of fabric and stitching",
      },
    ],
    composition: "89% polyester / 11% elastane",
    weightGsm: null,
    fit: "Regular fit",
    length: null,
    features: ["Quarter-zip closure", "Mock neck", "Four-way stretch"],
  },
  {
    handle: "mens-hoodie",
    name: "Men's Hoodie",
    audience: "mens",
    category: "hoodie",
    kind: "apparel",
    collections: ["mens", "tempo-jersey"],
    fabricLine: "tempo-jersey",
    summary:
      "An oversized pullover with ribbed cuffs, a ribbed hem and on-seam pockets.",
    priceUsd: 118,
    color: "Slate",
    colors: [
      {
        name: "Slate",
        hex: "#4A4F57",
        images: [
          {
            src: "/images/products/mens-hoodie/model-slate-front.webp",
            alt: "Men's Hoodie in Slate, front view on a model walking outside a gym",
          },
          {
            src: "/images/products/mens-hoodie/model-slate-back.webp",
            alt: "Men's Hoodie in Slate, back view on the same model",
          },
          {
            src: "/images/products/mens-hoodie/master-slate-front.webp",
            alt: "Men's Hoodie in Slate, ghost-mannequin front view on light grey",
          },
          {
            src: "/images/products/mens-hoodie/master-slate-back.webp",
            alt: "Men's Hoodie in Slate, ghost-mannequin back view on light grey",
          },
          {
            src: "/images/products/mens-hoodie/detail-slate.webp",
            alt: "Men's Hoodie in Slate, close-up of fabric and stitching",
          },
        ],
      },
      {
        name: "Black",
        hex: "#111111",
        images: [
          {
            src: "/images/products/mens-hoodie/master-black-front.webp",
            alt: "Men's Hoodie in Black, ghost-mannequin front view on light grey",
          },
          {
            src: "/images/products/mens-hoodie/master-black-back.webp",
            alt: "Men's Hoodie in Black, ghost-mannequin back view on light grey",
          },
        ],
      },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    status: "active",
    images: [
      {
        src: "/images/products/mens-hoodie/model-slate-front.webp",
        alt: "Men's Hoodie in Slate, front view on a model walking outside a gym",
      },
      {
        src: "/images/products/mens-hoodie/model-slate-back.webp",
        alt: "Men's Hoodie in Slate, back view on the same model",
      },
      {
        src: "/images/products/mens-hoodie/master-slate-front.webp",
        alt: "Men's Hoodie in Slate, ghost-mannequin front view on light grey",
      },
      {
        src: "/images/products/mens-hoodie/master-slate-back.webp",
        alt: "Men's Hoodie in Slate, ghost-mannequin back view on light grey",
      },
      {
        src: "/images/products/mens-hoodie/detail-slate.webp",
        alt: "Men's Hoodie in Slate, close-up of fabric and stitching",
      },
    ],
    composition: "89% polyester / 11% elastane",
    weightGsm: null,
    fit: "Oversized, hip length",
    length: null,
    features: ["On-seam pockets", "Rib cuffs", "Rib hem"],
  },
  {
    handle: "gift-card",
    name: "Moravel Athletic Gift Card",
    audience: "unisex",
    category: "gift card",
    kind: "gift-card",
    collections: [],
    fabricLine: null,
    summary: "Let them choose. Select a $50 or $100 gift card.",
    priceUsd: 50,
    color: "Black",
    colors: [
      {
        name: "Black",
        hex: "#111111",
        images: [
          {
            src: "/images/products/gift-card/artwork.webp",
            alt: "Matte black Moravel Athletic gift card with silver lettering",
          },
        ],
      },
    ],
    sizes: ["50", "100"],
    status: "active",
    images: [
      {
        src: "/images/products/gift-card/artwork.webp",
        alt: "Matte black Moravel Athletic gift card with silver lettering",
      },
    ],
    composition: null,
    weightGsm: null,
    fit: null,
    length: null,
    features: ["Choice of $50 or $100", "Recipient name", "Recipient email"],
  },
];

export function allProducts(): Product[] {
  return products;
}
export function getProduct(handle: string): Product | undefined {
  return products.find((p) => p.handle === handle);
}
export function productsIn(handle: string): Product[] {
  return products.filter((p) => p.collections.includes(handle));
}
export function priceFor(product: Product, size: string): number {
  return product.kind === "gift-card" && product.sizes.includes(size)
    ? Number(size)
    : product.priceUsd;
}
