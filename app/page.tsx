import { NavHeader } from "./components/landing/nav-header";
import { HeroSection } from "./components/landing/hero-section";
import HowItWorks from "./components/landing/how-it-works/howit-works";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-black text-foreground">
      <NavHeader />
      <HeroSection />
      <HowItWorks />
    </main>
  );
}
