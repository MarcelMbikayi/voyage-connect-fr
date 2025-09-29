import { Link } from "react-router-dom";
import { Ticket, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const footerSections = [
  {
    title: "Voyage",
    links: [
      { label: "Rechercher un billet", href: "/recherche" },
      { label: "Destinations populaires", href: "/" },
      { label: "Horaires", href: "/" },
      { label: "Cartes et abonnements", href: "/" }
    ]
  },
  {
    title: "Services",
    links: [
      { label: "Application mobile", href: "/" },
      { label: "Service client", href: "/" },
      { label: "Assurance voyage", href: "/" },
      { label: "Bagages", href: "/" }
    ]
  },
  {
    title: "Entreprise",
    links: [
      { label: "À propos", href: "/" },
      { label: "Partenaires", href: "/" },
      { label: "Carrières", href: "/" },
      { label: "Presse", href: "/" }
    ]
  },
  {
    title: "Support",
    links: [
      { label: "Centre d'aide", href: "/" },
      { label: "Nous contacter", href: "/" },
      { label: "Remboursements", href: "/" },
      { label: "Réclamations", href: "/" }
    ]
  }
];

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" }
];

export const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Ticket className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-primary">VoyageExpress</span>
            </Link>
            <p className="text-secondary-foreground/80 mb-6 max-w-sm">
              La plateforme de réservation de billets la plus simple et la plus fiable 
              pour tous vos voyages en Europe.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 bg-secondary-light/20 rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-secondary-foreground mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-secondary-foreground/80 hover:text-primary transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-secondary-light/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-secondary-foreground/60 text-sm">
            © 2024 VoyageExpress. Tous droits réservés.
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/" className="text-secondary-foreground/60 hover:text-primary text-sm transition-colors">
              Conditions d'utilisation
            </Link>
            <Link to="/" className="text-secondary-foreground/60 hover:text-primary text-sm transition-colors">
              Politique de confidentialité
            </Link>
            <Link to="/" className="text-secondary-foreground/60 hover:text-primary text-sm transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};