import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema } from "@/lib/seo";
export function Breadcrumb({
  trail,
}: {
  trail: { name: string; path: string }[];
}) {
  return (
    <>
      <JsonLd data={breadcrumbSchema(trail)} />
      <nav aria-label="Breadcrumb" className="breadcrumb">
        {trail.map((item, i) => (
          <span key={item.path}>
            {i > 0 && <span aria-hidden="true"> / </span>}
            {i === trail.length - 1 ? (
              <span aria-current="page">{item.name}</span>
            ) : (
              <Link href={item.path}>{item.name}</Link>
            )}
          </span>
        ))}
      </nav>
    </>
  );
}
