"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/** Native scrolling remains available for touch, trackpads and keyboard users. */
export function ShopRail({
  heading,
  label,
  children,
  variant = "products",
  resetKey,
}: {
  heading: ReactNode;
  label: string;
  children: ReactNode;
  variant?: "products" | "categories";
  resetKey?: string;
}) {
  const id = useId();
  const track = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: true });

  useEffect(() => {
    const element = track.current;
    if (!element) return;
    element.scrollTo({ left: 0, behavior: "instant" });
    const measure = () => {
      setEdges({
        start: element.scrollLeft <= 10,
        end:
          element.scrollWidth - element.clientWidth - element.scrollLeft <= 10,
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    element.addEventListener("scroll", measure, { passive: true });
    return () => {
      observer.disconnect();
      element.removeEventListener("scroll", measure);
    };
  }, [resetKey]);

  function advance(direction: number) {
    const element = track.current;
    if (!element) return;
    const card = element.firstElementChild;
    const step = card
      ? card.getBoundingClientRect().width +
        parseFloat(getComputedStyle(element).columnGap || "0")
      : element.clientWidth;
    const visible = Math.max(1, Math.floor((element.clientWidth + 16) / step));
    element.scrollBy({
      left: direction * step * visible,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }

  return (
    <div className={`shop-rail shop-rail-${variant}`}>
      <div className="shop-rail-heading">
        <div className="shop-rail-title">{heading}</div>
        <div className="shop-rail-controls" aria-label={`${label} navigation`}>
          <button
            type="button"
            onClick={() => advance(-1)}
            disabled={edges.start}
            aria-label={`Previous ${label}`}
            aria-controls={id}
          >
            <ChevronLeft aria-hidden="true" size={20} />
          </button>
          <button
            type="button"
            onClick={() => advance(1)}
            disabled={edges.end}
            aria-label={`Next ${label}`}
            aria-controls={id}
          >
            <ChevronRight aria-hidden="true" size={20} />
          </button>
        </div>
      </div>
      <div
        id={id}
        ref={track}
        className="shop-rail-track"
        role="region"
        aria-label={label}
        tabIndex={0}
      >
        {children}
      </div>
    </div>
  );
}
