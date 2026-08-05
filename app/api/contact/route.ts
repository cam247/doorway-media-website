import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  HONEYPOT_FIELD,
  validateContact,
  type ContactMessage,
} from "@/app/lib/contact";

/**
 * Delivers the contact form as an email through Resend.
 *
 * Configuration lives in `.env.local` — see `.env.example`. Only the API key is
 * required; the addresses fall back to values that work on a fresh Resend
 * account, so the form can be live before the domain is verified.
 *
 * The body is sent as plain text on purpose. Everything in it is attacker-
 * controlled, and text can't carry markup into whoever opens the mail.
 */

/**
 * Lower-case on purpose. The site writes this address as "Cam@doorway.media",
 * but Resend compares the recipient to the account's own address as a plain
 * string while a domain is still unverified, and rejects the capital C.
 */
const DEFAULT_TO = "cam@doorway.media";

/**
 * Resend's shared testing sender. It works the moment an API key exists, but it
 * will only deliver to the address that owns the Resend account. Verify
 * doorway.media and set CONTACT_FROM_EMAIL to something on it before this form
 * is expected to mail anyone else.
 */
const DEFAULT_FROM = "Doorway Media <onboarding@resend.dev>";

function body(value: ContactMessage): string {
  return [
    `From:    ${value.firstName} ${value.lastName}`,
    `Email:   ${value.email}`,
    "",
    value.message,
  ].join("\n");
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  /* A filled honeypot means a bot. Answer 200 so it has nothing to learn. */
  const honeypot = (payload as Record<string, unknown>)?.[HONEYPOT_FIELD];
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const { errors, value } = validateContact(payload);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    /* Logged rather than returned: the visitor can't act on our misconfiguration,
       and the message would only tell an attacker how the form is wired. */
    console.error(
      "[contact] RESEND_API_KEY is not set — the form cannot send. See .env.example."
    );
    return NextResponse.json({ error: "Email is not configured." }, { status: 500 });
  }

  const resend = new Resend(apiKey);

  /* The SDK reports failures on `error` instead of throwing, so this is checked
     rather than wrapped in a try/catch — the catch is for the network dying. */
  try {
    const { error } = await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL ?? DEFAULT_FROM,
      to: process.env.CONTACT_TO_EMAIL ?? DEFAULT_TO,
      /* Replying in a mail client answers the visitor, not the robot sender. */
      replyTo: value.email,
      subject: `New enquiry — ${value.firstName} ${value.lastName}`,
      text: body(value),
    });

    if (error) {
      console.error("[contact] Resend rejected the message:", error);
      return NextResponse.json({ error: "Could not send." }, { status: 502 });
    }
  } catch (cause) {
    console.error("[contact] Could not reach Resend:", cause);
    return NextResponse.json({ error: "Could not send." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
