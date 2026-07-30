import type {
  LineIssue,
  LineStatus,
  RequisitionHeader,
  RequisitionLine,
} from "./types";
import { findCatalogItem } from "./catalog";
import { clearDraft, loadDraft, saveDraft } from "./lib/draftStorage";

let nextId = 100;
const newId = () => ++nextId;

export function emptyLine(): RequisitionLine {
  return {
    id: newId(),
    itemCode: "",
    description: "",
    qty: 0,
    unit: "Each",
    unitPrice: null,
    taxPct: 18,
    glAccount: "",
    requiredDate: "2026-08-15",
  };
}

export interface FormState {
  header: RequisitionHeader;
  lines: RequisitionLine[];
  selected: Set<number>;
}

export const initialState: FormState = {
  header: {
    requestedBy: "Alex Rivera",
    department: "IT Operations",
    costCenter: "IT-OPS-01",
    requiredBy: "2026-08-15",
    priority: "High",
    budgetAvailable: 5000000,
    preferredVendor: "Acme Supplies",
    justification: "Quarterly hardware refresh for dev team",
  },
  lines: [
    {
      id: newId(),
      itemCode: "IT-SRV-992",
      description: "Dell Latitude 5420 Workstation",
      qty: 12,
      unit: "Each",
      unitPrice: 120000,
      taxPct: 18,
      glAccount: "6402-IT",
      requiredDate: "2026-08-15",
    },
    {
      id: newId(),
      itemCode: "OFF-SUP-012",
      description: "Ergonomic Office Chair - Mesh",
      qty: 25,
      unit: "Each",
      unitPrice: 35000,
      taxPct: 18,
      glAccount: "6410-FAC",
      requiredDate: "2026-08-15",
    },
    {
      id: newId(),
      itemCode: "IT-KEY-210",
      description: "Mechanical Keyboard (Brown)",
      qty: 15,
      unit: "Each",
      unitPrice: null,
      taxPct: 18,
      glAccount: "6402-IT",
      requiredDate: "2026-08-15",
    },
    {
      id: newId(),
      itemCode: "IT-MOU-311",
      description: "Wireless Mouse",
      qty: 0,
      unit: "Each",
      unitPrice: 2500,
      taxPct: 18,
      glAccount: "6402-IT",
      requiredDate: "2026-08-15",
    },
  ],
  selected: new Set(),
};

export type Action =
  | { type: "header"; patch: Partial<RequisitionHeader> }
  | { type: "addLine" }
  | { type: "updateLine"; id: number; patch: Partial<RequisitionLine> }
  | { type: "setItemCode"; id: number; code: string }
  | { type: "duplicateLine"; id: number }
  | { type: "deleteLine"; id: number }
  | { type: "toggleSelect"; id: number }
  | { type: "toggleSelectAll" }
  | { type: "deleteSelected" }
  | { type: "reset" };

export function reducer(state: FormState, action: Action): FormState {
  switch (action.type) {
    case "header":
      return { ...state, header: { ...state.header, ...action.patch } };

    case "addLine":
      return { ...state, lines: [...state.lines, emptyLine()] };

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
            glAccount: match.glAccount,
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

    case "deleteLine": {
      const selected = new Set(state.selected);
      selected.delete(action.id);
      return {
        ...state,
        selected,
        lines: state.lines.filter((line) => line.id !== action.id),
      };
    }

    case "toggleSelect": {
      const selected = new Set(state.selected);
      if (selected.has(action.id)) selected.delete(action.id);
      else selected.add(action.id);
      return { ...state, selected };
    }

    case "toggleSelectAll": {
      const allSelected = state.lines.every((line) =>
        state.selected.has(line.id)
      );
      return {
        ...state,
        selected: allSelected
          ? new Set()
          : new Set(state.lines.map((line) => line.id)),
      };
    }

    case "deleteSelected":
      return {
        ...state,
        selected: new Set(),
        lines: state.lines.filter((line) => !state.selected.has(line.id)),
      };

    case "reset":
      return initialState;
  }
}

const DRAFT_KEY = "incurv-erp:requisition-draft";

interface StoredFormState {
  header: RequisitionHeader;
  lines: RequisitionLine[];
}

export function loadInitialState(): FormState {
  const stored = loadDraft<StoredFormState | null>(DRAFT_KEY, null);
  if (!stored) return initialState;
  return { header: stored.header, lines: stored.lines, selected: new Set() };
}

export function persistState(state: FormState): void {
  saveDraft<StoredFormState>(DRAFT_KEY, { header: state.header, lines: state.lines });
}

export function clearPersistedState(): void {
  clearDraft(DRAFT_KEY);
}

export function lineStatus(line: RequisitionLine): LineStatus {
  const untouched =
    !line.itemCode && !line.description && line.qty === 0 && line.unitPrice == null;
  if (untouched) return { kind: "empty" };
  if (!line.itemCode.trim()) return { kind: "error", message: "Item code required" };
  if (line.unitPrice == null || line.unitPrice <= 0)
    return { kind: "error", message: "Unit price missing" };
  if (line.qty <= 0) return { kind: "error", message: "Qty must be > 0" };
  return { kind: "valid" };
}

export function lineTotal(line: RequisitionLine): number {
  if (line.unitPrice == null) return 0;
  return line.qty * line.unitPrice;
}

export interface Derived {
  validCount: number;
  errorCount: number;
  issues: LineIssue[];
  totalQty: number;
  subtotal: number;
  tax: number;
  grandTotal: number;
}

export function derive(lines: RequisitionLine[]): Derived {
  let validCount = 0;
  const issues: LineIssue[] = [];
  let totalQty = 0;
  let subtotal = 0;
  let tax = 0;

  lines.forEach((line, index) => {
    const status = lineStatus(line);
    if (status.kind === "valid") {
      validCount += 1;
      totalQty += line.qty;
      const total = lineTotal(line);
      subtotal += total;
      tax += (total * line.taxPct) / 100;
    } else if (status.kind === "error") {
      issues.push({ lineId: line.id, lineNo: index + 1, message: status.message });
    }
  });

  return {
    validCount,
    errorCount: issues.length,
    issues,
    totalQty,
    subtotal,
    tax,
    grandTotal: subtotal + tax,
  };
}
