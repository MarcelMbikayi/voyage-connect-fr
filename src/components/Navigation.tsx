import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, User, LogIn, Ticket, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  const navItems = [
    { href: "/", label: "Accueil" },
    { href: "/recherche", label: "Rechercher" },
    { href: "/tableau-de-bord", label: "Mes voyages" },
  ];

  const isActive = (href: string) => location.pathname === href;

  const handleSignOut = async () => {
    await signOut();
  };

  const AuthenticatedUserMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <User className="w-4 h-4" />
          <span className="hidden sm:inline">
            {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Mon compte'}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem asChild>
          <Link to="/profil" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Mon profil
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/tableau-de-bord" className="flex items-center gap-2">
            <Ticket className="w-4 h-4" />
            Mes voyages
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
          <LogOut className="w-4 h-4 mr-2" />
          Se déconnecter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const NavContent = () => (
    <>
      {navItems.map(item => (
        <Link
          key={item.href}
          to={item.href}
          className={`text-sm font-medium transition-colors hover:text-primary ${
            isActive(item.href) ? "text-primary" : "text-foreground/80"
          }`}
          onClick={() => setIsOpen(false)}
        >
          {item.label}
        </Link>
      ))}
    </>
  );

  return (
    <nav className="border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Ticket className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-primary">VoyageExpress</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavContent />
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <AuthenticatedUserMenu />
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/auth">
                    <User className="w-4 h-4 mr-2" />
                    Mon compte
                  </Link>
                </Button>
                <Button variant="default" size="sm" asChild>
                  <Link to="/auth">
                    <LogIn className="w-4 h-4 mr-2" />
                    Connexion
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col space-y-4 mt-8">
                <NavContent />
                <div className="border-t pt-4 space-y-2">
                  {user ? (
                    <>
                      <Button variant="ghost" className="w-full justify-start" asChild>
                        <Link to="/profil">
                          <User className="w-4 h-4 mr-2" />
                          Mon profil
                        </Link>
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start text-destructive" 
                        onClick={handleSignOut}
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Se déconnecter
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="ghost" className="w-full justify-start" asChild>
                        <Link to="/auth">
                          <User className="w-4 h-4 mr-2" />
                          Mon compte
                        </Link>
                      </Button>
                      <Button variant="default" className="w-full justify-start" asChild>
                        <Link to="/auth">
                          <LogIn className="w-4 h-4 mr-2" />
                          Connexion
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};