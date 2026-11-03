import { NextResponse } from "next/server";
import { checkCredentials, makeToken, setAdminCookie } from "@/lib/analytics/auth";

export async function POST(request: Request) {
  let body: { username?: string; password?: string } = {};
  try {
    body = (await request.json()) as { username?: string; password?: string };
  } catch {
    return NextResponse.json({ ok: false, error: "invalid json" }, { status: 400 });
  }

  const username = (body.username || "").trim();
  const password = body.password || "";

  if (!username || !password) {
    return NextResponse.json({ ok: false, error: "username and password required" }, { status: 400 });
  }

  if (!checkCredentials(username, password)) {
    // Slight delay to slow brute-force attempts.
    await new Promise((r) => setTimeout(r, 400));
    return NextResponse.json({ ok: false, error: "invalid credentials" }, { status: 401 });
  }

  const token = makeToken(username);
  const response = NextResponse.json({ ok: true });
  setAdminCookie(response, token);
  return response;
}
