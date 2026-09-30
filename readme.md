<div align="center">

# 🧾 Digi Compta

**Intelligent OCR & Automation for Tunisian Accounting Firms**

*Turn your PDF invoices into structured data — automatically, in real time, with AI*

[![n8n](https://img.shields.io/badge/n8n-Workflow_Automation-EA5B4B?style=for-the-badge&logo=n8n&logoColor=white)](https://n8n.io/)
[![Groq](https://img.shields.io/badge/Groq-Ultra_Fast_Inference-F55036?style=for-the-badge&logo=groq&logoColor=white)](https://groq.com/)
[![Mistral AI](https://img.shields.io/badge/Mistral_AI-OCR_Extraction-FF7000?style=for-the-badge&logo=mistralai&logoColor=white)](https://mistral.ai/)
[![FastAPI](https://img.shields.io/badge/FastAPI-REST_API-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![WebSocket](https://img.shields.io/badge/WebSocket-Realtime-010101?style=for-the-badge&logo=websocket&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](./LICENSE)

---

### 🎬 Video Demo

[![Watch Demo](https://img.shields.io/badge/▶_Watch_Demo-FF6B6B?style=for-the-badge&logo=youtube&logoColor=white)](https://drive.google.com/file/d/1n0501bvizbNDYL1gMotUayX-s-Gg-oV5/view?usp=sharing)

---

</div>

## 📖 Table of Contents

- [🧠 Why Digi Compta?](#-why-digi-compta)
- [🔍 The Core of the Project: Automated OCR](#-the-core-of-the-project-automated-ocr)
- [🤖 The AI Ecosystem: Groq + Mistral + n8n](#-the-ai-ecosystem-groq--mistral--n8n)
- [🔄 End-to-End Processing Pipeline](#-end-to-end-processing-pipeline)
- [⚡ Real Time & WebSocket](#-real-time--websocket)
- [📋 From Invoices to Tax Returns](#-from-invoices-to-tax-returns)
- [🏛️ Tunisian National Platforms](#️-tunisian-national-platforms)
- [📸 Screenshots](#-screenshots)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Installation & Launch](#-installation--launch)
- [⚙️ Configuration](#️-configuration)
- [📁 Project Structure](#-project-structure)
- [🤝 Contributing](#-contributing)
- [📝 License](#-license)
- [👥 Author](#-author)

---

## 🧠 Why Digi Compta?

Every day, Tunisian accounting firms lose hours **manually entering** invoice data, **checking** amounts, and **reformatting** information for tax returns. It is repetitive, error-prone, and costly work.

**Digi Compta removes this bottleneck.** By combining OCR powered by **Mistral AI**, ultra-fast inference from **Groq**, and automation with **n8n**, the system turns a raw PDF into usable structured data — in seconds, with no human intervention.

| 😫 Before Digi Compta | 🚀 With Digi Compta |
|:----------------------|:---------------------|
| Manual entry of every invoice | PDF upload → data extracted automatically |
| 5 to 10 minutes per invoice | A few seconds per invoice |
| Frequent transcription errors | AI extraction with built-in verification |
| Disconnected process across tools | Fully automated end-to-end pipeline |
| Manual tax returns | Generated automatically from invoices |
| No real-time visibility | Live WebSocket broadcasting |

---

## 🔍 The Core of the Project: Automated OCR

The centerpiece of Digi Compta is its **intelligent OCR pipeline** — a system designed to understand and extract data from Tunisian and French-language invoices with high accuracy.

### How it works

1. **📤 You upload a PDF** — Simple drag-and-drop in the interface
2. **🔔 n8n triggers the workflow** — The file is sent automatically via webhook
3. **🤖 Mistral AI analyzes the document** — Mistral's vision/language model extracts structured data from the document image
4. **⚡ Groq speeds up inference** — API calls go through Groq for ultra-fast inference (responses in milliseconds)
5. **🔄 Data is normalized** — The system handles French formats (decimal commas, non-breaking spaces, multilingual fields)
6. **🧾 The invoice editor fills itself in** — Extracted data appears automatically, ready to review and validate
7. **📡 The result is broadcast in real time** — All connected users see the invoice appear instantly

### What the OCR extracts

For each invoice, the system automatically extracts:

| Category | Extracted fields |
|:----------|:----------------|
| 🏢 **Supplier** | Name, VAT number, address, phone, email |
| 🧾 **Invoice** | Invoice number, issue date, currency (TND by default) |
| 📦 **Line items** | Description, quantity, unit price, total amount per line |
| 💰 **Totals** | Subtotal, tax (VAT), total amount including tax |

### Smart Normalization

Raw OCR output is often inconsistent — AI models return data in a variety of formats. That is where **normalization** comes in:

- **Multilingual fields**: The system recognizes field names in French (`fournisseur`, `montant`, `quantité`) and English (`supplier`, `amount`, `quantity`)
- **French number formats**: Automatic handling of decimal commas and non-breaking spaces (e.g. `1 234,56` → `1234.56`)
- **n8n unwrapping**: n8n responses are often wrapped in `{json}`, `{output}` or arrays — the normalizer unwraps them cleanly
- **Double validation**: Normalization runs on the frontend (TypeScript) AND the backend (Python) to guarantee consistency

---

## 🤖 The AI Ecosystem: Groq + Mistral + n8n

Digi Compta relies on a combination of three AI technologies that work together to deliver powerful, fast automation.

### 🧠 Mistral AI — The Extraction Engine

[Mistral AI](https://mistral.ai/) provides the language model that **understands** invoice content. Unlike traditional OCR, which only reads text, Mistral:

- **Understands the structure** of an invoice (header, line items, totals)
- **Identifies entities** (supplier name, VAT number, amounts)
- **Handles varied layouts** — every supplier has its own format
- **Supports French and English** — essential for Tunisian invoices, which mix both languages
- **Extracts structured data** directly as JSON, not raw text

### ⚡ Groq — Ultra-Fast Inference

[Groq](https://groq.com/) is the inference engine that makes the OCR **instant**. Instead of waiting several seconds for an API response, Groq provides:

- **Millisecond latency** — The user doesn't wait
- **High throughput** — Several invoices processed in parallel
- **Consistent results** — Same model, same quality, just faster

The Groq integration is used during the upload phase to trigger OCR analysis of the PDF document as quickly as possible.

### 🔄 n8n — The Workflow Orchestrator

[n8n](https://n8n.io/) is the brain that **connects everything**. It is the automation engine that orchestrates the full pipeline:

- **Upload webhook** — Receives the PDF sent from the interface
- **OCR workflow** — Chains the Groq/Mistral calls sequentially
- **Extraction webhook** — Dedicated endpoint for retrieving already-processed results
- **Invoice API** — Manages the full invoice lifecycle
- **Error handling** — Automatic retry, fallback, and logging

The advantage of n8n is its **flexibility**: workflows are visual and can be changed without touching code. You can adjust the OCR pipeline, add validation steps, or integrate new services — directly from the n8n interface.

> 📸 *Placeholder: Screenshot of the n8n workflow for the OCR pipeline*

<img width="1541" height="447" alt="Screenshot 2025-08-28 100507" src="https://github.com/user-attachments/assets/8b7e1d97-9d97-48b8-b5f4-db85fdd8813a" />


### How the three work together

```
  ┌──────────────┐        ┌──────────────┐        ┌──────────────┐
  │    GROQ      │        │   MISTRAL    │        │     n8n      │
  │  ⚡ Speed    │        │  🧠 Analysis │        │  🔄 Workflow │
  └──────┬───────┘        └──────┬───────┘        └──────┬───────┘
         │                       │                       │
         │  Fast model           │  Document             │  Coordinates
         │  inference            │  understanding        │  the calls
         │                       │                       │
         └───────────┬───────────┘───────────┬───────────┘
                     │                       │
                     ▼                       ▼
            ┌─────────────────────────────────────────┐
            │   RESULT: Structured invoice data       │
            │   delivered in real time                │
            └─────────────────────────────────────────┘
```

---

## 🔄 End-to-End Processing Pipeline

The end-to-end flow, from PDF upload to usable data:

```
  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
  │  UPLOAD │───►│  n8n    │───►│  GROQ   │───►│ MISTRAL │───►│ NORMAL- │
  │  PDF    │    │ WEBHOOK │    │  API    │    │   OCR   │    │ IZATION │
  └─────────┘    └─────────┘    └─────────┘    └─────────┘    └────┬────┘
                                                                    │
                                                                    ▼
  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
  │   TAX   │◄───│ INVOICE │◄───│VALIDATED│◄───│ WEBHOOK │◄───│   n8n   │
  │ RETURNS │    │ EDITOR  │    │  DATA   │    │RESPONSE │    │RESPONSE │
  └─────────┘    └────┬────┘    └─────────┘    └─────────┘    └─────────┘
                      │
                      ▼
               ┌─────────┐
               │WEBSOCKET│────►  Real-time broadcast
               │BROADCAST│       to all connected clients
               └─────────┘
```

### Step by Step

| # | Step | What happens |
|:-:|:------|:----------------|
| 1 | 📤 **PDF upload** | The user drags and drops a PDF file onto the *Collecte* (Collection) page |
| 2 | 💾 **Local storage** | The PDF is saved in IndexedDB for offline access and preview |
| 3 | 🔔 **n8n webhook** | The file is sent automatically to the n8n webhook, which triggers the OCR workflow |
| 4 | ⚡ **Groq call** | The workflow routes the request through Groq for ultra-fast inference |
| 5 | 🧠 **Mistral OCR** | Mistral AI analyzes the document and extracts structured data (supplier, line items, totals) |
| 6 | 🔄 **Normalization** | Raw data is normalized: multilingual fields, French number formats, n8n unwrapping |
| 7 | 🧾 **Auto-filled editor** | Normalized data automatically fills in the invoice form for review |
| 8 | 📡 **Real-time broadcast** | The backend broadcasts the invoice over WebSocket to all connected clients |

### 🛡️ Pipeline Resilience

The system is designed to **never block**:

- **n8n fallback** — If the n8n URL isn't configured, the system continues with an informational message instead of crashing
- **Multiple sources** — The invoice editor tries, in order: router data → stored extraction → live extraction → demo data
- **Robust number formats** — Normalization handles French quirks: `1 234,56 TND` cleanly becomes `1234.56`
- **Double normalization** — TypeScript (frontend) and Python (backend) implement the same logic independently for maximum consistency
- **Automatic unwrapping** — n8n envelopes (`{json}`, `{output}`, arrays) are stripped cleanly

---

## ⚡ Real Time & WebSocket

Digi Compta doesn't just process invoices — it **broadcasts them live**. As soon as an invoice is extracted and normalized, it appears instantly on every connected screen.

### How it works

- The FastAPI backend keeps a **WebSocket connection** open (`/ws`)
- Every processed invoice is **broadcast** to all connected clients
- The **Temps Réel** (Real Time) page displays incoming invoices as they arrive
- The **InvoiceViewer** component accumulates and displays invoices with their full details (items, subtotal, tax, total)
---

## 📋 From Invoices to Tax Returns

The end goal of the OCR isn't just to extract data — it's to **generate tax returns**. Digi Compta turns extracted invoices into returns ready to file:

| Return Type | Description | Status |
|:--------------------|:------------|:------:|
| **TVA** | Value Added Tax (VAT) — monthly/quarterly return | ✅ Automatic generation |
| **IR** | Income Tax — income return | ✅ Automatic generation |

The process is simple: OCR-processed invoices feed directly into the returns module. No more copy-pasting, no more transcription errors.

---

## 🏛️ Tunisian National Platforms

Digi Compta specifically targets the Tunisian regulatory ecosystem, with integration of government platforms:

| Platform | Acronym | Role | Status |
|:-----------|:---------|:-----|:------:|
| National Social Security Fund | **CNSS** | Employer social security filings | ✅ Connected |
| Tax Filing Platform | **JIBAYA** | Online tax returns | 🔲 In progress |
| National Business Registry | **RNE** | Commercial & legal registry | 🔲 In progress |

---

## 📸 Screenshots
<img width="1612" height="548" alt="Screenshot 2025-08-21 112759" src="https://github.com/user-attachments/assets/8c6048aa-1c49-4911-a5dc-734c0d0f50f7" />

<img width="1809" height="765" alt="Screenshot 2025-08-26 165036" src="https://github.com/user-attachments/assets/8aee202c-536c-458f-b616-8fcd1d4ef9ed" />
<img width="1857" height="605" alt="Screenshot 2025-08-26 213042" src="https://github.com/user-attachments/assets/fb8904b8-b83d-4a26-a65c-4b14de86d3fe" />
<img width="1865" height="798" alt="Screenshot 2025-08-28 142918" src="https://github.com/user-attachments/assets/93213d58-1c98-4749-88a1-bf5328c1b55a" />

<div align="center">

### 📤 Upload & OCR Pipeline

| 📤 PDF upload to n8n | 🔄 n8n workflow |
|:-----------------------:|:---------------:|
<img width="1919" height="915" alt="Screenshot 2025-08-28 100832" src="https://github.com/user-attachments/assets/6a90caba-6f59-46a3-a180-c9b53ac86147" />

</div>


---

## 🛠️ Tech Stack

### 🤖 AI & Automation

| Technology | Role |
|:------------|:-----|
| [![Mistral AI](https://img.shields.io/badge/Mistral_AI-OCR_Extraction-FF7000?logo=mistralai)](https://mistral.ai/) | Language model for intelligent data extraction from PDF invoices |
| [![Groq](https://img.shields.io/badge/Groq-Ultra_Fast_Inference-F55036?logo=groq)](https://groq.com/) | Ultra-fast inference for millisecond OCR responses |
| [![n8n](https://img.shields.io/badge/n8n-Workflow_Automation-EA5B4B?logo=n8n)](https://n8n.io/) | Workflow orchestration: upload webhook → OCR → extraction → response |

### ⚙️ Backend

| Technology | Role |
|:------------|:-----|
| [![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?logo=fastapi)](https://fastapi.tiangolo.com/) | REST API + WebSocket server for real-time broadcasting |
| [![Python](https://img.shields.io/badge/Python-3.10+-3776AB?logo=python)](https://python.org/) | Backend normalization, n8n proxy, extraction storage |
| [![Uvicorn](https://img.shields.io/badge/Uvicorn-ASGI-333333)](https://www.uvicorn.org/) | High-performance ASGI server |
| [![httpx](https://img.shields.io/badge/httpx-Async_Client-2E86C1)](https://www.python-httpx.org/) | Async HTTP client for proxy calls to n8n |

### 🖥️ Frontend

| Technology | Role |
|:------------|:-----|
| [![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev/) | User interface |
| [![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?logo=typescript)](https://www.typescriptlang.org/) | Frontend normalization of OCR data |
| [![Ant Design](https://img.shields.io/badge/Ant_Design-5.18-0170FE?logo=antdesign)](https://ant.design/) | Professional UI components |
| [![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite)](https://vitejs.dev/) | Build tool + API/n8n proxy |
| [![Zustand](https://img.shields.io/badge/Zustand-State-orange)](https://zustand-demo.pmnd.rs/) | Lightweight state management |
| [![Recharts](https://img.shields.io/badge/Recharts-Charts-8884D8)](https://recharts.org/) | KPI visualization |

---

## 🚀 Installation & Launch

### 📋 Prerequisites

| Tool | Version | Why |
|:------|:-------:|:---------|
| [![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)](https://nodejs.org/) | 18+ | Frontend & dev server |
| [![Python](https://img.shields.io/badge/Python-3.10+-3776AB?logo=python)](https://python.org/) | 3.10+ | FastAPI backend |
| [![n8n](https://img.shields.io/badge/n8n-Latest-EA5B4B?logo=n8n)](https://docs.n8n.io/) | Latest | OCR workflow engine |
| [![Groq API Key](https://img.shields.io/badge/Groq-API_Key-F55036?logo=groq)](https://console.groq.com/) | — | Fast inference |
| [![Mistral API Key](https://img.shields.io/badge/Mistral-API_Key-FF7000?logo=mistralai)](https://console.mistral.ai/) | — | OCR extraction |

### ⚡ Quick Install

```bash
# 1️⃣ Clone the repository
git clone https://github.com/MohamedHouij03/Frontend_digi_compta.git
cd Frontend_digi_compta

# 2️⃣ Install frontend dependencies
npm install

# 3️⃣ Install backend dependencies
python -m venv venv
source venv/bin/activate    # Linux/macOS
# or: venv\Scripts\activate  # Windows
pip install -r requirements.txt

# 4️⃣ Configure environment variables
cp .env.example .env.local
# Edit .env.local with your n8n webhook URLs
```

### 🔧 Running in Development

Open **three terminals** and start the following services:

```bash
# 🔄 Terminal 1 — n8n (OCR workflow engine)
n8n start
# → n8n interface at http://localhost:5678

# 🐍 Terminal 2 — FastAPI (backend + WebSocket)
source venv/bin/activate
python main.py
# → API server at http://127.0.0.1:8000
# → WebSocket at ws://127.0.0.1:8000/ws

# ⚛️ Terminal 3 — Frontend
npm run dev
# → App at http://localhost:5173
```

### 🏗️ Production Build

```bash
npm run build
npm run preview
```

---

## ⚙️ Configuration

### Environment Variables

Create a `.env.local` file at the project root with the following variables:

```env
# ═══════════════════════════════════════════
# 🤖 AI & OCR
# ═══════════════════════════════════════════
VITE_N8N_WEBHOOK_URL=http://localhost:5678/webhook/invoice-upload
VITE_N8N_EXTRACTION_URL=http://localhost:5678/webhook/extraction
VITE_N8N_INVOICE_API_URL=http://localhost:5678/webhook/invoice-api
N8N_UPLOAD_URL=http://localhost:5678/webhook/upload

# ═══════════════════════════════════════════
# ⚙️ Backend API
# ═══════════════════════════════════════════
VITE_API_BASE=http://127.0.0.1:8000

# ═══════════════════════════════════════════
# ⚡ Real-Time WebSocket
# ═══════════════════════════════════════════
VITE_WS_BASE=ws://127.0.0.1:8000
```

> 💡 **Note**: The Groq and Mistral API keys are configured in the n8n credentials, not in `.env.local`. Open the n8n interface to enter them. The backend reads `N8N_UPLOAD_URL`, `CORS_ORIGINS` and `STORAGE_DIR` from the shell environment.

---

## 📁 Project Structure

```
Frontend_digi_compta/
│
├── 📄 main.py                        # 🐍 FastAPI — REST API + WebSocket + n8n proxy
├── 📄 requirements.txt               # Python dependencies (fastapi, uvicorn, httpx)
│
├── 📂 src/
│   ├── 📂 lib/                       # 🔑 OCR & automation logic
│   │   ├── 📄 n8n.ts                 #    n8n webhook trigger (PDF upload)
│   │   ├── 📄 extractionApi.ts       #    n8n extraction API client
│   │   ├── 📄 invoiceApi.ts          #    Invoice CRUD API client
│   │   ├── 📄 normalizeInvoice.ts    #    🧠 OCR data normalization
│   │   └── 📄 docStore.ts            #    IndexedDB PDF storage
│   │
│   ├── 📂 components/
│   │   └── 📄 InvoiceViewer.tsx      #    ⚡ Real-time invoice feed (WebSocket)
│   │
│   ├── 📂 pages/
│   │   ├── 📄 Collecte.tsx           #    📤 PDF upload + OCR trigger
│   │   ├── 📄 OCR.tsx                #    🔍 OCR processing status
│   │   ├── 📄 Extraction.tsx         #    🤖 Data extracted by n8n/Mistral
│   │   ├── 📄 Facture.tsx            #    🧾 Auto-filled invoice editor
│   │   ├── 📄 TempsReel.tsx          #    ⚡ Real-time WebSocket view
│   │   ├── 📄 Declarations.tsx       #    📋 VAT/IR tax returns
│   │   ├── 📄 Accueil.tsx            #    📊 Dashboard & KPIs
│   │   ├── 📄 Plateformes.tsx        #    🏛️ CNSS / JIBAYA / RNE
│   │   └── ...                       #    Other pages
│   │
│   └── 📂 store/
│       └── 📄 appStore.ts            #    Global state (Zustand)
│
├── 📂 storage/                        # 💾 Webhook data (raw & normalized extractions)
│   ├── 📄 webhook_*.json
│   └── 📄 webhook_raw_*.json
│
├── 📄 .env.example                   # ⚙️ Configuration template (n8n URLs, WebSocket)
├── 📄 vite.config.ts                 # Proxy /api → FastAPI, /n8n → n8n
└── 📄 package.json
```

---

## 🤝 Contributing

Contributions are welcome! Especially to improve the OCR pipeline and AI integrations.

### 🔄 Process

1. 🍴 **Fork** the repository
2. 🌿 **Create** a branch: `git checkout -b feature/ocr-improvement`
3. 💻 **Build** your improvement
4. ✅ **Test** with real PDF invoices
5. 📝 **Commit**: `git commit -m "feat: improve Mistral extraction"`
6. 📤 **Push**: `git push origin feature/ocr-improvement`
7. 🔀 **Open** a Pull Request

### 🐋 Roadmap — OCR & Automation

- [ ] 🧠 Fine-tune the Mistral prompt for Tunisian invoices
- [ ] 📄 Multi-document support (purchase orders, receipts, quotes)
- [ ] 🔍 Batch OCR — process several PDFs in parallel
- [ ] 📊 OCR confidence score with low-confidence alerts
- [ ] 🏛️ Auto-fill CNSS/JIBAYA/RNE filings
- [ ] 🔐 Authentication & user roles
- [ ] 🗄️ Persistent database (PostgreSQL)
- [ ] 🐳 Dockerization (n8n + FastAPI + Frontend)
- [ ] 📱 Responsive mobile interface
- [ ] 📈 Automation-rate analytics dashboard

---

## 📝 License

This project is licensed under the **MIT** license. See the [LICENSE](./LICENSE) file for details.

---

## 👥 Author

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

**Powered by 🤖 Mistral AI · ⚡ Groq · 🔄 n8n**


[⬆️ Back to top](#-digi-compta)

</div>
