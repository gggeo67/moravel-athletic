import Link from "next/link";
import Image from "next/image";
import { storefront, fabricLines, journalArticles } from "@/config/site";
import { metadataForPage } from "@/lib/seo";
export const metadata = metadataForPage("/blogs/journal");
export default function Page() {
  return (
    <div className="wrap section-space">
      <div className="page-heading">
        <h1>{storefront.journal.title}</h1>
        <p>{storefront.journal.text}</p>
      </div>
      <div className="fabric-grid">
        {fabricLines.map((line) => (
          <Link
            className="fabric-card"
            key={line.handle}
            href={`/pages/materials#${line.handle}`}
          >
            <div className="editorial-photo">
              <Image
                src={line.image}
                alt={line.alt}
                fill
                sizes="(max-width:700px) 100vw, 33vw"
              />
            </div>
            <h2 className="mt-5">Inside {line.name}</h2>
            <p>{line.description}</p>
            <span className="text-link">Explore the fabric</span>
          </Link>
        ))}
      </div>
      {journalArticles.length > 0 && (
        <section className="section-space">
          <h2>Journal</h2>
          {journalArticles.map((a) => (
            <Link
              key={a.slug}
              href={`/blogs/journal/${a.slug}`}
              className="text-link"
            >
              {a.title}
            </Link>
          ))}
        </section>
      )}
    </div>
  );
}
