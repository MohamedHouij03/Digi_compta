import { Table, Tag, Button, Typography } from 'antd';

type Utilisateur = { id: string; nom: string; email: string; role: 'Admin' | 'Comptable' | 'Client' };

const data: Utilisateur[] = [
  { id: '1', nom: 'Nadia Ben Ali', email: 'nadia@cabinet.tn', role: 'Admin' },
  { id: '2', nom: 'Yassine Trabelsi', email: 'yassine@cabinet.tn', role: 'Comptable' },
  { id: '3', nom: 'Client ABC', email: 'contact@abc.tn', role: 'Client' },
];

export default function Utilisateurs() {
  return (
    <>
      <Typography.Title level={4}>Gestion multi-profils utilisateurs</Typography.Title>
      <Table<Utilisateur>
        rowKey="id"
        dataSource={data}
        columns={[
          { title: 'Nom', dataIndex: 'nom' },
          { title: 'Email', dataIndex: 'email' },
          {
            title: 'Rôle',
            dataIndex: 'role',
            render: (v: Utilisateur['role']) => <Tag color={v === 'Admin' ? 'gold' : v === 'Comptable' ? 'blue' : 'green'}>{v}</Tag>,
          },
          { title: 'Actions', render: () => <Button type="link">Changer le rôle</Button> },
        ]}
      />
    </>
  );
}
