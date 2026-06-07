export type ExtractedInvoice = {
  id?: string;
  supplierName?: string;
  supplierVat?: string;
  invoiceNumber?: string;
  date?: string; // ISO
  currency?: string;
  subtotal?: number;
  tax?: number;
  total?: number;
  lines?: Array<{ id?: string; description?: string; quantity?: number; unitPrice?: number; total?: number }>;
};

function getApiBase(): string {
  return (import.meta.env.VITE_API_BASE as string | undefined) || '/api';
}

function getWebhookUrl(): string {
  const apiBase = getApiBase();
  return (import.meta.env.VITE_N8N_EXTRACTION_URL as string | undefined) || `${apiBase}/webhook`;
}

export async function fetchExtraction(): Promise<ExtractedInvoice> {
  const url = getWebhookUrl();
  const res = await fetch(url, { method: 'GET' });
  if (!res.ok) throw new Error(`Extraction GET failed: ${res.status}`);
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) {
    return (await res.json()) as ExtractedInvoice;
  }
  // Non-JSON fallback
  const text = await res.text();
  return { supplierName: text };
}

export async function fetchLastStoredExtraction(): Promise<ExtractedInvoice> {
  const apiBase = getApiBase();
  const url = `${apiBase}/pdf-data`;
  const res = await fetch(url, { method: 'GET' });
  if (!res.ok) throw new Error(`pdf-data GET failed: ${res.status}`);
  return (await res.json()) as ExtractedInvoice;
}
