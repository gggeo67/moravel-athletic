import { notFound } from "next/navigation";
import Image from "next/image";
import { journalArticles } from "@/config/site";
import { metadataFor } from "@/lib/seo";
export const dynamicParams = false;
export function generateStaticParams() {
  return journalArticles.map((a) => ({ slug: a.slug }));
}
export async function generateMetadata({
  params,
}: PageProps<"/blogs/journal/[slug]">) {
  const { slug } = await params;
  const a = journalArticles.find((a) => a.slug === slug);
  return a
    ? metadataFor({
        path: `/blogs/journal/${slug}`,
        title: a.title,
        description: a.description,
      })
    : {};
}
export default async function Page({
  params,
}: PageProps<"/blogs/journal/[slug]">) {
  const { slug } = await params;
  const a = journalArticles.find((a) => a.slug === slug);
  if (!a) notFound();
  return (
    <article className="wrap text-page">
      <h1>{a.title}</h1>
      <Image
        src={a.image}
        alt={a.alt}
        width={1122}
        height={1402}
        sizes="(max-width:850px) 100vw, 850px"
      />
      {a.paragraphs.map((p, i) => (
        <p className="mt-6" key={i}>
          {p}
        </p>
      ))}
    </article>
  );
}
