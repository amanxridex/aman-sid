import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { passcode } = await req.json();
    const cleanInput = (passcode || "").trim();

    // Secure server-side check (supports env var or default owner passcode)
    const validCodes = [
      process.env.ADMIN_PASSWORD,
      "derick2026",
      "derick",
      "derek2026",
      "derek",
      "cozytheory",
    ].filter(Boolean);

    if (validCodes.includes(cleanInput)) {
      const response = NextResponse.json({ success: true });
      response.cookies.set("tct_admin_auth", "true", {
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        sameSite: "lax",
      });
      return response;
    }

    return NextResponse.json(
      { error: "Access Denied: Invalid security passcode." },
      { status: 401 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Authentication verification failed." },
      { status: 500 }
    );
  }
}
