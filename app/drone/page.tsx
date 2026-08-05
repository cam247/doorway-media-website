import type { Metadata } from "next";
import Navigation from "@/app/components/Navigation";
import Footer from "@/app/components/Footer";
import DroneContent from "./DroneContent";

export const metadata: Metadata = {
  title: "Aerial & Drone Videography | Doorway Media",
  description:
    "FAA-certified aerial cinematography, cinematic flyovers, and venue highlight reels shot by Doorway Media.",
};

export default function DronePage() {
  return (
    <>
      <Navigation />
      <main id="main" className="bg-bg">
        <DroneContent />
      </main>
      <Footer />
    </>
  );
}
