import { getSupabase, isSupabaseConfigured } from "./supabase";

/**
 * Supabase-backed analytics storage.
 *
 * Table: analytics_visits
 *   id          uuid (PK, default gen_random_uuid())
 *   visitor_id  text (not null)
 *   path        text (not null)
 *   created_at  timestamptz (default now())
 *   day         date (not null)
 *
 * All reads/writes go through the service-role client (server-side only).
 * RLS is enabled with NO public policies, so anonymous clients cannot read or
 * write. The service-role key bypasses RLS, which is why it must never reach
 * the browser.
 */

export type VisitEvent = {
  visitorId: string;
  path: string;
  timestamp: number;
  day: string;
};

export type StatsSummary = {
  totalUniqueVisitors: number;
  totalPageViews: number;
  returningVisitors: number;
  todayVisitors: number;
  daily: { date: string; visitors: number; views: number }[];
  weekly: { week: string; visitors: number; views: number }[];
  monthly: { month: string; visitors: number; views: number }[];
  topPages: { path: string; views: number; visitors: number }[];
  recentActivity: { path: string; timestamp: number }[];
};

const RETENTION_DAYS = 90;

function utcDay(ts: number): string {
  return new Date(ts).toISOString().slice(0, 10);
}

function weekKey(ts: number): string {
  const d = new Date(ts);
  const date = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const day = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

function monthKey(ts: number): string {
  return new Date(ts).toISOString().slice(0, 7);
}

export async function recordVisit(event: VisitEvent): Promise<void> {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  }
  const supabase = getSupabase();
  const { error } = await supabase.from("analytics_visits").insert({
    visitor_id: event.visitorId,
    path: event.path,
    created_at: new Date(event.timestamp).toISOString(),
    day: event.day,
  });
  if (error) {
    throw new Error(`Failed to record visit: ${error.message}`);
  }
}

export async function getStats(): Promise<StatsSummary> {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  }
  const supabase = getSupabase();

  // Fetch all visits within retention window.
  const cutoff = new Date(Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await supabase
    .from("analytics_visits")
    .select("visitor_id, path, created_at, day")
    .gte("created_at", cutoff)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch stats: ${error.message}`);
  }

  const visits = (data || []).map((row: { visitor_id: string; path: string; created_at: string; day: string }) => ({
    visitorId: row.visitor_id as string,
    path: row.path as string,
    timestamp: new Date(row.created_at).getTime(),
    day: row.day as string,
  }));

  const uniqueVisitors = new Set(visits.map((v) => v.visitorId));
  const totalPageViews = visits.length;

  const visitorDays = new Map<string, Set<string>>();
  for (const v of visits) {
    if (!visitorDays.has(v.visitorId)) visitorDays.set(v.visitorId, new Set());
    visitorDays.get(v.visitorId)!.add(v.day);
  }
  const returningVisitors = [...visitorDays.values()].filter((s) => s.size > 1).length;

  const today = utcDay(Date.now());
  const todayVisitors = new Set(visits.filter((v) => v.day === today).map((v) => v.visitorId)).size;

  // Daily (last 30 days)
  const dailyMap = new Map<string, { visitors: Set<string>; views: number }>();
  for (const v of visits) {
    if (!dailyMap.has(v.day)) dailyMap.set(v.day, { visitors: new Set(), views: 0 });
    const d = dailyMap.get(v.day)!;
    d.visitors.add(v.visitorId);
    d.views += 1;
  }
  const daily = [...dailyMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-30)
    .map(([date, d]) => ({ date, visitors: d.visitors.size, views: d.views }));

  // Weekly
  const weeklyMap = new Map<string, { visitors: Set<string>; views: number }>();
  for (const v of visits) {
    const w = weekKey(v.timestamp);
    if (!weeklyMap.has(w)) weeklyMap.set(w, { visitors: new Set(), views: 0 });
    const wk = weeklyMap.get(w)!;
    wk.visitors.add(v.visitorId);
    wk.views += 1;
  }
  const weekly = [...weeklyMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-12)
    .map(([week, w]) => ({ week, visitors: w.visitors.size, views: w.views }));

  // Monthly
  const monthlyMap = new Map<string, { visitors: Set<string>; views: number }>();
  for (const v of visits) {
    const m = monthKey(v.timestamp);
    if (!monthlyMap.has(m)) monthlyMap.set(m, { visitors: new Set(), views: 0 });
    const mo = monthlyMap.get(m)!;
    mo.visitors.add(v.visitorId);
    mo.views += 1;
  }
  const monthly = [...monthlyMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-12)
    .map(([month, m]) => ({ month, visitors: m.visitors.size, views: m.views }));

  // Top pages
  const pageMap = new Map<string, { views: number; visitors: Set<string> }>();
  for (const v of visits) {
    if (!pageMap.has(v.path)) pageMap.set(v.path, { views: 0, visitors: new Set() });
    const p = pageMap.get(v.path)!;
    p.views += 1;
    p.visitors.add(v.visitorId);
  }
  const topPages = [...pageMap.entries()]
    .map(([path, p]) => ({ path, views: p.views, visitors: p.visitors.size }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);

  const recentActivity = visits
    .slice()
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 20)
    .map((v) => ({ path: v.path, timestamp: v.timestamp }));

  return {
    totalUniqueVisitors: uniqueVisitors.size,
    totalPageViews,
    returningVisitors,
    todayVisitors,
    daily,
    weekly,
    monthly,
    topPages,
    recentActivity,
  };
}
