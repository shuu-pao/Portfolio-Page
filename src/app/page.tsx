import HeroSection from "@/components/sections/HeroSection";
import AboutMeSection from "@/components/sections/AboutMeSection";
import PortfolioGallerySection from "@/components/sections/PortfolioGallerySection";
import ContactSection from "@/components/sections/ContactSection";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="relative min-h-screen w-full bg-zinc-950">
        <HeroSection />
        <AboutMeSection />
        <PortfolioGallerySection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
