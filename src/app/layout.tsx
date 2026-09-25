import type { Metadata } from "next";
import { DM_Sans, Libre_Caslon_Text } from "next/font/google";
import "./globals.css";

import { site } from "@/config/site";
import { environment } from "@/config/environment";
import { metadataBaseUrl, organizationSchema, websiteSchema } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CartProvider } from "@/components/cart-provider";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});
const wordmark = Libre_Caslon_Text({
  variable: "--font-wordmark",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const env = environment();

export const metadata: Metadata = {
  metadataBase: metadataBaseUrl,
  title: { default: site.name, template: `%s · ${site.name}` },
  description: site.description,
  applicationName: site.name,
  robots: env.indexable
    ? { index: true, follow: true }
    : { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const org = organizationSchema();

  return (
    <html
      lang={site.lang}
      className={`${dmSans.variable} ${wordmark.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-background focus:px-4 focus:py-2"
        >
          Skip to content
        </a>
        <JsonLd data={websiteSchema()} />
        {org ? <JsonLd data={org} /> : null}
        <CartProvider>
          <SiteHeader />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter />
        </CartProvider>
      </body>
    </html>
  );
}
