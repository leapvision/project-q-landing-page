"use client";

import { useEffect, useRef, useState } from "react";

export type HeroFx = "dots" | "scan" | "grid" | "flow";

const INK = "23, 21, 15";
const RED = "163, 22, 33";

/**
 * Variant 1 — "dots": the unread archive as a faint drifting constellation;
 * every few seconds a handful of studies gather into a cohort and one ticks
 * diagnostic red, then dissolves back into the field.
 */
export function ConstellationBackdrop() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = canvas.getContext("2d")!;
    let raf = 0;
    let disposed = false;

    type Dot = {
      x: number; y: number; vx: number; vy: number;
      r: number; a: number; hx: number; hy: number; grabbed: boolean;
    };
    let dots: Dot[] = [];
    let w = 0, h = 0, dpr = 1;

    // cluster cycle: idle → gather → hold → release
    const CYCLE = 8000, GATHER = 1800, HOLD = 2200, RELEASE = 1800;
    let cycleStart = 0;
    let cx = 0, cy = 0;

    function seed() {
      const rect = canvas!.parentElement!.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
      const n = Math.max(60, Math.min(130, Math.round((w * h) / 14000)));
      dots = Array.from({ length: n }, () => {
        const x = Math.random() * w;
        const y = Math.random() * h;
        return {
          x, y, hx: x, hy: y,
          vx: (Math.random() - 0.5) * 7,
          vy: (Math.random() - 0.5) * 7,
          r: 1.3 + Math.random() * 1.4,
          a: 0.15 + Math.random() * 0.12,
          grabbed: false,
        };
      });
    }

    function pickCluster(now: number) {
      cycleStart = now;
      // keep the gathering event in the right half, clear of the headline
      cx = w * (0.55 + Math.random() * 0.38);
      cy = h * (0.12 + Math.random() * 0.55);
      dots.forEach((d) => (d.grabbed = false));
      dots
        .map((d, i) => ({ i, dist: (d.x - cx) ** 2 + (d.y - cy) ** 2 }))
        .sort((a, b) => a.dist - b.dist)
        .slice(0, 9)
        .forEach(({ i }) => (dots[i].grabbed = true));
    }

    const easeInOut = (t: number) => t * t * (3 - 2 * t);

    function frame(now: number, dt: number) {
      ctx.clearRect(0, 0, canvas!.width, canvas!.height);
      ctx.save();
      ctx.scale(dpr, dpr);

      const t = now - cycleStart;
      if (t > CYCLE) pickCluster(now);
      // pull strength over the cycle
      let pull = 0;
      if (t < GATHER) pull = easeInOut(t / GATHER);
      else if (t < GATHER + HOLD) pull = 1;
      else if (t < GATHER + HOLD + RELEASE) pull = 1 - easeInOut((t - GATHER - HOLD) / RELEASE);

      // whisper of a ring while the cohort holds
      if (pull > 0.6) {
        ctx.beginPath();
        ctx.arc(cx, cy, 21, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${RED}, ${0.2 * (pull - 0.6) * 2.5})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      let redDrawn = false;
      for (const d of dots) {
        // ambient drift on the home position
        d.hx += d.vx * dt;
        d.hy += d.vy * dt;
        if (d.hx < 0 || d.hx > w) d.vx *= -1;
        if (d.hy < 0 || d.hy > h) d.vy *= -1;

        if (d.grabbed && pull > 0) {
          // ring formation around the cluster point
          const ang = Math.atan2(d.hy - cy, d.hx - cx);
          const tx = cx + Math.cos(ang) * 14;
          const ty = cy + Math.sin(ang) * 14;
          d.x = d.hx + (tx - d.hx) * pull;
          d.y = d.hy + (ty - d.hy) * pull;
        } else {
          d.x = d.hx;
          d.y = d.hy;
        }

        ctx.beginPath();
        if (d.grabbed && pull > 0.85 && !redDrawn) {
          ctx.arc(d.x, d.y, d.r + 0.6, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${RED}, 0.85)`;
          redDrawn = true;
        } else if (d.grabbed && pull > 0) {
          ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${INK}, ${Math.min(0.5, d.a + 0.22 * pull)})`;
        } else {
          ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${INK}, ${d.a})`;
        }
        ctx.fill();
      }
      ctx.restore();
    }

    seed();
    if (reduce) {
      cycleStart = -CYCLE; // no cluster
      frame(0, 0);
    } else {
      let last = performance.now();
      cycleStart = last - CYCLE + 1200; // first gather arrives quickly
      const tick = (now: number) => {
        if (disposed) return;
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        frame(now, dt);
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }

    let rt = 0;
    const ro = new ResizeObserver(() => {
      window.clearTimeout(rt);
      rt = window.setTimeout(() => {
        seed();
        if (reduce) frame(0, 0);
      }, 150);
    });
    ro.observe(canvas.parentElement!);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(rt);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}

/**
 * Variant 3 — "grid": report graph paper drifting almost imperceptibly, with
 * one red crosshair re-positioning every few seconds like a measurement.
 */
export function GraticuleBackdrop() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const move = () => {
      el.style.left = `${52 + Math.random() * 42}%`;
      el.style.top = `${8 + Math.random() * 62}%`;
    };
    move();
    const id = window.setInterval(move, 7000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute -inset-24"
        style={{
          backgroundImage: `repeating-linear-gradient(to right, rgba(${INK},0.07) 0 1px, transparent 1px 72px), repeating-linear-gradient(to bottom, rgba(${INK},0.07) 0 1px, transparent 1px 72px)`,
          animation: "grid-pan 48s linear infinite",
        }}
      />
      <div
        ref={ref}
        className="absolute"
        style={{ transition: "left 2.4s cubic-bezier(0.16,1,0.3,1), top 2.4s cubic-bezier(0.16,1,0.3,1)" }}
      >
        <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
          <circle cx="17" cy="17" r="9" stroke={`rgba(${RED},0.55)`} strokeWidth="1" />
          <path d="M17 0v10M17 24v10M0 17h10M24 17h10" stroke={`rgba(${RED},0.55)`} strokeWidth="1" />
        </svg>
      </div>
    </div>
  );
}

/**
 * Variant 4 — "flow": one hairline running behind the headline with drifting
 * dashes and a red pulse — the pipeline motif, stated once, quietly.
 */
export function FlowLine() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-[55%] overflow-hidden">
      <svg width="100%" height="2" className="block">
        <line
          x1="0"
          y1="1"
          x2="100%"
          y2="1"
          stroke={`rgba(${INK},0.18)`}
          strokeWidth="1"
          strokeDasharray="7 9"
          style={{ animation: "dash-flow 2.8s linear infinite" }}
        />
      </svg>
      <span
        className="absolute top-0 h-[2px] w-14"
        style={{
          background: `linear-gradient(to right, transparent, rgba(${RED},0.75))`,
          animation: "flow-pulse 7s linear infinite",
        }}
      />
    </div>
  );
}

const TAG_BAND_MASK =
  "linear-gradient(to right, transparent 71%, black 73.5%, black 87.5%, transparent 90%)";

/**
 * One-shot flourish: when the plate scrolls into view, a scanner line crosses
 * it once; as it passes the ai-tags column the tags flash warm red, then
 * settle — Agent Q writing its findings. Never repeats; skipped entirely
 * under prefers-reduced-motion.
 */
export function PlateScanOnce() {
  const ref = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setRun(true);
          io.disconnect();
        }
      },
      { threshold: 0.45 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {run && (
        <>
          <span
            className="absolute top-0 h-full w-24"
            style={{ animation: "sweep-x 2.4s cubic-bezier(0.45,0,0.55,1) 0.2s 1 both" }}
          >
            <span
              className="absolute inset-0"
              style={{ background: `linear-gradient(to right, transparent, rgba(${RED},0.16))` }}
            />
            <span
              className="absolute top-0 right-0 h-full w-px"
              style={{ background: `rgba(${RED},0.6)` }}
            />
          </span>
          <span
            className="absolute inset-0"
            style={{
              background: `rgba(${RED}, 0.38)`,
              mixBlendMode: "screen",
              maskImage: TAG_BAND_MASK,
              WebkitMaskImage: TAG_BAND_MASK,
              opacity: 0,
              animation: "tint-flash 1s ease-in-out 1.6s 1 both",
            }}
          />
        </>
      )}
    </div>
  );
}

/**
 * Variant 2 — "scan": all motion contained in the framed media panel; a slow
 * scanner line crosses the ink with a faint red trace.
 */
export function FrameScan() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <span
        className="absolute top-0 h-full w-24"
        style={{ animation: "sweep-x 9s ease-in-out infinite" }}
      >
        <span
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to right, transparent, rgba(${RED},0.14))`,
          }}
        />
        <span
          className="absolute top-0 right-0 h-full w-px"
          style={{ background: `rgba(${RED},0.55)` }}
        />
      </span>
    </div>
  );
}
