"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import {
  addLine,
  parseLines,
  removeLine,
  setQuantity,
  totalQuantity,
  type CartLine,
  type VariantOptions,
} from "@/lib/cart";

const STORAGE_KEY = "moravel-athletic.cart.v1";

/**
 * Cart state, backed by localStorage and read through useSyncExternalStore.
 *
 * localStorage is an external store, so this uses the API designed for one
 * rather than syncing it into state from an effect. Three things fall out of
 * that: no hydration mismatch (the server snapshot is a stable empty array),
 * no cascading re-render on mount, and cross-tab sync for free via the
 * `storage` event.
 *
 * Every storage call is wrapped. Private windows, disabled site data and some
 * embedded webviews throw on access rather than returning null, and a cart
 * that cannot persist still has to work for the length of the session.
 *
 */

// Snapshots must be referentially stable or useSyncExternalStore loops.
const EMPTY: CartLine[] = [];
let snapshot: CartLine[] = EMPTY;
let loaded = false;

const listeners = new Set<() => void>();

function read(): CartLine[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? parseLines(JSON.parse(raw)) : EMPTY;
  } catch {
    return EMPTY;
  }
}

function persist(lines: CartLine[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  } catch {
    // Quota or blocked storage. In-memory cart still works this session.
  }
}

function emit() {
  for (const l of listeners) l();
}

function subscribe(cb: () => void) {
  // First subscriber primes the snapshot from storage.
  if (!loaded) {
    snapshot = read();
    loaded = true;
  }
  listeners.add(cb);

  // Another tab changed the cart.
  const onStorage = (e: StorageEvent) => {
    if (e.key !== STORAGE_KEY) return;
    snapshot = read();
    emit();
  };
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

const getSnapshot = () => snapshot;
const getServerSnapshot = () => EMPTY;

function mutate(fn: (lines: CartLine[]) => CartLine[]) {
  snapshot = fn(snapshot);
  persist(snapshot);
  emit();
}

/** True only after hydration, without an effect. */
const noopSubscribe = () => () => {};
function useHydrated(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

export function useCart() {
  const lines = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const ready = useHydrated();

  return {
    lines,
    count: totalQuantity(lines),
    ready,
    add: (
      handle: string,
      size: string,
      quantity = 1,
      options: VariantOptions = {},
    ) => mutate((l) => addLine(l, handle, size, quantity, options)),
    update: (id: string, quantity: number) =>
      mutate((l) => setQuantity(l, id, quantity)),
    remove: (id: string) => mutate((l) => removeLine(l, id)),
    clear: () => mutate(() => EMPTY),
  };
}

/**
 * Kept so the layout has one obvious place to wrap the app, and so swapping in
 * a provider-based client (Shopify) later needs no change at the call sites.
 */
export function CartProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
