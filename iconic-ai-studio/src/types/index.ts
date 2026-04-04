export interface User {
  id: string;
  email: string;
  name: string;
  total_credits: number;
  used_credits: number;
  created_at: string;
}

export interface Generation {
  id: string;
  user_id: string;
  product_image_url: string;
  generated_image_url: string;
  resolution: "2K" | "4K";
  category: string;
  created_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  credits_added: number;
  payment_provider: "stripe" | "razorpay";
  status: "pending" | "completed" | "failed";
  created_at: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  credits: number;
  price: number;
  currency: string;
  features: string[];
  highlighted?: boolean;
}
