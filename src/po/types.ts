export type Priority = "Low" | "Medium" | "High";

export interface POHeader {
  poNumber: string;
  orderDate: string;
  expectedDelivery: string;
  paymentTerms: string;
  currency: string;
  warehouse: string;
  costCenter: string;
  priority: Priority;
}

export interface VendorDetails {
  vendorName: string;
  gstin: string;
  primaryContact: string;
  email: string;
  billingAddress: string;
  shippingAddress: string;
  incoterms: string;
}

export interface POLine {
  id: number;
  itemCode: string;
  description: string;
  qty: number;
  unit: string;
  unitPrice: number | null;
  discountPct: number;
  taxPct: number;
  deliveryDate: string;
}

export type POLineStatus =
  | { kind: "valid" }
  | { kind: "empty" }
  | { kind: "error"; message: string };
