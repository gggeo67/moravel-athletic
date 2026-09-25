"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { MoveHorizontal, Layers, Check } from "lucide-react";
import { type Product, priceFor } from "@/content/catalog";
import { fabricLines } from "@/config/site";
import { useCart } from "@/components/cart-provider";
import { Accordion } from "@/components/accordion";
import { usd } from "@/lib/cart";
const icons = [Layers, MoveHorizontal, Check];
export function ProductDetail({ product }: { product: Product }) {
  const [color, setColor] = useState(product.colors[0]);
  const [size, setSize] = useState(product.kind === "gift-card" ? "50" : "");
  const [message, setMessage] = useState("");
  const [added, setAdded] = useState(false);
  const cart = useCart();
  const fabric = fabricLines.find((f) => f.handle === product.fabricLine);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!size) {
      setMessage("Choose a size to add this item.");
      return;
    }
    const data = new FormData(event.currentTarget);
    cart.add(product.handle, size, 1, {
      color: color.name,
      ...(product.kind === "gift-card"
        ? {
            recipientName: String(data.get("recipientName")).trim(),
            recipientEmail: String(data.get("recipientEmail")).trim(),
          }
        : {}),
    });
    setMessage("Added to your bag.");
    setAdded(true);
  }
  return (
    <div className="product-layout">
      <div
        className="product-gallery"
        tabIndex={0}
        aria-label={`${product.name} image gallery`}
      >
        {color.images.map((img, i) => (
          <div className="gallery-image" key={img.src}>
            <Image
              src={img.src}
              alt={img.alt}
              fill
              preload={i === 0}
              sizes="(max-width:700px) 90vw, 30vw"
            />
          </div>
        ))}
      </div>
      <div className="product-info">
        <h1>{product.name}</h1>
        <p className="product-price">{usd(priceFor(product, size))}</p>
        <p className="product-description">{product.summary}</p>
        <form onSubmit={submit}>
          <div className="product-options">
            {product.kind === "apparel" && (
              <>
                <p className="option-label">Color: {color.name}</p>
                <div className="color-options" aria-label="Choose color">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      className="color-button"
                      aria-label={c.name}
                      aria-pressed={color.name === c.name}
                      onClick={() => {
                        setColor(c);
                        setAdded(false);
                        setMessage("");
                      }}
                    >
                      <span className={`swatch-${c.name.toLowerCase()}`} />
                    </button>
                  ))}
                </div>
              </>
            )}
            <div className="product-option-heading mt-5">
              <p className="option-label">
                {product.kind === "gift-card"
                  ? "Amount"
                  : `Size${size ? `: ${size}` : ""}`}
              </p>
              {product.kind === "apparel" && (
                <Link href="/pages/size-guide" className="text-link text-sm">
                  Size & fit guide
                </Link>
              )}
            </div>
            <div
              className="size-options"
              aria-label={
                product.kind === "gift-card"
                  ? "Choose denomination"
                  : "Choose size"
              }
            >
              {product.sizes.map((s) => (
                <button
                  type="button"
                  className="size-button"
                  key={s}
                  aria-pressed={size === s}
                  onClick={() => {
                    setSize(s);
                    setMessage("");
                    setAdded(false);
                  }}
                >
                  {product.kind === "gift-card" ? usd(Number(s)) : s}
                </button>
              ))}
            </div>
            {product.kind === "gift-card" && (
              <div className="gift-fields">
                <label>
                  Recipient name
                  <input
                    name="recipientName"
                    required
                    maxLength={100}
                    autoComplete="off"
                  />
                </label>
                <label>
                  Recipient email
                  <input
                    name="recipientEmail"
                    required
                    type="email"
                    maxLength={254}
                    autoComplete="off"
                  />
                </label>
              </div>
            )}
            <button
              className="shop-button product-submit"
              type="submit"
              disabled={product.status !== "active"}
            >
              {product.status === "active" ? "Add to bag" : "Unavailable"}
            </button>
            <div className="product-status" role="status">
              {message}{" "}
              {added && (
                <Link href="/cart" className="underline">
                  View bag
                </Link>
              )}
            </div>
          </div>
        </form>
        <div className="flex gap-6 text-xs">
          <Link href="/pages/shipping" className="text-link">
            Shipping
          </Link>
          <Link href="/pages/returns" className="text-link">
            Returns
          </Link>
        </div>
        <div className="product-features">
          {product.features.map((feature, i) => {
            const Icon = icons[i % icons.length];
            return (
              <div key={feature} className="product-feature">
                <Icon aria-hidden="true" />
                <span>{feature}</span>
              </div>
            );
          })}
        </div>
        {product.fit && (
          <Accordion title="Fit">
            <p>
              {product.fit}
              {product.length ? `. ${product.length}.` : "."}
            </p>
            <p className="mt-2">Available sizes: {product.sizes.join(", ")}.</p>
          </Accordion>
        )}
        {product.composition && (
          <Accordion title="Fabric">
            <p>
              {product.composition}
              {product.weightGsm ? ` · ${product.weightGsm} GSM` : ""}
            </p>
            {fabric && (
              <Link
                href={`/collections/${fabric.handle}`}
                className="text-link"
              >
                Explore {fabric.name}
              </Link>
            )}
          </Accordion>
        )}
        <Accordion title="Features">
          <ul className="list-disc pl-5 space-y-2">
            {product.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </Accordion>
      </div>
    </div>
  );
}
