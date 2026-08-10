"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import type { CartAddItemPayload, CartItem } from "@/types/shop";

const CART_STORAGE_KEY = "artizan_cart_v1";
const CART_EVENT = "artizan-cart-updated";
const CART_SERVER_SNAPSHOT = "__ARTIZAN_CART_SERVER_SNAPSHOT__";

type CartContextValue = {
  items: CartItem[];
  isReady: boolean;
  itemCount: number;
  subtotalFixed: number;
  hasOnRequestItems: boolean;
  addItem: (payload: CartAddItemPayload) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  removeItem: (lineId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

function buildCartLineId(slug: string, sizeOptionId?: string | null) {
  return `${slug}::${sizeOptionId ?? "default"}`;
}

function parseStoredCart(raw: string | null): CartItem[] {
  if (!raw || raw === CART_SERVER_SNAPSHOT) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter(
        (item): item is CartItem =>
          item &&
          typeof item === "object" &&
          typeof item.lineId === "string" &&
          typeof item.slug === "string" &&
          typeof item.title === "string" &&
          typeof item.featuredImage === "string" &&
          typeof item.category === "string" &&
          typeof item.quantity === "number",
      )
      .map((item) => ({
        ...item,
        quantity: Math.max(1, Math.floor(item.quantity)),
        sizeOptionId:
          typeof item.sizeOptionId === "string" ? item.sizeOptionId : null,
        sizeLabel: typeof item.sizeLabel === "string" ? item.sizeLabel : null,
        unitPrice: typeof item.unitPrice === "number" ? item.unitPrice : null,
      }));
  } catch {
    return [];
  }
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const onStorageChange = () => callback();
  const onCartChange = () => callback();

  window.addEventListener("storage", onStorageChange);
  window.addEventListener(CART_EVENT, onCartChange);

  return () => {
    window.removeEventListener("storage", onStorageChange);
    window.removeEventListener(CART_EVENT, onCartChange);
  };
}

function getSnapshot() {
  if (typeof window === "undefined") {
    return "[]";
  }

  return window.localStorage.getItem(CART_STORAGE_KEY) ?? "[]";
}

function emitCartChange() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(CART_EVENT));
}

function commitCartMutation(mutator: (items: CartItem[]) => CartItem[]) {
  if (typeof window === "undefined") {
    return;
  }

  const current = parseStoredCart(window.localStorage.getItem(CART_STORAGE_KEY));
  const next = mutator(current);
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(next));
  emitCartChange();
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const rawSnapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => CART_SERVER_SNAPSHOT,
  );
  const items = useMemo(() => parseStoredCart(rawSnapshot), [rawSnapshot]);
  const isReady = rawSnapshot !== CART_SERVER_SNAPSHOT;

  const addItem = useCallback((payload: CartAddItemPayload) => {
    const nextQuantity = Math.max(1, Math.floor(payload.quantity ?? 1));
    const lineId = buildCartLineId(payload.slug, payload.sizeOptionId);

    commitCartMutation((current) => {
      const existing = current.find((item) => item.lineId === lineId);
      if (existing) {
        return current.map((item) =>
          item.lineId === lineId
            ? {
                ...item,
                quantity: item.quantity + nextQuantity,
                unitPrice: payload.unitPrice,
                sizeLabel: payload.sizeLabel ?? item.sizeLabel,
              }
            : item,
        );
      }

      const item: CartItem = {
        lineId,
        slug: payload.slug,
        title: payload.title,
        featuredImage: payload.featuredImage,
        category: payload.category,
        quantity: nextQuantity,
        sizeOptionId: payload.sizeOptionId ?? null,
        sizeLabel: payload.sizeLabel ?? null,
        unitPrice: payload.unitPrice,
        createdAt: new Date().toISOString(),
      };

      return [item, ...current];
    });
  }, []);

  const updateQuantity = useCallback((lineId: string, quantity: number) => {
    const nextQuantity = Math.floor(quantity);

    commitCartMutation((current) => {
      if (nextQuantity <= 0) {
        return current.filter((item) => item.lineId !== lineId);
      }

      return current.map((item) =>
        item.lineId === lineId ? { ...item, quantity: nextQuantity } : item,
      );
    });
  }, []);

  const removeItem = useCallback((lineId: string) => {
    commitCartMutation((current) => current.filter((item) => item.lineId !== lineId));
  }, []);

  const clearCart = useCallback(() => {
    commitCartMutation(() => []);
  }, []);

  const itemCount = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items],
  );

  const subtotalFixed = useMemo(
    () =>
      items.reduce((total, item) => {
        if (item.unitPrice === null) {
          return total;
        }
        return total + item.unitPrice * item.quantity;
      }, 0),
    [items],
  );

  const hasOnRequestItems = useMemo(
    () => items.some((item) => item.unitPrice === null),
    [items],
  );

  const value: CartContextValue = {
    items,
    isReady,
    itemCount,
    subtotalFixed,
    hasOnRequestItems,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart trebuie folosit in interiorul CartProvider.");
  }

  return context;
}
