import { Card, Typography, Alert } from 'antd';

export default function Archivage() {
  return (
    <Card title="Archivage sécurisé">
      <Typography.Paragraph>
        Les documents sont chiffrés et stockés dans un coffre-fort numérique conforme.
      </Typography.Paragraph>
      <Alert type="info" message="Rétention: 10 ans | Conformité RGPD" showIcon />
    </Card>
  );
}
