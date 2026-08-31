"use client";

import { useEffect, useRef, useState } from "react";

const MONO = "font-mono text-[10.5px] tracking-[0.18em] uppercase";
const INK = "#17150f";
const RED = "#a31621";

// deterministic scatter so the figure is stable across renders
function lcg(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

type Dot = { x: number; y: number; r: number; o: number };

function scatter(rnd: () => number, n: number, w: number, h: number, pad = 14): Dot[] {
  return Array.from({ length: n }, () => ({
    x: pad + rnd() * (w - pad * 2),
    y: pad + rnd() * (h - pad * 2),
    r: 1.2 + rnd() * 1.3,
    o: 0.16 + rnd() * 0.16,
  }));
}

function group(rnd: () => number, cx: number, cy: number, n: number, spread: number, o = 0.55): Dot[] {
  const dots: Dot[] = [];
  for (let i = 0; i < n; i++) {
    const a = rnd() * Math.PI * 2;
    const d = spread * (0.25 + rnd() * 0.75);
    dots.push({ x: cx + Math.cos(a) * d, y: cy + Math.sin(a) * d, r: 1.7 + rnd() * 0.9, o });
  }
  return dots;
}

/** hand-drawn closed lasso: jittered radii smoothed through midpoints */
function lassoPath(rnd: () => number, cx: number, cy: number, r: number, jitter: number) {
  const N = 10;
  const pts = Array.from({ length: N }, (_, i) => {
    const a = (i / N) * Math.PI * 2 - Math.PI / 3;
    const rr = r + (rnd() - 0.5) * 2 * jitter;
    return [cx + Math.cos(a) * rr, cy + Math.sin(a) * rr];
  });
  const mid = (a: number[], b: number[]) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  let d = `M ${mid(pts[0], pts[1])[0]} ${mid(pts[0], pts[1])[1]}`;
  for (let i = 1; i < N; i++) {
    const p = pts[i % N];
    const m = mid(pts[i % N], pts[(i + 1) % N]);
    d += ` Q ${p[0]} ${p[1]} ${m[0]} ${m[1]}`;
  }
  return d + " Z";
}

const STEPS = ["waitlist", "intro call", "connect archive", "first cohort"];

function StepsCaption() {
  return (
    <p className={`${MONO} mt-5 flex flex-wrap items-baseline gap-x-2.5 gap-y-1.5 border-t border-[#17150f]/15 pt-4 text-[#6b6656]`}>
      {STEPS.map((s, i) => (
        <span key={s} className="flex items-baseline gap-x-2.5">
          <span className={i === 0 ? "text-[#a31621]" : ""}>{s}</span>
          {i < STEPS.length - 1 && <span aria-hidden>→</span>}
        </span>
      ))}
    </p>
  );
}

/**
 * The waitlist as a dot field: wave 01 gathered by the platform's own lasso
 * gesture, one faint proto-cluster hinting at the waves that follow. The
 * lasso hand-draws itself the first time it scrolls into view (skipped for
 * reduced-motion, no-JS, and already-on-screen loads, which get the drawn
 * figure immediately).
 */
export function EarlyAccessFigure() {
  const ref = useRef<HTMLDivElement>(null);
  const [drawn, setDrawn] = useState(false);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDrawn(true);
      return;
    }
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) {
      setDrawn(true);
      return;
    }
    setArmed(true);
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setDrawn(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const rnd = lcg(20260901);
  const cx = 352, cy = 138;
  const dots = [
    ...scatter(rnd, 80, 520, 300),
    ...group(rnd, cx, cy, 9, 24),
    ...group(lcg(77), 138, 224, 7, 30, 0.3),
  ];
  const path = lassoPath(lcg(5), cx, cy, 38, 9);

  // draw-on trick: the dashed lasso is masked by a solid copy of itself whose
  // dash offset sweeps 1 → 0 (pathLength-normalised), so the dashes appear in
  // stroke order; the label and tick fade in once the loop closes.
  const late = (delay: string) =>
    armed
      ? { opacity: drawn ? 1 : 0, transition: `opacity 0.5s ease ${delay}` }
      : undefined;

  return (
    <div ref={ref} className="w-full">
      <svg
        viewBox="0 0 520 300"
        className="w-full"
        role="img"
        aria-label="A field of faint dots — the waitlist — with a hand-drawn lasso gathering one group as wave 01"
      >
        <defs>
          <mask id="lasso-draw" maskUnits="userSpaceOnUse">
            <path
              d={path}
              pathLength={1}
              fill="none"
              stroke="#fff"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray="1"
              style={
                armed
                  ? {
                      strokeDashoffset: drawn ? 0 : 1,
                      transition: "stroke-dashoffset 1.6s cubic-bezier(0.4,0,0.2,1) 0.15s",
                    }
                  : undefined
              }
            />
          </mask>
        </defs>
        {dots.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={INK} opacity={d.o} />
        ))}
        <path
          d={path}
          mask="url(#lasso-draw)"
          fill="none"
          stroke={RED}
          strokeOpacity="0.75"
          strokeWidth="1.1"
          strokeDasharray="4 5"
          strokeLinecap="round"
        />
        <circle cx={cx + 10} cy={cy - 8} r="3" fill={RED} style={late("1.7s")} />
        <g style={late("1.45s")}>
          <line x1={cx - 30} y1={cy - 26} x2={cx - 74} y2={cy - 62} stroke={INK} strokeOpacity="0.35" strokeWidth="1" />
          <text
            x={cx - 80}
            y={cy - 66}
            textAnchor="end"
            fontFamily="var(--font-fragment), monospace"
            fontSize="10"
            letterSpacing="1.6"
            fill="#6b6656"
          >
            WAVE 01
          </text>
        </g>
      </svg>
      <StepsCaption />
    </div>
  );
}
