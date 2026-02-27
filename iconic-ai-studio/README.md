# IconicAI Studio

**AI-Powered Fashion Model Generator SaaS** — Upload product photos and instantly generate professional fashion-model images with customizable backgrounds, resolutions, and model types. Built with a credit-based pricing system and dual payment-gateway support.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3, Framer Motion |
| UI Components | Radix UI, Lucide React |
| Database | PostgreSQL (Supabase) |
| Auth | Supabase Auth |
| Payments | Stripe, Razorpay |
| AI Generation | Pluggable (mock adapter included) |
| Deployment | Vercel |

---

## Features

- **AI Image Generation** — Upload front/back product photos and receive model images in 2K or 4K resolution.
- **Credit System** — Pay-as-you-go credits with six pricing tiers.
- **Dual Payment Gateways** — Stripe and Razorpay webhook integrations.
- **Dashboard** — Generation history, credit overview, profile management.
- **Admin Panel** — User management, credit adjustments, transaction history.
- **Landing Page** — Hero, features, how-it-works, pricing, and stats sections.
- **Dark Luxury Theme** — Gold accents, Playfair Display headings, fully responsive.

---

## Project Structure

```
iconic-ai-studio/
├── database/
│   └── schema.sql                 # PostgreSQL tables & RLS policies
├── public/                        # Static assets
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── generate/
│   │   │   │   └── route.ts       # POST /api/generate
│   │   │   └── webhook/
│   │   │       ├── stripe/
│   │   │       │   └── route.ts   # POST /api/webhook/stripe
│   │   │       └── razorpay/
│   │   │           └── route.ts   # POST /api/webhook/razorpay
│   │   ├── admin/
│   │   │   └── page.tsx           # Admin dashboard
│   │   ├── dashboard/
│   │   │   ├── generate/page.tsx  # Image generation UI
│   │   │   ├── history/page.tsx   # Past generations
│   │   │   ├── pricing/page.tsx   # Credit purchase
│   │   │   ├── profile/page.tsx   # User profile
│   │   │   ├── layout.tsx         # Dashboard shell
│   │   │   └── page.tsx           # Dashboard home
│   │   ├── login/page.tsx         # Login
│   │   ├── signup/page.tsx        # Sign-up
│   │   ├── layout.tsx             # Root layout
│   │   ├── page.tsx               # Landing page
│   │   └── globals.css
│   ├── components/
│   │   ├── landing/               # Landing-page sections
│   │   │   ├── navbar.tsx
│   │   │   ├── hero.tsx
│   │   │   ├── stats.tsx
│   │   │   ├── features.tsx
│   │   │   ├── how-it-works.tsx
│   │   │   ├── pricing-section.tsx
│   │   │   └── footer.tsx
│   │   └── ui/                    # Reusable Radix-based components
│   ├── hooks/
│   │   └── use-toast.ts
│   ├── lib/
│   │   ├── auth-context.tsx       # Auth provider & context
│   │   ├── credits.ts             # Credit helper functions
│   │   ├── mock-ai.ts             # Mock AI generation adapter
│   │   ├── supabase.ts            # Supabase client
│   │   └── utils.ts               # Utility helpers (cn)
│   ├── types/
│   │   └── index.ts               # Shared TypeScript interfaces
│   └── middleware.ts              # Route protection
├── .env.example
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** (ships with Node.js)
- A **Supabase** project (free tier works)
- *(Optional)* Stripe and/or Razorpay accounts for payments

### Installation

```bash
cd iconic-ai-studio
npm install
```

### Environment Setup

Copy the example env file and fill in your values:

```bash
cp .env.example .env.local
```

Required variables:

```
NEXT_PUBLIC_SUPABASE_URL=<your_supabase_url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_supabase_anon_key>
SUPABASE_SERVICE_ROLE_KEY=<your_service_role_key>

STRIPE_SECRET_KEY=<your_stripe_secret_key>
STRIPE_WEBHOOK_SECRET=<your_stripe_webhook_secret>

RAZORPAY_KEY_ID=<your_razorpay_key_id>
RAZORPAY_KEY_SECRET=<your_razorpay_key_secret>

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Database Setup

Run the schema against your Supabase PostgreSQL instance:

```bash
# Using the Supabase SQL Editor or psql:
psql "$DATABASE_URL" -f database/schema.sql
```

This creates three tables — `users`, `generations`, and `transactions` — with row-level security policies.

### Running the Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## Credit System

Every new user receives **5 free credits**. Each AI generation consumes **1 credit**. Additional credits can be purchased through the pricing page.

### How It Works

1. User uploads a product image and selects generation settings (category, background, resolution, model type).
2. The system checks the user's remaining credits via `hasCredits(total, used)`.
3. On success, one credit is deducted and the generated image is returned.
4. Credit balance is displayed on the dashboard and updated in real time.

---

## API Endpoints

### `POST /api/generate`

Generate an AI fashion-model image from a product photo.

| Field | Type | Description |
|-------|------|-------------|
| `image` | File | Product image (JPG/PNG, max 10 MB) |
| `category` | string | `Women`, `Men`, or `Kids` |
| `subcategory` | string | e.g. `Saree`, `Kurti`, `Shirt` |
| `background` | string | e.g. `Studio White`, `Outdoor`, `Custom` |
| `resolution` | string | `2K` or `4K` |
| `modelType` | string | `Indian` or `International` |
| `modelConsistency` | boolean | Reuse the same model across runs |

**Rate limit:** 10 requests per minute per user.

### `POST /api/webhook/stripe`

Receives Stripe payment events. Verifies the webhook signature, allocates credits, and records the transaction.

### `POST /api/webhook/razorpay`

Receives Razorpay payment events. Verifies the webhook signature, allocates credits, and records the transaction.

---

## Pricing Plans

| Plan | Credits | Price (INR) | Highlights |
|------|---------|-------------|------------|
| **Starter** | 10 | ₹499 | 2K resolution, email support |
| **Basic** | 50 | ₹1,999 | All backgrounds, priority support |
| **Pro** | 150 | ₹4,999 | 4K resolution, model consistency |
| **Business** | 500 | ₹14,999 | API access, dedicated support |
| **Enterprise** | 2,000 | ₹49,999 | White-label, account manager |
| **Unlimited** | 9,999 | ₹99,999 | Custom AI training, everything included |

---

## Deployment (Vercel)

1. Push the repository to GitHub.
2. Import the project in [Vercel](https://vercel.com/new).
3. Set the **Root Directory** to `iconic-ai-studio`.
4. Add all environment variables from `.env.example` in the Vercel project settings.
5. Deploy. Vercel auto-detects the Next.js framework.

For webhook endpoints, configure your Stripe/Razorpay dashboards to point at:

```
https://<your-domain>/api/webhook/stripe
https://<your-domain>/api/webhook/razorpay
```

---

## Security

- **Row-Level Security (RLS)** on all Supabase tables ensures users can only access their own data.
- **Webhook signature verification** for both Stripe and Razorpay.
- **File validation** on uploads — only JPG/PNG accepted, max 10 MB.
- **Rate limiting** — 10 generation requests per minute per user.
- **Environment variables** keep secrets out of the codebase; `.env.local` is git-ignored.
- **Middleware-based route protection** guards authenticated pages.

---

## License

This project is part of the [NewProject](../) repository. See the root [LICENSE](../LICENSE) file for details.
