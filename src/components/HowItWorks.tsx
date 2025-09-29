import { Card } from "@/components/ui/card";
import { Search, CreditCard, Ticket, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Recherchez",
    description: "Entrez votre destination et vos dates de voyage pour trouver les meilleures options",
    color: "bg-primary"
  },
  {
    icon: CreditCard,
    title: "Réservez",
    description: "Sélectionnez votre voyage et payez en toute sécurité avec plusieurs options de paiement",
    color: "bg-accent"
  },
  {
    icon: Ticket,
    title: "Recevez",
    description: "Obtenez instantanément votre billet électronique avec un QR code",
    color: "bg-success"
  },
  {
    icon: CheckCircle,
    title: "Voyagez",
    description: "Présentez simplement votre billet mobile et profitez de votre voyage",
    color: "bg-secondary"
  }
];

export const HowItWorks = () => {
  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="heading-2 text-foreground mb-4">
            Comment ça marche
          </h2>
          <p className="body text-muted-foreground max-w-2xl mx-auto">
            Réservez votre voyage en 4 étapes simples
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.title} className="relative animate-slide-up" style={{ animationDelay: `${index * 150}ms` }}>
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent z-0" />
              )}
              
              <Card className="p-6 text-center relative z-10 hover:shadow-card transition-all duration-300 bg-gradient-card border-0 group">
                <div className={`w-12 h-12 ${step.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <step.icon className="w-6 h-6 text-white" />
                </div>
                
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>

                <h3 className="font-semibold text-lg text-foreground mb-2">
                  {step.title}
                </h3>
                
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};