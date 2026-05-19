// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from "next/server";

const API_BASE =
  process.env.API_BASE_URL ??
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "https://api.escuelajs.co/api/v1";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    // Step 1: Create the account → POST /users/
    const registerRes = await fetch(`${API_BASE}/users/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        password,
        avatar: "https://picsum.photos/800",  // Platzi accepts this
      }),
    });

    const registerData = await registerRes.json();

    if (!registerRes.ok) {
      console.error("[register] Platzi /users/ error:", registerRes.status, registerData);
      return NextResponse.json(
        { error: registerData?.message ?? "Could not create account" },
        { status: registerRes.status }
      );
    }

    // registerData = { id, name, email, avatar, role }
    const user = registerData;

    // Step 2: Login with the same credentials → get tokens
    const loginRes = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const loginData = await loginRes.json();

    if (!loginRes.ok) {
      console.error("[register] auto-login failed:", loginRes.status, loginData);
      // Account created but login failed — ask them to log in manually
      return NextResponse.json(
        { message: "Account created. Please log in.", user },
        { status: 201 }
      );
    }

    // loginData = { access_token, refresh_token }
    const tokens = loginData;

    return NextResponse.json({ tokens, user }, { status: 201 });

  } catch (err) {
    console.error("[register route] threw:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}