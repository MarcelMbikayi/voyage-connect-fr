import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { CalendarDays, MapPin, Users, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const SearchForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    departureDate: "",
    returnDate: "",
    passengers: "1",
    tripType: "aller-simple"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to search results with query parameters
    const params = new URLSearchParams(formData);
    navigate(`/recherche?${params.toString()}`);
  };

  return (
    <Card className="p-6 md:p-8 shadow-card bg-gradient-card backdrop-blur-sm border-0 animate-scale-in">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex gap-2 mb-6">
          <Button
            type="button"
            variant={formData.tripType === "aller-simple" ? "default" : "ghost"}
            onClick={() => setFormData(prev => ({ ...prev, tripType: "aller-simple" }))}
            className="rounded-full"
          >
            Aller simple
          </Button>
          <Button
            type="button"
            variant={formData.tripType === "aller-retour" ? "default" : "ghost"}
            onClick={() => setFormData(prev => ({ ...prev, tripType: "aller-retour" }))}
            className="rounded-full"
          >
            Aller-retour
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="from" className="text-secondary">
              <MapPin className="inline w-4 h-4 mr-2" />
              Départ
            </Label>
            <Input
              id="from"
              placeholder="Ville ou gare de départ"
              value={formData.from}
              onChange={(e) => setFormData(prev => ({ ...prev, from: e.target.value }))}
              className="h-12 bg-background/50 border-border/50 focus:border-primary"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="to" className="text-secondary">
              <MapPin className="inline w-4 h-4 mr-2" />
              Arrivée
            </Label>
            <Input
              id="to"
              placeholder="Ville ou gare d'arrivée"
              value={formData.to}
              onChange={(e) => setFormData(prev => ({ ...prev, to: e.target.value }))}
              className="h-12 bg-background/50 border-border/50 focus:border-primary"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="departureDate" className="text-secondary">
              <CalendarDays className="inline w-4 h-4 mr-2" />
              Date de départ
            </Label>
            <Input
              id="departureDate"
              type="date"
              value={formData.departureDate}
              onChange={(e) => setFormData(prev => ({ ...prev, departureDate: e.target.value }))}
              className="h-12 bg-background/50 border-border/50 focus:border-primary"
              required
            />
          </div>

          {formData.tripType === "aller-retour" && (
            <div className="space-y-2">
              <Label htmlFor="returnDate" className="text-secondary">
                <CalendarDays className="inline w-4 h-4 mr-2" />
                Date de retour
              </Label>
              <Input
                id="returnDate"
                type="date"
                value={formData.returnDate}
                onChange={(e) => setFormData(prev => ({ ...prev, returnDate: e.target.value }))}
                className="h-12 bg-background/50 border-border/50 focus:border-primary"
                required={formData.tripType === "aller-retour"}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="passengers" className="text-secondary">
              <Users className="inline w-4 h-4 mr-2" />
              Passagers
            </Label>
            <Select value={formData.passengers} onValueChange={(value) => setFormData(prev => ({ ...prev, passengers: value }))}>
              <SelectTrigger className="h-12 bg-background/50 border-border/50 focus:border-primary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} passager{num > 1 ? 's' : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button type="submit" variant="hero" size="lg" className="w-full mt-8">
          <Search className="w-5 h-5 mr-2" />
          Rechercher des billets
        </Button>
      </form>
    </Card>
  );
};