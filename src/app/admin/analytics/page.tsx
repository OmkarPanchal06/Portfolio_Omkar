"use client";

import { useEffect, useState } from "react";
import type { StatsSummary } from "@/lib/analytics/storage";

type Status = "loading" | "unauth" | "ok" | "error";

export default function AnalyticsDashboard() {
  const [status, setStatus] = useState<Status>("loading");
  const [stats, setStats] = useState<StatsSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Login form state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginBusy, setLoginBusy] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  async function load() {
    setStatus("loading");
    try {
      const res = await fetch("/api/analytics/stats", { cache: "no-store" });
      if (res.status === 401) {
        setStatus("unauth");
        return;
      }
      if (!res.ok) {
        setStatus("error");
        setError(`HTTP ${res.status}`);
        return;
      }
      const data = (await res.json()) as { ok: boolean; stats: StatsSummary };
      setStats(data.stats);
      setStatus("ok");
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "network error");
    }
  }

  useEffect(() => {
    let alive = true;
    fetch("/api/analytics/stats", { cache: "no-store" })
      .then(async (res) => {
        if (!alive) return;
        if (res.status === 401) {
          setStatus("unauth");
          return;
        }
        if (!res.ok) {
          setStatus("error");
          setError(`HTTP ${res.status}`);
          return;
        }
        const data = (await res.json()) as { ok: boolean; stats: StatsSummary };
        if (!alive) return;
        setStats(data.stats);
        setStatus("ok");
      })
      .catch((e) => {
        if (!alive) return;
        setStatus("error");
        setError(e instanceof Error ? e.message : "network error");
      });
    return () => {
      alive = false;
    };
  }, []);

  async function onLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginBusy(true);
    setLoginError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setLoginError(data.error || "login failed");
        return;
      }
      setPassword("");
      await load();
    } catch (e) {
      setLoginError(e instanceof Error ? e.message : "network error");
    } finally {
      setLoginBusy(false);
    }
  }

  async function onLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setStats(null);
    setStatus("unauth");
  }

  if (status === "loading") {
    return (
      <main className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
        <p className="font-mono text-sm text-dim">loading…</p>
      </main>
    );
  }

  if (status === "unauth") {
    return (
      <main className="mx-auto max-w-md px-5 py-24 sm:px-8">
        <div className="brutal border-2 border-line bg-ink p-6">
          <div className="font-mono text-[10px] tracking-[0.2em] text-dim">ADMIN ACCESS</div>
          <h1 className="mt-2 font-display text-2xl font-bold uppercase text-fg">Analytics</h1>
          <p className="mt-2 text-sm text-muted">
            Sign in to view private visitor statistics.
          </p>
          <form onSubmit={onLogin} className="mt-6 space-y-3">
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username"
              autoComplete="username"
              className="w-full border border-line bg-ink px-3 py-2 font-mono text-sm text-fg caret-signal outline-none placeholder:text-dim/60 focus:border-signal"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
              autoComplete="current-password"
              className="w-full border border-line bg-ink px-3 py-2 font-mono text-sm text-fg caret-signal outline-none placeholder:text-dim/60 focus:border-signal"
            />
            {loginError && <p className="font-mono text-xs text-amber">{loginError}</p>}
            <button
              type="submit"
              disabled={loginBusy}
              className="w-full border-2 border-signal px-4 py-2 font-mono text-xs font-bold uppercase tracking-[0.16em] text-signal transition-colors hover:bg-signal hover:text-ink disabled:opacity-50"
            >
              {loginBusy ? "SIGNING IN…" : "SIGN IN"}
            </button>
          </form>
        </div>
      </main>
    );
  }

  if (status === "error" || !stats) {
    return (
      <main className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
        <p className="font-mono text-sm text-amber">error: {error}</p>
        <button onClick={() => void load()} className="mt-3 border border-line px-2 py-1 font-mono text-xs hover:bg-signal hover:text-ink">
          retry
        </button>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-mono text-[10px] tracking-[0.2em] text-dim">PRIVATE DASHBOARD</div>
          <h1 className="mt-1 font-display text-3xl font-bold uppercase text-fg">Visitor Analytics</h1>
        </div>
        <button onClick={onLogout} className="border border-line px-3 py-1.5 font-mono text-xs text-dim hover:bg-signal hover:text-ink">
          sign out
        </button>
      </div>

      {/* Overview cards */}
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Unique Visitors", value: stats.totalUniqueVisitors },
          { label: "Page Views", value: stats.totalPageViews },
          { label: "Returning", value: stats.returningVisitors },
          { label: "Today", value: stats.todayVisitors },
        ].map((c) => (
          <div key={c.label} className="brutal border-2 border-line bg-ink p-4">
            <div className="font-mono text-[10px] tracking-[0.16em] text-dim">{c.label.toUpperCase()}</div>
            <div className="mt-2 font-display text-3xl font-bold text-signal">{c.value.toLocaleString()}</div>
          </div>
        ))}
      </div>

      {/* Daily trend */}
      <section className="mt-10">
        <h2 className="font-display text-xl font-bold uppercase text-fg">Daily (last 30 days)</h2>
        <div className="mt-4 brutal border-2 border-line bg-ink p-4">
          <div className="flex items-end gap-1 overflow-x-auto" style={{ height: 120 }}>
            {stats.daily.map((d) => {
              const max = Math.max(1, ...stats.daily.map((x) => x.visitors));
              const h = (d.visitors / max) * 100;
              return (
                <div key={d.date} className="flex flex-1 flex-col items-center gap-1" title={`${d.date}: ${d.visitors} visitors, ${d.views} views`}>
                  <div className="w-full bg-signal/80" style={{ height: `${h}%`, minHeight: 2 }} />
                  <span className="font-mono text-[8px] text-dim">{d.date.slice(5)}</span>
                </div>
              );
            })}
            {stats.daily.length === 0 && <p className="font-mono text-xs text-dim">no data yet</p>}
          </div>
        </div>
      </section>

      {/* Monthly trend */}
      <section className="mt-10">
        <h2 className="font-display text-xl font-bold uppercase text-fg">Monthly</h2>
        <div className="mt-4 brutal border-2 border-line bg-ink p-4">
          <table className="w-full font-mono text-xs">
            <thead>
              <tr className="text-dim">
                <th className="text-left font-normal">Month</th>
                <th className="text-right font-normal">Visitors</th>
                <th className="text-right font-normal">Views</th>
              </tr>
            </thead>
            <tbody>
              {stats.monthly.map((m) => (
                <tr key={m.month} className="border-t border-line/50">
                  <td className="py-1">{m.month}</td>
                  <td className="py-1 text-right">{m.visitors}</td>
                  <td className="py-1 text-right">{m.views}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {stats.monthly.length === 0 && <p className="font-mono text-xs text-dim">no data yet</p>}
        </div>
      </section>

      {/* Top pages */}
      <section className="mt-10">
        <h2 className="font-display text-xl font-bold uppercase text-fg">Top Pages</h2>
        <div className="mt-4 brutal border-2 border-line bg-ink p-4">
          <table className="w-full font-mono text-xs">
            <thead>
              <tr className="text-dim">
                <th className="text-left font-normal">Path</th>
                <th className="text-right font-normal">Views</th>
                <th className="text-right font-normal">Visitors</th>
              </tr>
            </thead>
            <tbody>
              {stats.topPages.map((p) => (
                <tr key={p.path} className="border-t border-line/50">
                  <td className="py-1">{p.path}</td>
                  <td className="py-1 text-right">{p.views}</td>
                  <td className="py-1 text-right">{p.visitors}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {stats.topPages.length === 0 && <p className="font-mono text-xs text-dim">no data yet</p>}
        </div>
      </section>

      {/* Recent activity */}
      <section className="mt-10">
        <h2 className="font-display text-xl font-bold uppercase text-fg">Recent Activity</h2>
        <div className="mt-4 brutal border-2 border-line bg-ink p-4">
          <ul className="space-y-1 font-mono text-xs text-dim">
            {stats.recentActivity.map((a, i) => (
              <li key={i} className="flex justify-between">
                <span>{a.path}</span>
                <span>{new Date(a.timestamp).toLocaleString()}</span>
              </li>
            ))}
            {stats.recentActivity.length === 0 && <li>no data yet</li>}
          </ul>
        </div>
      </section>
    </main>
  );
}
