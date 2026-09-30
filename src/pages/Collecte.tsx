import { Upload, Card, Typography, Space, List, Button, Tag, message, Modal } from 'antd';
import { InboxOutlined, DeleteOutlined, EyeOutlined, FilePdfOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveDocument, listDocuments, deleteDocument, getDocumentBlob, type StoredDocumentMeta } from '@/lib/docStore';
import { triggerN8nInvoiceUpload } from '@/lib/n8n';
import { normalizeToInvoice } from '@/lib/normalizeInvoice';

const { Title, Paragraph } = Typography;

export default function Collecte() {
  const [docs, setDocs] = useState<StoredDocumentMeta[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const navigate = useNavigate();

  async function refresh() {
    const all = await listDocuments();
    setDocs(all);
  }

  useEffect(() => {
    void refresh();
  }, []);

  const beforeUpload: NonNullable<React.ComponentProps<typeof Upload>['beforeUpload']> = async (file) => {
    if (file.type !== 'application/pdf') {
      message.error('Veuillez téléverser uniquement des fichiers PDF.');
      return Upload.LIST_IGNORE;
    }
    try {
      await saveDocument(file as File);
      message.success('PDF stocké localement.');
      const res = await triggerN8nInvoiceUpload(file as File, { source: 'digi-compta', page: 'collecte' });
      if (res.ok) {
        message.success('Envoyé à n8n avec succès.');
        if (res.data) {
          navigate('/facture', { state: { invoice: normalizeToInvoice(res.data) } });
        }
      } else {
        message.error(`Échec d'envoi à n8n (status ${res.status || 'n/a'})`);
      }
      await refresh();
    } catch (e) {
      console.error(e);
      message.error("Échec du stockage du document.");
    }
    return Upload.LIST_IGNORE;
  };

  async function handlePreview(id: number) {
    const blob = await getDocumentBlob(id);
    if (!blob) {
      message.error('Impossible de charger le document.');
      return;
    }
    const url = URL.createObjectURL(blob);
    setPreviewUrl(url);
  }

  async function handleDelete(id: number) {
    await deleteDocument(id);
    message.success('Document supprimé.');
    await refresh();
  }

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Title level={4}>Collecte automatisée des documents</Title>
      <Paragraph>
        Déposez vos documents (PDF, images). La plateforme les classera et les acheminera
        automatiquement pour traitement.
      </Paragraph>
      <Card>
        <Upload.Dragger multiple beforeUpload={beforeUpload} showUploadList={false} accept="application/pdf">
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Cliquez ou glissez-déposez des fichiers PDF ici</p>
          <p className="ant-upload-hint">Types pris en charge: PDF</p>
        </Upload.Dragger>
      </Card>
      <Card title="Documents stockés">
        <List
          dataSource={docs}
          locale={{ emptyText: 'Aucun document stocké.' }}
          renderItem={(d) => (
            <List.Item
              actions={[
                <Button key="prev" icon={<EyeOutlined />} onClick={() => void handlePreview(d.id)}>Aperçu</Button>,
                <Button key="del" danger icon={<DeleteOutlined />} onClick={() => void handleDelete(d.id)}>Supprimer</Button>,
              ]}
            >
              <List.Item.Meta
                avatar={<FilePdfOutlined style={{ color: '#cf1322' }} />}
                title={d.name}
                description={<>
                  <Tag color="blue">{(d.size / 1024).toFixed(1)} Ko</Tag>
                  <Tag>{new Date(d.createdAt).toLocaleString('fr-FR')}</Tag>
                </>}
              />
            </List.Item>
          )}
        />
      </Card>
      <Modal
        open={!!previewUrl}
        title="Aperçu PDF"
        onCancel={() => { if (previewUrl) URL.revokeObjectURL(previewUrl); setPreviewUrl(null); }}
        footer={null}
        width={900}
        style={{ top: 24 }}
        styles={{ body: { height: 600, padding: 0 } }}
      >
        {previewUrl && (
          <iframe title="aperçu-pdf" src={previewUrl} style={{ width: '100%', height: '100%', border: 0 }} />
        )}
      </Modal>
    </Space>
  );
}
