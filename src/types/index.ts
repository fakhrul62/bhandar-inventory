export type CartItem = {
  productId: string;
  variantId?: string;
  name: string;
  imageUrl?: string;
  quantity: number;
  unitPrice: number;
  currency: "BDT" | "USD";
};
