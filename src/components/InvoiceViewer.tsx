import { useEffect, useState } from 'react';
import { Card, Empty, Space, Tag, Typography } from 'antd';
import type { Invoice } from '@/lib/invoiceApi';
import { normalizeToInvoice } from '@/lib/normalizeInvoice';

type Status = 'connecting' | 'connected' | 'error' | 'closed';

const statusColor: Record<Status, string> = {
  connecting: 'processing',
  connected: 'success',
  error: 'error',
  closed: 'default',
};

export function getWsBase(): string {
  return (import.meta.env.VITE_WS_BASE as string | undefined) || window.location.origin.replace(/^http/, 'ws');
}

export default function InvoiceViewer() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [status, setStatus] = useState<Status>('connecting');

  useEffect(() => {
    const ws = new WebSocket(`${getWsBase()}/ws`);
    ws.onopen = () => setStatus('connected');
    ws.onerror = () => setStatus('error');
    ws.onclose = () => setStatus('closed');
    ws.onmessage = (event) => {
      try {
        const invoice = normalizeToInvoice(JSON.parse(event.data));
        setInvoices((prev) => [invoice, ...prev]);
      } catch (e) {
        console.warn('Invalid WebSocket message', e);
      }
    };
    return () => ws.close();
  }, []);

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Tag color={statusColor[status]}>WebSocket: {status}</Tag>
      {invoices.length === 0 ? (
        <Empty description="En attente de factures…" />
      ) : (
        invoices.map((invoice, index) => (
          <Card key={`${invoice.id}-${index}`} size="small" title={`Facture ${invoice.invoiceNumber || invoice.id}`}>
            <Typography.Paragraph style={{ marginBottom: 8 }}>
              {invoice.supplierName || 'Fournisseur inconnu'} · {invoice.date.slice(0, 10)}
            </Typography.Paragraph>
            <ul>
              {invoice.lines.map((line) => (
                <li key={line.id}>
                  {line.description} — {line.quantity} × {line.unitPrice} = {line.total}
                </li>
              ))}
            </ul>
            <Typography.Text strong>
              Sous-total: {invoice.subtotal} | TVA: {invoice.tax} | Total: {invoice.total} {invoice.currency}
            </Typography.Text>
          </Card>
        ))
      )}
    </Space>
  );
}
