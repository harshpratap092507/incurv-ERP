import type { POHeader, POLine, POLineStatus, VendorDetails } from "./types";
import { findCatalogItem } from "../catalog";

let nextId = 900;
const newId = () => ++nextId;

export function emptyPOLine(): POLine {
  return {
    id: newId(),
    itemCode: "",
    description: "",
    qty: 0,
    unit: "Each",
    unitPrice: null,
    discountPct: 0,
    taxPct: 18,
    deliveryDate: "2026-08-12",
  };
}

export interface POState {
  header: POHeader;
  vendor: VendorDetails;
  lines: POLine[];
}

export const initialPOState: POState = {
  header: {
    poNumber: "PO-2026-00142",
    orderDate: "2026-07-29",
    expectedDelivery: "2026-08-12",
    paymentTerms: "Net 30",
    currency: "INR ₹",
    warehouse: "Central Warehouse - A1",
    costCenter: "IT-OPS",
    priority: "Medium",
  },
  vendor: {
    vendorName: "Acme Supplies Pvt Ltd",
    gstin: "29ABCDE1234F1Z5",
    primaryContact: "John Doe",
    email: "john.doe@acmesupplies.com",
    billingAddress: "Acme Supplies Pvt Ltd\n12, Industrial Estate, Whitefield\nBengaluru, Karnataka 560066",
    shippingAddress: "Acme Supplies Pvt Ltd\n12, Industrial Estate, Whitefield\nBengaluru, Karnataka 560066",
    incoterms: "DAP - Delivered at Place",
  },
  lines: [
    {
      id: newId(),
      itemCode: "IT-SRV-992",
      description: "Dell Latitude 5420 Workstation",
      qty: 5,
      unit: "Each",
      unitPrice: 125000,
      discountPct: 5,
      taxPct: 18,
      deliveryDate: "2026-08-12",
    },
    {
      id: newId(),
      itemCode: "IT-ACC-118",
      description: "USB-C Docking Station",
      qty: 12,
      unit: "Box",
      unitPrice: 8545,
      discountPct: 0,
      taxPct: 18,
      deliveryDate: "2026-08-14",
    },
  ],
};

export type POAction =
  | { type: "header"; patch: Partial<POHeader> }
  | { type: "vendor"; patch: Partial<VendorDetails> }
  | { type: "addLine" }
  | { type: "updateLine"; id: number; patch: Partial<POLine> }
  | { type: "setItemCode"; id: number; code: string }
  | { type: "duplicateLine"; id: number }
  | { type: "deleteLine"; id: number };

export function poReducer(state: POState, action: POAction): POState {
  switch (action.type) {
    case "header":
      return { ...state, header: { ...state.header, ...action.patch } };

    case "vendor":
      return { ...state, vendor: { ...state.vendor, ...action.patch } };

    case "addLine":
      return { ...state, lines: [...state.lines, emptyPOLine()] };

    case "updateLine":
      return {
        ...state,
        lines: state.lines.map((line) =>
          line.id === action.id ? { ...line, ...action.patch } : line
        ),
      };

    case "setItemCode": {
      const match = findCatalogItem(action.code);
      return {
        ...state,
        lines: state.lines.map((line) => {
          if (line.id !== action.id) return line;
          if (!match) return { ...line, itemCode: action.code };
          return {
            ...line,
            itemCode: match.code,
            description: match.description,
            unit: match.unit,
            unitPrice: match.unitPrice,
            taxPct: match.taxPct,
            qty: line.qty || 1,
          };
        }),
      };
    }

    case "duplicateLine": {
      const source = state.lines.find((line) => line.id === action.id);
      if (!source) return state;
      const index = state.lines.indexOf(source);
      const copy = { ...source, id: newId() };
      const lines = [...state.lines];
      lines.splice(index + 1, 0, copy);
      return { ...state, lines };
    }

    case "deleteLine":
      return { ...state, lines: state.lines.filter((line) => line.id !== action.id) };
  }
}

export function poLineStatus(line: POLine): POLineStatus {
  const untouched =
    !line.itemCode && !line.description && line.qty === 0 && line.unitPrice == null;
  if (untouched) return { kind: "empty" };
  if (!line.itemCode.trim()) return { kind: "error", message: "Item code required" };
  if (line.unitPrice == null || line.unitPrice <= 0)
    return { kind: "error", message: "Unit price missing" };
  if (line.qty <= 0) return { kind: "error", message: "Qty must be > 0" };
  if (!line.deliveryDate) return { kind: "error", message: "Delivery date missing" };
  return { kind: "valid" };
}

export interface POLineComputed {
  gross: number;
  discountAmount: number;
  taxable: number;
  taxAmount: number;
  cgst: number;
  sgst: number;
  total: number;
}

export function computePOLine(line: POLine): POLineComputed {
  const price = line.unitPrice ?? 0;
  const gross = line.qty * price;
  const discountAmount = (gross * line.discountPct) / 100;
  const taxable = gross - discountAmount;
  const taxAmount = (taxable * line.taxPct) / 100;
  return {
    gross,
    discountAmount,
    taxable,
    taxAmount,
    cgst: taxAmount / 2,
    sgst: taxAmount / 2,
    total: taxable + taxAmount,
  };
}

export interface PODerived {
  validCount: number;
  errorCount: number;
  issues: { lineId: number; lineNo: number; message: string }[];
  totalQty: number;
  grossTotal: number;
  discountTotal: number;
  taxableTotal: number;
  cgst: number;
  sgst: number;
  grandTotal: number;
}

export function derivePO(lines: POLine[]): PODerived {
  let validCount = 0;
  const issues: PODerived["issues"] = [];
  let totalQty = 0;
  let grossTotal = 0;
  let discountTotal = 0;
  let taxableTotal = 0;
  let cgst = 0;
  let sgst = 0;

  lines.forEach((line, index) => {
    const status = poLineStatus(line);
    if (status.kind === "valid") {
      validCount += 1;
      totalQty += line.qty;
      const computed = computePOLine(line);
      grossTotal += computed.gross;
      discountTotal += computed.discountAmount;
      taxableTotal += computed.taxable;
      cgst += computed.cgst;
      sgst += computed.sgst;
    } else if (status.kind === "error") {
      issues.push({ lineId: line.id, lineNo: index + 1, message: status.message });
    }
  });

  return {
    validCount,
    errorCount: issues.length,
    issues,
    totalQty,
    grossTotal,
    discountTotal,
    taxableTotal,
    cgst,
    sgst,
    grandTotal: taxableTotal + cgst + sgst,
  };
}
