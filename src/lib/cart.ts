import { getProduct, priceFor } from "@/content/catalog";
export type VariantOptions = {
  color?: string;
  recipientName?: string;
  recipientEmail?: string;
};
export type CartLine = VariantOptions & {
  id: string;
  handle: string;
  size: string;
  quantity: number;
};
export type ResolvedLine = CartLine & {
  name: string;
  color: string;
  unitPrice: number;
  lineTotal: number;
  available: boolean;
  image: string;
};
export const MAX_PER_LINE = 5;
export function lineId(
  handle: string,
  size: string,
  options: VariantOptions = {},
): string {
  return [
    handle,
    size,
    options.color ?? "",
    options.recipientEmail ?? "",
    options.recipientName ?? "",
  ]
    .map(encodeURIComponent)
    .join("::");
}
export function addLine(
  lines: CartLine[],
  handle: string,
  size: string,
  quantity = 1,
  options: VariantOptions = {},
): CartLine[] {
  if (!Number.isFinite(quantity) || quantity < 1) return lines;
  const product = getProduct(handle);
  const selection = {
    ...options,
    color: options.color ?? product?.color ?? "",
  };
  const id = lineId(handle, size, selection);
  const n = Math.min(MAX_PER_LINE, Math.floor(quantity));
  return lines.some((l) => l.id === id)
    ? lines.map((l) =>
        l.id === id
          ? { ...l, quantity: Math.min(MAX_PER_LINE, l.quantity + n) }
          : l,
      )
    : [...lines, { id, handle, size, quantity: n, ...selection }];
}
export function setQuantity(
  lines: CartLine[],
  id: string,
  quantity: number,
): CartLine[] {
  if (!Number.isFinite(quantity)) return lines;
  if (quantity <= 0) return removeLine(lines, id);
  return lines.map((l) =>
    l.id === id
      ? { ...l, quantity: Math.min(MAX_PER_LINE, Math.floor(quantity)) }
      : l,
  );
}
export function removeLine(lines: CartLine[], id: string): CartLine[] {
  return lines.filter((l) => l.id !== id);
}
export function totalQuantity(lines: CartLine[]): number {
  return lines.reduce((n, l) => n + l.quantity, 0);
}
export function resolveLines(lines: CartLine[]): ResolvedLine[] {
  return lines.flatMap((line) => {
    const p = getProduct(line.handle);
    if (!p) return [];
    const color = p.colors.find((c) => c.name === (line.color ?? p.color));
    const unitPrice = priceFor(p, line.size);
    return [
      {
        ...line,
        name: p.name,
        color: color?.name ?? line.color ?? p.color,
        unitPrice,
        lineTotal: unitPrice * line.quantity,
        image: color?.images[0]?.src ?? p.images[0].src,
        available:
          p.status === "active" && p.sizes.includes(line.size) && !!color,
      },
    ];
  });
}
export function subtotal(lines: ResolvedLine[]): number {
  return lines.reduce((n, l) => n + l.lineTotal, 0);
}
export function parseLines(raw: unknown): CartLine[] {
  if (!Array.isArray(raw) || raw.length > 60) return [];
  let result: CartLine[] = [];
  for (const item of raw) {
    if (typeof item !== "object" || item === null) continue;
    const { handle, size, quantity, color, recipientName, recipientEmail } =
      item as Record<string, unknown>;
    if (
      typeof handle !== "string" ||
      typeof size !== "string" ||
      typeof quantity !== "number" ||
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > MAX_PER_LINE
    )
      continue;
    const p = getProduct(handle);
    if (!p || !p.sizes.includes(size)) continue;
    const chosen = color === undefined ? p.color : color;
    if (typeof chosen !== "string" || !p.colors.some((c) => c.name === chosen))
      continue;
    const opts: VariantOptions = { color: chosen };
    if (p.kind === "gift-card") {
      if (
        typeof recipientName !== "string" ||
        !recipientName.trim() ||
        recipientName.length > 100 ||
        typeof recipientEmail !== "string" ||
        recipientEmail.length > 254 ||
        !/^\S+@[^\s@]+\.[^\s@]+$/.test(recipientEmail)
      )
        continue;
      opts.recipientName = recipientName.trim();
      opts.recipientEmail = recipientEmail.toLowerCase().trim();
    }
    result = addLine(result, handle, size, quantity, opts);
  }
  return result;
}
export function usd(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}
