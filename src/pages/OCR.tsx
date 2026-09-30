import { Card, Typography, List, Tag } from 'antd';

const docs = [
  { id: 1, nom: 'Facture-ACME-0123.pdf', statut: 'Terminé' },
  { id: 2, nom: 'Fiche-Paie-Janvier.png', statut: 'En cours' },
];

export default function OCR() {
  return (
    <Card title="Reconnaissance OCR intelligente">
      <Typography.Paragraph>
        Les documents collectés sont analysés automatiquement pour extraire les données clés
        (Montant, TVA, Fournisseur, Date...).
      </Typography.Paragraph>
      <List
        dataSource={docs}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta title={item.nom} />
            <Tag color={item.statut === 'Terminé' ? 'green' : 'blue'}>{item.statut}</Tag>
          </List.Item>
        )}
      />
    </Card>
  );
}
