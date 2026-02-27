# NewProject

This repository contains multiple projects:

## Projects

### [IconicAI Studio](./iconic-ai-studio/)

An AI-powered Fashion Model Generator SaaS built with Next.js 14, TypeScript, Tailwind CSS, and Supabase. Upload product photos and generate professional fashion-model images with customizable backgrounds, resolutions, and model types. Features a credit-based pricing system with Stripe and Razorpay payment integrations.

➡️ See the full documentation in [`iconic-ai-studio/README.md`](./iconic-ai-studio/README.md).

---

## Deploy to Vercel (Step-by-Step)

Because the Next.js app lives inside the `iconic-ai-studio/` folder (not at the root of this repo), you **must** tell Vercel where to find it. Follow these steps:

1. Go to [vercel.com](https://vercel.com) and click **"Add New → Project"**.
2. Import this GitHub repository (`NewProject`).
3. **Important — Set the Root Directory:**
   - On the project configuration screen, find the **"Root Directory"** field.
   - Click **Edit** and type: `iconic-ai-studio`
   - This tells Vercel the app is inside that folder.
4. Add your environment variables (copy them from `iconic-ai-studio/.env.example`):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_APP_URL` → set this to your Vercel domain (e.g. `https://your-app.vercel.app`)
   - *(Optional)* `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`
5. Click **Deploy**.

### Already deployed but getting a 404?

1. Open your project on [vercel.com](https://vercel.com/dashboard).
2. Go to **Settings → General**.
3. Scroll down to **"Root Directory"**.
4. Change it to `iconic-ai-studio` and click **Save**.
5. Go to the **Deployments** tab and click **"Redeploy"** on the latest deployment.

---

## License

See [LICENSE](./LICENSE) for details.
