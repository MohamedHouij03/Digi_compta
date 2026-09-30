import { Card, Table, Button } from 'antd';

type Declaration = { id: string; type: string; periode: string; statut: string };

const data: Declaration[] = [
  { id: '1', type: 'TVA', periode: '2025-06', statut: 'Prête' },
  { id: '2', type: 'IR', periode: '2025-T2', statut: 'En cours' },
];

export default function Declarations() {
  return (
    <Card title="Génération automatique des déclarations">
      <Table<Declaration>
        rowKey="id"
        dataSource={data}
        columns={[
          { title: 'Type', dataIndex: 'type' },
          { title: 'Période', dataIndex: 'periode' },
          { title: 'Statut', dataIndex: 'statut' },
          { title: 'Actions', render: () => <Button type="link">Générer</Button> },
        ]}
      />
    </Card>
  );
}
