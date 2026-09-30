export type InvoiceLine = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
};

export type Invoice = {
  id: string;
  supplierName: string;
  supplierVat?: string;
  supplierAddress?: string;
  supplierPhone?: string;
  supplierEmail?: string;
  invoiceNumber: string;
  date: string; // ISO
  currency: string;
  subtotal: number;
  tax: number;
  total: number;
  lines: InvoiceLine[];
};

function getInvoiceApiUrl(): string {
  const apiBase = (import.meta.env.VITE_API_BASE as string | undefined) || '/api';
  return (import.meta.env.VITE_N8N_INVOICE_API_URL as string | undefined) || `${apiBase}/invoice`;
}

export async function fetchInvoice(id: string): Promise<Invoice> {
  const res = await fetch(`${getInvoiceApiUrl()}?id=${encodeURIComponent(id)}`);
  if (!res.ok) throw new Error(`Invoice GET failed: ${res.status}`);
  return (await res.json()) as Invoice;
}

export async function saveInvoice(invoice: Invoice): Promise<void> {
  const res = await fetch(getInvoiceApiUrl(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(invoice),
  });
  if (!res.ok) throw new Error(`Invoice POST failed: ${res.status}`);
}
