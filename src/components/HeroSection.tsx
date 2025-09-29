import { SearchForm } from "./SearchForm";

export const HeroSection = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center px-4 py-16 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-hero" />
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Hero Content */}
        <div className="mb-12 animate-fade-in">
          <h1 className="heading-1 text-white mb-6">
            Votre billet pour la RDC, en un clic
          </h1>
          <p className="body-large text-white/90 max-w-2xl mx-auto mb-8">
            Réservez vos billets de bus, train et avion en toute simplicité.
            Connecter les villes et les populations de la République Démocratique du Congo.
          </p>
          
          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-12 text-white/80">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">5+</div>
              <div className="text-sm">Villes Principales</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">10+</div>
              <div className="text-sm">Compagnies Partenaires</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">100+</div>
              <div className="text-sm">Trajets par jour</div>
            </div>
          </div>
        </div>

        {/* Search Form */}
        <div className="animate-slide-up">
          <SearchForm />
        </div>
      </div>
    </section>
  );
};