import { Card, List, Switch } from 'antd';

const plateformes = [
  { id: 'cnss', nom: 'CNSS', connecte: true },
  { id: 'jibaya', nom: 'JIBAYA', connecte: false },
  { id: 'rne', nom: 'RNE', connecte: false },
];

export default function Plateformes() {
  return (
    <Card title="Intégrations plateformes nationales">
      <List
        dataSource={plateformes}
        renderItem={(p) => (
          <List.Item actions={[<Switch key={p.id} defaultChecked={p.connecte} />]}>
            {p.nom}
          </List.Item>
        )}
      />
    </Card>
  );
}
