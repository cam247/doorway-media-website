import Navigation from "@/app/components/Navigation";
import Footer from "@/app/components/Footer";
import Hero from "@/app/components/home/Hero";
import WorkGrid from "@/app/components/home/WorkGrid";
import FeaturedWith from "@/app/components/home/FeaturedWith";
import Story from "@/app/components/home/Story";
import ContactSection from "@/app/components/home/ContactSection";

/**
 * Section order follows landing.csv → "Portfolio Grid":
 *   1. Hero  2. Project grid  3. Social proof  4. About/Philosophy  5. Contact
 *
 * This is a Server Component. It was previously one 637-line "use client" file,
 * which shipped the entire homepage — copy, data and all — to the browser
 * (`dont-mark-page-as-client-component`, HIGH). Interactivity now lives in leaf
 * components only.
 */
export default function Home() {
  return (
    <>
      <Navigation />
      <main id="main">
        <Hero />
        <WorkGrid />
        <FeaturedWith />
        <Story />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
