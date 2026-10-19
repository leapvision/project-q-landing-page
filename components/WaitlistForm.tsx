"use client";

import { useState } from "react";
import { GlowButton } from "@/components/GlowButton";

type Status = "idle" | "submitting" | "success" | "error";

function Honeypot({ id }: { id: string }) {
  return (
    <div
      aria-hidden="true"
      className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden"
    >
      <label htmlFor={id}>Website</label>
      <input id={id} name="website" type="text" tabIndex={-1} autoComplete="off" />
    </div>
  );
}

/**
 * Waitlist capture for d5 (pre-launch CTA). Two shapes: "inline" — a single
 * email + button row for the hero, on ivory; "full" — name, organisation,
 * email, and a free-text line for the closing section, on ink. On success the
 * form folds closed (animated grid-row collapse) and the confirmation eases
 * into its place with the constellation's "found" tick.
 */
export function WaitlistForm({ variant }: { variant: "inline" | "full" }) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(
      new FormData(e.currentTarget).entries(),
    ) as Record<string, string>;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email ?? "")) {
      setError("Enter a work email we can reach you at.");
      return;
    }
    setError("");
    setStatus("submitting");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  const dark = variant === "full";
  const success = status === "success";
  const field = dark
    ? "rounded-md border border-line-inverse bg-ink-raised px-4 py-3 text-[15px] text-ivory placeholder:text-placeholder focus:border-accent-bright focus:outline-none transition-colors"
    : "rounded-md border border-ink/30 bg-ivory-raised px-4 py-3 text-[14.5px] text-ink placeholder:text-placeholder focus:border-accent focus:outline-none transition-colors";
  const label =
    "mb-2 block font-mono text-[10.5px] tracking-[0.18em] text-muted-inverse uppercase";

  const form =
    variant === "inline" ? (
      <form onSubmit={onSubmit} noValidate className="relative w-full max-w-[430px]">
        <Honeypot id="wl-website" />
        <div className="flex flex-wrap items-stretch gap-2 sm:flex-nowrap">
          <label htmlFor="wl-email" className="sr-only">
            Work email
          </label>
          <input
            id="wl-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="Work email"
            className={`${field} min-w-0 flex-1`}
          />
          <GlowButton type="submit" disabled={status === "submitting"}>
            {status === "submitting" ? "Joining…" : "Join waitlist"}
          </GlowButton>
        </div>
        {/* reserved line so an appearing message never shifts the row */}
        <p aria-live="polite" className="mt-1.5 min-h-[19px] text-[12.5px] text-accent">
          {error ||
            (status === "error"
              ? "That didn't go through — check your connection and try again."
              : "")}
        </p>
      </form>
    ) : (
      <form onSubmit={onSubmit} noValidate className="relative grid gap-5">
        <Honeypot id="wlf-website" />
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="wlf-name" className={label}>
              Name
            </label>
            <input id="wlf-name" name="name" type="text" autoComplete="name" className={`${field} w-full`} />
          </div>
          <div>
            <label htmlFor="wlf-org" className={label}>
              Organisation (optional)
            </label>
            <input id="wlf-org" name="org" type="text" autoComplete="organization" className={`${field} w-full`} />
          </div>
        </div>
        <div>
          <label htmlFor="wlf-email" className={label}>
            Work email
          </label>
          <input
            id="wlf-email"
            name="email"
            type="email"
            autoComplete="email"
            className={`${field} w-full`}
          />
          {error && <p className="mt-2 text-[12.5px] text-accent-bright">{error}</p>}
        </div>
        <div>
          <label htmlFor="wlf-building" className={label}>
            What are you building (optional)
          </label>
          <textarea
            id="wlf-building"
            name="building"
            rows={3}
            placeholder="Modalities, model goals, where your data lives today…"
            className={`${field} w-full resize-y`}
          />
        </div>
        <div className="flex flex-wrap items-center gap-5">
          <GlowButton type="submit" disabled={status === "submitting"} className="px-8 py-3.5">
            {status === "submitting" ? "Joining…" : "Join waitlist"}
          </GlowButton>
          <p className="font-mono text-[10.5px] tracking-[0.18em] text-muted-inverse uppercase">
            early access · onboarding in waves
          </p>
        </div>
        {status === "error" && (
          <p className="text-[13px] text-accent-bright">
            That didn&apos;t go through — check your connection and try again.
          </p>
        )}
      </form>
    );

  return (
    <div>
      <div
        aria-hidden={success || undefined}
        style={{
          display: "grid",
          gridTemplateRows: success ? "0fr" : "1fr",
          transition: "grid-template-rows 700ms cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <div
          className={success ? "pointer-events-none" : undefined}
          style={{
            overflow: "hidden",
            opacity: success ? 0 : 1,
            visibility: success ? "hidden" : "visible",
            transition: "opacity 350ms ease, visibility 0s linear 700ms",
          }}
        >
          {form}
        </div>
      </div>
      {success && (
        <p
          role="status"
          className={`flex items-center gap-3 text-[15px] ${dark ? "text-ivory" : "text-ink"}`}
          style={{ animation: "fade-up 0.6s cubic-bezier(0.16,1,0.3,1) 0.4s both" }}
        >
          {/* the constellation's "found" mark: red tick, faint ring, one pulse */}
          <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden className={`shrink-0 overflow-visible ${dark ? "text-accent-bright" : "text-accent"}`}>
            <circle cx="12" cy="12" r="3.2" fill="currentColor" />
            <circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1" />
            <circle
              cx="12"
              cy="12"
              r="7"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              style={{
                transformBox: "fill-box",
                transformOrigin: "center",
                animation: "ring-pop 1.1s ease-out 0.75s both",
              }}
            />
          </svg>
          You&apos;re on the list — we&apos;ll be in touch as onboarding opens.
        </p>
      )}
    </div>
  );
}
