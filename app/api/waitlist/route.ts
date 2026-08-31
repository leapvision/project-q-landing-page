import { NextResponse } from "next/server";
import { appendFile } from "node:fs/promises";
import path from "node:path";

// Launch blocker: signups are validated and recorded locally
// (waitlist-signups.jsonl + server log), but nothing notifies the team yet.
// Wire this to the CRM / mailing list before go-live.
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid body" }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "invalid email" }, { status: 400 });
  }

  const record = {
    at: new Date().toISOString(),
    email,
    name: typeof body.name === "string" ? body.name.trim().slice(0, 200) : null,
    org: typeof body.org === "string" ? body.org.trim().slice(0, 200) : null,
    building: typeof body.building === "string" ? body.building.trim().slice(0, 2000) : null,
  };
  console.log("[waitlist-signup]", record);
  try {
    // best-effort local persistence; serverless filesystems may be read-only
    await appendFile(
      path.join(process.cwd(), "waitlist-signups.jsonl"),
      JSON.stringify(record) + "\n",
    );
  } catch {
    // the console record above still stands
  }
  return NextResponse.json({ ok: true });
}
