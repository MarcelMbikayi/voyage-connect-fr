import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

const Confirmation = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="heading-2 mb-8">Confirmation de réservation</h1>
          <div className="text-center py-12">
            <p className="body text-muted-foreground">
              Cette page affichera la confirmation avec le QR code du billet.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Confirmation;