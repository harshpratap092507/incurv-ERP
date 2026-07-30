import type { CatalogItem } from "./types";

export const CATALOG: CatalogItem[] = [
  {
    code: "IT-SRV-992",
    description: "Dell Latitude 5420 Workstation",
    unit: "Each",
    unitPrice: 120000,
    taxPct: 18,
    glAccount: "6402-IT",
  },
  {
    code: "OFF-SUP-012",
    description: "Ergonomic Office Chair - Mesh",
    unit: "Each",
    unitPrice: 35000,
    taxPct: 18,
    glAccount: "6410-FAC",
  },
  {
    code: "IT-MON-441",
    description: '27" 4K Monitor',
    unit: "Each",
    unitPrice: 42000,
    taxPct: 18,
    glAccount: "6402-IT",
  },
  {
    code: "IT-ACC-118",
    description: "USB-C Docking Station",
    unit: "Each",
    unitPrice: 18000,
    taxPct: 18,
    glAccount: "6402-IT",
  },
  {
    code: "IT-KEY-210",
    description: "Mechanical Keyboard (Brown)",
    unit: "Each",
    unitPrice: 9500,
    taxPct: 18,
    glAccount: "6402-IT",
  },
  {
    code: "IT-MOU-311",
    description: "Wireless Mouse",
    unit: "Each",
    unitPrice: 2500,
    taxPct: 18,
    glAccount: "6402-IT",
  },
  {
    code: "FAC-DSK-101",
    description: "Standing Desk 140cm",
    unit: "Each",
    unitPrice: 52000,
    taxPct: 18,
    glAccount: "6410-FAC",
  },
];

export const UNITS = ["Each", "Box", "Pcs", "Set", "Pack"];

export function findCatalogItem(code: string): CatalogItem | undefined {
  return CATALOG.find(
    (item) => item.code.toLowerCase() === code.trim().toLowerCase()
  );
}

export function formatINR(value: number): string {
  return value.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
}
