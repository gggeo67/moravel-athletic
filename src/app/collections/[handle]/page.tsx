import { notFound } from "next/navigation";
import { collections, faqs } from "@/config/site";
import { productsIn } from "@/content/catalog";
import { metadataFor } from "@/lib/seo";
import { CategoryRail } from "@/components/editorial";
import { CollectionShop } from "@/components/collection-shop";
import { Accordion } from "@/components/accordion";
export const dynamicParams = false;
export function generateStaticParams() {
  return collections.map((c) => ({ handle: c.handle }));
}
export async function generateMetadata({
  params,
}: PageProps<"/collections/[handle]">) {
  const { handle } = await params;
  const c = collections.find((c) => c.handle === handle);
  return c
    ? metadataFor({
        path: `/collections/${handle}`,
        title: c.title,
        description: c.description,
      })
    : {};
}
export default async function Page({
  params,
  searchParams,
}: PageProps<"/collections/[handle]">) {
  const { handle } = await params;
  const query = await searchParams;
  const c = collections.find((c) => c.handle === handle);
  if (!c) notFound();
  const products = productsIn(handle);
  const category =
    typeof query.category === "string" &&
    products.some((p) => p.category === query.category)
      ? query.category
      : "";
  return (
    <>
      <div className="page-heading">
        <h1>{c.title}</h1>
        <p>{c.description}</p>
      </div>
      <div className="wrap section-space pt-0">
        {["womens", "mens"].includes(handle) && (
          <CategoryRail audience={handle} />
        )}
        <CollectionShop
          key={`${handle}-${category}`}
          products={products}
          initialCategory={category}
        />
        <section className="faq-block">
          <h2 className="mb-6">A closer look</h2>
          {faqs.slice(0, 3).map((f) => (
            <Accordion key={f.question} title={f.question}>
              {f.answer}
            </Accordion>
          ))}
        </section>
      </div>
    </>
  );
}
