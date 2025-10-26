import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { DifferentialsSection } from "@/components/sections/DifferentialsSection";
import { ContactSection } from "@/components/sections/ContactSection";

export default function Home() {
  return (
    <>
      <Header />

      <main id="main-content">
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <DifferentialsSection />
        <ContactSection />
      </main>

      <Footer />
    </>
  );
}
