export type StoredDocumentMeta = {
  id: number;
  name: string;
  type: string;
  size: number;
  createdAt: number;
};

export type StoredDocumentRecord = StoredDocumentMeta & { blob?: Blob };

const DB_NAME = 'digi-compta';
const DB_VERSION = 1;
const STORE = 'documents';

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true });
        store.createIndex('createdAt', 'createdAt', { unique: false });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveDocument(file: File): Promise<number> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    const store = tx.objectStore(STORE);
    const record: Omit<StoredDocumentRecord, 'id'> = {
      name: file.name,
      type: file.type,
      size: file.size,
      createdAt: Date.now(),
      blob: file,
    };
    const req = store.add(record);
    req.onsuccess = () => resolve(req.result as number);
    req.onerror = () => reject(req.error);
  });
}

export async function listDocuments(): Promise<StoredDocumentMeta[]> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const store = tx.objectStore(STORE);
    const request = store.getAll();
    request.onsuccess = () => {
      const all = (request.result as StoredDocumentRecord[]).map((r) => ({
        id: (r as any).id as number,
        name: r.name,
        type: r.type,
        size: r.size,
        createdAt: r.createdAt,
      }));
      all.sort((a, b) => b.createdAt - a.createdAt);
      resolve(all);
    };
    request.onerror = () => reject(request.error);
  });
}

export async function deleteDocument(id: number): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    const store = tx.objectStore(STORE);
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function getDocumentBlob(id: number): Promise<Blob | null> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const store = tx.objectStore(STORE);
    const req = store.get(id);
    req.onsuccess = () => {
      const rec = req.result as StoredDocumentRecord | undefined;
      resolve(rec?.blob ?? null);
    };
    req.onerror = () => reject(req.error);
  });
}
