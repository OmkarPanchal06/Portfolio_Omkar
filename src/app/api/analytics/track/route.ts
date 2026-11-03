import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { recordVisit } from "@/lib/analytics/storage";

const VISITOR_COOKIE = "op_vid";
const ADMIN_COOKIE = "op_admin";
const DEDUP_WINDOW_MS = 30 * 60 * 1000;

function newVisitorId(): string {
  return crypto.randomUUID();
}

function utcDay(ts: number): string {
  return new Date(ts).toISOString().slice(0, 10);
}

export async function POST(request: Request) {
  const cookieStore = await cookies();

  // Never track admin sessions.
  if (cookieStore.get(ADMIN_COOKIE)?.value) {
    return NextResponse.json({ ok: true, tracked: false, reason: "admin" });
  }

  let body: { path?: string } = {};
  try {
    body = (await request.json()) as { path?: string };
  } catch {
    body = {};
  }

  // Validate path: must be a string, max 200 chars, must start with /
  const rawPath = typeof body.path === "string" ? body.path : "/";
  const path = rawPath.slice(0, 200);
  if (!path.startsWith("/")) {
    return NextResponse.json({ ok: false, error: "invalid path" }, { status: 400 });
  }

  const existing = cookieStore.get(VISITOR_COOKIE)?.value;
  const visitorId = existing || newVisitorId();

  const now = Date.now();

  const lastSeenCookie = cookieStore.get("op_last");
  let lastSeen = 0;
  if (lastSeenCookie?.value) {
    try {
      lastSeen = Number(lastSeenCookie.value);
    } catch {
      lastSeen = 0;
    }
  }

  const response = NextResponse.json({ ok: true, tracked: true });

  response.cookies.set(VISITOR_COOKIE, visitorId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  if (now - lastSeen < DEDUP_WINDOW_MS) {
    response.cookies.set("op_last", String(now), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60,
    });
    return response;
  }

  // Record the visit. If the DB write fails, report it (don't silently succeed).
  try {
    await recordVisit({
      visitorId,
      path,
      timestamp: now,
      day: utcDay(now),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "tracking failed";
    return NextResponse.json({ ok: false, tracked: false, error: message }, { status: 502 });
  }

  response.cookies.set("op_last", String(now), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60,
  });

  return response;
}
