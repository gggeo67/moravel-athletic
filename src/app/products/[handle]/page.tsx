import { notFound } from "next/navigation";
import { allProducts, getProduct, productsIn } from "@/content/catalog";
import { fabricLines } from "@/config/site";
import { JsonLd } from "@/components/json-ld";
import { metadataFor, productSchema } from "@/lib/seo";
import { ProductDetail } from "@/components/product-detail";
import { Breadcrumb } from "@/components/breadcrumb";
import { ProductRail } from "@/components/product-rail";
export const dynamicParams = false;
export function generateStaticParams() {
  return allProducts().map((p) => ({ handle: p.handle }));
}
export async function generateMetadata({
  params,
}: PageProps<"/products/[handle]">) {
  const { handle } = await params;
  const p = getProduct(handle);
  return p
    ? metadataFor({
        path: `/products/${handle}`,
        title: p.name,
        description: p.summary,
      })
    : {};
}
export default async function Page({
  params,
}: PageProps<"/products/[handle]">) {
  const { handle } = await params;
  const p = getProduct(handle);
  if (!p) notFound();
  const line = fabricLines.find((f) => f.handle === p.fabricLine);
  const coordinated = allProducts()
    .filter(
      (x) =>
        x.audience === p.audience &&
        x.handle !== p.handle &&
        x.category !== p.category,
    )
    .slice(0, 4);
  return (
    <>
      <div className="wrap pb-12">
        <JsonLd data={productSchema(p)} />
        <Breadcrumb
          trail={[
            { name: "Home", path: "/" },
            ...(p.audience === "unisex"
              ? []
              : [
                  {
                    name: p.audience === "womens" ? "Women" : "Men",
                    path: `/collections/${p.audience}`,
                  },
                ]),
            { name: p.name, path: `/products/${p.handle}` },
          ]}
        />
        <ProductDetail key={p.handle} product={p} />
      </div>
      <ProductRail title="Wear it together" products={coordinated} />
      {line && (
        <ProductRail
          title={`More from ${line.name}`}
          products={productsIn(line.handle)
            .filter((x) => x.handle !== p.handle)
            .slice(0, 4)}
        />
      )}
    </>
  );
}
