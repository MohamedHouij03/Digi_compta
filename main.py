# main.py
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, UploadFile, File, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from pathlib import Path
import json
import os

try:
    import httpx
except Exception:  # pragma: no cover
    httpx = None  # type: ignore

app = FastAPI()

# ----------------- CORS -----------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # set your React origin(s) in production
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------- Data Schemas -----------------
class InvoiceLine(BaseModel):
    id: Optional[str] = None
    description: Optional[str] = None
    quantity: Optional[float] = 0
    unitPrice: Optional[float] = 0
    total: Optional[float] = 0

class Invoice(BaseModel):
    id: str
    supplierName: Optional[str] = ""
    supplierVat: Optional[str] = ""
    supplierAddress: Optional[str] = ""   # 👈 added
    supplierPhone: Optional[str] = ""     # 👈 added
    supplierEmail: Optional[str] = ""     # 👈 added
    invoiceNumber: Optional[str] = ""
    date: str
    currency: str = "TND"
    subtotal: float = 0
    tax: float = 0
    total: float = 0
    lines: List[InvoiceLine] = []

# ----------------- WebSocket Manager -----------------
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in list(self.active_connections):
            try:
                await connection.send_json(message)
            except Exception:
                self.disconnect(connection)

manager = ConnectionManager()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()  # keep connection alive
    except WebSocketDisconnect:
        manager.disconnect(websocket)

# ----------------- In-memory Stores -----------------
_invoices: Dict[str, Dict[str, Any]] = {}
_last_extraction: Optional[Dict[str, Any]] = None

# ----------------- Helpers -----------------
def storage_dir() -> Path:
    out = Path(os.getenv("STORAGE_DIR", "storage"))
    out.mkdir(parents=True, exist_ok=True)
    return out

def _mock_invoice() -> Dict[str, Any]:
    subtotal = 2 * 100 + 1 * 250
    tax = round(subtotal * 0.19, 2)
    return {
        "id": "demo",
        "supplierName": "ACME SARL",
        "supplierVat": "TN1234567",
        "supplierAddress": "1 rue Demo, Tunis",
        "supplierPhone": "+216 55 000 000",
        "supplierEmail": "contact@acme.tn",
        "invoiceNumber": "FAC-2025-001",
        "date": "2025-06-30T00:00:00.000Z",
        "currency": "TND",
        "subtotal": subtotal,
        "tax": tax,
        "total": round(subtotal + tax, 2),
        "lines": [
            {"id": "l1", "description": "Service comptable", "quantity": 2, "unitPrice": 100, "total": 200},
            {"id": "l2", "description": "Licence logiciel", "quantity": 1, "unitPrice": 250, "total": 250},
        ],
    }

def unwrap_n8n(body: Any) -> Any:
    """Unwrap common n8n shapes (array, {json}, {output})."""
    b = body
    if isinstance(b, list) and b:
        b = b[0]
    if isinstance(b, dict) and isinstance(b.get("json"), dict):
        b = b["json"]
    if isinstance(b, dict) and isinstance(b.get("output"), dict):
        b = b["output"]
    return b or {}

def _to_number(value: Any, fallback: float = 0.0) -> float:
    """Parse '1 500', '1,500', '1 500,25', etc."""
    if value is None or value == "":
        return fallback
    if isinstance(value, (int, float)):
        try:
            return float(value)
        except Exception:
            return fallback
    s = str(value).strip()
    s = s.replace("\u00A0", "").replace(" ", "")
    s = "".join(ch for ch in s if ch.isdigit() or ch in ",.+-")
    if "," in s and "." in s:
        s = s.replace(",", "")
    elif "," in s and "." not in s:
        s = s.replace(",", ".")
    try:
        return float(s)
    except Exception:
        return fallback

def _address_to_string(addr: Any) -> str:
    if not addr:
        return ""
    if isinstance(addr, str):
        return addr
    parts = [
        addr.get("street") or addr.get("line1"),
        addr.get("line2"),
        addr.get("city"),
        addr.get("zip") or addr.get("postal_code") or addr.get("postcode"),
        addr.get("country"),
    ]
    return ", ".join([p for p in parts if p])

def _currency_code(c: Any) -> str:
    if not c:
        return "TND"
    s = str(c).strip()
    if s == "€":
        return "EUR"
    if s == "$":
        return "USD"
    return s

