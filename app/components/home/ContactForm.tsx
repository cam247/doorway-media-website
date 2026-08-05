"use client";

import { useState } from "react";
import { ArrowRight, Loader2, Send } from "lucide-react";
import {
  HONEYPOT_FIELD,
  validateContact,
  type ContactErrors,
} from "@/app/lib/contact";

type Status = "idle" | "submitting" | "success" | "error";

const FIELDS = [
  { name: "firstName", label: "First name", type: "text", autoComplete: "given-name" },
  { name: "lastName", label: "Last name", type: "text", autoComplete: "family-name" },
] as const;

/**
 * Contact form.
 *
 * Rules applied: `input-labels` (visible, never placeholder-only),
 * `inline-validation` + `error-clarity` (message sits under its own field),
 * `error-messages` (role="alert" so it is announced), `loading-buttons`
 * (disabled + status while in flight), `submit-feedback` (idle → submitting →
 * success/error, never a silent result).
 *
 * Submissions are mailed by `/api/contact`. Success is only ever reported after
 * that route confirms the send — a visitor told "message sent" who was in fact
 * dropped will sit waiting for a reply that can't come.
 */
export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<ContactErrors>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const payload = Object.fromEntries(data.entries());

    const { errors: found } = validateContact(payload);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      // Move focus to the first problem so keyboard users aren't hunting.
      const first = Object.keys(found)[0];
      e.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    setStatus("submitting");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setStatus(response.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="card flex flex-col items-center rounded-3xl p-14 text-center"
      >
        <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-gold/10 text-gold">
          <Send aria-hidden="true" className="h-5 w-5" />
        </span>
        <p className="display-md text-2xl text-fg">Message sent</p>
        <p className="lede mt-2 text-base">We&apos;ll be in touch shortly.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="card rounded-3xl p-6 md:p-10"
    >
      {/* Bot bait. Parked off-screen rather than display:none, which scripts
          know to skip, and kept out of the tab order and the a11y tree so no
          real visitor can reach it. Anything that arrives filled in is discarded
          by the route. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[-9999px] h-0 w-0 overflow-hidden"
      >
        <label htmlFor={HONEYPOT_FIELD}>Company</label>
        <input
          id={HONEYPOT_FIELD}
          name={HONEYPOT_FIELD}
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {FIELDS.map((field) => (
          <div key={field.name}>
            <label htmlFor={field.name} className="eyebrow mb-2.5 block">
              {field.label}
            </label>
            <input
              id={field.name}
              name={field.name}
              type={field.type}
              autoComplete={field.autoComplete}
              aria-invalid={!!errors[field.name]}
              aria-describedby={errors[field.name] ? `${field.name}-error` : undefined}
              className="field rounded-xl px-4 py-3.5"
            />
            {errors[field.name] && (
              <p
                id={`${field.name}-error`}
                role="alert"
                className="mt-2 text-sm text-danger"
              >
                {errors[field.name]}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-5">
        <label htmlFor="email" className="eyebrow mb-2.5 block">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          className="field rounded-xl px-4 py-3.5"
        />
        {errors.email && (
          <p id="email-error" role="alert" className="mt-2 text-sm text-danger">
            {errors.email}
          </p>
        )}
      </div>

      <div className="mt-5">
        <label htmlFor="message" className="eyebrow mb-2.5 block">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          aria-invalid={!!errors.message}
          aria-describedby={
            errors.message ? "message-error" : "message-helper"
          }
          className="field resize-none rounded-xl px-4 py-3.5"
        />
        {errors.message ? (
          <p id="message-error" role="alert" className="mt-2 text-sm text-danger">
            {errors.message}
          </p>
        ) : (
          /* `helper-text`: set expectations before the error appears. */
          <p id="message-helper" className="mt-2 text-sm text-fg-subtle">
            Timeline, budget range, and what you&apos;re making — whatever you
            have so far.
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="group mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-fg px-8 text-sm font-semibold text-bg transition-transform duration-200 hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-60 sm:w-auto"
      >
        {status === "submitting" ? (
          <>
            <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
            Sending…
          </>
        ) : (
          <>
            Submit
            <ArrowRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
            />
          </>
        )}
      </button>

      {/* Always present so assistive tech picks up the change, not just on error. */}
      <p role="status" aria-live="polite" className="sr-only">
        {status === "submitting" ? "Sending your message" : ""}
      </p>

      {status === "error" && (
        <p role="alert" className="mt-4 text-sm text-danger">
          Something went wrong sending your message. Please try again, or email
          us directly at Cam@doorway.media.
        </p>
      )}
    </form>
  );
}
