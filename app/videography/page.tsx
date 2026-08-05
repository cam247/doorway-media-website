import type { Metadata } from "next";
import Navigation from "@/app/components/Navigation";
import Footer from "@/app/components/Footer";
import VideographyContent from "./VideographyContent";

export const metadata: Metadata = {
  title: "Videography & Commercial Production | Doorway Media",
  description:
    "Cinematic brand films, commercials, and corporate video produced by Doorway Media.",
};

export default function VideographyPage() {
  return (
    <>
      <Navigation />
      <main id="main" className="bg-bg">
        <VideographyContent />
      </main>
      <Footer />
    </>
  );
}
