import { Layout, Menu, theme, ConfigProvider } from 'antd';
import type { MenuProps } from 'antd';
import frFR from 'antd/locale/fr_FR';
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  FileSearchOutlined,
  CloudUploadOutlined,
  DatabaseOutlined,
  DeploymentUnitOutlined,
  SafetyCertificateOutlined,
  FileDoneOutlined,
  BarChartOutlined,
  TeamOutlined,
  WifiOutlined,
} from '@ant-design/icons';
import type { ReactNode } from 'react';
import {
  Accueil,
  Collecte,
  DonneesClients,
  OCR,
  Mosais,
  Plateformes,
  Archivage,
  Declarations,
  TableauxDeBord,
  Utilisateurs,
  Facture,
  Extraction,
  TempsReel,
} from './pages';

const { Header, Sider, Content, Footer } = Layout;

type AppRoute = { path: string; label: string; icon: ReactNode; element: ReactNode };

const routes: AppRoute[] = [
  { path: '/accueil', label: 'Tableau de bord', icon: <DashboardOutlined />, element: <Accueil /> },
  { path: '/collecte', label: 'Collecte', icon: <CloudUploadOutlined />, element: <Collecte /> },
  { path: '/donnees', label: 'Données clients', icon: <DatabaseOutlined />, element: <DonneesClients /> },
  { path: '/ocr', label: 'OCR', icon: <FileSearchOutlined />, element: <OCR /> },
  { path: '/mosais', label: 'Intégration Mosais', icon: <DeploymentUnitOutlined />, element: <Mosais /> },
  { path: '/plateformes', label: 'Plateformes nationales', icon: <TeamOutlined />, element: <Plateformes /> },
  { path: '/archivage', label: 'Archivage', icon: <SafetyCertificateOutlined />, element: <Archivage /> },
  { path: '/declarations', label: 'Déclarations', icon: <FileDoneOutlined />, element: <Declarations /> },
  { path: '/kpi', label: 'KPI', icon: <BarChartOutlined />, element: <TableauxDeBord /> },
  { path: '/utilisateurs', label: 'Utilisateurs', icon: <TeamOutlined />, element: <Utilisateurs /> },
  { path: '/facture', label: 'Facture (édition)', icon: <FileDoneOutlined />, element: <Facture /> },
  { path: '/extraction', label: 'Extraction (n8n)', icon: <FileSearchOutlined />, element: <Extraction /> },
  { path: '/temps-reel', label: 'Temps réel (WS)', icon: <WifiOutlined />, element: <TempsReel /> },
];

const menuItems: MenuProps['items'] = routes.map(({ path, label, icon }) => ({
  key: path,
  icon,
  label: <Link to={path}>{label}</Link>,
}));

export default function App() {
  const location = useLocation();
  const selectedKey = location.pathname === '/' ? '/accueil' : location.pathname;
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <ConfigProvider locale={frFR}>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider breakpoint="lg" collapsedWidth="0">
          <div className="logo">Digi Compta</div>
          <Menu theme="dark" mode="inline" selectedKeys={[selectedKey]} items={menuItems} />
        </Sider>
        <Layout>
          <Header style={{ background: colorBgContainer }}>
            <div className="header-title">Plateforme pour cabinets comptables</div>
          </Header>
          <Content style={{ margin: '16px' }}>
            <div
              style={{
                padding: 24,
                minHeight: 360,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
              <Routes>
                {routes.map(({ path, element }) => (
                  <Route key={path} path={path} element={element} />
                ))}
                <Route path="/" element={<Navigate to="/accueil" replace />} />
              </Routes>
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Digi Compta © {new Date().getFullYear()}</Footer>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}
