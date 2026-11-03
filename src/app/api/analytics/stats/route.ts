import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/analytics/auth";
import { getStats } from "@/lib/analytics/storage";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  try {
    const stats = await getStats();
    return NextResponse.json({ ok: true, stats });
  } catch (err) {
    const message = err instanceof Error ? err.message : "failed to fetch stats";
    return NextResponse.json({ ok: false, error: message }, { status: 502 });
  }
}
