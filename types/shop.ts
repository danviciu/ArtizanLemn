export type CartItem = {
  lineId: string;
  slug: string;
  title: string;
  featuredImage: string;
  category: string;
  quantity: number;
  sizeOptionId: string | null;
  sizeLabel: string | null;
  unitPrice: number | null;
  createdAt: string;
};

export type CartAddItemPayload = {
  slug: string;
  title: string;
  featuredImage: string;
  category: string;
  quantity?: number;
  sizeOptionId?: string | null;
  sizeLabel?: string | null;
  unitPrice: number | null;
};

export type CheckoutDeliveryMethod = "curier" | "ridicare_personala";
export type CheckoutPaymentMethod = "transfer_bancar" | "ramburs";

export type CheckoutCreateOrderPayload = {
  customerName: string;
  phone: string;
  email: string;
  county: string;
  city: string;
  address: string;
  notes?: string;
  deliveryMethod: CheckoutDeliveryMethod;
  paymentMethod: CheckoutPaymentMethod;
  acceptTerms: boolean;
  items: Array<{
    slug: string;
    quantity: number;
    sizeOptionId?: string | null;
  }>;
};

export type StoredCheckoutOrderItem = {
  lineId: string;
  slug: string;
  title: string;
  featuredImage: string;
  category: string;
  quantity: number;
  sizeOptionId: string | null;
  sizeLabel: string | null;
  unitPrice: number | null;
  lineTotal: number | null;
};

export type StoredCheckoutOrder = {
  id: string;
  orderNumber: string;
  createdAt: string;
  updatedAt: string;
  status: "nou";
  customerName: string;
  phone: string;
  email: string;
  county: string;
  city: string;
  address: string;
  notes: string | null;
  deliveryMethod: CheckoutDeliveryMethod;
  paymentMethod: CheckoutPaymentMethod;
  items: StoredCheckoutOrderItem[];
  subtotalFixed: number;
  hasOnRequestItems: boolean;
};
