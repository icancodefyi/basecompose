import { NavHeader } from "./components/landing/nav-header";
import { HeroSection } from "./components/landing/hero-section";
import HowItWorks from "./components/landing/how-it-works/howit-works";
import WhoIsThisFor from "./components/landing/who-is-this-for/who-is-this-for";
import SupportedTech from "./components/landing/supported-tech/supported-tech";
import WhyBaseCompose from "./components/landing/why-layered/why-base-compose";
import WhatYouGet from "./components/landing/what-you-get/what-you-get";
import FinalCTA from "./components/landing/final-cta/final-cta";
import Footer from "./components/landing/footer/footer";


export default function LandingPage() {
  return (
    <main className="min-h-screen bg-black text-foreground">
      <NavHeader />
      <HeroSection />
      <HowItWorks />
      <WhoIsThisFor />
      <SupportedTech />
      <WhyBaseCompose />
      <WhatYouGet />
      <FinalCTA/>
      <Footer/>
    </main>
  );
}
