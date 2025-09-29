import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { TripCard, Trip } from "@/components/TripCard";
import { supabase } from "@/integrations/supabase/client";
import { Search, Frown, ArrowRight } from "lucide-react";

const SearchResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const searchParams = new URLSearchParams(location.search);
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const departureDate = searchParams.get("departureDate");

  useEffect(() => {
    const fetchTrips = async () => {
      setLoading(true);
      setError(null);

      if (!from || !to || !departureDate) {
        setError("Les paramètres de recherche (départ, arrivée, date) sont requis.");
        setLoading(false);
        return;
      }

      try {
        let query = supabase
          .from('detailed_schedules_view')
          .select('*')
          .ilike('start_location', `%${from}%`)
          .ilike('end_location', `%${to}%`);

        // Filter by date range for the selected day
        const startDate = new Date(departureDate);
        startDate.setUTCHours(0, 0, 0, 0);

        const endDate = new Date(departureDate);
        endDate.setUTCHours(23, 59, 59, 999);

        query = query
          .gte('departure_time', startDate.toISOString())
          .lte('departure_time', endDate.toISOString());

        const { data, error: queryError } = await query;

        if (queryError) {
          throw queryError;
        }

        setTrips(data as Trip[]);
      } catch (e: any) {
        console.error("Failed to fetch trips:", e);
        setError("Impossible de charger les résultats de la recherche. Veuillez réessayer.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [location.search, from, to, departureDate]);

  const handleSelectTrip = (tripId: string) => {
    // This would navigate to the passenger details or payment page
    navigate(`/reservation/${tripId}`);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center py-20">
          <Search className="w-12 h-12 text-primary animate-pulse mx-auto" />
          <p className="body mt-4">Recherche des trajets en cours...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-20 text-destructive">
          <Frown className="w-12 h-12 mx-auto" />
          <p className="body mt-4">{error}</p>
        </div>
      );
    }

    if (trips.length === 0) {
      return (
        <div className="text-center py-20">
          <Frown className="w-12 h-12 text-muted-foreground mx-auto" />
          <p className="body mt-4">Aucun trajet trouvé pour cette recherche.</p>
          <p className="body-small text-muted-foreground">Essayez de modifier vos critères de recherche.</p>
        </div>
      );
    }

    return (
      <div>
        {trips.map((trip) => (
          <TripCard key={trip.id} trip={trip} onSelect={handleSelectTrip} />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <main className="flex-grow py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-8">
            <p className="body-small text-muted-foreground">Résultats pour votre recherche</p>
            <h1 className="heading-2 capitalize">
              {from} <ArrowRight className="inline-block mx-2 h-6 w-6" /> {to}
            </h1>
            <p className="body text-muted-foreground">{departureDate ? new Date(departureDate).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : ''}</p>
          </div>

          {renderContent()}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SearchResults;