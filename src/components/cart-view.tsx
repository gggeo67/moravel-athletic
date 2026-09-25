"use client";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { resolveLines, subtotal, usd, MAX_PER_LINE } from "@/lib/cart";
export function CartView() {
  const { lines, ready, update, remove } = useCart();
  const resolved = resolveLines(lines);
  if (!ready)
    return (
      <p aria-busy="true" className="mt-8">
        Loading your bag…
      </p>
    );
  if (!resolved.length)
    return (
      <div className="empty-state">
        <p>Your bag is empty.</p>
        <div className="flex gap-4">
          <Link className="button-link" href="/collections/womens">
            Shop Women
          </Link>
          <Link className="button-link outline" href="/collections/mens">
            Shop Men
          </Link>
        </div>
      </div>
    );
  return (
    <div className="bag-layout">
      <ul>
        {resolved.map((line) => (
          <li className="bag-item" key={line.id}>
            <Link href={`/products/${line.handle}`} className="bag-image">
              <Image src={line.image} alt={line.name} fill sizes="100px" />
            </Link>
            <div>
              <div className="bag-details">
                <div>
                  <Link href={`/products/${line.handle}`}>
                    <h2>{line.name}</h2>
                  </Link>
                  <p>
                    {line.handle === "gift-card"
                      ? usd(Number(line.size))
                      : `${line.color} / ${line.size}`}
                  </p>
                  {line.recipientName && <p>For {line.recipientName}</p>}
                </div>
                <span>{usd(line.lineTotal)}</span>
              </div>
              <div className="quantity-control">
                <button
                  onClick={() => update(line.id, line.quantity - 1)}
                  aria-label={`One fewer ${line.name}`}
                >
                  −
                </button>
                <span aria-label="Quantity">{line.quantity}</span>
                <button
                  disabled={line.quantity >= MAX_PER_LINE}
                  onClick={() => update(line.id, line.quantity + 1)}
                  aria-label={`One more ${line.name}`}
                >
                  +
                </button>
                <button
                  className="remove"
                  onClick={() => remove(line.id)}
                  aria-label={`Remove ${line.name}`}
                >
                  Remove
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <aside className="order-summary">
        <h2 className="text-xl">Your bag</h2>
        <p className="subtotal-row">
          <span>Item subtotal</span>
          <span>{usd(subtotal(resolved))}</span>
        </p>
        <Link href="/checkout" className="button-link w-full">
          Check out
        </Link>
        <Link href="/collections/womens" className="text-link text-sm mt-3">
          Continue shopping
        </Link>
      </aside>
    </div>
  );
}
