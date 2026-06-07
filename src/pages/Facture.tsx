import { useEffect, useMemo, useState } from 'react';
import { Card, Form, Input, DatePicker, InputNumber, Button, Table, Space, Typography, message, Divider } from 'antd';
import dayjs from 'dayjs';
import type { ColumnsType } from 'antd/es/table';
import { fetchInvoice, saveInvoice, type Invoice, type InvoiceLine } from '@/lib/invoiceApi';
import { fetchExtraction, fetchLastStoredExtraction } from '@/lib/extractionApi';
import { normalizeToInvoice } from '@/lib/normalizeInvoice';
import InvoiceViewer from '@/components/InvoiceViewer';
import { useLocation } from 'react-router-dom';

export default function Facture() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    const stateInvoice = (location.state as any)?.invoice as Partial<Invoice> | undefined;
    if (stateInvoice) {
      const inv = normalizeToInvoice(stateInvoice);
      setInvoice(inv);
      form.setFieldsValue({ ...inv, date: inv.date ? dayjs(inv.date) : undefined } as any);
      setLoading(false);
    } else {
      // Prefer last stored extraction from backend storage, then try live extraction, then fallback invoice
      fetchLastStoredExtraction()
        .then((raw) => {
          const normalized = normalizeToInvoice(raw);
          setInvoice(normalized);
          form.setFieldsValue({ ...normalized, date: normalized.date ? dayjs(normalized.date) : undefined } as any);
        })
        .catch(() =>
          fetchExtraction()
            .then((raw) => {
              const normalized = normalizeToInvoice(raw);
              setInvoice(normalized);
              form.setFieldsValue({ ...normalized, date: normalized.date ? dayjs(normalized.date) : undefined } as any);
            })
            .catch(() =>
              fetchInvoice('demo').then((inv) => {
                const normalized = normalizeToInvoice(inv);
                setInvoice(normalized);
                form.setFieldsValue({ ...normalized, date: normalized.date ? dayjs(normalized.date) : undefined } as any);
              })
            )
        )
        .catch((e) => {
          console.error(e);
          message.error("Échec de chargement de la facture");
        })
        .finally(() => setLoading(false));
    }
  }, [form, location.state]);

  const columns: ColumnsType<InvoiceLine> = useMemo(() => [
    { title: 'Désignation', dataIndex: 'description' },
    { title: 'Qté', dataIndex: 'quantity', width: 80 },
    { title: 'PU', dataIndex: 'unitPrice', width: 120 },
    { title: 'Total', dataIndex: 'total', width: 120 },
  ], []);

  function pickInvoiceEditable(values: any) {
    return {
      supplierName: values.supplierName,
      supplierVat: values.supplierVat,
      invoiceNumber: values.invoiceNumber,
      date: values.date,
      currency: values.currency,
      // lines unchanged here; editing lines is not implemented in this form
    };
  }

  function toIsoDate(value: any, fallback: string): string {
    try {
      if (!value) return fallback;
      const d = dayjs(value);
      return d.isValid() ? d.toISOString() : fallback;
    } catch {
      return fallback;
    }
  }

  async function onSave(values: any) {
    if (!invoice) return;
    const lines: InvoiceLine[] = (values.lines || []).map((l: any, idx: number) => ({
      id: String(l?.id || idx + 1),
      description: l?.description || '',
      quantity: Number(l?.quantity ?? 0),
      unitPrice: Number(l?.unitPrice ?? 0),
      total: Number(l?.total ?? 0),
    }));

    const merged: Invoice = {
      id: invoice.id,
      supplierName: values.supplierName || '',
      supplierVat: values.supplierVat,
      supplierAddress: values.supplierAddress,
      supplierPhone: values.supplierPhone,
      supplierEmail: values.supplierEmail,
      invoiceNumber: values.invoiceNumber || '',
      date: toIsoDate(values.date, invoice.date),
      currency: values.currency || invoice.currency,
      subtotal: Number(values.subtotal ?? invoice.subtotal),
      tax: Number(values.tax ?? invoice.tax),
      total: Number(values.total ?? invoice.total),
      lines,
    } as Invoice;

    try {
      await saveInvoice(merged);
      setInvoice(merged);
      message.success('Facture enregistrée');
    } catch (e) {
      console.error(e);
      message.error("Échec d'enregistrement");
    }
  }

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <Typography.Title level={4}>Facture</Typography.Title>
      <Card loading={loading}>
        <Form form={form} layout="vertical" onFinish={onSave}>
          <Space style={{ display: 'flex' }} size="large" wrap>
            <Form.Item label="Fournisseur" name="supplierName" rules={[{ required: true, message: 'Requis' }]}> 
              <Input placeholder="Nom du fournisseur" />
            </Form.Item>
            <Form.Item label="Adresse fournisseur" name="supplierAddress">
              <Input placeholder="Adresse complète" />
            </Form.Item>
            <Form.Item label="Téléphone fournisseur" name="supplierPhone">
              <Input placeholder="Ex: +216 ..." />
            </Form.Item>
            <Form.Item label="Email fournisseur" name="supplierEmail" rules={[{ type: 'email', message: 'Email invalide' }]}> 
              <Input placeholder="contact@fournisseur.tn" />
            </Form.Item>
            <Form.Item label="Matricule TVA" name="supplierVat">
              <Input placeholder="TN..." />
            </Form.Item>
            <Form.Item label="N° facture" name="invoiceNumber" rules={[{ required: true, message: 'Requis' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Date" name="date" rules={[{ required: true, message: 'Requis' }]}>
              <DatePicker format="YYYY-MM-DD" />
            </Form.Item>
            <Form.Item label="Devise" name="currency" rules={[{ required: true, message: 'Requis' }]}>
              <Input style={{ width: 100 }} />
            </Form.Item>
          </Space>

          <Card size="small" title="Lignes">
            <Form.List name="lines">
              {(fields, { add, remove }) => (
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 0.5fr 0.8fr 0.8fr 0.4fr', gap: 12, fontWeight: 600 }}>
                    <div>Désignation</div>
                    <div>Qté</div>
                    <div>PU</div>
                    <div>Total</div>
                    <div>Actions</div>
                  </div>
                  {fields.map((field, idx) => (
                    <div key={field.key} style={{ display: 'grid', gridTemplateColumns: '2fr 0.5fr 0.8fr 0.8fr 0.4fr', gap: 12, alignItems: 'center' }}>
                      <Form.Item name={[field.name, 'id']} hidden>
                        <Input />
                      </Form.Item>
                      <Form.Item name={[field.name, 'description']} rules={[{ required: true, message: 'Requis' }]} style={{ marginBottom: 0 }}>
                        <Input placeholder="Désignation" />
                      </Form.Item>
                      <Form.Item name={[field.name, 'quantity']} rules={[{ required: true, message: 'Requis' }]} style={{ marginBottom: 0 }}>
                        <InputNumber min={0} style={{ width: '100%' }} />
                      </Form.Item>
                      <Form.Item name={[field.name, 'unitPrice']} rules={[{ required: true, message: 'Requis' }]} style={{ marginBottom: 0 }}>
                        <InputNumber min={0} style={{ width: '100%' }} />
                      </Form.Item>
                      <Form.Item name={[field.name, 'total']} rules={[{ required: true, message: 'Requis' }]} style={{ marginBottom: 0 }}>
                        <InputNumber min={0} style={{ width: '100%' }} />
                      </Form.Item>
                      <div>
                        <Button danger onClick={() => remove(field.name)}>Supprimer</Button>
                      </div>
                    </div>
                  ))}
                  <Divider style={{ margin: '8px 0' }} />
                  <Button
                    type="dashed"
                    onClick={() =>
                      add({ id: String(Date.now()), description: '', quantity: 1, unitPrice: 0, total: 0 })
                    }
                  >
                    Ajouter une ligne
                  </Button>
                </Space>
              )}
            </Form.List>
          </Card>

          <Space style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
            <Form.Item label="Sous-total" name="subtotal" rules={[{ required: true, message: 'Requis' }]}>
              <InputNumber prefix={invoice?.currency} style={{ width: 140 }} />
            </Form.Item>
            <Form.Item label="TVA (19%)" name="tax" rules={[{ required: true, message: 'Requis' }]}>
              <InputNumber prefix={invoice?.currency} style={{ width: 140 }} />
            </Form.Item>
            <Form.Item label="Total" name="total" rules={[{ required: true, message: 'Requis' }]}>
              <InputNumber prefix={invoice?.currency} style={{ width: 160 }} />
            </Form.Item>
            <Button type="primary" htmlType="submit">Enregistrer</Button>
          </Space>
        </Form>
      </Card>

      <Card title="Flux WebSocket (dernières factures reçues)">
        <InvoiceViewer />
      </Card>
    </Space>
  );
}


