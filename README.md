# Bhandar

Bhandar (ভান্ডার) is an inventory, sales, and storefront management platform for small business owners in Bangladesh.

## Core Features

- Supabase email/password and Google auth with verified-email dashboard access
- Prisma/PostgreSQL data model for users, plans, stores, products, variants, orders, and subscriptions
- Product limits for Free, Pro, and Max plans
- Public storefront at `/store/[slug]`
- Persisted cart with guest checkout
- Stripe card checkout and subscription billing portal
- Development mobile-payment simulator while ShurjoPay credentials are pending
- Upstash-backed rate limiting for auth, products, and orders

## Local Setup

1. Copy `.env.example` to `.env.local`.
2. Fill Supabase, Stripe, and Upstash values.
3. Create Supabase Storage buckets:
   - `product-images`
   - `digital-files`
   - `store-logos`
   - `avatars`
4. Reset and seed the database:

```bash
npm run db:reset
```

5. Run the app:

```bash
npm run dev
```

## Plans

| Plan | Price | Product Limit |
| --- | ---: | ---: |
| Free | ৳0/mo | 50 |
| Pro | ৳499/mo | 500 |
| Max | ৳999/mo | 1000+ |

Resend email templates are intentionally deferred until sender/domain setup is ready.
