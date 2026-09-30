export async function triggerN8nInvoiceUpload<T = unknown>(file: File, extra?: Record<string, string | number>) {
  const apiBase = (import.meta.env.VITE_API_BASE as string | undefined) || '/api';
  const webhookUrl = (import.meta.env.VITE_N8N_WEBHOOK_URL as string | undefined) || `${apiBase}/upload-invoice`;

  const formData = new FormData();
  formData.append('file', file, file.name);
  formData.append('name', file.name);
  formData.append('type', file.type);
  formData.append('size', String(file.size));
  formData.append('createdAt', String(Date.now()));
  if (extra) {
    for (const [k, v] of Object.entries(extra)) formData.append(k, String(v));
  }

  try {
    const res = await fetch(webhookUrl, { method: 'POST', body: formData, mode: 'cors' });
    let data: T | undefined;
    if ((res.headers.get('content-type') || '').includes('application/json')) {
      try {
        data = await res.json();
      } catch {
        data = undefined;
      }
    }
    return { ok: res.ok, status: res.status, data };
  } catch (error) {
    return { ok: false, status: 0, data: undefined, error: (error as Error).message };
  }
}
