import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

const PassengerDetails = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="heading-2 mb-8">Informations passagers</h1>
          <div className="text-center py-12">
            <p className="body text-muted-foreground">
              Cette page contiendra le formulaire de saisie des informations passagers.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PassengerDetails;