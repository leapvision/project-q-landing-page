<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project Q repository guide

## Purpose

This repository contains the Project Q marketing and early-access landing page for Drongo AI. Project Q is presented as a medical-imaging data platform that turns imaging archives into curated, annotated, reviewable, and export-ready datasets.

The product is still in development. Keep concept renders labelled as such, and preserve the statement that Agent Q outputs are not diagnoses.

## Package manager and commands

Use npm and keep `package-lock.json` in sync with dependency changes.

- `npm install` installs dependencies.
- `npm run dev` starts the local development server.
- `npm run build` creates the production build and is the primary repository-wide verification command.
- `npm run start` serves a completed production build.

There are currently no lint or test scripts. Do not claim those checks ran unless the corresponding tooling has been added.

## Architecture

- `app/page.tsx` contains the single-page landing-page content and section data.
- `app/layout.tsx` defines the root layout, global metadata, and global fonts.
- `app/globals.css` contains Tailwind CSS 4 integration, theme values, global styles, and shared motion keyframes.
- `components/` contains reusable presentation, motion, and waitlist components. Components that use state, effects, canvas, browser APIs, or event handlers must remain Client Components.
- `app/api/waitlist/route.ts` implements `POST /api/waitlist`.
- `public/` contains product concept renders and other static assets referenced by root-relative paths.

Use the `@/*` TypeScript path alias for imports from the repository root.

## UI conventions

- Preserve the established warm-ivory, near-black, and diagnostic-red visual system unless the requested change explicitly alters the art direction.
- Keep the page responsive and maintain visible keyboard focus, semantic labels, useful alternative text, and reduced-motion behavior.
- Use `next/font` for font loading. The current design uses Archivo and Fragment Mono globally, with DM Sans and Bricolage Grotesque on the landing page.
- Reuse existing motion and form components before introducing parallel implementations.
- Keep product claims aligned across visible copy, metadata, alternative text, and documentation.

## Waitlist behavior

The forms in `components/WaitlistForm.tsx` send JSON to `POST /api/waitlist`. `email` is required; `name`, `org`, and `building` are optional.

The route uses SendGrid to email accepted submissions to the configured internal recipient. That notification is the waitlist record; the application intentionally has no database or local-file persistence. The route returns success only after SendGrid accepts the internal notification. Applicant confirmation is optional and must not turn an already accepted internal notification into a failed form submission.

The required server-only variables are `SENDGRID_API_KEY`, `WAITLIST_FROM_EMAIL`, and `WAITLIST_TO_EMAIL`. `WAITLIST_SEND_CONFIRMATION=true` enables applicant confirmations and requires an active dynamic-template ID in `SENDGRID_CONFIRMATION_TEMPLATE_ID`. Keep secrets out of the repository and maintain placeholder-only documentation in `.env.example`.

## Working practices

- Preserve unrelated user changes and untracked assets.
- Keep changes focused; do not replace existing product imagery or copy unless the task calls for it.
- After code changes, run `npm run build` when practical and report any checks that could not be run.
- For documentation-only changes, at minimum run `git diff --check` and verify documented scripts and behavior against the repository.
