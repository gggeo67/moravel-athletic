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
      <div className="fabric-grid journal-guides">
        {fabricLines.map((line) => (
          <Link
            className="fabric-card"
            key={line.handle}
            href={`/pages/materials#${line.handle}`}
          >
            <div className="editorial-photo">
              <Image
                src={line.macro}
                alt={`${line.name} fabric texture close-up`}
                fill
                sizes="(max-width:700px) 100vw, 33vw"
              />
            </div>
            <h2 className="mt-5">
              {storefront.journal.cardPrefix} {line.name}{" "}
              {storefront.journal.cardSuffix}
            </h2>
            <p>{line.description}</p>
            <span className="text-link">{storefront.journal.cta}</span>
          </Link>
        ))}
      </div>
      <nav className="page-links" aria-label="More guides">
        <Link className="text-link" href="/pages/size-guide">
          Size & fit guide
        </Link>
        <Link className="text-link" href="/pages/materials">
          All materials
        </Link>
        <Link className="text-link" href="/pages/gift-guide">
          Holiday gift guide
        </Link>
      </nav>
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
