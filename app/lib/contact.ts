/**
 * The contact form's shape and its validation rules, shared by the form and the
 * route handler that mails it.
 *
 * The copy that runs in the browser exists for fast feedback and nothing else.
 * The route runs the very same function again on arrival, because an API route
 * is a public endpoint: anything on the internet can POST to it, and the form
 * is not in the way. Sharing one function is what stops the two checks drifting
 * apart as the fields change.
 */

export const CONTACT_FIELDS = [
  "firstName",
  "lastName",
  "email",
  "message",
] as const;

export type ContactField = (typeof CONTACT_FIELDS)[number];
export type ContactErrors = Partial<Record<ContactField, string>>;
export type ContactMessage = Record<ContactField, string>;

/**
 * Length caps, so a hostile POST can't mail a novel. The email ceiling is the
 * RFC 5321 maximum; the rest are simply well past anything a person would type.
 */
const LIMITS: Record<ContactField, number> = {
  firstName: 100,
  lastName: 100,
  email: 254,
  message: 5000,
};

/** Deliberately loose. Real delivery is the only true test of an address. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Returns the trimmed values alongside any problems, so a caller that passes
 * validation can mail exactly what was checked rather than re-deriving it.
 */
export function validateContact(input: unknown): {
  errors: ContactErrors;
  value: ContactMessage;
} {
  const raw = (input ?? {}) as Partial<Record<ContactField, unknown>>;

  const value = Object.fromEntries(
    CONTACT_FIELDS.map((field) => [field, String(raw[field] ?? "").trim()])
  ) as ContactMessage;

  const errors: ContactErrors = {};

  if (!value.firstName) errors.firstName = "Enter your first name.";
  if (!value.lastName) errors.lastName = "Enter your last name.";

  if (!value.email) errors.email = "Enter your email address.";
  else if (!EMAIL.test(value.email))
    errors.email = "That email address doesn't look right.";

  if (!value.message) errors.message = "Tell us a little about your project.";

  for (const field of CONTACT_FIELDS) {
    if (!errors[field] && value[field].length > LIMITS[field]) {
      errors[field] = `Please keep this under ${LIMITS[field]} characters.`;
    }
  }

  return { errors, value };
}

/**
 * Bots fill in every field they find. This one is positioned off-screen and
 * hidden from assistive tech, so anything arriving in it came from a script.
 */
export const HONEYPOT_FIELD = "company";
