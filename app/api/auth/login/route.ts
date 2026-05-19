// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { loginUser } from "@/lib/api/auth";
import type { User } from "@/types";

const API_BASE = process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.escuelajs.co/api/v1";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Step 1: Get tokens from Platzi
    const tokenResult = await loginUser({ email, password });

    if (tokenResult.error || !tokenResult.data) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const tokens = tokenResult.data;

    // Step 2: Get user profile using the access token
    const profileResponse = await fetch(`${API_BASE}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
        "Content-Type": "application/json",
      },
    });

    if (!profileResponse.ok) {
      // Tokens valid but profile fetch failed — return tokens without user
      return NextResponse.json({ tokens, user: null });
    }

    const user: User = await profileResponse.json();

    return NextResponse.json({ tokens, user }, { status: 200 });
  } catch (err) {
    console.error("[login route]", err);          // ← shows real error in terminal
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}