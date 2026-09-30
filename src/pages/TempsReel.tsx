import { useEffect, useState } from 'react';
import { Card, Typography, Descriptions, Table, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { Invoice, InvoiceLine } from '@/lib/invoiceApi';
import { normalizeToInvoice } from '@/lib/normalizeInvoice';
import { getWsBase } from '@/components/InvoiceViewer';

const columns: ColumnsType<InvoiceLine> = [
  { title: 'Désignation', dataIndex: 'description' },
  { title: 'Qté', dataIndex: 'quantity', width: 80 },
  { title: 'PU', dataIndex: 'unitPrice', width: 120 },
  { title: 'Total', dataIndex: 'total', width: 120 },
];

export default function TempsReel() {
  const [invoice, setInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    const ws = new WebSocket(`${getWsBase()}/ws`);
    ws.onmessage = (ev) => {
      try {
        setInvoice(normalizeToInvoice(JSON.parse(ev.data)));
      } catch (e) {
        console.warn('Invalid WebSocket message', e);
      }
    };
    return () => ws.close();
  }, []);

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Typography.Title level={4}>Flux en temps réel (WebSocket)</Typography.Title>

      <Card>
        {invoice ? (
          <Descriptions title="Facture reçue" bordered column={1} size="small">
            <Descriptions.Item label="N° facture">{invoice.invoiceNumber || invoice.id}</Descriptions.Item>
            <Descriptions.Item label="Date">{invoice.date.slice(0, 10)}</Descriptions.Item>
            <Descriptions.Item label="Fournisseur">{invoice.supplierName || '—'}</Descriptions.Item>
            <Descriptions.Item label="Total">
              {invoice.total} {invoice.currency}
            </Descriptions.Item>
          </Descriptions>
        ) : (
          <Typography.Text type="secondary">En attente de données depuis /ws…</Typography.Text>
        )}
      </Card>

      <Card title="Lignes">
        <Table<InvoiceLine>
          rowKey="id"
          dataSource={invoice?.lines || []}
          columns={columns}
          pagination={false}
          size="small"
        />
      </Card>
    </Space>
  );
}
