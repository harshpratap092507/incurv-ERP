export type Priority = "Low" | "Medium" | "High";

export interface CatalogItem {
  code: string;
  description: string;
  unit: string;
  unitPrice: number;
  taxPct: number;
  glAccount: string;
}

export interface RequisitionLine {
  id: number;
  itemCode: string;
  description: string;
  qty: number;
  unit: string;
  unitPrice: number | null;
  taxPct: number;
  glAccount: string;
  requiredDate: string;
}

export interface RequisitionHeader {
  requestedBy: string;
  department: string;
  costCenter: string;
  requiredBy: string;
  priority: Priority;
  budgetAvailable: number;
  preferredVendor: string;
  justification: string;
}

export type LineIssue = { lineId: number; lineNo: number; message: string };

export type LineStatus =
  | { kind: "valid" }
  | { kind: "empty" }
  | { kind: "error"; message: string };
