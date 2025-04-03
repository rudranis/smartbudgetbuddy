
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NotificationCenter } from "@/components/NotificationCenter";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  LayoutDashboard, 
  Receipt, 
  PiggyBank, 
  Users, 
  User, 
  Bell, 
  Menu,
  X,
  LogOut,
  Settings,
  LightbulbIcon,
  BarChart2,
  CreditCard
} from "lucide-react";

const navItems = [
  { path: "/dashboard", name: "Dashboard", icon: LayoutDashboard },
  { path: "/expenses", name: "Expenses", icon: Receipt },
  { path: "/budget", name: "Budget", icon: PiggyBank },
  { path: "/groups", name: "Groups", icon: Users },
  { path: "/advisor", name: "Financial Advisor", icon: BarChart2 },
  { path: "/profile", name: "Profile", icon: User },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
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

  const handleLogout = () => {
    logout();
    navigate("/");
    closeMobileMenu();
  };

  const isHomePage = location.pathname === "/";
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

  // Don't show navbar on auth pages
  if (isAuthPage) return null;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300",
        isScrolled || !isHomePage
          ? "bg-background/80 backdrop-blur-md border-b"
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
            <LightbulbIcon className="h-6 w-6 text-primary" />
            <span className="text-primary font-bold text-xl">SmartBudget</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {isAuthenticated && !isHomePage && navItems.map((item) => (
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
            
            {!isAuthenticated && isHomePage && (
              <>
                <Link to="/login">
                  <Button variant="outline" className="mr-2">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button>Get Started</Button>
                </Link>
              </>
            )}
            
            <div className="flex items-center space-x-1 ml-2">
              <ThemeToggle />
              
              {isAuthenticated && (
                <>
                  <NotificationCenter />
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 ml-1">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={user?.avatar} alt={user?.name} />
                          <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>
                        <div className="flex flex-col">
                          <span>{user?.name}</span>
                          <span className="text-xs text-muted-foreground">{user?.email}</span>
                          <span className="text-xs text-muted-foreground capitalize mt-1">
                            {user?.userType}
                          </span>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/profile" className="cursor-pointer">
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/profile/settings" className="cursor-pointer">
                          <Settings className="mr-2 h-4 w-4" />
                          Settings
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/profile/payments" className="cursor-pointer">
                          <CreditCard className="mr-2 h-4 w-4" />
                          Payment Methods
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive" onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 md:hidden">
            <ThemeToggle />
            
            {isAuthenticated && <NotificationCenter />}
            
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
          "fixed inset-0 bg-background z-40 md:hidden transform transition-transform duration-300 ease-in-out pt-16",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="pt-4 px-4 pb-6 h-full overflow-y-auto">
          {isAuthenticated ? (
            <>
              <div className="flex items-center p-4 mb-4 bg-muted/50 rounded-lg">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{user?.name}</div>
                  <div className="text-sm text-muted-foreground">{user?.email}</div>
                </div>
              </div>
              
              <nav className="flex flex-col space-y-1">
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
                
                <Button
                  variant="ghost"
                  className="flex items-center justify-start px-4 py-3 h-auto text-base font-medium rounded-md text-destructive hover:bg-destructive/10"
                  onClick={handleLogout}
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Logout
                </Button>
              </nav>
            </>
          ) : (
            <div className="flex flex-col space-y-4 p-4">
              <Link to="/login" onClick={closeMobileMenu}>
                <Button variant="outline" className="w-full">Login</Button>
              </Link>
              <Link to="/signup" onClick={closeMobileMenu}>
                <Button className="w-full">Create Account</Button>
              </Link>
            </div>
          )}
          
          <div className="mt-8 pt-6 border-t">
            <div className="flex items-center justify-center">
              <LightbulbIcon className="h-5 w-5 text-primary mr-2" />
              <p className="text-sm text-center italic">Smart Budget, Smarter You!</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
