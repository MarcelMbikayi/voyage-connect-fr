import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Smartphone, Bell, MapPin, CreditCard, QrCode } from "lucide-react";

const features = [
  {
    icon: Bell,
    title: "Notifications en temps réel",
    description: "Restez informé des changements d'horaires et de quai"
  },
  {
    icon: MapPin,
    title: "Géolocalisation",
    description: "Trouvez automatiquement les gares et arrêts près de vous"
  },
  {
    icon: CreditCard,
    title: "Paiement mobile",
    description: "Payez rapidement avec Apple Pay, Google Pay ou Mobile Money"
  },
  {
    icon: QrCode,
    title: "Billets numériques",
    description: "Tous vos billets dans votre téléphone, même hors ligne"
  }
];

export const MobileAppSection = () => {
  return (
    <section className="py-16 px-4 bg-gradient-hero">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-white animate-fade-in">
            <h2 className="heading-2 mb-6">
              Téléchargez l'app VoyageExpress
            </h2>
            <p className="body-large mb-8 text-white/90">
              Emportez vos voyages partout avec vous. Notre application mobile vous offre 
              une expérience de réservation encore plus fluide.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {features.map((feature, index) => (
                <div key={feature.title} className="flex items-start space-x-3 animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <feature.icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-white/80">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="secondary" size="lg" className="flex items-center">
                <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                App Store
              </Button>
              <Button variant="secondary" size="lg" className="flex items-center">
                <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                </svg>
                Google Play
              </Button>
            </div>
          </div>

          {/* Mock Phone */}
          <div className="relative animate-scale-in">
            <Card className="p-8 bg-gradient-card backdrop-blur-sm border-white/20">
              <div className="mx-auto w-64 h-96 bg-gradient-to-b from-gray-900 to-gray-800 rounded-3xl p-4 shadow-2xl">
                <div className="h-full bg-white rounded-2xl overflow-hidden relative">
                  {/* Status Bar */}
                  <div className="bg-gray-900 h-8 flex items-center justify-between px-4">
                    <span className="text-white text-xs">9:41</span>
                    <div className="flex space-x-1">
                      <div className="w-4 h-2 bg-white rounded-sm"></div>
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                  
                  {/* App Content */}
                  <div className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-gray-900">VoyageExpress</h3>
                      <Smartphone className="w-6 h-6 text-primary" />
                    </div>
                    
                    <div className="space-y-3">
                      <div className="bg-primary/10 rounded-lg p-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Paris → Lyon</span>
                          <span className="text-xs text-primary">TGV</span>
                        </div>
                        <div className="text-xs text-gray-600 mt-1">Aujourd'hui, 14:20</div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Lyon → Nice</span>
                          <span className="text-xs text-accent">FlixBus</span>
                        </div>
                        <div className="text-xs text-gray-600 mt-1">Demain, 08:30</div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-primary text-white rounded-lg p-3 text-center">
                      <QrCode className="w-8 h-8 mx-auto mb-2" />
                      <span className="text-sm">Billet numérique</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};