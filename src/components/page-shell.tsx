import type { ReactNode } from "react";
import Link from "next/link";
import { getPage, helpContent } from "@/config/site";
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
      {children ?? (
        <>
          {(helpContent[path] ?? []).map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              <p>{section.text}</p>
            </section>
          ))}
          <nav className="page-links" aria-label="More information">
            <Link className="text-link" href="/pages/faq">
              Frequently asked questions
            </Link>
            <Link className="text-link" href="/pages/size-guide">
              Size & fit
            </Link>
            <Link className="text-link" href="/pages/materials">
              Materials
            </Link>
          </nav>
        </>
      )}
    </div>
  );
}
