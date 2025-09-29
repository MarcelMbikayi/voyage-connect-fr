import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import SearchResults from "./pages/SearchResults";
import TripSelection from "./pages/TripSelection";
import PassengerDetails from "./pages/PassengerDetails";
import Payment from "./pages/Payment";
import Confirmation from "./pages/Confirmation";
import Dashboard from "./pages/Dashboard";
import AdminPortal from "./pages/AdminPortal";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/recherche" element={<SearchResults />} />
            <Route path="/voyage/:id" element={<TripSelection />} />
            <Route path="/passagers" element={<PassengerDetails />} />
            <Route path="/paiement" element={<Payment />} />
            <Route path="/confirmation" element={<Confirmation />} />
            <Route path="/tableau-de-bord" element={<Dashboard />} />
            <Route path="/admin" element={<AdminPortal />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profil" element={<Profile />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
