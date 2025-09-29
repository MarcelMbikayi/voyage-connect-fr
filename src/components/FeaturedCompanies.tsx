import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Wifi, Coffee, Car } from "lucide-react";

const companies = [
  {
    name: "FlixBus",
    type: "Bus",
    rating: 4.5,
    features: ["Wi-Fi gratuit", "Prises électriques", "Siège confort"],
    logo: "🚌",
    color: "bg-green-500"
  },
  {
    name: "SNCF Connect",
    type: "Train",
    rating: 4.7,
    features: ["Haute vitesse", "Restauration", "1ère classe"],
    logo: "🚄",
    color: "bg-blue-500"
  },
  {
    name: "Transavia",
    type: "Avion",
    rating: 4.3,
    features: ["Vol direct", "Bagages inclus", "Check-in mobile"],
    logo: "✈️",
    color: "bg-sky-500"
  },
  {
    name: "Eurolines",
    type: "Bus",
    rating: 4.2,
    features: ["Réseau européen", "Tarifs flexibles", "Confort+"],
    logo: "🚌",
    color: "bg-orange-500"
  }
];

export const FeaturedCompanies = () => {
  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="heading-2 text-foreground mb-4">
            Nos partenaires de confiance
          </h2>
          <p className="body text-muted-foreground max-w-2xl mx-auto">
            Voyagez avec les meilleures compagnies de transport d'Europe
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {companies.map((company, index) => (
            <Card key={company.name} className="p-6 hover:shadow-card transition-all duration-300 animate-slide-up bg-gradient-card border-0 group cursor-pointer" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="text-center space-y-4">
                <div className={`w-16 h-16 ${company.color} rounded-full flex items-center justify-center mx-auto text-2xl group-hover:scale-110 transition-transform duration-300`}>
                  {company.logo}
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg text-foreground">
                    {company.name}
                  </h3>
                  <Badge variant="secondary" className="mt-1">
                    {company.type}
                  </Badge>
                </div>

                <div className="flex items-center justify-center gap-1">
                  <Star className="w-4 h-4 fill-accent text-accent" />
                  <span className="font-medium text-foreground">
                    {company.rating}
                  </span>
                </div>

                <div className="space-y-2">
                  {company.features.map(feature => (
                    <div key={feature} className="flex items-center justify-center text-sm text-muted-foreground">
                      <div className="w-1 h-1 bg-primary rounded-full mr-2" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};