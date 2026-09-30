import { useEffect, useState } from 'react';
import { Card, Form, Input, DatePicker, InputNumber, Button, Space, Typography, Table, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { fetchExtraction, type ExtractedInvoice } from '@/lib/extractionApi';

export default function Extraction() {
  const [form] = Form.useForm<ExtractedInvoice>();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ExtractedInvoice | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchExtraction()
      .then((res) => {
        setData(res);
        form.setFieldsValue({ ...res, date: res.date } as any);
      })
      .catch((e) => {
        console.error(e);
        message.error("Échec de récupération de l'extraction");
      })
      .finally(() => setLoading(false));
  }, [form]);

  const columns: ColumnsType<any> = [
    { title: 'Désignation', dataIndex: 'description' },
    { title: 'Qté', dataIndex: 'quantity', width: 80 },
    { title: 'PU', dataIndex: 'unitPrice', width: 120 },
    { title: 'Total', dataIndex: 'total', width: 120 },
  ];

  function onFinish(values: any) {
    setData(values);
    message.success('Extraction mise à jour localement');
  }

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Typography.Title level={4}>Extraction (n8n)</Typography.Title>
      <Card loading={loading}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Space style={{ display: 'flex' }} size="large" wrap>
            <Form.Item label="Fournisseur" name="supplierName">
              <Input />
            </Form.Item>
            <Form.Item label="Matricule TVA" name="supplierVat">
              <Input />
            </Form.Item>
            <Form.Item label="N° facture" name="invoiceNumber">
              <Input />
            </Form.Item>
            <Form.Item label="Date" name="date">
              <DatePicker format="YYYY-MM-DD" value={data?.date ? dayjs(data.date) : undefined as any} />
            </Form.Item>
            <Form.Item label="Devise" name="currency">
              <Input style={{ width: 100 }} />
            </Form.Item>
          </Space>

          <Card size="small" title="Lignes">
            <Table
              rowKey={(r: any, idx) => (r?.id as string) || String(idx)}
              columns={columns}
              dataSource={data?.lines || []}
              pagination={false}
            />
          </Card>

          <Space style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
            <Form.Item label="Sous-total" name="subtotal">
              <InputNumber />
            </Form.Item>
            <Form.Item label="TVA" name="tax">
              <InputNumber />
            </Form.Item>
            <Form.Item label="Total" name="total">
              <InputNumber />
            </Form.Item>
            <Button type="primary" htmlType="submit">Enregistrer (local)</Button>
          </Space>
        </Form>
      </Card>
    </Space>
  );
}
