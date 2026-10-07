import { Paise } from "./types";

export interface GstLineInput {
  unitPricePaise: Paise; // GST-inclusive
  qty: number;
  gstRate: number; // e.g. 5, 12, 18, 28
  discountPaise?: Paise;
}

export interface GstLineOutput {
  taxableValue: Paise;
  gstAmount: Paise;
  cgst: Paise;
  sgst: Paise;
  igst: Paise;
  lineTotal: Paise;
}

export interface GstCalculationResult {
  lines: GstLineOutput[];
  taxableTotal: Paise;
  cgstTotal: Paise;
  sgstTotal: Paise;
  igstTotal: Paise;
  taxTotal: Paise;
  subtotal: Paise;
  roundOff: Paise;
  grandTotal: Paise;
  isInterState: boolean;
  hsnSummary: Record<string, { taxable: Paise; cgst: Paise; sgst: Paise; igst: Paise; total: Paise }>;
}

export function calculateGst(
  lines: (GstLineInput & { hsnCode?: string })[],
  businessStateCode: string = "16", // Default Tripura
  placeOfSupplyStateCode: string = "16"
): GstCalculationResult {
  const isInterState = businessStateCode !== placeOfSupplyStateCode;

  let taxableTotal = 0;
  let cgstTotal = 0;
  let sgstTotal = 0;
  let igstTotal = 0;
  let subtotal = 0;

  const hsnSummary: Record<string, { taxable: Paise; cgst: Paise; sgst: Paise; igst: Paise; total: Paise }> = {};

  const lineOutputs: GstLineOutput[] = lines.map((line) => {
    const grossTotal = line.unitPricePaise * line.qty;
    const discount = line.discountPaise || 0;
    const netTotal = Math.max(0, grossTotal - discount);

    // Back-calculate taxable from GST-inclusive amount:
    // Net = Taxable * (1 + rate/100) => Taxable = Net / (1 + rate/100)
    const rateFactor = 1 + line.gstRate / 100;
    const taxableValue = Math.round(netTotal / rateFactor);
    const gstAmount = netTotal - taxableValue;

    let cgst = 0;
    let sgst = 0;
    let igst = 0;

    if (isInterState) {
      igst = gstAmount;
    } else {
      cgst = Math.round(gstAmount / 2);
      sgst = gstAmount - cgst; // prevent 1-paise divergence
    }

    taxableTotal += taxableValue;
    cgstTotal += cgst;
    sgstTotal += sgst;
    igstTotal += igst;
    subtotal += netTotal;

    const hsn = line.hsnCode || "GENERAL";
    if (!hsnSummary[hsn]) {
      hsnSummary[hsn] = { taxable: 0, cgst: 0, sgst: 0, igst: 0, total: 0 };
    }
    hsnSummary[hsn].taxable += taxableValue;
    hsnSummary[hsn].cgst += cgst;
    hsnSummary[hsn].sgst += sgst;
    hsnSummary[hsn].igst += igst;
    hsnSummary[hsn].total += netTotal;

    return {
      taxableValue,
      gstAmount,
      cgst,
      sgst,
      igst,
      lineTotal: netTotal,
    };
  });

  const taxTotal = cgstTotal + sgstTotal + igstTotal;
  // Round off to nearest rupee (100 paise)
  const exactTotal = subtotal;
  const roundedGrandTotal = Math.round(exactTotal / 100) * 100;
  const roundOff = roundedGrandTotal - exactTotal;

  return {
    lines: lineOutputs,
    taxableTotal,
    cgstTotal,
    sgstTotal,
    igstTotal,
    taxTotal,
    subtotal,
    roundOff,
    grandTotal: roundedGrandTotal,
    isInterState,
    hsnSummary,
  };
}

export function formatPaiseToInr(paise: Paise): string {
  const rupees = paise / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(rupees);
}
