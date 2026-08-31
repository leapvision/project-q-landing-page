const RED = "text-[#a31621]";

/**
 * The Crookes tube — the bulb Röntgen was working with in Würzburg, 1895,
 * when x-rays announced themselves. Every image in the archive starts here.
 * Easter egg: hovering the tube fires it — the electron beam pulses and the
 * x-rays flicker (killed globally under prefers-reduced-motion).
 */
export function FooterArt() {
  return (
    <div className="x-tube text-right">
      <style>{`
        .x-tube:hover .beam { animation: beam-fire 1.1s linear infinite; }
        .x-tube:hover .rays { animation: rays-flicker 1.1s linear infinite; }
      `}</style>
      <pre className="inline-block text-left font-mono text-[5.5px] leading-[1.3] text-[#17150f]/60" aria-hidden>
        {`       ┌──────────────┐
    ┌──┘              └──┐
 ───┤ e- `}<span className="beam">{`┄┄┄┄┄┄┄▶`}</span>{` ╱      ├─── +
    └──┐         ╱    ┌──┘
       └──────────────┘
                `}<span className={`rays ${RED}`}>{`╲  ╲  ╲`}</span>
      </pre>
    </div>
  );
}
