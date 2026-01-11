import { NavHeader } from "./components/landing/nav-header";
import { HeroSection } from "./components/landing/hero-section";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <NavHeader />
      <HeroSection />
    </main>
  );
}
