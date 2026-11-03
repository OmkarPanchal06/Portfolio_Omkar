import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import crypto from "node:crypto";

/**
 * Minimal, dependency-free admin authentication.
 *
 * Configuration (environment variables):
 *   ADMIN_USERNAME   (default: "admin")
 *   ADMIN_PASSWORD   (required - the plaintext password you choose)
 *
 * On successful login a signed session token is stored in an httpOnly cookie
 * (`op_admin`). Verification is server-side only. For production-grade auth,
 * swap this for Supabase Auth and keep the same cookie name + isAdmin() helper.
 */

const ADMIN_COOKIE = "op_admin";
const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24h

function secret(): string {
  // Falls back to a dev-only secret so local dev works without configuration.
  // In production, ADMIN_SESSION_SECRET should be set to a long random string.
  return process.env.ADMIN_SESSION_SECRET || "dev-only-insecure-secret-change-me";
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", secret()).update(payload).digest("hex");
}

export function makeToken(username: string): string {
  const expires = Date.now() + SESSION_TTL_MS;
  const payload = `${username}:${expires}`;
  return `${payload}:${sign(payload)}`;
}

export function verifyToken(token: string | undefined): { username: string } | null {
  if (!token) return null;
  const parts = token.split(":");
  if (parts.length !== 3) return null;
  const [username, expiresStr, sig] = parts;
  const expires = Number(expiresStr);
  if (!Number.isFinite(expires) || Date.now() > expires) return null;
  const payload = `${username}:${expiresStr}`;
  const expected = sign(payload);
  // Constant-time comparison.
  if (sig.length !== expected.length) return null;
  let diff = 0;
  for (let i = 0; i < sig.length; i++) diff |= sig.charCodeAt(i) ^ expected.charCodeAt(i);
  if (diff !== 0) return null;

  const configuredUser = process.env.ADMIN_USERNAME || "admin";
  if (username !== configuredUser) return null;
  return { username };
}

export async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  return verifyToken(token) !== null;
}

export function adminUsername(): string {
  return process.env.ADMIN_USERNAME || "admin";
}

export function checkCredentials(username: string, password: string): boolean {
  const configuredUser = process.env.ADMIN_USERNAME || "admin";
  const configuredPass = process.env.ADMIN_PASSWORD;
  if (!configuredPass) return false;
  // Constant-time-ish comparison for both fields.
  if (username.length !== configuredUser.length) return false;
  let userDiff = 0;
  for (let i = 0; i < username.length; i++) userDiff |= username.charCodeAt(i) ^ configuredUser.charCodeAt(i);
  if (userDiff !== 0) return false;

  if (password.length !== configuredPass.length) return false;
  let passDiff = 0;
  for (let i = 0; i < password.length; i++) passDiff |= password.charCodeAt(i) ^ configuredPass.charCodeAt(i);
  return passDiff === 0;
}

export { ADMIN_COOKIE };
export function setAdminCookie(response: NextResponse, token: string): void {
  response.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  });
}

export function clearAdminCookie(response: NextResponse): void {
  response.cookies.set(ADMIN_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}
