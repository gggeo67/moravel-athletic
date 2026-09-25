import Link from "next/link";
import { site } from "@/config/site";
import { Newsletter } from "@/components/newsletter";
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <Newsletter />
          {site.footerGroups.slice(0, 3).map((group) => (
            <nav key={group.title} aria-label={`${group.title} footer`}>
              <h2>{group.title}</h2>
              <ul>
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link className="footer-link" href={item.href}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} {site.name}
          </p>
          <nav className="legal-links" aria-label="Legal">
            {site.footerGroups[3].items.map((item) => (
              <Link className="footer-link" key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
