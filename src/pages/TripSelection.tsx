import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

const TripSelection = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="heading-2 mb-8">Sélection du voyage</h1>
          <div className="text-center py-12">
            <p className="body text-muted-foreground">
              Cette page affichera la sélection de sièges et les détails du voyage.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TripSelection;