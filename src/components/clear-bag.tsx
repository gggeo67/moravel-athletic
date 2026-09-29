"use client";

import { useEffect } from "react";
import { useCart } from "@/components/cart-provider";

/** Empties the bag once an order has been saved (the page only renders this with an order ref). */
export function ClearBag() {
  const { clear, ready, count } = useCart();
  useEffect(() => {
    if (ready && count > 0) clear();
  }, [ready, count, clear]);
  return null;
}
