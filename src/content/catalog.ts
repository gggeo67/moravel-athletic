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
    collections: ["womens", "line-two"],
    fabricLine: "line-two",
    summary: "High-rise leggings with a wide waistband and a clean, close fit.",
    priceUsd: 98,
    color: "Black",
    colors: [
      {
        name: "Black",
        hex: "#303330",
        images: [
          {
            src: "/images/products/womens-training-legging/model-black-front.webp",
            alt: "Women's Training Legging in Black, model front view",
          },
          {
            src: "/images/products/womens-training-legging/model-black-back.webp",
            alt: "Women's Training Legging in Black, model back view",
          },
          {
            src: "/images/products/womens-training-legging/master-black-front.webp",
            alt: "Women's Training Legging in Black, front garment view",
          },
          {
            src: "/images/products/womens-training-legging/master-black-back.webp",
            alt: "Women's Training Legging in Black, back garment view",
          },
          {
            src: "/images/products/womens-training-legging/detail-black.webp",
            alt: "Women's Training Legging fabric and construction detail",
          },
        ],
      },
      {
        name: "Olive",
        hex: "#717763",
        images: [
          {
            src: "/images/products/womens-training-legging/master-olive-front.webp",
            alt: "Women's Training Legging in Olive, front garment view",
          },
          {
            src: "/images/products/womens-training-legging/master-olive-back-v2.webp",
            alt: "Women's Training Legging in Olive, back garment view",
          },
        ],
      },
    ],
    sizes: ["XXS", "XS", "S", "M", "L", "XL", "XXL"],
    status: "active",
    images: [
      {
        src: "/images/products/womens-training-legging/model-black-front.webp",
        alt: "Women's Training Legging in Black, model front view",
      },
      {
        src: "/images/products/womens-training-legging/model-black-back.webp",
        alt: "Women's Training Legging in Black, model back view",
      },
      {
        src: "/images/products/womens-training-legging/master-black-front.webp",
        alt: "Women's Training Legging in Black, front garment view",
      },
      {
        src: "/images/products/womens-training-legging/master-black-back.webp",
        alt: "Women's Training Legging in Black, back garment view",
      },
      {
        src: "/images/products/womens-training-legging/detail-black.webp",
        alt: "Women's Training Legging fabric and construction detail",
      },
    ],
    composition: "87% polyester / 13% elastane",
    weightGsm: null,
    fit: "Close fitting, high rise",
    length: "25-inch inseam",
    features: ["Wide waistband", "Rear storage pocket", "Four-way stretch"],
  },
  {
    handle: "womens-sports-bra",
    name: "Women's Sports Bra",
    audience: "womens",
    category: "sports bra",
    kind: "apparel",
    collections: ["womens", "line-two"],
    fabricLine: "line-two",
    summary:
      "A close-fitting sports bra with adjustable straps and removable cups.",
    priceUsd: 58,
    color: "Black",
    colors: [
      {
        name: "Black",
        hex: "#303330",
        images: [
          {
            src: "/images/products/womens-sports-bra/model-black-front.webp",
            alt: "Women's Sports Bra in Black, model front view",
          },
          {
            src: "/images/products/womens-sports-bra/model-black-side.webp",
            alt: "Women's Sports Bra in Black, model side view",
          },
          {
            src: "/images/products/womens-sports-bra/master-black-front.webp",
            alt: "Women's Sports Bra in Black, front garment view",
          },
          {
            src: "/images/products/womens-sports-bra/master-black-back.webp",
            alt: "Women's Sports Bra in Black, back garment view",
          },
          {
            src: "/images/products/womens-sports-bra/detail-black.webp",
            alt: "Women's Sports Bra fabric and construction detail",
          },
        ],
      },
      {
        name: "Olive",
        hex: "#717763",
        images: [
          {
            src: "/images/products/womens-sports-bra/master-olive-front.webp",
            alt: "Women's Sports Bra in Olive, front garment view",
          },
          {
            src: "/images/products/womens-sports-bra/master-olive-back.webp",
            alt: "Women's Sports Bra in Olive, back garment view",
          },
        ],
      },
    ],
    sizes: ["XXS", "XS", "S", "M", "L", "XL", "XXL"],
    status: "active",
    images: [
      {
        src: "/images/products/womens-sports-bra/model-black-front.webp",
        alt: "Women's Sports Bra in Black, model front view",
      },
      {
        src: "/images/products/womens-sports-bra/model-black-side.webp",
        alt: "Women's Sports Bra in Black, model side view",
      },
      {
        src: "/images/products/womens-sports-bra/master-black-front.webp",
        alt: "Women's Sports Bra in Black, front garment view",
      },
      {
        src: "/images/products/womens-sports-bra/master-black-back.webp",
        alt: "Women's Sports Bra in Black, back garment view",
      },
      {
        src: "/images/products/womens-sports-bra/detail-black.webp",
        alt: "Women's Sports Bra fabric and construction detail",
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
    collections: ["womens", "line-two"],
    fabricLine: "line-two",
    summary: "High-waisted bike shorts with a smooth, seam-free front.",
    priceUsd: 68,
    color: "Black",
    colors: [
      {
        name: "Black",
        hex: "#303330",
        images: [
          {
            src: "/images/products/womens-bike-short/model-black-front.webp",
            alt: "Women's Bike Short in Black, model front view",
          },
          {
            src: "/images/products/womens-bike-short/model-black-back.webp",
            alt: "Women's Bike Short in Black, model back view",
          },
          {
            src: "/images/products/womens-bike-short/master-black-front.webp",
            alt: "Women's Bike Short in Black, front garment view",
          },
          {
            src: "/images/products/womens-bike-short/master-black-back.webp",
            alt: "Women's Bike Short in Black, back garment view",
          },
          {
            src: "/images/products/womens-bike-short/detail-black.webp",
            alt: "Women's Bike Short fabric and construction detail",
          },
        ],
      },
      {
        name: "Olive",
        hex: "#717763",
        images: [
          {
            src: "/images/products/womens-bike-short/master-olive-front.webp",
            alt: "Women's Bike Short in Olive, front garment view",
          },
          {
            src: "/images/products/womens-bike-short/master-olive-back.webp",
            alt: "Women's Bike Short in Olive, back garment view",
          },
        ],
      },
    ],
    sizes: ["XXS", "XS", "S", "M", "L", "XL"],
    status: "active",
    images: [
      {
        src: "/images/products/womens-bike-short/model-black-front.webp",
        alt: "Women's Bike Short in Black, model front view",
      },
      {
        src: "/images/products/womens-bike-short/model-black-back.webp",
        alt: "Women's Bike Short in Black, model back view",
      },
      {
        src: "/images/products/womens-bike-short/master-black-front.webp",
        alt: "Women's Bike Short in Black, front garment view",
      },
      {
        src: "/images/products/womens-bike-short/master-black-back.webp",
        alt: "Women's Bike Short in Black, back garment view",
      },
      {
        src: "/images/products/womens-bike-short/detail-black.webp",
        alt: "Women's Bike Short fabric and construction detail",
      },
    ],
    composition: "87% polyester / 13% elastane",
    weightGsm: null,
    fit: "Fitted",
    length: "5-inch inseam",
    features: ["High waistband", "No front seam", "Four-way stretch"],
  },
  {
    handle: "womens-training-tee",
    name: "Women's Training Tee",
    audience: "womens",
    category: "tee",
    kind: "apparel",
    collections: ["womens", "line-one"],
    fabricLine: "line-one",
    summary: "A fitted raglan tee in softly brushed stretch jersey.",
    priceUsd: 48,
    color: "White",
    colors: [
      {
        name: "White",
        hex: "#E9E5DD",
        images: [
          {
            src: "/images/products/womens-training-tee/model-white-front.webp",
            alt: "Women's Training Tee in White, model front view",
          },
          {
            src: "/images/products/womens-training-tee/model-white-back.webp",
            alt: "Women's Training Tee in White, model back view",
          },
          {
            src: "/images/products/womens-training-tee/master-white-front.webp",
            alt: "Women's Training Tee in White, front garment view",
          },
          {
            src: "/images/products/womens-training-tee/master-white-back.webp",
            alt: "Women's Training Tee in White, back garment view",
          },
          {
            src: "/images/products/womens-training-tee/detail-white.webp",
            alt: "Women's Training Tee fabric and construction detail",
          },
        ],
      },
      {
        name: "Taupe",
        hex: "#9B8679",
        images: [
          {
            src: "/images/products/womens-training-tee/master-taupe-front.webp",
            alt: "Women's Training Tee in Taupe, front garment view",
          },
          {
            src: "/images/products/womens-training-tee/master-taupe-back.webp",
            alt: "Women's Training Tee in Taupe, back garment view",
          },
        ],
      },
    ],
    sizes: ["XXS", "XS", "S", "M", "L", "XL", "XXL"],
    status: "active",
    images: [
      {
        src: "/images/products/womens-training-tee/model-white-front.webp",
        alt: "Women's Training Tee in White, model front view",
      },
      {
        src: "/images/products/womens-training-tee/model-white-back.webp",
        alt: "Women's Training Tee in White, model back view",
      },
      {
        src: "/images/products/womens-training-tee/master-white-front.webp",
        alt: "Women's Training Tee in White, front garment view",
      },
      {
        src: "/images/products/womens-training-tee/master-white-back.webp",
        alt: "Women's Training Tee in White, back garment view",
      },
      {
        src: "/images/products/womens-training-tee/detail-white.webp",
        alt: "Women's Training Tee fabric and construction detail",
      },
    ],
    composition: "89% polyester / 11% elastane",
    weightGsm: null,
    fit: "Fitted, high hip",
    length: null,
    features: ["Raglan sleeves", "Four-way stretch", "Moisture wicking"],
  },
  {
    handle: "womens-jogger",
    name: "Women's Jogger",
    audience: "womens",
    category: "joggers",
    kind: "apparel",
    collections: ["womens", "line-one"],
    fabricLine: "line-one",
    summary: "Softly brushed joggers with a relaxed leg and a cuffed ankle.",
    priceUsd: 98,
    color: "Black",
    colors: [
      {
        name: "Black",
        hex: "#303330",
        images: [
          {
            src: "/images/products/womens-jogger/model-black-front.webp",
            alt: "Women's Jogger in Black, model front view",
          },
          {
            src: "/images/products/womens-jogger/model-black-back.webp",
            alt: "Women's Jogger in Black, model back view",
          },
          {
            src: "/images/products/womens-jogger/master-black-front.webp",
            alt: "Women's Jogger in Black, front garment view",
          },
          {
            src: "/images/products/womens-jogger/master-black-back.webp",
            alt: "Women's Jogger in Black, back garment view",
          },
          {
            src: "/images/products/womens-jogger/detail-black.webp",
            alt: "Women's Jogger fabric and construction detail",
          },
        ],
      },
      {
        name: "Taupe",
        hex: "#9B8679",
        images: [
          {
            src: "/images/products/womens-jogger/master-taupe-front.webp",
            alt: "Women's Jogger in Taupe, front garment view",
          },
          {
            src: "/images/products/womens-jogger/master-taupe-back.webp",
            alt: "Women's Jogger in Taupe, back garment view",
          },
        ],
      },
    ],
    sizes: ["XXS", "XS", "S", "M", "L", "XL", "XXL"],
    status: "active",
    images: [
      {
        src: "/images/products/womens-jogger/model-black-front.webp",
        alt: "Women's Jogger in Black, model front view",
      },
      {
        src: "/images/products/womens-jogger/model-black-back.webp",
        alt: "Women's Jogger in Black, model back view",
      },
      {
        src: "/images/products/womens-jogger/master-black-front.webp",
        alt: "Women's Jogger in Black, front garment view",
      },
      {
        src: "/images/products/womens-jogger/master-black-back.webp",
        alt: "Women's Jogger in Black, back garment view",
      },
      {
        src: "/images/products/womens-jogger/detail-black.webp",
        alt: "Women's Jogger fabric and construction detail",
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
    collections: ["womens", "line-one"],
    fabricLine: "line-one",
    summary: "An easy full-zip layer in softly brushed stretch jersey.",
    priceUsd: 110,
    color: "White",
    colors: [
      {
        name: "White",
        hex: "#E9E5DD",
        images: [
          {
            src: "/images/products/womens-zip-hoodie/model-white-front.webp",
            alt: "Women's Zip Hoodie in White, model front view",
          },
          {
            src: "/images/products/womens-zip-hoodie/model-white-back.webp",
            alt: "Women's Zip Hoodie in White, model back view",
          },
          {
            src: "/images/products/womens-zip-hoodie/master-white-front.webp",
            alt: "Women's Zip Hoodie in White, front garment view",
          },
          {
            src: "/images/products/womens-zip-hoodie/master-white-back.webp",
            alt: "Women's Zip Hoodie in White, back garment view",
          },
          {
            src: "/images/products/womens-zip-hoodie/detail-white.webp",
            alt: "Women's Zip Hoodie fabric and construction detail",
          },
        ],
      },
      {
        name: "Taupe",
        hex: "#9B8679",
        images: [
          {
            src: "/images/products/womens-zip-hoodie/master-taupe-front.webp",
            alt: "Women's Zip Hoodie in Taupe, front garment view",
          },
          {
            src: "/images/products/womens-zip-hoodie/master-taupe-back.webp",
            alt: "Women's Zip Hoodie in Taupe, back garment view",
          },
        ],
      },
    ],
    sizes: ["XXS", "XS", "S", "M", "L", "XL", "XXL"],
    status: "active",
    images: [
      {
        src: "/images/products/womens-zip-hoodie/model-white-front.webp",
        alt: "Women's Zip Hoodie in White, model front view",
      },
      {
        src: "/images/products/womens-zip-hoodie/model-white-back.webp",
        alt: "Women's Zip Hoodie in White, model back view",
      },
      {
        src: "/images/products/womens-zip-hoodie/master-white-front.webp",
        alt: "Women's Zip Hoodie in White, front garment view",
      },
      {
        src: "/images/products/womens-zip-hoodie/master-white-back.webp",
        alt: "Women's Zip Hoodie in White, back garment view",
      },
      {
        src: "/images/products/womens-zip-hoodie/detail-white.webp",
        alt: "Women's Zip Hoodie fabric and construction detail",
      },
    ],
    composition: "89% polyester / 11% elastane",
    weightGsm: null,
    fit: "Easy fit, low hip",
    length: null,
    features: ["Full zip", "Side pockets", "Hanging loop"],
  },
  {
    handle: "mens-training-tee",
    name: "Men's Training Tee",
    audience: "mens",
    category: "tee",
    kind: "apparel",
    collections: ["mens", "line-one"],
    fabricLine: "line-one",
    summary: "A brushed jersey tee with an athletic fit and four-way stretch.",
    priceUsd: 58,
    color: "White",
    colors: [
      {
        name: "White",
        hex: "#E9E5DD",
        images: [
          {
            src: "/images/products/mens-training-tee/model-white-front.webp",
            alt: "Men's Training Tee in White, model front view",
          },
          {
            src: "/images/products/mens-training-tee/model-white-back.webp",
            alt: "Men's Training Tee in White, model back view",
          },
          {
            src: "/images/products/mens-training-tee/master-white-front.webp",
            alt: "Men's Training Tee in White, front garment view",
          },
          {
            src: "/images/products/mens-training-tee/master-white-back.webp",
            alt: "Men's Training Tee in White, back garment view",
          },
          {
            src: "/images/products/mens-training-tee/detail-white.webp",
            alt: "Men's Training Tee fabric and construction detail",
          },
        ],
      },
      {
        name: "Black",
        hex: "#303330",
        images: [
          {
            src: "/images/products/mens-training-tee/master-black-front.webp",
            alt: "Men's Training Tee in Black, front garment view",
          },
          {
            src: "/images/products/mens-training-tee/master-black-back.webp",
            alt: "Men's Training Tee in Black, back garment view",
          },
        ],
      },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    status: "active",
    images: [
      {
        src: "/images/products/mens-training-tee/model-white-front.webp",
        alt: "Men's Training Tee in White, model front view",
      },
      {
        src: "/images/products/mens-training-tee/model-white-back.webp",
        alt: "Men's Training Tee in White, model back view",
      },
      {
        src: "/images/products/mens-training-tee/master-white-front.webp",
        alt: "Men's Training Tee in White, front garment view",
      },
      {
        src: "/images/products/mens-training-tee/master-white-back.webp",
        alt: "Men's Training Tee in White, back garment view",
      },
      {
        src: "/images/products/mens-training-tee/detail-white.webp",
        alt: "Men's Training Tee fabric and construction detail",
      },
    ],
    composition: "89% polyester / 11% elastane",
    weightGsm: null,
    fit: "Athletic fit",
    length: null,
    features: ["Brushed jersey", "Four-way stretch", "Moisture wicking"],
  },
  {
    handle: "mens-training-short",
    name: "Men's Training Short",
    audience: "mens",
    category: "shorts",
    kind: "apparel",
    collections: ["mens", "line-three"],
    fabricLine: "line-three",
    summary: "Light woven shorts with a classic fit and a zip storage pocket.",
    priceUsd: 78,
    color: "Black",
    colors: [
      {
        name: "Black",
        hex: "#303330",
        images: [
          {
            src: "/images/products/mens-training-short/model-black-front.webp",
            alt: "Men's Training Short in Black, model front view",
          },
          {
            src: "/images/products/mens-training-short/model-black-back.webp",
            alt: "Men's Training Short in Black, model back view",
          },
          {
            src: "/images/products/mens-training-short/master-black-front.webp",
            alt: "Men's Training Short in Black, front garment view",
          },
          {
            src: "/images/products/mens-training-short/master-black-back.webp",
            alt: "Men's Training Short in Black, back garment view",
          },
          {
            src: "/images/products/mens-training-short/detail-black.webp",
            alt: "Men's Training Short fabric and construction detail",
          },
        ],
      },
      {
        name: "Olive",
        hex: "#717763",
        images: [
          {
            src: "/images/products/mens-training-short/master-olive-front.webp",
            alt: "Men's Training Short in Olive, front garment view",
          },
          {
            src: "/images/products/mens-training-short/master-olive-back.webp",
            alt: "Men's Training Short in Olive, back garment view",
          },
        ],
      },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    status: "active",
    images: [
      {
        src: "/images/products/mens-training-short/model-black-front.webp",
        alt: "Men's Training Short in Black, model front view",
      },
      {
        src: "/images/products/mens-training-short/model-black-back.webp",
        alt: "Men's Training Short in Black, model back view",
      },
      {
        src: "/images/products/mens-training-short/master-black-front.webp",
        alt: "Men's Training Short in Black, front garment view",
      },
      {
        src: "/images/products/mens-training-short/master-black-back.webp",
        alt: "Men's Training Short in Black, back garment view",
      },
      {
        src: "/images/products/mens-training-short/detail-black.webp",
        alt: "Men's Training Short fabric and construction detail",
      },
    ],
    composition: "86% polyester / 14% elastane",
    weightGsm: 137,
    fit: "Classic fit, unlined",
    length: "7-inch inseam",
    features: ["Internal drawcord", "Zip storage pocket", "Four-way stretch"],
  },
  {
    handle: "mens-jogger",
    name: "Men's Jogger",
    audience: "mens",
    category: "joggers",
    kind: "apparel",
    collections: ["mens", "line-one"],
    fabricLine: "line-one",
    summary:
      "Slim, tapered joggers with zip pockets and an adjustable drawcord.",
    priceUsd: 98,
    color: "Black",
    colors: [
      {
        name: "Black",
        hex: "#303330",
        images: [
          {
            src: "/images/products/mens-jogger/model-black-front.webp",
            alt: "Men's Jogger in Black, model front view",
          },
          {
            src: "/images/products/mens-jogger/model-black-back.webp",
            alt: "Men's Jogger in Black, model back view",
          },
          {
            src: "/images/products/mens-jogger/master-black-front.webp",
            alt: "Men's Jogger in Black, front garment view",
          },
          {
            src: "/images/products/mens-jogger/master-black-back-v4.webp",
            alt: "Men's Jogger in Black, back garment view",
          },
          {
            src: "/images/products/mens-jogger/detail-black.webp",
            alt: "Men's Jogger fabric and construction detail",
          },
        ],
      },
      {
        name: "Taupe",
        hex: "#9B8679",
        images: [
          {
            src: "/images/products/mens-jogger/master-taupe-front.webp",
            alt: "Men's Jogger in Taupe, front garment view",
          },
          {
            src: "/images/products/mens-jogger/master-taupe-back-v3.webp",
            alt: "Men's Jogger in Taupe, back garment view",
          },
        ],
      },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    status: "active",
    images: [
      {
        src: "/images/products/mens-jogger/model-black-front.webp",
        alt: "Men's Jogger in Black, model front view",
      },
      {
        src: "/images/products/mens-jogger/model-black-back.webp",
        alt: "Men's Jogger in Black, model back view",
      },
      {
        src: "/images/products/mens-jogger/master-black-front.webp",
        alt: "Men's Jogger in Black, front garment view",
      },
      {
        src: "/images/products/mens-jogger/master-black-back-v4.webp",
        alt: "Men's Jogger in Black, back garment view",
      },
      {
        src: "/images/products/mens-jogger/detail-black.webp",
        alt: "Men's Jogger fabric and construction detail",
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
    collections: ["mens", "line-one"],
    fabricLine: "line-one",
    summary: "A mock-neck quarter-zip in softly brushed stretch jersey.",
    priceUsd: 128,
    color: "Black",
    colors: [
      {
        name: "Black",
        hex: "#303330",
        images: [
          {
            src: "/images/products/mens-quarter-zip/model-black-front.webp",
            alt: "Men's Quarter-Zip in Black, model front view",
          },
          {
            src: "/images/products/mens-quarter-zip/model-black-back.webp",
            alt: "Men's Quarter-Zip in Black, model back view",
          },
          {
            src: "/images/products/mens-quarter-zip/master-black-front.webp",
            alt: "Men's Quarter-Zip in Black, front garment view",
          },
          {
            src: "/images/products/mens-quarter-zip/master-black-back.webp",
            alt: "Men's Quarter-Zip in Black, back garment view",
          },
          {
            src: "/images/products/mens-quarter-zip/detail-black.webp",
            alt: "Men's Quarter-Zip fabric and construction detail",
          },
        ],
      },
      {
        name: "Olive",
        hex: "#717763",
        images: [
          {
            src: "/images/products/mens-quarter-zip/master-olive-front.webp",
            alt: "Men's Quarter-Zip in Olive, front garment view",
          },
          {
            src: "/images/products/mens-quarter-zip/master-olive-back.webp",
            alt: "Men's Quarter-Zip in Olive, back garment view",
          },
        ],
      },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    status: "active",
    images: [
      {
        src: "/images/products/mens-quarter-zip/model-black-front.webp",
        alt: "Men's Quarter-Zip in Black, model front view",
      },
      {
        src: "/images/products/mens-quarter-zip/model-black-back.webp",
        alt: "Men's Quarter-Zip in Black, model back view",
      },
      {
        src: "/images/products/mens-quarter-zip/master-black-front.webp",
        alt: "Men's Quarter-Zip in Black, front garment view",
      },
      {
        src: "/images/products/mens-quarter-zip/master-black-back.webp",
        alt: "Men's Quarter-Zip in Black, back garment view",
      },
      {
        src: "/images/products/mens-quarter-zip/detail-black.webp",
        alt: "Men's Quarter-Zip fabric and construction detail",
      },
    ],
    composition: "89% polyester / 11% elastane",
    weightGsm: null,
    fit: "Classic fit",
    length: null,
    features: ["Quarter-zip closure", "Mock neck", "Four-way stretch"],
  },
  {
    handle: "mens-hoodie",
    name: "Men's Hoodie",
    audience: "mens",
    category: "hoodie",
    kind: "apparel",
    collections: ["mens", "line-one"],
    fabricLine: "line-one",
    summary:
      "A relaxed pullover with ribbed cuffs, a ribbed hem and on-seam pockets.",
    priceUsd: 118,
    color: "White",
    colors: [
      {
        name: "White",
        hex: "#E9E5DD",
        images: [
          {
            src: "/images/products/mens-hoodie/model-white-front.webp",
            alt: "Men's Hoodie in White, model front view",
          },
          {
            src: "/images/products/mens-hoodie/model-white-back.webp",
            alt: "Men's Hoodie in White, model back view",
          },
          {
            src: "/images/products/mens-hoodie/master-white-front.webp",
            alt: "Men's Hoodie in White, front garment view",
          },
          {
            src: "/images/products/mens-hoodie/master-white-back.webp",
            alt: "Men's Hoodie in White, back garment view",
          },
          {
            src: "/images/products/mens-hoodie/detail-white.webp",
            alt: "Men's Hoodie fabric and construction detail",
          },
        ],
      },
      {
        name: "Black",
        hex: "#303330",
        images: [
          {
            src: "/images/products/mens-hoodie/master-black-front.webp",
            alt: "Men's Hoodie in Black, front garment view",
          },
          {
            src: "/images/products/mens-hoodie/master-black-back.webp",
            alt: "Men's Hoodie in Black, back garment view",
          },
        ],
      },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    status: "active",
    images: [
      {
        src: "/images/products/mens-hoodie/model-white-front.webp",
        alt: "Men's Hoodie in White, model front view",
      },
      {
        src: "/images/products/mens-hoodie/model-white-back.webp",
        alt: "Men's Hoodie in White, model back view",
      },
      {
        src: "/images/products/mens-hoodie/master-white-front.webp",
        alt: "Men's Hoodie in White, front garment view",
      },
      {
        src: "/images/products/mens-hoodie/master-white-back.webp",
        alt: "Men's Hoodie in White, back garment view",
      },
      {
        src: "/images/products/mens-hoodie/detail-white.webp",
        alt: "Men's Hoodie fabric and construction detail",
      },
    ],
    composition: "89% polyester / 11% elastane",
    weightGsm: null,
    fit: "Relaxed, hip length",
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
    summary:
      "Let them choose. Select a $50 or $100 gift card.",
    priceUsd: 50,
    color: "White",
    colors: [
      {
        name: "White",
        hex: "#E9E5DD",
        images: [
          {
            src: "/images/products/gift-card/artwork.webp",
            alt: "Moravel Athletic gift card in White and Black",
          },
        ],
      },
    ],
    sizes: ["50", "100"],
    status: "active",
    images: [
      {
        src: "/images/products/gift-card/artwork.webp",
        alt: "Moravel Athletic gift card in White and Black",
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
