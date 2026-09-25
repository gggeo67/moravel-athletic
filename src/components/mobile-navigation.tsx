"use client";
import { useRef } from "react";
import Link from "next/link";
import type { NavItem } from "@/config/site";
export function MobileNavigation({ items }: { items: NavItem[] }) {
  const details = useRef<HTMLDetailsElement>(null);
  return (
    <details
      ref={details}
      className="mobile-nav"
      onKeyDown={(event) => {
        if (event.key === "Escape" && details.current) {
          details.current.open = false;
          details.current.querySelector("summary")?.focus();
        }
      }}
    >
      <summary>Menu</summary>
      <nav className="mobile-menu" aria-label="Mobile navigation">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => {
              if (details.current) details.current.open = false;
            }}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </details>
  );
}
