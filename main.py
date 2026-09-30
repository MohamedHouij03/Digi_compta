import json
import os
from pathlib import Path
from typing import Any, Dict, List, Optional

import httpx
from fastapi import FastAPI, File, HTTPException, Request, UploadFile, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel

app = FastAPI(title="Digi Compta API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)


# ----------------- Schemas -----------------
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
    supplierAddress: Optional[str] = ""
    supplierPhone: Optional[str] = ""
    supplierEmail: Optional[str] = ""
    invoiceNumber: Optional[str] = ""
    date: str
    currency: str = "TND"
    subtotal: float = 0
    tax: float = 0
    total: float = 0
    lines: List[InvoiceLine] = []


# ----------------- WebSocket -----------------
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
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)


# ----------------- In-memory stores -----------------
_invoices: Dict[str, Dict[str, Any]] = {}
_last_extraction: Optional[Dict[str, Any]] = None


# ----------------- Helpers -----------------
def storage_dir() -> Path:
    out = Path(os.getenv("STORAGE_DIR", "storage"))
    out.mkdir(parents=True, exist_ok=True)
    return out


def write_json(path: Path, data: Any) -> None:
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


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
        return float(value)
    s = str(value).strip()
    s = s.replace(" ", "").replace(" ", "")
    s = "".join(ch for ch in s if ch.isdigit() or ch in ",.+-")
    if "," in s and "." in s:
        s = s.replace(",", "")
    elif "," in s:
        s = s.replace(",", ".")
    try:
        return float(s)
    except ValueError:
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
    return ", ".join(p for p in parts if p)


def _currency_code(c: Any) -> str:
    if not c:
        return "TND"
    s = str(c).strip()
    return {"€": "EUR", "$": "USD"}.get(s, s)


def normalize_to_invoice_shape(body: Dict[str, Any]) -> Dict[str, Any]:
    """
    Map an arbitrary extraction payload (from Groq/Mistral via n8n) into the UI invoice shape.
    Handles invoice_id, supplier.{name,vat,vat_number,email,phone,address}, customer fallback,
    items/lines, currency symbols and totals.
    """
    supplier = body.get("supplier") or body.get("vendor") or body.get("seller") or {}
    customer = body.get("customer") or body.get("buyer") or {}
    items = body.get("lines") or body.get("items") or []

    def _to_line(idx: int, it: Dict[str, Any]) -> Dict[str, Any]:
        q = _to_number(it.get("quantity") or it.get("qty") or it.get("qte") or 0)
        up = _to_number(it.get("unitPrice") or it.get("unit_price") or it.get("price_unit") or it.get("price") or 0)
        return {
            "id": str(it.get("id") or idx + 1),
            "description": it.get("description") or it.get("designation") or it.get("name") or it.get("item") or "",
            "quantity": q,
            "unitPrice": up,
            "total": _to_number(it.get("total") or (q * up)),
        }

    invoice_number = (
        body.get("invoiceNumber")
        or body.get("invoice_number")
        or body.get("invoiceNo")
        or body.get("invoice_no")
        or body.get("number")
        or body.get("invoice_id")
        or ""
    )

    lines = [_to_line(i, it) for i, it in enumerate(items)]

    subtotal = _to_number(body.get("subtotal"), float("nan"))
    if subtotal != subtotal:  # NaN: not provided
        subtotal = sum(line["total"] for line in lines)
    tax = _to_number(body.get("tax") or body.get("vat"), float("nan"))
    if tax != tax:
        tax = round(subtotal * 0.19, 2)
    total = _to_number(body.get("total"), float("nan"))
    if total != total:
        total = round(subtotal + tax, 2)

    return {
        "id": str(body.get("id") or invoice_number or "unknown"),
        "invoiceNumber": invoice_number,
        "supplierName": supplier.get("name") or body.get("supplierName") or customer.get("name") or "",
        "supplierVat": supplier.get("vat") or supplier.get("vat_number") or body.get("supplierVat") or customer.get("vat") or "",
        "supplierEmail": supplier.get("email") or body.get("supplierEmail") or customer.get("email") or "",
        "supplierPhone": supplier.get("phone") or body.get("supplierPhone") or customer.get("phone") or "",
        "supplierAddress": _address_to_string(body.get("supplierAddress") or supplier.get("address") or customer.get("address")),
        "date": body.get("date") or body.get("invoiceDate") or body.get("issue_date") or "",
        "currency": _currency_code(body.get("currency") or body.get("devise")),
        "subtotal": round(subtotal, 2),
        "tax": round(tax, 2),
        "total": round(total, 2),
        "lines": lines,
    }


# ----------------- n8n webhook -----------------
@app.post("/webhook")
async def receive_data(request: Request):
    """Accept JSON from n8n, normalize it, store it, broadcast it and echo it back."""
    global _last_extraction
    try:
        raw = await request.json()
    except Exception:
        raw = json.loads((await request.body()).decode("utf-8", "ignore") or "{}")

    body = normalize_to_invoice_shape(unwrap_n8n(raw))
    _last_extraction = body

    out = storage_dir()
    inv_id = body.get("id") or "webhook"
    date_str = (body.get("date") or "date").replace(":", "-").replace(" ", "_").replace("/", "-")
    write_json(out / f"webhook_raw_{inv_id}_{date_str}.json", raw)
    write_json(out / f"webhook_{inv_id}_{date_str}.json", body)

    await manager.broadcast(body)
    return body


# ----------------- PDF upload -----------------
@app.post("/upload-invoice")
async def upload_invoice(file: UploadFile = File(...)):
    """
    Receive a PDF from the frontend and forward it to n8n (N8N_UPLOAD_URL),
    as a multipart form field named 'file'.
    """
    global _last_extraction

    n8n_url = os.getenv("N8N_UPLOAD_URL")
    if not n8n_url:
        raise HTTPException(
            status_code=503,
            detail="N8N_UPLOAD_URL not set; cannot forward to n8n. Set N8N_UPLOAD_URL or post JSON directly to /webhook.",
        )

    content = await file.read()
    try:
        async with httpx.AsyncClient(timeout=60) as client:
            resp = await client.post(
                n8n_url,
                files={"file": (file.filename, content, file.content_type or "application/pdf")},
                data={"source": "fastapi"},
            )
    except httpx.HTTPError as e:
        raise HTTPException(status_code=502, detail=f"n8n forward failed: {e}")

    is_json = resp.headers.get("content-type", "").startswith("application/json")
    posted = resp.json() if is_json else {"raw": resp.text}
    body = normalize_to_invoice_shape(unwrap_n8n(posted))
    _last_extraction = body

    write_json(storage_dir() / f"extraction_{body.get('id') or 'extraction'}.json", body)
    await manager.broadcast(body)
    return JSONResponse(body)


# ----------------- Read endpoints -----------------
@app.get("/pdf-data")
async def pdf_data():
    """Return the last extracted invoice, or a demo invoice if none yet."""
    return JSONResponse(_last_extraction or _mock_invoice())


@app.get("/invoice")
async def get_invoice(id: str = "demo"):
    return JSONResponse(_invoices.get(id) or _mock_invoice())


@app.post("/invoice")
async def save_invoice(inv: Invoice):
    _invoices[inv.id] = inv.model_dump()
    return {"ok": True}


@app.get("/health")
def health():
    return {"ok": True}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
