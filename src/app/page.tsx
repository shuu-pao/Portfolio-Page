import HeroSection from "@/components/sections/HeroSection";
import TaglineSection from "@/components/sections/TaglineSection";
import IntroBioSection from "@/components/sections/IntroBioSection";
import PortfolioGallerySection from "@/components/sections/PortfolioGallerySection";
import SkillsStackSection from "@/components/sections/SkillsStackSection";
import MissionStatementSection from "@/components/sections/MissionStatementSection";
import ProcessTimelineSection from "@/components/sections/ProcessTimelineSection";
import ContactSection from "@/components/sections/ContactSection";
import { Navbar } from "@/components/layout/Navbar";
import { SectionIndexTab } from "@/components/layout/SectionIndexTab";

export default function Home() {
  return (
    <>
      <Navbar />
      <SectionIndexTab />
      <main className="relative min-h-screen w-full">
        <HeroSection />
        <TaglineSection />
        <IntroBioSection />
        <PortfolioGallerySection />
        <SkillsStackSection />
        <MissionStatementSection />
        <ProcessTimelineSection />
        <ContactSection />
      </main>
    </>
  );
}
