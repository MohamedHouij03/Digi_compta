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

export async function fetchExtraction(): Promise<ExtractedInvoice> {
  const url = (import.meta.env.VITE_N8N_EXTRACTION_URL as string | undefined) || `${getApiBase()}/pdf-data`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Extraction GET failed: ${res.status}`);
  if ((res.headers.get('content-type') || '').includes('application/json')) {
    return (await res.json()) as ExtractedInvoice;
  }
  return { supplierName: await res.text() };
}

export async function fetchLastStoredExtraction(): Promise<ExtractedInvoice> {
  const res = await fetch(`${getApiBase()}/pdf-data`);
  if (!res.ok) throw new Error(`pdf-data GET failed: ${res.status}`);
  return (await res.json()) as ExtractedInvoice;
}
