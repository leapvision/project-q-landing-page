# Project Q landing page

Marketing and early-access landing page for Project Q, Drongo AI's medical-imaging data platform. The site presents the product's archive-to-dataset workflow, platform capabilities, target teams, and phased early-access programme.

Project Q is currently in development. The product imagery on the page consists of concept renders, and Agent Q outputs are presented as non-diagnostic.

## What is implemented

- Responsive single-page marketing site with sections for infrastructure, platform capabilities, early access, teams, and the waitlist
- Animated hero, scroll reveals, pipeline graphics, and reduced-motion support
- Inline and full waitlist forms with client- and server-side email validation
- SendGrid-backed `POST /api/waitlist` endpoint for early-access signups
- Bot honeypot and optional applicant confirmation email
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

Copy `.env.example` to `.env.local` and provide your SendGrid settings before
testing the waitlist. The API key must remain server-only.

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

An accepted submission sends a notification through SendGrid to the configured
internal recipient. That notification is the waitlist record; this project does
not persist submissions to a database or local file. The route returns success
only after SendGrid accepts the internal notification.

Set these server-side environment variables locally and in Vercel:

| Variable | Required | Purpose |
| --- | --- | --- |
| `SENDGRID_API_KEY` | Yes | Restricted SendGrid API key with Mail Send access |
| `WAITLIST_FROM_EMAIL` | Yes | Sender on a SendGrid-authenticated domain |
| `WAITLIST_TO_EMAIL` | Yes | Internal notification recipient; accepts a comma-separated list |
| `WAITLIST_SEND_CONFIRMATION` | No | Set to `true` to email the applicant after the internal notification succeeds |

Keep `WAITLIST_SEND_CONFIRMATION=false` in Vercel Preview while testing, then
set it to `true` in Production when applicant confirmations are ready. If a
confirmation fails, the submission still succeeds because the internal
notification has already been accepted.

The forms include a silent honeypot for basic bot filtering. For a public launch
with significant automated traffic, add a shared rate limiter or a challenge
service; in-memory rate limiting is not reliable across serverless instances.

### Vercel Preview

Connect the repository to Vercel and push a non-production branch to receive a
temporary Preview Deployment URL. Add the variables above to the Preview scope
first. After testing, add the corresponding Production values, merge to the
production branch, and attach the registered domain in the Vercel project.

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
