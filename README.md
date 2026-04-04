# NewProject

This repository contains multiple projects:

## Projects

### [IconicAI Studio](./iconic-ai-studio/)

An AI-powered Fashion Model Generator SaaS built with Next.js 14, TypeScript, Tailwind CSS, and Supabase. Upload product photos and generate professional fashion-model images with customizable backgrounds, resolutions, and model types. Features a credit-based pricing system with Stripe and Razorpay payment integrations.

➡️ See the full documentation in [`iconic-ai-studio/README.md`](./iconic-ai-studio/README.md).

---

## Deploy to Vercel

The repository includes a `vercel.json` that automatically points Vercel at the `iconic-ai-studio/` folder — no manual configuration needed.

1. Go to [vercel.com](https://vercel.com) and click **"Add New → Project"**.
2. Import this GitHub repository (`NewProject`).
3. Add your environment variables (copy them from `iconic-ai-studio/.env.example`):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_APP_URL` → set this to your Vercel domain (e.g. `https://your-app.vercel.app`)
   - *(Optional)* `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`
4. Click **Deploy**.

### Already deployed but getting a 404?

Go to the **Deployments** tab on your Vercel project and click **"Redeploy"** on the latest deployment. The updated `vercel.json` in this repo will automatically fix the issue.

---

## License

See [LICENSE](./LICENSE) for details.
