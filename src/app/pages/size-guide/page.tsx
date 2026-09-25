import Link from "next/link";
import { allProducts } from "@/content/catalog";
import { metadataForPage } from "@/lib/seo";
export const metadata = metadataForPage("/pages/size-guide");
export default function Page() {
  return (
    <div className="wrap text-page">
      <h1>Size & fit guide</h1>
      <p>
        Compare the offered sizes, garment fit and listed inseam for each style.
      </p>
      {(["womens", "mens"] as const).map((a) => (
        <section key={a} className="mt-10">
          <h2>{a === "womens" ? "Women" : "Men"}</h2>
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th scope="col">Style</th>
                  <th scope="col">Sizes</th>
                  <th scope="col">Fit</th>
                  <th scope="col">Inseam</th>
                </tr>
              </thead>
              <tbody>
                {allProducts()
                  .filter((p) => p.audience === a)
                  .map((p) => (
                    <tr key={p.handle}>
                      <th scope="row">
                        <Link
                          className="underline"
                          href={`/products/${p.handle}`}
                        >
                          {p.name}
                        </Link>
                      </th>
                      <td>{p.sizes.join(", ")}</td>
                      <td>{p.fit}</td>
                      <td>{p.length ?? "—"}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  );
}
