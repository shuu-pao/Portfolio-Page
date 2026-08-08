import { Navbar } from "@/components/layout/Navbar";
import { ContactFormSection } from "@/components/sections/ContactFormSection";
import { ContactFooterBlock } from "@/components/sections/ContactFooterBlock";
import { Footer } from "@/components/layout/Footer";

export default function ContactPage() {
  return (
    <>
      <Navbar />
      {/* id="contact" lets useActiveSection (Navbar's dark/light text switch)
          recognize this page as the "contact" section, same as the home
          page's #contact anchor — otherwise Navbar defaults to its
          light-mode text color against this page's dark background. */}
      <main id="contact" className="relative min-h-screen w-full bg-em-invert-bg px-6 pt-[14vh] md:px-16">
        <ContactFormSection />
        <ContactFooterBlock />
      </main>
      <Footer />
    </>
  );
}
