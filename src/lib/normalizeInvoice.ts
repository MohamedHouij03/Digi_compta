import type { Invoice, InvoiceLine } from '@/lib/invoiceApi';
import dayjs from 'dayjs';

// ---------- helpers ----------
function unwrapN8N(raw: any): any {
  let b = raw ?? {};
  if (Array.isArray(b) && b.length) b = b[0];
  if (b && typeof b === 'object' && b.json && typeof b.json === 'object') b = b.json;
  if (b && typeof b === 'object' && b.output && typeof b.output === 'object') b = b.output;
  return b ?? {};
}

// accept "1 500", "1 500" (NBSP), "1,500", "1 500,25", "1,500.25"
function toNumber(value: any, fallback = 0): number {
  if (value === null || value === undefined || value === '') return fallback;
  if (typeof value === 'number' && Number.isFinite(value)) return value;

  let s = String(value).trim();
  // remove spaces and NBSP
  s = s.replace(/\u00A0/g, '').replace(/\s+/g, '');

  // keep only digits, signs, separators
  s = s.replace(/[^0-9.,+-]/g, '');

  const hasComma = s.includes(',');
  const hasDot = s.includes('.');

  if (hasComma && hasDot) {
    // assume comma is thousands sep → drop commas
    s = s.replace(/,/g, '');
  } else if (hasComma && !hasDot) {
    // assume comma is decimal sep
    s = s.replace(/,/g, '.');
  }
  const n = Number(s);
  return Number.isFinite(n) ? n : fallback;
}

function toIsoDate(value: any): string {
  if (!value) return new Date().toISOString();
  const d = dayjs(value);
  return d.isValid() ? d.toISOString() : new Date().toISOString();
}

function currencyCode(c: any): string {
  if (!c) return 'TND';
  const s = String(c).trim();
  if (s === '€') return 'EUR';
  if (s === '$') return 'USD';
  return s;
}

function normLine(l: any, idx: number): InvoiceLine {
  const quantity = toNumber(l?.quantity ?? l?.qty ?? l?.qte, 0);
  const unitPrice = toNumber(l?.unitPrice ?? l?.unit_price ?? l?.price_unit ?? l?.price, 0);
  const total = toNumber(l?.total, quantity * unitPrice);
  return {
    id: String(l?.id ?? idx + 1),
    description: l?.description ?? l?.designation ?? l?.item ?? '',
    quantity,
    unitPrice,
    total,
  };
}

// ---------- main ----------
export function normalizeToInvoice(input: any): Invoice {
  const raw = unwrapN8N(input);

  // source blocks
  const supplier =
    raw?.supplier ?? raw?.vendor ?? raw?.seller ?? {};
  const customer = raw?.customer ?? raw?.buyer ?? {};

  const supplierName =
    raw?.supplierName ?? supplier?.name ?? customer?.name ?? '';
  const supplierVat =
    raw?.supplierVat ?? supplier?.vat ?? supplier?.vat_number ?? customer?.vat ?? '';
  const supplierAddress =
    raw?.supplierAddress ?? supplier?.address ?? customer?.address ?? '';
  const supplierPhone =
    raw?.supplierPhone ?? supplier?.phone ?? customer?.phone ?? '';
  const supplierEmail =
    raw?.supplierEmail ?? supplier?.email ?? customer?.email ?? '';

  const invoiceNumber =
    raw?.invoiceNumber ??
    raw?.invoice_number ??
    raw?.invoiceNo ??
    raw?.invoice_no ??
    raw?.number ??
    raw?.invoice_id ?? // <-- important fallback
    '';

  const date = toIsoDate(raw?.date ?? raw?.invoiceDate ?? raw?.issued_at ?? raw?.issue_date);
  const currency = currencyCode(raw?.currency ?? raw?.devise);

  const linesSrc: any[] = Array.isArray(raw?.lines)
    ? raw?.lines
    : Array.isArray(raw?.items)
    ? raw?.items
    : [];
  const lines = linesSrc.map(normLine);

  const providedSubtotal = toNumber(raw?.subtotal, NaN);
  const computedSubtotal = Number.isFinite(providedSubtotal)
    ? providedSubtotal
    : lines.reduce((s, l) => s + toNumber(l.total, 0), 0);

  const providedTax = toNumber(raw?.tax ?? raw?.vat, NaN);
  const tax = Number.isFinite(providedTax) ? providedTax : +(computedSubtotal * 0.19).toFixed(2);

  const providedTotal = toNumber(raw?.total, NaN);
  const total = Number.isFinite(providedTotal) ? providedTotal : +(computedSubtotal + tax).toFixed(2);

  return {
    id: String(raw?.id ?? (invoiceNumber || 'from-n8n')),
    supplierName,
    supplierVat,
    supplierAddress,
    supplierPhone,
    supplierEmail,
    invoiceNumber,
    date,
    currency,
    subtotal: +computedSubtotal.toFixed(2),
    tax,
    total,
    lines,
  };
}
