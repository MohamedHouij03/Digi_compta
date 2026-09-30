import { Card, Col, Row, Statistic } from 'antd';
import { ArrowUpOutlined, FileDoneOutlined, CloudUploadOutlined } from '@ant-design/icons';
import { useMemo } from 'react';

export default function Accueil() {
  const stats = useMemo(
    () => ({
      documentsDuMois: 482,
      declarationsGenerees: 26,
      tauxAutomatisation: 78,
    }),
    []
  );

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} md={8}>
        <Card>
          <Statistic
            title="Documents collectés (mois)"
            value={stats.documentsDuMois}
            prefix={<CloudUploadOutlined />}
          />
        </Card>
      </Col>
      <Col xs={24} md={8}>
        <Card>
          <Statistic
            title="Déclarations générées"
            value={stats.declarationsGenerees}
            prefix={<FileDoneOutlined />}
          />
        </Card>
      </Col>
      <Col xs={24} md={8}>
        <Card>
          <Statistic
            title="Taux d'automatisation"
            value={stats.tauxAutomatisation}
            suffix="%"
            prefix={<ArrowUpOutlined style={{ color: '#52c41a' }} />}
          />
        </Card>
      </Col>
    </Row>
  );
}
