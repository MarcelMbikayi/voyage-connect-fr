import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { FeaturedCompanies } from "@/components/FeaturedCompanies";
import { HowItWorks } from "@/components/HowItWorks";
import { MobileAppSection } from "@/components/MobileAppSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <FeaturedCompanies />
      <HowItWorks />
      <MobileAppSection />
      <Footer />
    </div>
  );
};

export default Index;
