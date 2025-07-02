import React, { useState, useEffect, createContext, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Home,
  Server,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Settings,
  User as UserIcon,
  Moon,
  Sun,
  Coins,
  Crown,
  BarChart3,
  Bell,
  Search,
  Command,
  LucideMonitorUp,
  LucideKeySquare,
  LucideShoppingBag,
  LucideHandCoins,
  CogIcon,
  LucideRadio,
  LucideServerCog,
  LucideStore,
  DollarSign,
} from "lucide-react";
import ssr from "@/lib/ssr";

// Theme context
const ThemeContext = createContext({
  theme: "dark",
  toggleTheme: () => {},
});

// Sidebar context
const SidebarContext = createContext({
  isCollapsed: false,
  toggleSidebar: () => {},
  isMobile: false,
  closeMobileSidebar: () => {},
});

// Search functionality hook
const useSearch = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);
  
  return {
    isOpen,
    openSearch: () => setIsOpen(true),
    closeSearch: () => setIsOpen(false),
  };
};

// Get user data
const getUserData = () => {
  const authUser = ssr.get("authUser") || {};
  const userRoles = ssr.get("userRoles") || [];
  
  return {
    name: authUser.name || "Guest User",
    email: authUser.email || "guest@example.com",
    credits: authUser.credits || 0,
    coins: authUser.coins || 0,
    serverCount: authUser.server_count || 0,
    serverLimit: authUser.server_limit || 0,
    rank: authUser.rank || "user",
    avatar: authUser.avatar || 
      `https://ui-avatars.com/api/?name=${encodeURIComponent(authUser.name || "User")}&background=7c3aed&color=fff&size=128`,
    status: "online",
    unreadNotifications: 3,
    isAdmin: userRoles.some(role => role.toLowerCase().includes("admin")),
  };
};

// Search Modal Component
const SearchModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden border border-zinc-200 dark:border-zinc-800" 
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center border-b border-zinc-200 dark:border-zinc-800 p-4">
          <Search className="h-5 w-5 text-zinc-400 mr-3" />
          <input
            type="text"
            className="flex-1 bg-transparent border-0 focus:ring-0 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 text-base outline-none"
            placeholder="Type to search..."
            autoFocus
          />
          <div className="flex items-center border border-zinc-200 dark:border-zinc-700 rounded px-1.5 py-0.5 text-xs text-zinc-500 dark:text-zinc-400">
            <span className="mr-0.5">Esc</span>
          </div>
        </div>
        <div className="p-4 text-center text-zinc-500 dark:text-zinc-400">
          <p>Start typing to search...</p>
        </div>
      </div>
    </div>
  );
};

// Sidebar Item Component
const SidebarItem = ({ item, isActive, isCollapsed, onClick, children }) => {
  const { closeMobileSidebar } = useContext(SidebarContext);
  
  const handleClick = (e) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
    if (item.href) {
      closeMobileSidebar();
    }
  };

  if (isCollapsed) {
    return (
      <Link 
        to={item.href || "#"}
        className="block w-full"
        onClick={handleClick}
      >
        <Button
          variant={isActive ? "default" : "ghost"}
          size="icon"
          className={cn(
            "w-full h-11 relative mb-1",
            isActive 
              ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900" 
              : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          )}
        >
          <item.icon className={cn("h-5 w-5", item.iconColor)} />
          {item.badge && (
            <Badge
              className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center p-0 text-[10px]"
            >
              {item.badge}
            </Badge>
          )}
        </Button>
      </Link>
    );
  }

  return (
    <div className="w-full">
      <Button
        variant={isActive ? "default" : "ghost"}
        className={cn(
          "w-full justify-start h-10 px-3 text-base rounded-lg",
          isActive
            ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900" 
            : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
        )}
        onClick={handleClick}
        asChild={!!item.href && !onClick}
      >
        {item.href && !onClick ? (
          <Link to={item.href}>
            <div className="flex items-center w-full">
              <item.icon className={cn("h-5 w-5 mr-2", item.iconColor)} />
              <span className="flex-1 text-left font-medium">{item.title}</span>
              {item.badge && <Badge className="ml-auto">{item.badge}</Badge>}
              {onClick && (
                <ChevronDown className={cn(
                  "h-4 w-4 transition-transform",
                  isActive ? "transform rotate-180" : ""
                )} />
              )}
            </div>
          </Link>
        ) : (
          <div className="flex items-center w-full">
            <item.icon className={cn("h-5 w-5 mr-2", item.iconColor)} />
            <span className="flex-1 text-left font-medium">{item.title}</span>
            {item.badge && <Badge className="ml-auto">{item.badge}</Badge>}
            {onClick && (
              <ChevronDown className={cn(
                "h-4 w-4 transition-transform",
                isActive ? "transform rotate-180" : ""
              )} />
            )}
          </div>
        )}
      </Button>
      {children}
    </div>
  );
};

