import type { ReactNode } from "react";
import Link from "next/link";
import { getPage, helpContent, policyEffectiveDate } from "@/config/site";
export function PageShell({
  path,
  children,
}: {
  path: string;
  children?: ReactNode;
}) {
  const page = getPage(path);
  return (
    <div className="wrap text-page">
      <h1>{page.title}</h1>
      <p className="effective-date">Effective {policyEffectiveDate}</p>
      {(helpContent[path] ?? []).map((section) => (
        <section key={section.heading}>
          <h2>{section.heading}</h2>
          <p>{section.text}</p>
          {section.list && (
            <ul className="policy-list">
              {section.list.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
          {section.link && (
            <p>
              <Link className="text-link" href={section.link.href}>
                {section.link.label}
              </Link>
            </p>
          )}
        </section>
      ))}
      {children}
      <nav className="page-links" aria-label="More information">
        <Link className="text-link" href="/pages/faq">
          Frequently asked questions
        </Link>
        <Link className="text-link" href="/pages/shipping">
          Shipping
        </Link>
        <Link className="text-link" href="/pages/returns">
          Returns
        </Link>
        <Link className="text-link" href="/pages/size-guide">
          Size & fit
        </Link>
      </nav>
    </div>
  );
}
