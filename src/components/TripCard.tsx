import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Clock, DollarSign, Navigation } from "lucide-react";

// Define a type for the trip data for type safety
export type Trip = {
  id: string;
  company_name: string;
  departure_time: string;
  arrival_time: string;
  start_location: string;
  end_location: string;
  price: number;
  available_seats: number;
};

interface TripCardProps {
  trip: Trip;
  onSelect: (tripId: string) => void;
}

export const TripCard = ({ trip, onSelect }: TripCardProps) => {
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDuration = (start: string, end: string) => {
    const diff = new Date(end).getTime() - new Date(start).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  }

  return (
    <Card className="p-4 mb-4 flex flex-col md:flex-row justify-between items-center transition-all hover:shadow-lg hover:border-primary">
      <div className="flex-grow w-full md:w-auto">
        <div className="flex items-center justify-between mb-4">
          <Badge>{trip.company_name}</Badge>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{getDuration(trip.departure_time, trip.arrival_time)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col items-center">
            <div className="font-bold text-xl">{formatTime(trip.departure_time)}</div>
            <div className="text-sm text-muted-foreground">{trip.start_location}</div>
          </div>

          <div className="flex-grow flex items-center justify-center mx-4">
             <ArrowRight className="w-6 h-6 text-muted-foreground" />
          </div>

          <div className="flex flex-col items-center">
            <div className="font-bold text-xl">{formatTime(trip.arrival_time)}</div>
            <div className="text-sm text-muted-foreground">{trip.end_location}</div>
          </div>
        </div>
      </div>

      <div className="w-full md:w-auto mt-4 md:mt-0 md:ml-6 flex flex-col items-end border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6">
        <div className="flex items-center mb-2">
          <DollarSign className="w-5 h-5 text-primary mr-1" />
          <span className="text-2xl font-bold">{trip.price.toFixed(2)}</span>
          <span className="text-muted-foreground ml-1">USD</span>
        </div>
        <div className="text-sm text-muted-foreground mb-4">
          {trip.available_seats} places restantes
        </div>
        <Button onClick={() => onSelect(trip.id)} className="w-full md:w-auto">
          Sélectionner ce trajet
        </Button>
      </div>
    </Card>
  );
};