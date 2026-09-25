import Link from "next/link";
import { site, storefront } from "@/config/site";
import { CartLink } from "@/components/cart-link";
import { MobileNavigation } from "@/components/mobile-navigation";
export function SiteHeader() {
  return (
    <>
      <div className="announcement">{storefront.announcement}</div>
      <header className="site-header">
        <div className="wrap header-row">
          <Link href="/" className="wordmark" aria-label={`${site.name} home`}>
            {site.name}
          </Link>
          <nav className="desktop-nav" aria-label="Primary">
            <ul>
              {site.navigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <MobileNavigation items={site.navigation} />
          <div className="header-bag">
            <CartLink />
          </div>
        </div>
      </header>
    </>
  );
}
