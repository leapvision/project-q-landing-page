# Project Q landing page

Marketing and early-access landing page for Project Q, Drongo AI's medical-imaging data platform. The site presents the product's archive-to-dataset workflow, platform capabilities, target teams, and phased early-access programme.

Project Q is currently in development. The product imagery on the page consists of concept renders, and Agent Q outputs are presented as non-diagnostic.

## What is implemented

- Responsive single-page marketing site with sections for infrastructure, platform capabilities, early access, teams, and the waitlist
- Animated hero, scroll reveals, pipeline graphics, and reduced-motion support
- Inline and full waitlist forms with client- and server-side email validation
- `POST /api/waitlist` endpoint for recording early-access signups
- Tailwind CSS 4 styling and Google fonts loaded through `next/font`

## Tech stack

- Next.js 16 with the App Router
- React 19
- TypeScript
- Tailwind CSS 4

## Run locally

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

No environment variables are required for the current local implementation.

## Available scripts

```bash
npm run dev    # start the development server
npm run build  # create a production build
npm run start  # serve the production build
```

## Waitlist behavior

The waitlist forms submit JSON to `POST /api/waitlist`. A valid submission may contain:

```json
{
  "email": "person@example.com",
  "name": "Optional name",
  "org": "Optional organisation",
  "building": "Optional description of the team's work"
}
```

`email` is required. The other fields are optional and are trimmed and length-limited by the route handler.

For local development, each accepted signup is written to the server log and, on a best-effort basis, appended to `waitlist-signups.jsonl` in the project root. This is not durable production storage: serverless filesystems may be read-only or ephemeral, and the current endpoint does not notify the team. Connect the route to a CRM, database, or mailing-list provider before launch.

## Project structure

```text
app/
  api/waitlist/route.ts  Waitlist API endpoint
  globals.css            Global theme and motion styles
  layout.tsx             Root layout, fonts, and metadata
  page.tsx               Landing-page content and sections
components/              Interactive forms, motion, and illustrations
public/                  Product concept renders and static assets
```

The landing page is implemented in `app/page.tsx`; reusable client-side behavior lives in `components/`.
