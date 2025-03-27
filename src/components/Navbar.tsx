
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Receipt, 
  PiggyBank, 
  Users, 
  User, 
  Bell, 
  Menu, 
  X 
} from "lucide-react";

const navItems = [
  { path: "/dashboard", name: "Dashboard", icon: LayoutDashboard },
  { path: "/expenses", name: "Expenses", icon: Receipt },
  { path: "/budget", name: "Budget", icon: PiggyBank },
  { path: "/groups", name: "Groups", icon: Users },
  { path: "/profile", name: "Profile", icon: User },
];

const Navbar = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isHomePage = location.pathname === "/";

  return (
    <header
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300",
        isScrolled || !isHomePage
          ? "bg-white/80 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2"
            onClick={closeMobileMenu}
          >
            <span className="text-primary font-bold text-xl">SmartBudget</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {!isHomePage && navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  location.pathname === item.path
                    ? "text-primary bg-primary/10"
                    : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                )}
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.name}
              </Link>
            ))}
            {isHomePage && (
              <>
                <Link to="/dashboard">
                  <Button variant="outline" className="mr-2">
                    Login
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button>Get Started</Button>
                </Link>
              </>
            )}
            {!isHomePage && (
              <Button variant="ghost" size="icon" className="ml-2">
                <Bell className="w-5 h-5" />
              </Button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 bg-white z-40 md:hidden transform transition-transform duration-300 ease-in-out",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="pt-20 px-4 pb-6 h-full overflow-y-auto">
          <nav className="flex flex-col space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center px-4 py-3 text-base font-medium rounded-md transition-colors",
                  location.pathname === item.path
                    ? "text-primary bg-primary/10"
                    : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                )}
                onClick={closeMobileMenu}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
