"use client";

import Link from "next/link";
import { useCart } from "@/components/cart-provider";

export function CartLink() {
  const { count, ready } = useCart();
  return (
    <Link href="/cart" className="hover:underline">
      Bag{ready && count > 0 ? ` (${count})` : ""}
    </Link>
  );
}
