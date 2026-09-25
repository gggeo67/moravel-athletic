"use client";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { OrderForm } from "@/components/order-form";
import { resolveLines, subtotal, usd } from "@/lib/cart";
export function CheckoutView() {
  const { lines, ready } = useCart();
  const resolved = resolveLines(lines);
  if (!ready)
    return (
      <p className="mt-8" aria-busy="true">
        Loading your order…
      </p>
    );
  if (!resolved.length)
    return (
      <div className="empty-state">
        <p>Your bag is empty.</p>
        <Link className="button-link" href="/collections/womens">
          Explore the collection
        </Link>
      </div>
    );
  return (
    <div className="bag-layout">
      <OrderForm lines={lines} />
      <aside className="order-summary">
        <h2 className="text-xl mb-6">Your order</h2>
        <ul className="space-y-5">
          {resolved.map((line) => (
            <li className="checkout-item" key={line.id}>
              <div className="bag-image">
                <Image src={line.image} alt={line.name} fill sizes="64px" />
              </div>
              <div>
                <p>{line.name}</p>
                <p>
                  {line.handle === "gift-card"
                    ? usd(Number(line.size))
                    : `${line.color} / ${line.size}`}{" "}
                  · Qty {line.quantity}
                </p>
                {line.recipientName && <p>For {line.recipientName}</p>}
              </div>
              <span className="text-sm">{usd(line.lineTotal)}</span>
            </li>
          ))}
        </ul>
        <p className="subtotal-row border-t pt-5">
          <span>Item subtotal</span>
          <span>{usd(subtotal(resolved))}</span>
        </p>
        <Link className="text-link text-sm" href="/cart">
          Edit your bag
        </Link>
      </aside>
    </div>
  );
}
