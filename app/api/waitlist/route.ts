import sgMail from "@sendgrid/mail";
import { NextResponse } from "next/server";

const MAX_REQUEST_LENGTH = 10_000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type WaitlistRecord = {
  at: string;
  email: string;
  name: string | null;
  org: string | null;
  building: string | null;
};

function optionalText(value: unknown, maxLength: number) {
  if (typeof value !== "string") return null;
  const text = value.trim().slice(0, maxLength);
  return text || null;
}

function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[character]!,
  );
}

function notificationText(record: WaitlistRecord) {
  return [
    "A new team has joined the Project Q waitlist.",
    "",
    `Submitted: ${record.at}`,
    `Email: ${record.email}`,
    `Name: ${record.name ?? "Not provided"}`,
    `Organisation: ${record.org ?? "Not provided"}`,
    `What they are building: ${record.building ?? "Not provided"}`,
  ].join("\n");
}

function notificationHtml(record: WaitlistRecord) {
  const rows = [
    ["Submitted", record.at],
    ["Email", record.email],
    ["Name", record.name ?? "Not provided"],
    ["Organisation", record.org ?? "Not provided"],
    ["What they are building", record.building ?? "Not provided"],
  ];

  return `
    <div style="font-family:Arial,sans-serif;color:#17150f;line-height:1.5">
      <h1 style="font-size:22px;margin:0 0 20px">New Project Q waitlist signup</h1>
      <table style="border-collapse:collapse;width:100%;max-width:680px">
        ${rows
          .map(
            ([label, value]) => `
              <tr>
                <th style="border-top:1px solid #ded8ca;padding:10px 16px 10px 0;text-align:left;vertical-align:top;width:160px">${escapeHtml(label)}</th>
                <td style="border-top:1px solid #ded8ca;padding:10px 0;white-space:pre-wrap">${escapeHtml(value)}</td>
              </tr>`,
          )
          .join("")}
      </table>
    </div>`;
}

function sendGridConfig() {
  const apiKey = process.env.SENDGRID_API_KEY?.trim();
  const from = process.env.WAITLIST_FROM_EMAIL?.trim();
  const to = (process.env.WAITLIST_TO_EMAIL ?? "")
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);
  const sendConfirmation = process.env.WAITLIST_SEND_CONFIRMATION === "true";
  const confirmationTemplateId =
    process.env.SENDGRID_CONFIRMATION_TEMPLATE_ID?.trim();

  if (
    !apiKey ||
    !from ||
    to.length === 0 ||
    (sendConfirmation && !confirmationTemplateId?.startsWith("d-"))
  ) {
    return null;
  }

  return {
    apiKey,
    from,
    to,
    sendConfirmation,
    confirmationTemplateId,
  };
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;

  try {
    const rawBody = await request.text();
    if (rawBody.length > MAX_REQUEST_LENGTH) {
      return NextResponse.json(
        { ok: false, error: "request too large" },
        { status: 413 },
      );
    }

    const parsed: unknown = JSON.parse(rawBody);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("invalid body");
    }
    body = parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid body" }, { status: 400 });
  }

  // A filled honeypot is treated as success so automated submissions receive
  // no signal that they were discarded.
  if (typeof body.website === "string" && body.website.trim()) {
    return NextResponse.json({ ok: true });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (email.length > 320 || !EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ ok: false, error: "invalid email" }, { status: 400 });
  }

  const config = sendGridConfig();
  if (!config) {
    console.error("[waitlist] SendGrid environment variables are incomplete");
    return NextResponse.json(
      { ok: false, error: "waitlist unavailable" },
      { status: 503 },
    );
  }

  const record: WaitlistRecord = {
    at: new Date().toISOString(),
    email,
    name: optionalText(body.name, 200),
    org: optionalText(body.org, 200),
    building: optionalText(body.building, 2000),
  };

  sgMail.setApiKey(config.apiKey);
  sgMail.setTimeout(10_000);

  try {
    await sgMail.send({
      to: config.to,
      from: config.from,
      replyTo: record.email,
      subject: "New Project Q waitlist signup",
      text: notificationText(record),
      html: notificationHtml(record),
      categories: ["project-q-waitlist-notification"],
      trackingSettings: {
        clickTracking: { enable: false, enableText: false },
        openTracking: { enable: false },
      },
    });
  } catch {
    console.error("[waitlist] SendGrid rejected the team notification");
    return NextResponse.json(
      { ok: false, error: "notification failed" },
      { status: 502 },
    );
  }

  if (config.sendConfirmation) {
    try {
      await sgMail.send({
        to: record.email,
        from: config.from,
        replyTo: config.to[0],
        templateId: config.confirmationTemplateId!,
        dynamicTemplateData: {
          first_name: record.name?.split(/\s+/)[0] ?? "",
          full_name: record.name ?? "",
          organisation: record.org ?? "",
          current_year: new Date().getUTCFullYear(),
        },
        categories: ["project-q-waitlist-confirmation"],
        trackingSettings: {
          clickTracking: { enable: false, enableText: false },
          openTracking: { enable: false },
        },
      });
    } catch {
      // The team notification is the source of truth, so a confirmation
      // failure must not make the visitor resubmit and create duplicates.
      console.error("[waitlist] SendGrid rejected the applicant confirmation");
    }
  }

  return NextResponse.json({ ok: true });
}
