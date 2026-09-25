import Image from "next/image";
import Link from "next/link";
import { fabricLines, storefront } from "@/config/site";
import { metadataForPage } from "@/lib/seo";
import { productsIn } from "@/content/catalog";
export const metadata = metadataForPage("/pages/materials");
export default function Page() {
  return (
    <div className="wrap section-space">
      <div className="page-heading">
        <h1>{storefront.fabrics.title}</h1>
        <p>{storefront.fabrics.text}</p>
      </div>
      {fabricLines.map((line) => (
        <section
          key={line.handle}
          className="material-section"
          id={line.handle}
        >
          <div className="material-photo">
            <Image
              src={line.macro}
              alt={`${line.name} fabric close-up`}
              fill
              sizes="(max-width:700px) 100vw, 50vw"
            />
          </div>
          <div>
            <h2>{line.name}</h2>
            <p>{line.description}</p>
            <table className="data-table">
              <tbody>
                <tr>
                  <th scope="row">Composition</th>
                  <td>{line.composition}</td>
                </tr>
                <tr>
                  <th scope="row">Styles</th>
                  <td>
                    {productsIn(line.handle)
                      .map((p) => p.name)
                      .join(", ")}
                  </td>
                </tr>
              </tbody>
            </table>
            <Link
              href={`/collections/${line.handle}`}
              className="text-link mt-5"
            >
              Shop {line.name}
            </Link>
          </div>
        </section>
      ))}
    </div>
  );
}
