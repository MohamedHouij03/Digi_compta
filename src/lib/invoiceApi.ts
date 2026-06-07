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

function getApiBase(): string | undefined {
  const apiBase = (import.meta.env.VITE_API_BASE as string | undefined) || '/api';
  return (import.meta.env.VITE_N8N_INVOICE_API_URL as string | undefined) || `${apiBase}/invoice`;
}

export async function fetchInvoice(id: string): Promise<Invoice> {
  const base = getApiBase();
  if (!base) {
    // Fallback mock if no n8n endpoint configured
    const subtotal = 2 * 100 + 1 * 250;
    const tax = +(subtotal * 0.19).toFixed(2);
    return {
      id,
      supplierName: 'ACME SARL',
      supplierVat: 'TN1234567',
      invoiceNumber: 'FAC-2025-001',
      date: new Date().toISOString(),
      currency: 'TND',
      subtotal,
      tax,
      total: +(subtotal + tax).toFixed(2),
      lines: [
        { id: 'l1', description: 'Service comptable', quantity: 2, unitPrice: 100, total: 200 },
        { id: 'l2', description: 'Licence logiciel', quantity: 1, unitPrice: 250, total: 250 },
      ],
    };
  }

  const url = `${base}?id=${encodeURIComponent(id)}`;
  const res = await fetch(url, { method: 'GET' });
  if (!res.ok) throw new Error(`n8n GET failed: ${res.status}`);
  const data = (await res.json()) as Invoice;
  return data;
}

export async function saveInvoice(invoice: Invoice): Promise<void> {
  const base = getApiBase();
  if (!base) return; // silently ignore in mock mode

  const res = await fetch(base, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(invoice),
  });
  if (!res.ok) throw new Error(`n8n POST failed: ${res.status}`);
}


