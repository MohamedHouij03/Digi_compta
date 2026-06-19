<div align="center">

# 🧾 Digi Compta

**OCR Intelligent & Automatisation pour Cabinets Comptables Tunisiens**

*Transformez vos factures PDF en données structurées — automatiquement, en temps réel, avec l'IA*

[![n8n](https://img.shields.io/badge/n8n-Workflow_Automation-EA5B4B?style=for-the-badge&logo=n8n&logoColor=white)](https://n8n.io/)
[![Groq](https://img.shields.io/badge/Groq-Ultra_Fast_Inference-F55036?style=for-the-badge&logo=groq&logoColor=white)](https://groq.com/)
[![Mistral AI](https://img.shields.io/badge/Mistral_AI-OCR_Extraction-FF7000?style=for-the-badge&logo=mistralai&logoColor=white)](https://mistral.ai/)
[![FastAPI](https://img.shields.io/badge/FastAPI-REST_API-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![WebSocket](https://img.shields.io/badge/WebSocket-Realtime-010101?style=for-the-badge&logo=websocket&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](./LICENSE)

---

### 🎬 Démo Vidéo

[![Watch Demo](https://img.shields.io/badge/▶_Watch_Demo-FF6B6B?style=for-the-badge&logo=youtube&logoColor=white)](https://drive.google.com/file/d/1n0501bvizbNDYL1gMotUayX-s-Gg-oV5/view?usp=sharing)

---

</div>

## 📖 Table des Matières

- [🧠 Pourquoi Digi Compta ?](#-pourquoi-digi-compta-)
- [🔍 Le Cœur du Projet : L'OCR Automatisé](#-le-cœur-du-projet--locr-automatisé)
- [🤖 L'Écosystème IA : Groq + Mistral + n8n](#-lécosystème-ia--groq--mistral--n8n)
- [🔄 Pipeline Complet de Traitement](#-pipeline-complet-de-traitement)
- [⚡ Temps Réel & WebSocket](#-temps-réel--websocket)
- [📋 Des Factures aux Déclarations Fiscales](#-des-factures-aux-déclarations-fiscales)
- [🏛️ Plateformes Nationales Tunisiennes](#️-plateformes-nationales-tunisiennes)
- [📸 Captures d'Écran](#-captures-décran)
- [🛠️ Stack Technique](#️-stack-technique)
- [🚀 Installation & Lancement](#-installation--lancement)
- [⚙️ Configuration](#️-configuration)
- [📁 Structure du Projet](#-structure-du-projet)
- [🤝 Contribution](#-contribution)
- [📝 Licence](#-licence)
- [👥 Auteur](#-auteur)

---

## 🧠 Pourquoi Digi Compta ?

Chaque jour, les cabinets comptables tunisiens perdent des heures à **saisir manuellement** les données de factures, à **vérifier** les montants, à **reformater** les informations pour les déclarations fiscales. C'est un travail répétitif, erreur-prone, et coûteux.

**Digi Compta élimine ce goulot d'étranglement.** En combinant l'OCR propulsé par **Mistral AI**, l'inférence ultra-rapide de **Groq**, et l'automatisation de **n8n**, le système transforme un PDF brut en données structurées exploitables — en quelques secondes, sans intervention humaine.

| 😫 Avant Digi Compta | 🚀 Avec Digi Compta |
|:----------------------|:---------------------|
| Saisie manuelle de chaque facture | Upload PDF → données extraites automatiquement |
| 5 à 10 minutes par facture | Quelques secondes par facture |
| Erreurs de retranscription fréquentes | Extraction IA avec vérification intégrée |
| Processus déconnecté entre outils | Pipeline automatisé de bout en bout |
| Déclarations fiscales manuelles | Génération automatique depuis les factures |
| Aucune visibilité en temps réel | Diffusion WebSocket en direct |

---

## 🔍 Le Cœur du Projet : L'OCR Automatisé

La pièce maîtresse de Digi Compta est son **pipeline OCR intelligent** — un système conçu pour comprendre et extraire les données de factures tunisiennes et francophones avec une précision élevée.

### Comment ça fonctionne

1. **📤 Vous uploadez un PDF** — Glisser-déposer simple dans l'interface
2. **🔔 n8n déclenche le workflow** — Le fichier est envoyé automatiquement via webhook
3. **🤖 Mistral AI analyse le document** — Le modèle de vision/language de Mistral extrait les données structurées depuis l'image du document
4. **⚡ Groq accélère l'inférence** — Les appels API passent par Groq pour une inference ultra-rapide (réponse en millisecondes)
5. **🔄 Les données sont normalisées** — Le système gère les formats français (virgules décimales, espaces insécables, champs multilingues)
6. **🧾 L'éditeur de facture se remplit** — Les données extraites apparaissent automatiquement, prêtes à vérifier et valider
7. **📡 Le résultat est diffusé en temps réel** — Tous les utilisateurs connectés voient la facture apparaître instantanément

### Ce que l'OCR extrait

Pour chaque facture, le système extrait automatiquement :

| Catégorie | Champs extraits |
|:----------|:----------------|
| 🏢 **Fournisseur** | Nom, numéro TVA, adresse, téléphone, email |
| 🧾 **Facture** | Numéro de facture, date d'émission, devise (TND par défaut) |
| 📦 **Lignes de facture** | Description, quantité, prix unitaire, montant total par ligne |
| 💰 **Totaux** | Sous-total, taxe (TVA), montant total TTC |

### La Normalisation Intelligente

L'OCR brut est souvent irrégulier — les modèles IA retournent des données dans des formats variés. C'est là que la **normalisation** entre en jeu :

- **Champs multilingues** : Le système reconnaît les noms de champs en français (`fournisseur`, `montant`, `quantité`) et en anglais (`supplier`, `amount`, `quantity`)
- **Formats numériques français** : Gestion automatique des virgules décimales et des espaces insécables (ex: `1 234,56` → `1234.56`)
- **Désenrobage n8n** : Les réponses n8n sont souvent enveloppées dans `{json}`, `{output}` ou des tableaux — le normalisateur les déballage proprement
- **Double validation** : La normalisation s'exécute côté frontend (TypeScript) ET côté backend (Python) pour garantir la cohérence

---

## 🤖 L'Écosystème IA : Groq + Mistral + n8n

Digi Compta repose sur une combinaison de trois technologies IA qui travaillent en synergie pour offrir une automatisation puissante et rapide.

### 🧠 Mistral AI — Le Moteur d'Extraction

[Mistral AI](https://mistral.ai/) fournit le modèle de langage qui **comprend** le contenu des factures. Contrairement à l'OCR traditionnel qui se contente de lire du texte, Mistral :

- **Comprend la structure** d'une facture (entête, lignes, totaux)
- **Identifie les entités** (nom du fournisseur, numéro TVA, montants)
- **Gère les mises en page variées** — chaque fournisseur a sa propre présentation
- **Supporte le français et l'anglais** — essentiel pour les factures tunisiennes qui mélangent les deux langues
- **Extrait des données structurées** directement au format JSON, pas du texte brut

### ⚡ Groq — L'Inférence Ultra-Rapide

[Groq](https://groq.com/) est le moteur d'inférence qui rend l'OCR **instantané**. Au lieu d'attendre plusieurs secondes pour une réponse API, Groq fournit :

- **Latence en millisecondes** — L'utilisateur ne attend pas
- **Débit élevé** — Traitement de plusieurs factures en parallèle
- **Cohérence des résultats** — Même modèle, même qualité, mais plus vite

L'intégration Groq est utilisée lors de la phase d'upload pour déclencher l'analyse OCR du document PDF le plus rapidement possible.

### 🔄 n8n — L'Orchestrateur de Workflows

[n8n](https://n8n.io/) est le cerveau qui **connecte tout**. C'est le moteur d'automatisation qui orchestre le pipeline complet :

- **Webhook d'upload** — Reçoit le PDF envoyé depuis l'interface
- **Workflow OCR** — Enchaîne les appels à Groq/Mistral de manière séquentielle
- **Webhook d'extraction** — Endpoint dédié pour récupérer les résultats déjà traités
- **API Facture** — Gère le cycle de vie complet des factures
- **Gestion des erreurs** — Retry automatique, fallback, et logging

L'avantage de n8n est sa **flexibilité** : les workflows sont visuels et modifiables sans toucher au code. Vous pouvez ajuster le pipeline OCR, ajouter des étapes de validation, ou intégrer de nouveaux services — directement depuis l'interface n8n.

> 📸 *Placeholder : Capture d'écran du workflow n8n pour le pipeline OCR*

<img width="1541" height="447" alt="Capture d&#39;écran 2025-08-28 100507" src="https://github.com/user-attachments/assets/8b7e1d97-9d97-48b8-b5f4-db85fdd8813a" />


### Comment les trois travaillent ensemble

```
  ┌──────────────┐        ┌──────────────┐        ┌──────────────┐
  │    GROQ      │        │   MISTRAL    │        │     n8n      │
  │  ⚡ Vitesse  │        │  🧠 Analyse  │        │  🔄 Orchestre│
  └──────┬───────┘        └──────┬───────┘        └──────┬───────┘
         │                       │                       │
         │  Inférence rapide     │  Compréhension        │  Coordination
         │  du modèle            │  du document          │  des appels
         │                       │                       │
         └───────────┬───────────┘───────────┬───────────┘
                     │                       │
                     ▼                       ▼
            ┌─────────────────────────────────────────┐
            │         RÉSULTAT : Données de facture    │
            │         structurées en temps réel        │
            └─────────────────────────────────────────┘
```

---

## 🔄 Pipeline Complet de Traitement

Le flux de bout en bout, de l'upload PDF jusqu'aux données exploitables :

```
  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
  │  UPLOAD │───►│  n8n    │───►│  GROQ   │───►│ MISTRAL │───►│ NORMAL- │
  │  PDF    │    │ WEBHOOK │    │  API    │    │   OCR   │    │ ISATION │
  └─────────┘    └─────────┘    └─────────┘    └─────────┘    └────┬────┘
                                                                    │
                                                                    ▼
  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
  │  DÉCLAR-│◄───│ ÉDITEUR │◄───│ DONNÉES │◄───│ WEBHOOK │◄───│ RÉPONSE │
  │  ATIONS │    │ FACTURE │    │ VALIDÉES│    │ RÉPONSE │    │  n8n    │
  └─────────┘    └────┬────┘    └─────────┘    └─────────┘    └─────────┘
                      │
                      ▼
               ┌─────────┐
               │WEBSOCKET│────►  Diffusion temps réel
               │BROADCAST│       à tous les clients connectés
               └─────────┘
```

### Étape par Étape

| # | Étape | Ce qui se passe |
|:-:|:------|:----------------|
| 1 | 📤 **Upload PDF** | L'utilisateur glisse-dépose un fichier PDF dans la page *Collecte* |
| 2 | 💾 **Stockage local** | Le PDF est sauvegardé dans IndexedDB pour accès hors-ligne et prévisualisation |
| 3 | 🔔 **Webhook n8n** | Le fichier est envoyé automatiquement au webhook n8n qui déclenche le workflow OCR |
| 4 | ⚡ **Appel Groq** | Le workflow route la requête via Groq pour une inférence ultra-rapide |
| 5 | 🧠 **OCR Mistral** | Mistral AI analyse le document et extrait les données structurées (fournisseur, lignes, totaux) |
| 6 | 🔄 **Normalisation** | Les données brutes sont normalisées : champs multilingues, formats numériques français, désenrobage n8n |
| 7 | 🧾 **Éditeur auto-rempli** | Les données normalisées remplissent automatiquement le formulaire de facture pour vérification |
| 8 | 📡 **Diffusion temps réel** | Le backend diffuse la facture via WebSocket à tous les clients connectés |

### 🛡️ Résilience du Pipeline

Le système est conçu pour **ne jamais bloquer** :

- **Fallback n8n** — Si l'URL n8n n'est pas configurée, le système continue avec un message d'information au lieu de crasher
- **Sources multiples** — L'éditeur de facture essaie dans l'ordre : données du routeur → extraction stockée → extraction live → données de démonstration
- **Formats numériques robustes** — La normalisation gère les particularités françaises : `1 234,56 TND` devient proprement `1234.56`
- **Double normalisation** — TypeScript (frontend) et Python (backend) implémentent la même logique indépendamment pour une cohérence maximale
- **Désenrobage automatique** — Les enveloppes n8n (`{json}`, `{output}`, tableaux) sont retirées proprement

---

## ⚡ Temps Réel & WebSocket

Digi Compta ne se contente pas de traiter les factures — il les **diffuse en direct**. Dès qu'une facture est extraite et normalisée, elle apparaît instantanément sur tous les écrans connectés.

### Comment ça marche

- Le backend FastAPI maintient une **connexion WebSocket** ouverte (`/ws`)
- Chaque facture traitée est **broadcastée** à tous les clients connectés
- La page **Temps Réel** affiche les factures entrantes au fur et à mesure
- Le composant **InvoiceViewer** accumule et affiche les factures avec leurs détails complets (items, sous-total, taxe, total)
---

## 📋 Des Factures aux Déclarations Fiscales

L'objectif final de l'OCR n'est pas juste d'extraire des données — c'est de **générer des déclarations fiscales**. Digi Compta transforme les factures extraites en déclarations prêtes à soumettre :

| Type de Déclaration | Description | Statut |
|:--------------------|:------------|:------:|
| **TVA** | Taxe sur la Valeur Ajoutée — déclaration mensuelle/trimestrielle | ✅ Génération automatique |
| **IR** | Impôt sur le Revenu — déclaration des revenus | ✅ Génération automatique |

Le processus est simple : les factures OCR-isées alimentent directement le module de déclarations. Plus de copier-coller, plus d'erreurs de retranscription.

---

## 🏛️ Plateformes Nationales Tunisiennes

Digi Compta cible spécifiquement l'écosystème réglementaire tunisien avec l'intégration des plateformes gouvernementales :

| Plateforme | Acronyme | Rôle | Statut |
|:-----------|:---------|:-----|:------:|
| Caisse Nationale de Sécurité Sociale | **CNSS** | Déclarations sociales employeur | ✅ Connecté |
| Plateforme de Déclaration Fiscale | **JIBAYA** | Déclarations d'impôts en ligne | 🔲 En cours |
| Registre National des Entreprises | **RNE** | Registre commercial & juridique | 🔲 En cours |

---

## 📸 Captures d'Écran
<img width="1612" height="548" alt="Capture d&#39;écran 2025-08-21 112759" src="https://github.com/user-attachments/assets/8c6048aa-1c49-4911-a5dc-734c0d0f50f7" />

<img width="1809" height="765" alt="Capture d&#39;écran 2025-08-26 165036" src="https://github.com/user-attachments/assets/8aee202c-536c-458f-b616-8fcd1d4ef9ed" />
<img width="1857" height="605" alt="Capture d&#39;écran 2025-08-26 213042" src="https://github.com/user-attachments/assets/fb8904b8-b83d-4a26-a65c-4b14de86d3fe" />
<img width="1865" height="798" alt="Capture d&#39;écran 2025-08-28 142918" src="https://github.com/user-attachments/assets/93213d58-1c98-4749-88a1-bf5328c1b55a" />

<div align="center">

### 📤 Upload & OCR Pipeline

| 📤 Upload PDF vers n8n | 🔄 Workflow n8n |
|:-----------------------:|:---------------:|
<img width="1919" height="915" alt="Capture d&#39;écran 2025-08-28 100832" src="https://github.com/user-attachments/assets/6a90caba-6f59-46a3-a180-c9b53ac86147" />

</div>


---

## 🛠️ Stack Technique

### 🤖 IA & Automatisation

| Technologie | Rôle |
|:------------|:-----|
| [![Mistral AI](https://img.shields.io/badge/Mistral_AI-OCR_Extraction-FF7000?logo=mistralai)](https://mistral.ai/) | Modèle de langage pour l'extraction intelligente de données depuis les factures PDF |
| [![Groq](https://img.shields.io/badge/Groq-Ultra_Fast_Inference-F55036?logo=groq)](https://groq.com/) | Inférence ultra-rapide pour des réponses OCR en millisecondes |
| [![n8n](https://img.shields.io/badge/n8n-Workflow_Automation-EA5B4B?logo=n8n)](https://n8n.io/) | Orchestration des workflows : webhook upload → OCR → extraction → réponse |

### ⚙️ Backend

| Technologie | Rôle |
|:------------|:-----|
| [![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?logo=fastapi)](https://fastapi.tiangolo.com/) | Serveur API REST + WebSocket pour la diffusion temps réel |
| [![Python](https://img.shields.io/badge/Python-3.10+-3776AB?logo=python)](https://python.org/) | Normalisation backend, proxy n8n, stockage des extractions |
| [![Uvicorn](https://img.shields.io/badge/Uvicorn-ASGI-333333)](https://www.uvicorn.org/) | Serveur ASGI haute performance |
| [![httpx](https://img.shields.io/badge/httpx-Async_Client-2E86C1)](https://www.python-httpx.org/) | Client HTTP asynchrone pour les appels proxy vers n8n |

### 🖥️ Frontend

| Technologie | Rôle |
|:------------|:-----|
| [![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev/) | Interface utilisateur |
| [![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?logo=typescript)](https://www.typescriptlang.org/) | Normalisation frontend des données OCR |
| [![Ant Design](https://img.shields.io/badge/Ant_Design-5.18-0170FE?logo=antdesign)](https://ant.design/) | Composants UI professionnels |
| [![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite)](https://vitejs.dev/) | Build tool + proxy API/n8n |
| [![Zustand](https://img.shields.io/badge/Zustand-State-orange)](https://zustand-demo.pmnd.rs/) | Gestion d'état légère |
| [![Recharts](https://img.shields.io/badge/Recharts-Charts-8884D8)](https://recharts.org/) | Visualisation KPIs |

---

## 🚀 Installation & Lancement

### 📋 Prérequis

| Outil | Version | Pourquoi |
|:------|:-------:|:---------|
| [![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)](https://nodejs.org/) | 18+ | Frontend & dev server |
| [![Python](https://img.shields.io/badge/Python-3.10+-3776AB?logo=python)](https://python.org/) | 3.10+ | Backend FastAPI |
| [![n8n](https://img.shields.io/badge/n8n-Latest-EA5B4B?logo=n8n)](https://docs.n8n.io/) | Dernière | Moteur de workflow OCR |
| [![Groq API Key](https://img.shields.io/badge/Groq-API_Key-F55036?logo=groq)](https://console.groq.com/) | — | Inférence rapide |
| [![Mistral API Key](https://img.shields.io/badge/Mistral-API_Key-FF7000?logo=mistralai)](https://console.mistral.ai/) | — | Extraction OCR |

### ⚡ Installation Rapide

```bash
# 1️⃣ Cloner le dépôt
git clone https://github.com/MohamedHouij03/Frontend_digi_compta.git
cd Frontend_digi_compta

# 2️⃣ Installer les dépendances Frontend
npm install

# 3️⃣ Installer les dépendances Backend
python -m venv venv
source venv/bin/activate    # Linux/macOS
# ou: venv\Scripts\activate  # Windows
pip install -r requirements.txt

# 4️⃣ Configurer les variables d'environnement
cp .env.local.example .env.local
# Éditez .env.local avec vos clés API Groq/Mistral et URLs n8n
```

### 🔧 Lancement en Développement

Ouvrez **trois terminaux** et lancez les services suivants :

```bash
# 🔄 Terminal 1 — n8n (moteur de workflow OCR)
n8n start
# → Interface n8n sur http://localhost:5678
# → Importez le workflow OCR fourni dans /workflows

# 🐍 Terminal 2 — FastAPI (backend + WebSocket)
source venv/bin/activate
python main.py
# → Serveur API sur http://127.0.0.1:8000
# → WebSocket sur ws://127.0.0.1:8000/ws

# ⚛️ Terminal 3 — Frontend
npm run dev
# → Application sur http://localhost:5173
```

### 🏗️ Build de Production

```bash
npm run build
npm run preview
```

---

## ⚙️ Configuration

### Variables d'Environnement

Créez un fichier `.env.local` à la racine du projet avec les variables suivantes :

```env
# ═══════════════════════════════════════════
# 🤖 IA & OCR
# ═══════════════════════════════════════════
VITE_N8N_WEBHOOK_URL=http://localhost:5678/webhook/invoice-upload
VITE_N8N_EXTRACTION_URL=http://localhost:5678/webhook/extraction
VITE_N8N_INVOICE_API_URL=http://localhost:5678/webhook/invoice-api
N8N_UPLOAD_URL=http://localhost:5678/webhook/upload

# ═══════════════════════════════════════════
# ⚙️ API Backend
# ═══════════════════════════════════════════
VITE_API_BASE=http://127.0.0.1:8000

# ═══════════════════════════════════════════
# ⚡ WebSocket Temps Réel
# ═══════════════════════════════════════════
VITE_WS_BASE=ws://127.0.0.1:8000
```

> 💡 **Note** : Les clés API Groq et Mistral sont configurées dans les credentials n8n, pas dans le `.env.local`. Ouvrez l'interface n8n pour les renseigner.

---

## 📁 Structure du Projet

```
Frontend_digi_compta/
│
├── 📄 main.py                        # 🐍 FastAPI — API REST + WebSocket + proxy n8n
├── 📄 requirements.txt               # Dépendances Python (fastapi, uvicorn, httpx)
│
├── 📂 src/
│   ├── 📂 lib/                       # 🔑 Logique OCR & automatisation
│   │   ├── 📄 n8n.ts                 #    Déclencheur webhook n8n (upload PDF)
│   │   ├── 📄 extractionApi.ts       #    Client API extraction n8n
│   │   ├── 📄 invoiceApi.ts          #    Client API CRUD factures
│   │   ├── 📄 normalizeInvoice.ts    #    🧠 Normalisation des données OCR
│   │   └── 📄 docStore.ts            #    Stockage IndexedDB des PDF
│   │
│   ├── 📂 components/
│   │   └── 📄 InvoiceViewer.jsx      #    ⚡ Flux factures temps réel (WebSocket)
│   │
│   ├── 📂 pages/
│   │   ├── 📄 Collecte.tsx           #    📤 Upload PDF + déclenchement OCR
│   │   ├── 📄 OCR.tsx                #    🔍 Suivi état traitement OCR
│   │   ├── 📄 Extraction.tsx         #    🤖 Données extraites par n8n/Mistral
│   │   ├── 📄 Facture.tsx            #    🧾 Éditeur facture auto-rempli
│   │   ├── 📄 TempsReel.tsx          #    ⚡ Vue temps réel WebSocket
│   │   ├── 📄 Declarations.tsx       #    📋 Déclarations TVA/IR
│   │   ├── 📄 Accueil.tsx            #    📊 Dashboard & KPIs
│   │   ├── 📄 Plateformes.tsx        #    🏛️ CNSS / JIBAYA / RNE
│   │   └── ...                       #    Autres pages
│   │
│   └── 📂 store/
│       └── 📄 appStore.ts            #    État global (Zustand)
│
├── 📂 storage/                        # 💾 Données webhook (extractions brutes & normalisées)
│   ├── 📄 webhook_*.json
│   └── 📄 webhook_raw_*.json
│
├── 📄 .env.local                     # ⚙️ Configuration (URLs n8n, WebSocket)
├── 📄 vite.config.ts                 # Proxy /api → FastAPI, /n8n → n8n
└── 📄 package.json
```

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Surtout pour améliorer le pipeline OCR et les intégrations IA.

### 🔄 Processus

1. 🍴 **Forkez** le dépôt
2. 🌿 **Créez** une branche : `git checkout -b feature/amélioration-ocr`
3. 💻 **Développez** votre amélioration
4. ✅ **Testez** avec de vraies factures PDF
5. 📝 **Commitez** : `git commit -m "feat: amélioration extraction Mistral"`
6. 📤 **Poussez** : `git push origin feature/amélioration-ocr`
7. 🔀 **Ouvrez** une Pull Request

### 🐋 Roadmap — OCR & Automatisation

- [ ] 🧠 Fine-tuning du prompt Mistral pour les factures tunisiennes
- [ ] 📄 Support multi-documents (bons de commande, reçus, devis)
- [ ] 🔍 OCR batch — traitement de plusieurs PDF en parallèle
- [ ] 📊 Score de confiance OCR avec alerte si faible
- [ ] 🏛️ Auto-remplissage des déclarations CNSS/JIBAYA/RNE
- [ ] 🔐 Authentification & rôles utilisateurs
- [ ] 🗄️ Base de données persistante (PostgreSQL)
- [ ] 🐳 Dockerisation (n8n + FastAPI + Frontend)
- [ ] 📱 Interface mobile responsive
- [ ] 📈 Dashboard analytique du taux d'automatisation

---

## 📝 Licence

Ce projet est sous licence **MIT**. Voir le fichier [LICENSE](./LICENSE) pour plus de détails.

---

## 👥 Auteur

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/MohamedHouij03">
        <img src="https://img.shields.io/badge/GitHub-MohamedHouij03-181717?style=flat-square&logo=github" alt="GitHub"/>
        <br />
        <sub><b>Mohamed Houij</b></sub>
      </a>
    </td>
  </tr>
</table>

---

<div align="center">

**Propulsé par 🤖 Mistral AI · ⚡ Groq · 🔄 n8n**

*Fait avec ❤️ pour les cabinets comptables tunisiens*

[⬆️ Retour en haut](#-digi-compta)

</div>
