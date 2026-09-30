import { Card } from 'antd';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const data = [
  { mois: 'Jan', docs: 120 },
  { mois: 'Fév', docs: 180 },
  { mois: 'Mar', docs: 260 },
  { mois: 'Avr', docs: 220 },
  { mois: 'Mai', docs: 300 },
  { mois: 'Juin', docs: 340 },
];

export default function TableauxDeBord() {
  return (
    <Card title="KPI - Documents traités">
      <div style={{ width: '100%', height: 320 }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 16, right: 16, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mois" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="docs" stroke="#1677ff" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
