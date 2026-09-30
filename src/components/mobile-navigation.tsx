"use client";
import { BrandLogo } from "@/components/brand-logo";
import { useRef } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { type NavItem } from "@/config/site";
export function MobileNavigation({ items }: { items: NavItem[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  return (
    <div className="mobile-nav">
      <button
        ref={trigger}
        aria-label="Open menu"
        aria-haspopup="dialog"
        onClick={() => dialog.current?.showModal()}
      >
        <Menu aria-hidden="true" />
      </button>
      <dialog
        ref={dialog}
        className="navigation-dialog"
        aria-label="Navigation menu"
        onKeyDown={(event) => {
          if (event.key !== "Tab") return;
          const controls = Array.from(
            event.currentTarget.querySelectorAll<HTMLElement>(
              "button, a[href]",
            ),
          );
          const first = controls[0];
          const last = controls[controls.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last?.focus();
          }
          if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first?.focus();
          }
        }}
        onClose={() => trigger.current?.focus()}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
      >
        <div className="navigation-dialog-header">
          <span className="wordmark" role="img" aria-label="Moravel Athletic"><BrandLogo /></span>
          <button
            aria-label="Close menu"
            onClick={() => dialog.current?.close()}
          >
            <X aria-hidden="true" />
          </button>
        </div>
        <nav aria-label="Mobile navigation">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => dialog.current?.close()}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </dialog>
    </div>
  );
}
