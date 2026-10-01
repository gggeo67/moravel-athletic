import Image from "next/image";
import Link from "next/link";
import { fabricLines, storefront } from "@/config/site";
import { getProduct } from "@/content/catalog";
import { metadataForPage } from "@/lib/seo";
import styles from "./story.module.css";

export const metadata = metadataForPage("/pages/our-story");

export default function Page() {
  const story = storefront.story;
  const [range, fabric, colors, details] = story.blocks;
  const colorProducts = [
    getProduct("womens-training-tee")!,
    getProduct("womens-jogger")!,
  ];
  const detailProduct = getProduct("mens-training-short")!;
  const detailImage = detailProduct.images.find((image) =>
    image.src.includes("/detail-"),
  )!;

  return (
    <div className={styles.story}>
      <section className={styles.hero}>
        <div className={styles.heroImage}>
          <Image
            src={range.image}
            alt={range.alt}
            fill
            preload
            sizes="(max-width:700px) 100vw, 56vw"
          />
        </div>
        <div className={styles.heroCopy}>
          <h1>{story.title}</h1>
          <p>{story.intro}</p>
        </div>
      </section>

      <section className={`wrap ${styles.range}`}>
        <h2>{range.title}</h2>
        <div>
          <p>{range.text}</p>
          <div className={styles.links}>
            <Link className="text-link" href="/collections/womens">
              Shop Women
            </Link>
            <Link className="text-link" href="/collections/mens">
              Shop Men
            </Link>
          </div>
        </div>
      </section>

      <section className={`wrap ${styles.fabrics}`}>
        <div className={styles.sectionHeading}>
          <h2>{fabric.title}</h2>
          <p>{fabric.text}</p>
        </div>
        <div className={styles.fabricGrid}>
          {fabricLines.map((line) => (
            <Link
              key={line.handle}
              href={`/pages/materials#${line.handle}`}
              className={styles.fabricLink}
            >
              <div className={styles.fabricImage}>
                <Image
                  src={line.macro}
                  alt={`${line.name} fabric texture close-up`}
                  fill
                  sizes="(max-width:700px) 100vw, 33vw"
                />
              </div>
              <div className={styles.fabricCaption}>
                <h3>{line.name}</h3>
                <span aria-hidden="true">↗</span>
                <p>{line.composition}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.colors}>
        <div className="wrap">
          <div className={styles.sectionHeading}>
            <h2>{colors.title}</h2>
            <p>{colors.text}</p>
          </div>
          <div className={styles.colorGrid}>
            {colorProducts.map((product) => (
              <Link
                key={product.handle}
                href={`/products/${product.handle}`}
                className={styles.colorPair}
              >
                <div className={styles.pairImages}>
                  {product.colors.map((color) => {
                    const photo = color.images.find(
                      (image) =>
                        image.src.includes("/master-") &&
                        image.src.endsWith("-front.webp"),
                    )!;
                    return (
                      <figure key={color.name}>
                        <div className={styles.garmentImage}>
                          <Image
                            src={photo.src}
                            alt={photo.alt}
                            fill
                            sizes="(max-width:700px) 46vw, 23vw"
                          />
                        </div>
                        <figcaption>{color.name}</figcaption>
                      </figure>
                    );
                  })}
                </div>
                <h3>
                  {product.name}
                  <span aria-hidden="true">↗</span>
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={`wrap ${styles.details}`}>
        <div className={styles.detailImage}>
          <Image
            src={detailImage.src}
            alt={detailImage.alt}
            fill
            sizes="(max-width:700px) 100vw, 45vw"
          />
        </div>
        <div className={styles.detailCopy}>
          <h2>{details.title}</h2>
          <p>{details.text}</p>
          <div className={styles.links}>
            <Link
              className="button-link"
              href={`/products/${detailProduct.handle}`}
            >
              Explore the training short
            </Link>
            <Link className="text-link" href="/pages/size-guide">
              Size &amp; fit guide
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
