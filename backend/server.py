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

app = FastAPI(title="Asian Hardware and Paints")
# The storefront and API are served from the same origin. Enable credentialed
# cross-origin requests only for explicit, configured origins—not a wildcard.
cors_env = os.environ.get("CORS_ORIGINS", "").strip()
allowed_origins = []
for item in cors_env.split(","):
    item = item.strip().rstrip("/")
    if not item or item in ("*", "value"):
        continue
    if not item.startswith("http://") and not item.startswith("https://"):
        allowed_origins.append(f"https://{item}")
        allowed_origins.append(f"http://{item}")
    else:
        allowed_origins.append(item)

# Comprehensive regex matching: localhost, any *.vercel.app, and any *.2up.in domain
cors_regex = r"^https?://(localhost|127\.0\.0\.1|(.*\.)?vercel\.app|(.*\.)?2up\.in)(:\d+)?$"

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins if allowed_origins else [],
    allow_origin_regex=cors_regex,
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