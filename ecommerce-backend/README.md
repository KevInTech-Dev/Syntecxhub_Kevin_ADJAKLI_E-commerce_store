# Ecommerce Backend

Minimal backend for the e-commerce project (Express + MongoDB + Stripe).

Setup (local dev):

1. Copy `.env.example` to `.env` and fill values (MONGO_URI, JWT_SECRET, STRIPE keys).

2. Install deps and run seed (create admin & sample products):

```powershell
cd ecommerce-backend
npm install
npm run seed
npm run dev
```

Or using Docker Compose:

```powershell
docker compose up --build
```

Stripe notes:
- Create a Checkout session by calling `/api/payment/create-checkout-session` (authenticated).
- Configure a Stripe webhook pointing to `/api/payment/webhook` and set `STRIPE_WEBHOOK_SECRET` in `.env`.
