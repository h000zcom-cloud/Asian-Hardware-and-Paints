# 🏪 Asian Hardware and Paints

A full-stack business management application for a hardware & paints retail store.

**Public Site** → Landing page for walk-in customers  
**Admin Panel** → Inventory, billing (POS), customers, quotations, reports, PDF export

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Tailwind CSS, Radix UI (shadcn), React Query, Framer Motion |
| Backend | Python FastAPI, Motor (async MongoDB driver) |
| Database | MongoDB (Atlas recommended) |
| Auth | JWT + bcrypt |
| PDF | ReportLab (thermal 80mm + A4/A5 invoices) |

## Project Structure

```
├── frontend/          # React CRA app (Vercel)
│   ├── src/
│   │   ├── pages/     # PublicSite, Login, Dashboard, Billing, Bills,
│   │   │              # Quotations, Inventory, Customers, Reports, Settings
│   │   ├── components/# AdminShell, BillDetail, ProductSearch, CartItems, ui/
│   │   └── lib/       # api.js, billing.js, print.js, share.js
│   ├── vercel.json    # Vercel deployment config
│   └── .env.example   # Frontend env template
│
├── backend/           # Python FastAPI app (Railway/Render)
│   ├── server.py      # FastAPI entrypoint + CORS + routers
│   ├── core.py        # MongoDB connection, JWT auth, bootstrap
│   ├── api_auth.py    # Login/logout/password endpoints
│   ├── api_inventory.py # Product CRUD, stock management
│   ├── api_sales.py   # Bills, quotations, customers, reports
│   ├── pdf_export.py  # Thermal + A4/A5 PDF generation
│   ├── seed_from_pdf.py # Seed inventory from PDF price lists
│   ├── data/          # products.json (seed catalog)
│   ├── fonts/         # Noto Sans Devanagari (Marathi text in PDFs)
│   ├── Procfile       # Railway/Render start command
│   ├── Dockerfile     # Container deployment
│   ├── requirements.prod.txt  # Production dependencies (lean)
│   ├── requirements.txt       # Full dev dependencies
│   └── .env.example   # Backend env template
│
└── tests/             # Test suites
```

## 🚀 Quick Start (Local Development)

### 1. Database — MongoDB Atlas (Free Tier)

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com) → Create free M0 cluster
2. Create a database user (username + password)
3. Under Network Access → Allow your IP (or `0.0.0.0/0` for dev)
4. Get your connection string: `mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/`

### 2. Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB Atlas URL, DB_NAME, and JWT_SECRET

python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

pip install -r requirements.prod.txt
uvicorn server:app --reload --port 8001
```

The backend will bootstrap automatically on first start:
- Creates default store settings (Asian Hardware and Paints, Nashik address, GSTIN)
- Creates admin user: `admin` / `asian2019`
- Seeds ~1000 products from `data/products.json`

### 3. Frontend

```bash
cd frontend
cp .env.example .env
# Ensure REACT_APP_BACKEND_URL=http://localhost:8001

yarn install
yarn start
```

Open [http://localhost:3000](http://localhost:3000) — the public site loads.  
Go to [http://localhost:3000/login](http://localhost:3000/login) → Login with `admin` / `asian2019`.

## 🌐 Deployment

### Frontend → Vercel

1. Push to GitHub
2. Import repo in [vercel.com](https://vercel.com)
3. Set **Root Directory** to `frontend`
4. Set **Build Command** to `yarn build`
5. Add environment variable:
   - `REACT_APP_BACKEND_URL` = your deployed backend URL (e.g., `https://asian-hw-api.railway.app`)
6. Deploy!

### Backend → Railway

1. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
2. Set **Root Directory** to `backend`
3. Railway auto-detects the `Procfile`
4. Add environment variables:
   - `MONGO_URL` = your MongoDB Atlas connection string
   - `DB_NAME` = `asian_hardware`
   - `JWT_SECRET` = a long random string
   - `CORS_ORIGINS` = your Vercel URL (e.g., `https://asian-hardware.vercel.app`)
5. Deploy!

### Alternative: Backend → Render

1. Go to [render.com](https://render.com) → New Web Service → Connect GitHub
2. Set **Root Directory** to `backend`
3. Set **Build Command** to `pip install -r requirements.prod.txt`
4. Set **Start Command** to `uvicorn server:app --host 0.0.0.0 --port $PORT`
5. Add the same environment variables as Railway
6. Deploy!

## 🔐 Default Credentials

| Field | Value |
|-------|-------|
| Username | `admin` |
| Password | `asian2019` |

> ⚠️ **Change the password immediately** after first login via Settings page!

## 📋 Features

- **Public Storefront**: Professional landing page with store info, products showcase
- **Point of Sale**: Full billing with product search, cart, GST toggle, customer lookup
- **Inventory Management**: Product CRUD, stock tracking, SKU generation, category management
- **Customer Management**: Customer records, purchase history, credit/khata tracking
- **Quotations**: Create quotations with terms, validity periods, PDF export
- **Reports**: Sales analytics, date-range filtering, CSV export
- **PDF Export**: Thermal (80mm receipt), A4, A5 formats with Marathi header support
- **WhatsApp Sharing**: Share bills/quotations via WhatsApp
- **Offline-Ready**: Client-side caching with IndexedDB for resilience
- **Mobile Responsive**: Full mobile UI with bottom tab navigation

## License

Private — All rights reserved.
