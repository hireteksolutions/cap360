import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, UserCog } from "lucide-react"; // 👈 Added UserCog icon
import ConsultationModal from "./ConsultationModal";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Programs", href: "/career-program" },
    { name: "Resume Services", href: "/resume-services" },
    { name: "Industry", href: "/industries" },
    { name: "About Us", href: "/about" },
    { name: "Success Stories", href: "/story-success" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="shadow-lg sticky top-0 z-50 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img 
                src="/cap-uploads/caplogo.png" 
                alt="CAP 360 Logo" 
                className="h-10 w-auto"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 text-sm font-medium transition-colors flex items-center gap-1 ${
                  location.pathname === item.href
                    ? "border-b-2"
                    : "hover:opacity-75"
                }`}
                style={{ 
                  color: '#121B2E',
                  ...(location.pathname === item.href ? { borderBottomColor: '#121B2E' } : {})
                }}
              >
                {item.icon ? item.icon : item.name} {/* 👈 Show icon if available */}
              </Link>
            ))}
            <ConsultationModal>
              <Button className="bg-gradient-icon text-white hover:opacity-90">
                Book Free Consultation
              </Button>
            </ConsultationModal>

            {/* Admin Icon */}
            {/* <Link
              to="/admin"
              className="hover:opacity-75 p-2"
              style={{ color: "#121B2E" }}
            >
              <UserCog size={22} />
            </Link> */}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="hover:opacity-75"
              style={{ color: '#121B2E' }}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t bg-white" style={{ borderTopColor: '#121B2E' }}>
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 text-base font-medium transition-colors hover:opacity-75 flex items-center gap-2 ${
                    location.pathname === item.href ? "font-bold" : ""
                  }`}
                  style={{ 
                    color: '#121B2E',
                    ...(location.pathname === item.href ? { backgroundColor: 'rgba(18, 27, 46, 0.1)' } : {})
                  }}
                  onClick={() => setIsOpen(false)}
                >
                  {item.icon ? item.icon : item.name} {/* 👈 Show icon if available */}
                </Link>
              ))}
              <div className="px-3 py-2">
                <ConsultationModal>
                  <Button className="w-full bg-gradient-icon text-white hover:opacity-90">
                    Book Free Consultation
                  </Button>
                </ConsultationModal>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