def normalize_to_invoice_shape(body: Dict[str, Any]) -> Dict[str, Any]:
    """
    Map arbitrary extraction payload (from Grok/Mistral via n8n) into the UI shape.
    Handles: invoice_id, supplier.{name,vat,vat_number,email,phone,address}, customer fallback,
    items/lines, currency symbol, totals, etc.
    """
    supplier = body.get("supplier") or body.get("vendor") or body.get("seller") or {}
    customer = body.get("customer") or body.get("buyer") or {}

    items = body.get("lines") or body.get("items") or []

    def _to_line(idx: int, it: Dict[str, Any]) -> Dict[str, Any]:
        q = _to_number(it.get("quantity") or it.get("qty") or it.get("qte") or 0)
        up = _to_number(it.get("unitPrice") or it.get("unit_price") or it.get("price_unit") or it.get("price") or 0)
        tot = _to_number(it.get("total") or (q * up))
        return {
            "id": str(it.get("id") or idx + 1),
            "description": it.get("description") or it.get("designation") or it.get("name") or it.get("item") or "",
            "quantity": q,
            "unitPrice": up,
            "total": tot,
        }

    invoice_number = (
        body.get("invoiceNumber")
        or body.get("invoice_number")
        or body.get("invoiceNo")
        or body.get("invoice_no")
        or body.get("number")
        or body.get("invoice_id")   # important fallback
        or ""
    )

    # Figures
    provided_sub = _to_number(body.get("subtotal"), float("nan"))
    lines_norm = [_to_line(i, it) for i, it in enumerate(items)]
    computed_sub = provided_sub if provided_sub == provided_sub else sum(_to_number(l["total"], 0) for l in lines_norm)  # NaN check
    provided_tax = _to_number(body.get("tax") or body.get("vat"), float("nan"))
    tax = provided_tax if provided_tax == provided_tax else round(computed_sub * 0.19, 2)
    provided_total = _to_number(body.get("total"), float("nan"))
    total = provided_total if provided_total == provided_total else round(computed_sub + tax, 2)

    normalized = {
        # IDs
        "id": str(body.get("id") or invoice_number or "unknown"),
        "invoiceNumber": invoice_number,

        # Parties
        "supplierName": supplier.get("name") or body.get("supplierName") or customer.get("name") or "",
        "supplierVat": supplier.get("vat") or supplier.get("vat_number") or body.get("supplierVat") or customer.get("vat") or "",
        "supplierEmail": supplier.get("email") or body.get("supplierEmail") or customer.get("email") or "",
        "supplierPhone": supplier.get("phone") or body.get("supplierPhone") or customer.get("phone") or "",
        "supplierAddress": _address_to_string(body.get("supplierAddress") or supplier.get("address") or customer.get("address")),

        # Header
        "date": body.get("date") or body.get("invoiceDate") or body.get("issue_date") or "",
        "currency": _currency_code(body.get("currency") or body.get("devise") or "TND"),

        # Amounts
        "subtotal": round(computed_sub, 2),
        "tax": round(tax, 2),
        "total": round(total, 2),

        # Lines
        "lines": lines_norm,
    }
    return normalized

# ----------------- Webhook from n8n -----------------
@app.post("/webhook")
async def receive_data(request: Request):
    """Accept JSON from n8n, unwrap/normalize, store, broadcast, and echo back."""
    global _last_extraction
    try:
        raw = await request.json()
    except Exception:
        raw = json.loads((await request.body()).decode("utf-8", "ignore") or "{}")

    body = normalize_to_invoice_shape(unwrap_n8n(raw))
    _last_extraction = body

    out = storage_dir()
    inv_id = body.get("id") or body.get("invoice_id") or "webhook"
    date_str = (body.get("date") or "date").replace(":", "-").replace(" ", "_").replace("/", "-")
    # keep both raw and normalized for debug
    (out / f"webhook_raw_{inv_id}_{date_str}.json").write_text(json.dumps(raw, ensure_ascii=False, indent=2), encoding="utf-8")
    (out / f"webhook_{inv_id}_{date_str}.json").write_text(json.dumps(body, ensure_ascii=False, indent=2), encoding="utf-8")

    await manager.broadcast(body)
    return body  # echo normalized invoice

# ----------------- Upload PDF from React (optional forward to n8n) -----------------
@app.post("/upload-invoice")
async def upload_invoice(file: UploadFile = File(...)):
    """
    Receives PDF upload from React and optionally forwards to n8n.
    Set env N8N_UPLOAD_URL to enable forwarding (expects a form-data file field named 'file').
    """
    global _last_extraction

    n8n_url = os.getenv("N8N_UPLOAD_URL")
    content = await file.read()

    if n8n_url:
        if httpx is None:
            raise HTTPException(status_code=500, detail="httpx not installed on server")
        try:
            async with httpx.AsyncClient(timeout=60) as client:
                resp = await client.post(
                    n8n_url,
                    files={"file": (file.filename, content, file.content_type or "application/pdf")},
                    data={"source": "fastapi", "via": "upload-invoice"},
                )
            posted = resp.json() if resp.headers.get("content-type", "").startswith("application/json") else {"raw": resp.text}
            body = normalize_to_invoice_shape(unwrap_n8n(posted))
            _last_extraction = body

            out = storage_dir()
            inv_id = body.get("id") or "extraction"
            (out / f"extraction_{inv_id}.json").write_text(json.dumps(body, ensure_ascii=False, indent=2), encoding="utf-8")
            await manager.broadcast(body)
            return JSONResponse(body)
        except httpx.HTTPError as e:  # type: ignore
            raise HTTPException(status_code=502, detail=f"n8n forward failed: {e}")

    # Prefer failing if not wired, to avoid saving a mock silently
    raise HTTPException(
        status_code=503,
        detail="N8N_UPLOAD_URL not set; cannot forward to n8n. Set N8N_UPLOAD_URL or post JSON directly to /webhook."
    )

# ----------------- Read Endpoints -----------------
@app.get("/pdf-data")
async def pdf_data():
    """Returns last extracted invoice (from webhook or upload) or a mock."""
    return JSONResponse(_last_extraction or _mock_invoice())

@app.get("/invoice")
async def get_invoice(id: str = "demo"):
    data = _invoices.get(id) or _mock_invoice()
    return JSONResponse(data)

@app.post("/invoice")
async def save_invoice(inv: Invoice):
    _invoices[inv.id] = inv.dict()
    return {"ok": True}

@app.get("/health")
def health():
    return {"ok": True}

# Run with: uvicorn main:app --host 0.0.0.0 --port 8000 --reload
