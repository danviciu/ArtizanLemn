import "server-only";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import type { StoredCheckoutOrder } from "@/types/shop";

const ORDERS_FILE_PATH = path.join(process.cwd(), "data", "customerOrders.json");

type CreateStoredOrderInput = Omit<
  StoredCheckoutOrder,
  "id" | "orderNumber" | "createdAt" | "updatedAt" | "status"
>;

async function ensureStorageFile() {
  try {
    await fs.access(ORDERS_FILE_PATH);
  } catch {
    await fs.mkdir(path.dirname(ORDERS_FILE_PATH), { recursive: true });
    await fs.writeFile(ORDERS_FILE_PATH, "[]\n", "utf8");
  }
}

async function readStoredOrders() {
  await ensureStorageFile();
  const raw = await fs.readFile(ORDERS_FILE_PATH, "utf8");

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [] as StoredCheckoutOrder[];
    }

    return parsed as StoredCheckoutOrder[];
  } catch {
    return [] as StoredCheckoutOrder[];
  }
}

async function writeStoredOrders(orders: StoredCheckoutOrder[]) {
  await fs.writeFile(ORDERS_FILE_PATH, `${JSON.stringify(orders, null, 2)}\n`, "utf8");
}

function generateOrderNumber(createdAt: Date) {
  const year = createdAt.getUTCFullYear();
  const month = `${createdAt.getUTCMonth() + 1}`.padStart(2, "0");
  const day = `${createdAt.getUTCDate()}`.padStart(2, "0");
  const suffix = Math.floor(Math.random() * 9000 + 1000);
  return `CMD-${year}${month}${day}-${suffix}`;
}

export async function listStoredCheckoutOrders() {
  return readStoredOrders();
}

export async function getStoredCheckoutOrderById(id: string) {
  const orders = await readStoredOrders();
  return orders.find((order) => order.id === id) ?? null;
}

export async function createStoredCheckoutOrder(input: CreateStoredOrderInput) {
  const orders = await readStoredOrders();
  const now = new Date();

  const order: StoredCheckoutOrder = {
    id: `ord-web-${crypto.randomUUID()}`,
    orderNumber: generateOrderNumber(now),
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    status: "nou",
    ...input,
  };

  orders.unshift(order);
  await writeStoredOrders(orders);

  return order;
}
