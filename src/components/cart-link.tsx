"use client";

import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/components/cart-provider";

export function CartLink() {
  const { count, ready } = useCart();
  return (
    <Link href="/cart" className="hover:underline">
      <ShoppingBag size={20} aria-hidden="true" /> Bag ({ready ? count : 0})
    </Link>
  );
}
