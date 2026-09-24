import logging
import os
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

load_dotenv(Path(__file__).parent / ".env")

from core import client, bootstrap  # noqa: E402
from api_auth import router as auth_router  # noqa: E402
from api_inventory import router as inventory_router  # noqa: E402
from api_sales import router as sales_router  # noqa: E402
from cors_config import parse_cors_origins  # noqa: E402

app = FastAPI(title="Asian Hardware and Paints")
# Browsers send an exact scheme/host/port Origin. Only the configured frontend
# origins may use the session cookie across origins.
allowed_origins = parse_cors_origins(os.environ.get("CORS_ORIGINS"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth_router, prefix="/api")
app.include_router(inventory_router, prefix="/api")
app.include_router(sales_router, prefix="/api")


@app.on_event("startup")
async def on_startup():
    await bootstrap()


@app.on_event("shutdown")
async def on_shutdown():
    client.close()


@app.get("/api/health")
async def health():
    return {"status": "ok"}


logging.basicConfig(level=logging.INFO)
