import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

const AdminPortal = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="heading-2 mb-8">Portail administrateur</h1>
          <div className="text-center py-12">
            <p className="body text-muted-foreground">
              Cette page sera destinée à la gestion des voyages, flotte et analytics.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminPortal;