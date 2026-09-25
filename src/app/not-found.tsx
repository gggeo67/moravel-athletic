import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found",
  description: "That page doesn't exist.",
  robots: { index: false, follow: false },
};

/** Real 404: Next renders this with HTTP 404 for any unmatched path. */
export default function NotFound() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-24">
      <p className="text-sm text-muted-foreground">404</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Page not found</h1>
      <Link href="/" className="mt-6 inline-block underline">
        Back to the home page
      </Link>
    </div>
  );
}
