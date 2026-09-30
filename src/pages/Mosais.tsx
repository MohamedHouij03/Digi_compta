import { Card, Typography, Button, Space } from 'antd';

export default function Mosais() {
  return (
    <Card title="Intégration avec Mosais">
      <Typography.Paragraph>
        Configurez la connexion à votre logiciel Mosais pour synchroniser plans comptables,
        écritures et pièces justificatives.
      </Typography.Paragraph>
      <Space>
        <Button type="primary">Connecter</Button>
        <Button>Tester la connexion</Button>
      </Space>
    </Card>
  );
}
