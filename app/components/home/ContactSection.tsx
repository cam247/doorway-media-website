import { Mail, Phone } from "lucide-react";
import Reveal from "@/app/components/Reveal";
import ContactForm from "@/app/components/home/ContactForm";

const details = [
  {
    icon: Mail,
    label: "Cam@doorway.media",
    href: "mailto:Cam@doorway.media",
  },
  {
    icon: Phone,
    label: "317-500-1570",
    href: "tel:+13175001570",
  },
];

/**
 * landing.csv → "Portfolio Grid", section 4: Contact.
 * Server shell; only the form itself is a Client Component.
 */
export default function ContactSection() {
  return (
    <section
      id="contact"
      className="relative z-10 border-t border-line bg-surface py-20 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-20">
          <Reveal className="lg:col-span-5">
            <p className="eyebrow text-gold">Get in Touch</p>
            <h2 className="display-lg mt-4 text-4xl text-fg md:text-6xl">
              Connect
            </h2>
            <p className="lede mt-6 max-w-md text-base md:text-lg">
              Have a project in mind or want to collaborate? Reach out to us
              today. Let&apos;s open the door!
            </p>

            <ul className="mt-10 space-y-2">
              {details.map((detail) => (
                <li key={detail.href}>
                  <a
                    href={detail.href}
                    className="group flex min-h-12 items-center gap-3.5 text-base font-medium text-fg"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line-strong bg-bg transition-colors group-hover:border-gold group-hover:text-gold">
                      <detail.icon aria-hidden="true" className="h-4 w-4" />
                    </span>
                    {detail.label}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-7">
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
