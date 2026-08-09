import { Navbar } from "@/components/layout/Navbar";
import { ContactFormSection } from "@/components/sections/ContactFormSection";
import { ContactFooterBlock } from "@/components/sections/ContactFooterBlock";
import { Footer } from "@/components/layout/Footer";

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="relative w-full px-6 pt-[14vh] md:px-16">
        <ContactFormSection />
      </main>
      {/* id="contact" lets useActiveSection (Navbar's dark/light text switch)
          recognize only this always-dark zone as the "contact" section —
          same placement as the home page's ContactSection.tsx, so the
          navbar's forced cream text only kicks in once this zone is
          reached, not over the theme-adaptive form section above. */}
      <div className="relative w-full bg-em-invert-bg">
        <section id="contact" className="relative px-6 py-[10vh] md:px-16">
          <ContactFooterBlock />
        </section>
        <Footer />
      </div>
    </>
  );
}
