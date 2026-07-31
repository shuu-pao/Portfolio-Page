import HeroSection from "@/components/sections/HeroSection";
import IntroBioSection from "@/components/sections/IntroBioSection";
import PortfolioGallerySection from "@/components/sections/PortfolioGallerySection";
import SkillsStackSection from "@/components/sections/SkillsStackSection";
import ProcessTimelineSection from "@/components/sections/ProcessTimelineSection";
import ContactSection from "@/components/sections/ContactSection";
import { Navbar } from "@/components/layout/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="relative min-h-screen w-full bg-em-bg">
        <HeroSection />
        <IntroBioSection />
        <PortfolioGallerySection />
        <SkillsStackSection />
        <ProcessTimelineSection />
        <ContactSection />
      </main>
    </>
  );
}
