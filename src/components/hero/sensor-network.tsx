"use client";

import { useEffect, useRef } from "react";

/**
 * Live IoT sensor mesh.
 *
 * Nodes sit on a deterministic seeded layout, drift gently, and push away from
 * the cursor. Edges are built once per resize (cheap). Telemetry packets travel
 * along edges independently of the edge list, so the graph can redraw without
 * invalidating in-flight packets.
 *
 * Perf rules: one batched stroke for every edge, DPR capped at 2, and the RAF
 * loop stops entirely when the hero scrolls offscreen or the tab is hidden.
 */

const ACCENTS = ["#c6ff00", "#ff6b1a", "#00e5ff"] as const;

type SensorNode = {
  bx: number;
  by: number;
  px: number;
  py: number;
  ox: number;
  oy: number;
  r: number;
  gateway: boolean;
  phase: number;
  speed: number;
  accent: number;
};

type Edge = { a: number; b: number };

type Packet = { a: number; b: number; t: number; speed: number; rev: boolean };

/** Deterministic PRNG so the mesh looks designed, not random, on every load. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function SensorNetwork() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const deliveredRef = useRef<HTMLSpanElement>(null);
  const linkRef = useRef<HTMLSpanElement>(null);
  const nodesRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const maybeWrap = wrapRef.current;
    const maybeCanvas = canvasRef.current;
    if (!maybeWrap || !maybeCanvas) return;

    const wrap: HTMLDivElement = maybeWrap;
    const canvas: HTMLCanvasElement = maybeCanvas;

    const maybeCtx = canvas.getContext("2d", { alpha: true });
    if (!maybeCtx) return;
    const ctx: CanvasRenderingContext2D = maybeCtx;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0;
    let H = 0;
    let raf = 0;
    let inView = true;
    let frame = 0;
    let clock = 0;
    let last = performance.now();
    let spawnAcc = 0;
    let delivered = 0;

    const rnd = mulberry32(20261017);
    const nodes: SensorNode[] = [];
    let edges: Edge[] = [];
    const packets: Packet[] = [];
    const mouse = { x: -9999, y: -9999 };

    const NODE_COUNT = 76;
    for (let i = 0; i < NODE_COUNT; i++) {
      const gateway = i % 8 === 0;
      nodes.push({
        bx: 0.02 + rnd() * 0.96,
        by: 0.03 + rnd() * 0.94,
        px: 0,
        py: 0,
        ox: 0,
        oy: 0,
        r: gateway ? 4.4 : 1.5 + rnd() * 1.7,
        gateway,
        phase: rnd() * Math.PI * 2,
        speed: 0.3 + rnd() * 0.55,
        accent: gateway ? (i % 16 === 0 ? 1 : 0) : rnd() > 0.95 ? 2 : 0,
      });
    }
    if (nodesRef.current) nodesRef.current.textContent = String(nodes.length);

    function layout() {
      const rect = wrap.getBoundingClientRect();
      W = Math.max(1, rect.width);
      H = Math.max(1, rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      for (const n of nodes) {
        n.px = n.bx * W;
        n.py = n.by * H;
        n.ox = 0;
        n.oy = 0;
      }

      edges = [];
      const maxD = Math.min(W, H) * 0.19;
      const maxD2 = maxD * maxD;
      for (let i = 0; i < nodes.length && edges.length < 340; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].px - nodes[j].px;
          const dy = nodes[i].py - nodes[j].py;
          const d2 = dx * dx + dy * dy;
          if (d2 < maxD2) edges.push({ a: i, b: j });
        }
      }
    }

    function spawnPacket() {
      if (!edges.length) return;
      const e = edges[(Math.random() * edges.length) | 0];
      packets.push({
        a: e.a,
        b: e.b,
        t: 0,
        speed: 0.2 + Math.random() * 0.34,
        rev: Math.random() > 0.5,
      });
    }

    function step(dt: number) {
      clock += dt;
      const R = 132;

      for (const n of nodes) {
        const dx = n.px - mouse.x;
        const dy = n.py - mouse.y;
        const d = Math.hypot(dx, dy);
        let pushX = 0;
        let pushY = 0;
        if (d < R && d > 0.001) {
          const f = (1 - d / R) * 36;
          pushX = (dx / d) * f;
          pushY = (dy / d) * f;
        }
        n.ox = Math.cos(clock * n.speed + n.phase) * 6 + pushX;
        n.oy = Math.sin(clock * n.speed * 0.82 + n.phase) * 6 + pushY;
      }

      spawnAcc += dt;
      if (spawnAcc > 0.15 && packets.length < 30) {
        spawnAcc = 0;
        spawnPacket();
      }

      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i];
        p.t += p.speed * dt;
        if (p.t >= 1) {
          delivered++;
          packets.splice(i, 1);
        }
      }
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);

      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(198, 255, 0, 0.14)";
      ctx.beginPath();
      for (const e of edges) {
        const a = nodes[e.a];
        const b = nodes[e.b];
        ctx.moveTo(a.px + a.ox, a.py + a.oy);
        ctx.lineTo(b.px + b.ox, b.py + b.oy);
      }
      ctx.stroke();

      for (const n of nodes) {
        const x = n.px + n.ox;
        const y = n.py + n.oy;
        const pulse = 0.62 + 0.38 * Math.sin(clock * 1.6 + n.phase);
        const c = ACCENTS[n.accent];

        if (n.gateway) {
          ctx.strokeStyle = c;
          ctx.globalAlpha = 0.16 + 0.2 * pulse;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(x, y, n.r + 5 + pulse * 3, 0, Math.PI * 2);
          ctx.stroke();
          ctx.globalAlpha = 0.9;
        } else {
          ctx.globalAlpha = 0.34 + 0.4 * pulse;
        }

        ctx.fillStyle = c;
        ctx.beginPath();
        ctx.arc(x, y, n.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      ctx.globalCompositeOperation = "lighter";
      for (const p of packets) {
        const a = nodes[p.a];
        const b = nodes[p.b];
        const t = p.rev ? 1 - p.t : p.t;
        const x = a.px + a.ox + ((b.px + b.ox) - (a.px + a.ox)) * t;
        const y = a.py + a.oy + ((b.py + b.oy) - (a.py + a.oy)) * t;
        const tt = Math.max(0, t - 0.09);
        const tx = a.px + a.ox + ((b.px + b.ox) - (a.px + a.ox)) * tt;
        const ty = a.py + a.oy + ((b.py + b.oy) - (a.py + a.oy)) * tt;

        ctx.strokeStyle = "rgba(198, 255, 0, 0.6)";
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(x, y);
        ctx.stroke();

        ctx.fillStyle = "#f4ffd0";
        ctx.beginPath();
        ctx.arc(x, y, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";

      if (mouse.x > -999 && mouse.x < W + 200) {
        const g = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 150);
        g.addColorStop(0, "rgba(198, 255, 0, 0.13)");
        g.addColorStop(1, "rgba(198, 255, 0, 0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 150, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function tick(now: number) {
      raf = 0;
      if (!running) return;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      frame++;

      step(dt);
      draw();

      if (frame % 8 === 0 && deliveredRef.current) {
        deliveredRef.current.textContent = delivered.toLocaleString("en-US");
      }
      if (frame % 100 === 0 && linkRef.current) {
        linkRef.current.textContent =
          linkRef.current.textContent === "ACTIVE" ? "SYNCING" : "ACTIVE";
      }

      raf = requestAnimationFrame(tick);
    }

    function shouldRun() {
      return !reduce && inView && !document.hidden;
    }

    let running = false;
    function start() {
      if (running || !shouldRun()) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    }
    function stop() {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    }

    const onPointer = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    const onVisibility = () => {
      if (shouldRun()) start();
      else stop();
    };

    const ro = new ResizeObserver(() => {
      layout();
      if (reduce) draw();
    });
    ro.observe(wrap);

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (shouldRun()) start();
        else stop();
      },
      { threshold: 0.01 },
    );
    io.observe(wrap);

    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);

    layout();

    if (reduce) {
      if (linkRef.current) linkRef.current.textContent = "STATIC";
      if (deliveredRef.current) deliveredRef.current.textContent = "—";
      draw();
    } else {
      start();
    }

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />

      <div className="absolute right-4 top-20 hidden select-none border border-line/80 bg-ink/70 px-3 py-2 font-mono text-[10px] leading-relaxed backdrop-blur-sm sm:block lg:right-8">
        <div className="flex items-center gap-6 text-dim">
          <span>LINK</span>
          <span ref={linkRef} className="w-16 text-right text-signal">
            ACTIVE
          </span>
        </div>
        <div className="flex items-center gap-6 text-dim">
          <span>NODES</span>
          <span ref={nodesRef} className="w-16 text-right text-fg">
            76
          </span>
        </div>
        <div className="flex items-center gap-6 text-dim">
          <span>DELIVERED</span>
          <span ref={deliveredRef} className="w-16 text-right text-fg">
            0
          </span>
        </div>
      </div>
    </div>
  );
}
