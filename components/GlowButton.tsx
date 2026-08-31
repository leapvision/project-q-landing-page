/**
 * Primary CTA with an animated under-glow, adapted from the "rainbow button"
 * pattern into the d5 world: the rainbow's five hues become a slow sweep
 * through the brand's red family, the face stays diagnostic red, and the
 * blurred strip beneath reads as lamp-light on the desk. Motion collapses
 * under prefers-reduced-motion via the global animation kill.
 */

const RED_SWEEP =
  "linear-gradient(90deg,#e05561,#7a1019,#d8434f,#a31621,#e05561)";

export function GlowButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`group relative inline-flex cursor-pointer items-center justify-center rounded-md px-6 py-3 text-[14px] font-medium text-[#f5f0e6] transition duration-150 [background-clip:padding-box,border-box,border-box] [background-origin:border-box] [border:1.5px_solid_transparent] bg-[length:200%] [animation:glow-slide_3.5s_linear_infinite] hover:brightness-110 active:scale-[0.96] focus-visible:outline-none disabled:pointer-events-none disabled:opacity-60 ${className ?? ""}`}
      style={{
        backgroundImage: `linear-gradient(#a31621,#a31621),linear-gradient(#a31621 50%,rgba(163,22,33,0.55) 80%,rgba(163,22,33,0)),${RED_SWEEP}`,
      }}
      {...props}
    >
      <span
        aria-hidden
        className="absolute bottom-[-10%] left-1/2 z-0 h-[12%] w-4/5 -translate-x-1/2 bg-[length:200%] opacity-70 [animation:glow-slide_3.5s_linear_infinite] [filter:blur(0.85rem)]"
        style={{ backgroundImage: RED_SWEEP }}
      />
      <span className="relative z-10">{children}</span>
    </button>
  );
}
