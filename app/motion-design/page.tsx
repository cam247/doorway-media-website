import type { Metadata } from "next";
import Navigation from "@/app/components/Navigation";
import Footer from "@/app/components/Footer";
import MotionDesignContent from "./MotionDesignContent";

export const metadata: Metadata = {
  title: "Motion Design & 3D Animation | Doorway Media",
  description:
    "High-end 3D renders, logo animations, and motion graphics packages designed and animated by Doorway Media.",
};

export default function MotionDesignPage() {
  return (
    <>
      <Navigation />
      <main id="main" className="bg-bg">
        <MotionDesignContent />
      </main>
      <Footer />
    </>
  );
}