// Theme Toggle Component
const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <Switch
      checked={theme === "dark"}
      onCheckedChange={toggleTheme}
      className="data-[state=checked]:bg-zinc-900 dark:data-[state=checked]:bg-zinc-100"
    />
  );
};

// Main sidebar layout component
export default function SidebarLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState(null);
  
  const { isOpen: isSearchOpen, openSearch, closeSearch } = useSearch();
  const location = useLocation();
  const user = getUserData();
  
  // Check device size
  useEffect(() => {
    const checkIsMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // Auto-collapse on tablets
      if (window.innerWidth < 1024 && window.innerWidth >= 768) {
        setIsCollapsed(true);
      }
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Initialize theme
  useEffect(() => {
    const darkModePreference = localStorage.getItem("dark-mode") === "true";
    setTheme(darkModePreference ? "dark" : "light");
    document.documentElement.classList.toggle("dark", darkModePreference);
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("dark-mode", newTheme === "dark");
  };
  
  // Get current page title
  const getCurrentPageTitle = () => {
    if (location.pathname.startsWith("/home")) return "Dashboard";
    if (location.pathname.startsWith("/home/store")) return "Store";
    if (location.pathname.startsWith("/home/servers")) return "Servers";
    if (location.pathname.startsWith("/ticket")) return "Support";
    if (location.pathname.startsWith("/admin")) return "Admin";
    if (location.pathname.startsWith("/broadcast/india")) return "India Broadcast";
    if (location.pathname.startsWith("/broadcast/uk")) return "UK Broadcast";
    return "Dashboard";
  };
  
  // Get current active tab
  // Set the active tab in the sidebar based on the current URL path
  const getCurrentTab = () => {
    if (location.pathname === "/home") return "home";
    if (location.pathname === "/home/store") return "store";
    if (location.pathname === "/servers") return "panel";
    if (location.pathname === "/home/servers") return "products";
    if (location.pathname === "/shop") return "coinshop";
    if (location.pathname === "/earn") return "earn";
    if (location.pathname === "/profile") return "profile";
    if (location.pathname.startsWith("/broadcast/india")) return "broadcast-india";
    if (location.pathname.startsWith("/broadcast/uk")) return "broadcast-uk";
    if (location.pathname.startsWith("/admin")) return "admin";
    return "";
  };
  
  const activeTab = getCurrentTab();
  
  // Close mobile sidebar
  const closeMobileSidebar = () => {
    if (isMobile && isMobileOpen) {
      setIsMobileOpen(false);
    }
  };
  
  // User Avatar
  const UserAvatar = ({ size = "md" }) => {
    const sizes = {
      sm: "h-6 w-6",
      md: "h-9 w-9",
      lg: "h-10 w-10"
    };
    
    const initials = user.name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
    
    return (
      <Avatar className={sizes[size]}>
        <AvatarImage src={user.avatar} alt={user.name} />
        <AvatarFallback className={cn(
          "text-xs font-medium",
          user.rank === "premium"
            ? "bg-amber-600 text-white"
            : user.isAdmin
              ? "bg-red-600 text-white"
              : "bg-zinc-600 text-white"
        )}>
          {initials}
        </AvatarFallback>
      </Avatar>
    );
  };
  
  // Navigation items
  const navItems = [
    {
      title: "Dashboard",
      href: "/home",
      icon: Home,
      isActive: activeTab === "home"
    },
    {
      title: "Store",
      href: "/home/store",
      icon: LucideStore,
      isActive: activeTab === "store"
    },
    
    
  ];
  
  // Add admin panel if user is admin
  if (user.isAdmin) {
    navItems.push({
      title: "Admin",
      href: "/admin",
      icon: CogIcon,
      iconColor: "text-red-500",
      isActive: activeTab === "admin"
    });
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <SidebarContext.Provider value={{ isCollapsed, toggleSidebar: () => setIsCollapsed(!isCollapsed), isMobile, closeMobileSidebar }}>
        <div className="flex h-screen overflow-hidden bg-white dark:bg-zinc-950">
          {/* Mobile header */}
          {isMobile && (
            <header className="fixed top-0 left-0 right-0 z-40 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 h-16 flex items-center px-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="h-10 w-10"
              >
                {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              
              <div className="flex items-center ml-3">
                <img 
                  src="/logo.svg" 
                  alt="Logo" 
                  className="h-8 w-8 mr-2"
                />
                <h1 className="font-semibold text-lg">
                  {getCurrentPageTitle()}
                </h1>
              </div>
              
              <div className="ml-auto flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={openSearch} 
                  className="h-10 w-10"
                >
                  <Search className="h-5 w-5" />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleTheme} 
                  className="h-10 w-10"
                >
                  {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-10 w-10 relative rounded-full p-0">
                      <UserAvatar />
                      {user.unreadNotifications > 0 && (
                        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                          {user.unreadNotifications}
                        </span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuLabel className="flex items-center gap-3 p-3 border-l-4 border-primary">
                      <UserAvatar size="lg" />
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">Coins: {user.coins}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/logout" className="cursor-pointer flex items-center text-red-600">
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </header>
          )}

          {/* Mobile sidebar overlay */}
          {isMobile && isMobileOpen && (
            <div
              className="fixed inset-0 bg-black/60 z-30 mt-16"
              onClick={closeMobileSidebar}
            />
          )}

          {/* Sidebar */}
          <aside
            className={cn(
              "flex flex-col bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 transition-all duration-300",
              isMobile 
                ? cn(
                  "fixed top-16 left-0 bottom-0 z-40 w-72 transform",
                  isMobileOpen ? "translate-x-0" : "-translate-x-full"
                )
                : cn(
                  isCollapsed ? "w-[72px]" : "w-[280px]"
                )
            )}
          >
            {/* Logo and header (desktop only) */}
            {!isMobile && (
              <div className={cn(
                "flex items-center border-b border-zinc-200 dark:border-zinc-800 h-16",
                isCollapsed ? "justify-center px-3" : "px-6"
              )}>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                    <img src="/logo.svg" alt="Logo" className="h-6 w-6" />
                  </div>
                  
                  {!isCollapsed && (
                    <div>
                      <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Dashboard</h2>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {user.isAdmin ? 'Administration' : 'Hobby'}
                      </p>
                    </div>
                  )}
                </div>
                
                {!isCollapsed && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsCollapsed(true)}
                    className="h-9 w-9 ml-auto"
                  >
                    <ChevronDown className="h-5 w-5 rotate-90" />
                  </Button>
                )}
              </div>
            )}
            
            {/* Search bar (desktop expanded only) */}
            {!isMobile && !isCollapsed && (
              <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
                <Button
                  variant="outline"
                  className="w-full justify-start text-sm text-zinc-400 dark:text-zinc-500 font-normal"
                  onClick={openSearch}
                >
                  <Search className="h-4 w-4 mr-2" />
                  <span>Search...</span>
                  <div className="ml-auto flex items-center text-xs border border-zinc-200 dark:border-zinc-700 rounded px-1.5 py-0.5">
                    <Command className="h-3 w-3 mr-1" />
                    <span>K</span>
                  </div>
                </Button>
              </div>
            )}

            {/* Navigation */}
            <ScrollArea className={cn(
              "flex-1",
              isCollapsed ? "px-2 py-2" : "px-4 py-6"
            )}>
              <div className="space-y-1">
                {navItems.map((item, i) => (
                  <React.Fragment key={i}>
                    {item.isDropdown ? (
                      <div className="mb-1">
                        <SidebarItem 
                          item={item}
                          isActive={item.isActive}
                          isCollapsed={isCollapsed}
                          onClick={() => {
                            if (!isCollapsed) {
                              setExpandedMenu(expandedMenu === i ? null : i);
                            }
                          }}
                        />
                        
                        {/* Dropdown menu items */}
                        {!isCollapsed && expandedMenu === i && item.children && (
                          <div className="ml-8 mt-1 space-y-1">
                            {item.children.map((child, j) => (
                              <Link 
                                key={j}
                                to={child.href} 
                                className={cn(
                                  "flex items-center py-2 px-3 text-sm rounded-lg",
                                  child.isActive 
                                    ? "bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100" 
                                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                )}
                                onClick={closeMobileSidebar}
                              >
                                <child.icon className={cn("h-4 w-4 mr-2", child.iconColor)} />
                                <span>{child.title}</span>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <SidebarItem 
                        item={item}
                        isActive={item.isActive}
                        isCollapsed={isCollapsed}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </ScrollArea>

            {/* Footer */}
            {isCollapsed ? (
              <div className="p-2 mt-auto border-t border-zinc-200 dark:border-zinc-800 flex flex-col items-center">
                <UserAvatar size="md" />
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsCollapsed(false)}
                  className="h-9 w-9 mt-2"
                >
                  <ChevronDown className="h-5 w-5 -rotate-90" />
                </Button>
              </div>
            ) : (
              <div className="border-t border-zinc-200 dark:border-zinc-800 p-4">
                <div className="space-y-2">
                  {/* Coins Display */}
                  <div className="flex items-center justify-between px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-900 rounded-lg">
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-amber-500" />
                      <span className="font-medium text-zinc-700 dark:text-zinc-300">Credits: {user.credits}</span>
                    </div>
                  </div>
                  
                  {/* Logout */}
                  <Link to="/logout" className="flex items-center h-10 px-3 text-base text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg">
                    <LogOut className="h-5 w-5 mr-2" />
                    <span className="font-medium">Logout</span>
                  </Link>
                  
                  {/* Theme Toggle */}
                  <div className="flex items-center justify-between px-3 py-2">
                    <div className="flex items-center">
                      <Sun className="h-4 w-4 mr-2 text-zinc-500 dark:text-zinc-400" />
                      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Light mode</span>
                    </div>
                    <ThemeToggle />
                  </div>
                </div>
              </div>
            )}
          </aside>

          {/* Main Content Area */}
          <div className={cn(
            "flex-1 flex flex-col overflow-hidden",
            isMobile && "pt-16"
          )}>
            {/* Desktop Header */}
            {!isMobile && (
              <header className="bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 h-16 flex items-center px-6">
                <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{getCurrentPageTitle()}</h1>
                
                <div className="ml-auto flex items-center gap-3">
                  <Button 
                    variant="outline"
                    className="h-9 flex items-center gap-2 px-3"
                    onClick={openSearch}
                  >
                    <Search className="h-4 w-4 text-zinc-500" />
                    <span className="text-zinc-700 dark:text-zinc-300">Search</span>
                    <span className="text-xs text-zinc-400 border border-zinc-200 dark:border-zinc-700 rounded px-1 py-0.5 flex items-center">
                      <Command className="h-3 w-3 mr-0.5" />
                      <span>K</span>
                    </span>
                  </Button>
                  
                  <Button variant="ghost" size="icon" className="h-10 w-10 relative">
                    <Bell className="h-5 w-5" />
                    {user.unreadNotifications > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                        {user.unreadNotifications}
                      </span>
                    )}
                  </Button>
                  
                  <Separator orientation="vertical" className="h-8 bg-zinc-200 dark:bg-zinc-800" />
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full p-0">
                        <UserAvatar />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel className="flex items-center gap-3 p-3 border-l-4 border-primary">
                        <UserAvatar size="lg" />
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">Credits: {user.credits}</p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={toggleTheme} className="cursor-pointer">
                        {theme === "dark" ? (
                          <>
                            <Sun className="mr-2 h-4 w-4" />
                            Light Mode
                          </>
                        ) : (
                          <>
                            <Moon className="mr-2 h-4 w-4" />
                            Dark Mode
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/logout" className="cursor-pointer text-red-600">
                          <LogOut className="mr-2 h-4 w-4" />
                          Sign Out
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </header>
            )}

            {/* Search Modal */}
            <SearchModal isOpen={isSearchOpen} onClose={closeSearch} />

            {/* Page Content */}
            <main className="flex-1 overflow-auto p-4 bg-zinc-50 dark:bg-zinc-950">
              <div className="min-h-[calc(100vh-2rem)] flex-1 rounded-xl bg-white dark:bg-zinc-900 p-6 border border-zinc-200 dark:border-zinc-800">
                {children}
              </div>
            </main>
          </div>
        </div>
      </SidebarContext.Provider>
    </ThemeContext.Provider>
  );
}