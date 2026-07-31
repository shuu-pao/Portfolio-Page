import HeroSection from "@/components/sections/HeroSection";
import MarqueeTickerSection from "@/components/sections/MarqueeTickerSection";
import PortfolioGallerySection from "@/components/sections/PortfolioGallerySection";
import AboutMeSection from "@/components/sections/AboutMeSection";
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
        <MarqueeTickerSection />
        <PortfolioGallerySection />
        <AboutMeSection />
        <SkillsStackSection />
        <ProcessTimelineSection />
        <ContactSection />
      </main>
    </>
  );
}
