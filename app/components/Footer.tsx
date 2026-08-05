import Image from "next/image";
import Link from "next/link";
import { serviceLinks, socialLinks } from "@/app/lib/site-data";

function SocialGlyph({ name }: { name: string }) {
  const paths: Record<string, string> = {
    Instagram:
      "M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4A5.8 5.8 0 0 1 16.2 22H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2zm0 2A3.8 3.8 0 0 0 4 7.8v8.4A3.8 3.8 0 0 0 7.8 20h8.4a3.8 3.8 0 0 0 3.8-3.8V7.8A3.8 3.8 0 0 0 16.2 4H7.8zm0 2A5 5 0 1 1 12 17a5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm5.5-2.3a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4z",
    Facebook:
      "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
  };
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="h-[18px] w-[18px]"
    >
      <path d={paths[name]} />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-line bg-bg py-14">
      <div className="mx-auto max-w-7xl px-5 md:px-6 lg:px-10">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/Doorway Media Transparent.png"
                alt=""
                width={36}
                height={36}
                className="h-9 w-9 object-contain"
              />
              <span className="text-[15px] font-bold tracking-tight text-fg">
                Doorway Media
              </span>
            </Link>
            <p className="lede mt-4 max-w-xs text-base">
              Cinematic video production, aerial cinematography, and motion
              design for brands and stories worth remembering.
            </p>
          </div>

          <nav aria-label="Services" className="md:col-span-3">
            <h2 className="eyebrow mb-4">Services</h2>
            <ul className="space-y-1">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex min-h-11 items-center text-sm text-fg-muted transition-colors hover:text-fg"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3">
            <h2 className="eyebrow mb-4">Contact</h2>
            <div className="flex flex-col">
              <a
                href="tel:+13175001570"
                className="flex min-h-11 items-center text-sm text-fg-muted transition-colors hover:text-fg"
              >
                317-500-1570
              </a>
              <a
                href="mailto:Cam@doorway.media"
                className="flex min-h-11 items-center text-sm text-fg-muted transition-colors hover:text-fg"
              >
                Cam@doorway.media
              </a>
            </div>
          </div>

          <div className="flex items-start gap-2 md:col-span-2 md:justify-end">
            {socialLinks.map((social) => {
              const isPlaceholder = social.href === "#";
              return (
                <a
                  key={social.name}
                  href={social.href}
                  aria-label={social.name}
                  {...(isPlaceholder
                    ? {}
                    : { target: "_blank", rel: "noopener noreferrer" })}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-line-strong text-fg-muted transition-colors hover:border-gold hover:text-gold"
                >
                  <SocialGlyph name={social.name} />
                </a>
              );
            })}
          </div>
        </div>

        <p className="mt-10 border-t border-line pt-8 text-center text-xs text-fg-subtle">
          &copy; {new Date().getFullYear()} Doorway Media. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
