import { Table, Typography, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';

type Client = {
  id: string;
  raisonSociale: string;
  nif: string;
  contact: string;
};

const data: Client[] = [
  { id: '1', raisonSociale: 'Alpha SARL', nif: '123456789', contact: 'alpha@example.com' },
  { id: '2', raisonSociale: 'Beta SA', nif: '987654321', contact: 'beta@example.com' },
];

const columns: ColumnsType<Client> = [
  { title: 'Raison sociale', dataIndex: 'raisonSociale' },
  { title: 'NIF', dataIndex: 'nif' },
  { title: 'Contact', dataIndex: 'contact' },
  { title: 'Actions', render: () => <Button type="link">Éditer</Button> },
];

export default function DonneesClients() {
  return (
    <>
      <Typography.Title level={4}>Données clients</Typography.Title>
      <Table<Client> rowKey="id" columns={columns} dataSource={data} pagination={false} />
    </>
  );
}
