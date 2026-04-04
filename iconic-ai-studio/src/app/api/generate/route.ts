import { NextRequest, NextResponse } from "next/server";
import { generateFashionModelImage, GenerationSettings } from "@/lib/mock-ai";

const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 60_000;

function isRateLimited(userId: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(userId);

  if (!entry || now - entry.lastReset > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(userId, { count: 1, lastReset: now });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return true;
  }

  entry.count += 1;
  return false;
}

function isValidFileType(productImage: string): boolean {
  const lower = productImage.toLowerCase();
  return /\.(jpg|jpeg|png)(\?|$|&)/.test(lower) || /^data:image\/(jpeg|png)/.test(lower);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productImage, settings, userId } = body as {
      productImage: unknown;
      settings: unknown;
      userId?: string;
    };

    if (!productImage || typeof productImage !== "string") {
      return NextResponse.json(
        { error: "productImage is required and must be a string" },
        { status: 400 }
      );
    }

    if (!settings || typeof settings !== "object") {
      return NextResponse.json(
        { error: "settings object is required" },
        { status: 400 }
      );
    }

    if (!isValidFileType(productImage)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPG and PNG images are accepted." },
        { status: 400 }
      );
    }

    const userKey = typeof userId === "string" ? userId : "anonymous";
    if (isRateLimited(userKey)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Maximum 10 requests per minute." },
        { status: 429 }
      );
    }

    const result = await generateFashionModelImage(
      productImage,
      settings as GenerationSettings
    );

    return NextResponse.json(
      { imageUrl: result.imageUrl, seedId: result.seedId },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
