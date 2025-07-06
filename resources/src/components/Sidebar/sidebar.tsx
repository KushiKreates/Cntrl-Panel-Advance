import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from "react";
import { Link, useRouter, Outlet } from "@tanstack/react-router";
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
  IconHome,
  IconServer,
  IconLogout,
  IconChevronDown,
  IconMenu2,
  IconX,
  IconSettings,
  IconUser,
  IconMoon,
  IconSun,
  IconCoins,
  IconCrown,
  IconChartBar,
  IconBell,
  IconSearch,
  IconCommand,
  IconDeviceDesktop,
  IconKey,
  IconShoppingBag,
  IconHandCoins,
  IconSettings2,
  IconRadio,
  IconServerCog,
  IconShoppingCart,
  IconCurrencyDollar,
  IconServer2,
  IconChevronRight,
  IconChevronLeft,
  IconTicket,
} from "@tabler/icons-react";
import ssr from "@/lib/ssr";
import useSearch from "@/hooks/usesearch";

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
          <IconSearch className="h-5 w-5 text-zinc-400 mr-3" />
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

// Sidebar Item Component - Fixed version
const SidebarItem = ({ item, isActive, isCollapsed, onClick, children }) => {
  const { closeMobileSidebar } = useContext(SidebarContext);
  const router = useRouter();
  
  // This handles dropdown toggles
  const handleDropdownToggle = (e) => {
    e.preventDefault();
    if (onClick) {
      onClick();
    }
    closeMobileSidebar();
  };
  
  // This handles direct navigation
  const handleNavigation = () => {
    console.log("Navigating to:", item.href);
    router.navigate({ to: item.href });
    closeMobileSidebar();
  };

  // For collapsed view
  if (isCollapsed) {
    return (
      <Link 
        to={item.href || "/"}
        className="block w-full"
        onClick={onClick ? handleDropdownToggle : handleNavigation}
      >
        <div className={cn(
          "w-full h-11 relative mb-1 flex items-center justify-center",
          isActive 
            ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900" 
            : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
        )}>
          <item.icon className={cn("h-5 w-5", item.iconColor)} />
          {item.badge && (
            <Badge
              className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center p-0 text-[10px]"
            >
              {item.badge}
            </Badge>
          )}
        </div>
      </Link>
    );
  }

  // For regular items with links (not dropdowns)
  if (item.href && !onClick) {
    return (
      <Link 
        to={item.href}
        className="block w-full"
        onClick={handleNavigation}
      >
        <div className={cn(
          "w-full justify-start h-10 px-3 text-base rounded-lg flex items-center",
          isActive
            ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900" 
            : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
        )}>
          <item.icon className={cn("h-5 w-5 mr-2", item.iconColor)} />
          <span className="flex-1 text-left font-medium">{item.title}</span>
          {item.badge && <Badge className="ml-auto">{item.badge}</Badge>}
        </div>
      </Link>
    );
  }

  // For dropdown headers
  return (
    <div className="w-full">
      <button
        className={cn(
          "w-full justify-start h-10 px-3 text-base rounded-lg flex items-center",
          isActive
            ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900" 
            : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
        )}
        onClick={handleDropdownToggle}
      >
        <item.icon className={cn("h-5 w-5 mr-2", item.iconColor)} />
        <span className="flex-1 text-left font-medium">{item.title}</span>
        {item.badge && <Badge className="ml-auto">{item.badge}</Badge>}
        {onClick && (
          <IconChevronDown className={cn(
            "h-4 w-4 transition-transform",
            isActive ? "transform rotate-180" : ""
          )} />
        )}
      </button>
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

// Custom Search Trigger Component
const CustomSearchTrigger = ({ onClick }) => {
  return (
    <div
      className={cn(
        "relative flex items-center rounded-lg border transition-colors cursor-pointer",
        "border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900",
        "hover:border-zinc-300 dark:hover:border-zinc-600"
      )}
      onClick={onClick}
    >
      <IconSearch className="absolute left-3 h-4 w-4 text-zinc-400 dark:text-zinc-500" />
      <div 
        className="h-9 pl-9 pr-4 py-2 w-full text-sm text-zinc-400 dark:text-zinc-500 flex items-center justify-between"
      >
        <span>Search...</span>
        <span className="text-xs border border-zinc-200 dark:border-zinc-700 rounded px-1.5 py-0.5 flex items-center">
          <IconCommand className="h-3 w-3 mr-1" />
          <span>K</span>
        </span>
      </div>
    </div>
  );
};

// Main sidebar layout component
export default function SidebarLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const user = getUserData();

  const { 
    isOpen: isSearchHookOpen, 
    openSearch, 
    closeSearch, 
    SearchComponent: HookSearchComponent 
  } = useSearch();

  const router = useRouter();
  const pathname = router.state.location.pathname;

  // Check if current route is login
  const isLoginPage = pathname === "/login";

  // If we're on the login page, only render the Outlet without sidebar
  if (isLoginPage) {
    return (
      <>
        <div className="dark:bg-black bg-white min-h-screen">
          <Outlet />
        </div>
      </>
    );
  }

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
    if (pathname === "/home") return "Dashboard";
    if (pathname.startsWith("/home/store")) return "Store";
    if (pathname.startsWith("/home/tickets")) return "ticket";
    if (pathname.startsWith("/home/servers")) return "Servers";
    if (pathname.startsWith("/ticket")) return "Support";
    if (pathname.startsWith("/admin")) return "Admin";
    if (pathname.startsWith("/broadcast/india")) return "India Broadcast";
    if (pathname.startsWith("/broadcast/uk")) return "UK Broadcast";
    if (pathname.match("home/admin/queue")) return "admin-queue";
    return "Dashboard";
  };
    
  // Get current active tab
  const getCurrentTab = () => {
    if (pathname === "/home") return "home";
    if (pathname == "/home/tickets") return "ticket";
    if (pathname === "/home/store") return "store";
    if (pathname === "/servers") return "panel";
    if (pathname === "/home/servers") return "Servers";
    if (pathname === "/shop") return "coinshop";
    if (pathname === "/earn") return "earn";
    if (pathname === "/profile") return "profile";
    if (pathname.startsWith("/broadcast/india")) return "broadcast-india";
    if (pathname.startsWith("/broadcast/uk")) return "broadcast-uk";
    if (pathname == "/admin") return "admin";
    if (pathname.match("/home/admin/queue")) return "admin-queue";
   
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
      icon: IconHome,
      isActive: activeTab === "home"
    },
    {
      title: "Store",
      href: "/home/store",
      icon: IconShoppingCart,
      isActive: activeTab === "store"
    },
    {
      title: "Servers",
      href: "/home/servers",
      icon: IconServer2,
      isActive: activeTab === "Servers"
    },
    {
      title: "Tickets",
      href: "/home/tickets",
      icon: IconTicket,
      isActive: activeTab === "ticket"
    },
  ];
    
  // Add admin panel if user is admin
  if (user.isAdmin) {
    navItems.push({
      title: "Admin",
      href: "/admin",
      icon: IconSettings2,
      iconColor: "text-red-500",
      isActive: activeTab === "admin"
    });
    navItems.push({
      title: "Queue",
      href: "/home/admin/queue",
      icon: IconSettings2,
      iconColor: "text-red-500",
      isActive: activeTab === "admin-queue"
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
                {isMobileOpen ? <IconX className="h-5 w-5" /> : <IconMenu2 className="h-5 w-5" />}
              </Button>
              <div className="flex items-center ml-3">
                <img src="/logo.svg" alt="Logo" className="h-8 w-8 mr-2" />
                <h1 className="font-semibold text-lg">{getCurrentPageTitle()}</h1>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={openSearch} className="h-10 w-10">
                  <IconSearch className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-10 w-10">
                  {theme === 'dark' ? <IconSun className="h-5 w-5" /> : <IconMoon className="h-5 w-5" />}
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
                        <IconLogout className="mr-2 h-4 w-4" />
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
          <aside className={cn(
            "flex flex-col bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 transition-all duration-300",
            isMobile 
              ? cn("fixed top-16 left-0 bottom-0 z-40 w-72 transform", isMobileOpen ? "translate-x-0" : "-translate-x-full")
              : cn(isCollapsed ? "w-[72px]" : "w-[280px]")
          )}>
            {/* Logo and desktop header */}
            {!isMobile && (
              <div className={cn("flex items-center border-b border-zinc-200 dark:border-zinc-800 h-16", isCollapsed ? "justify-center px-3" : "px-6")}>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                    <img src="/logo.svg" alt="Logo" className="h-6 w-6" />
                  </div>
                  {!isCollapsed && (
                    <div>
                      <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Dashboard</h2>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">{user.isAdmin ? 'Administration' : 'Hobby'}</p>
                    </div>
                  )}
                </div>
  
                {!isCollapsed && (
                  <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(true)} className="h-9 w-9 ml-auto">
                    <IconChevronLeft className="h-5 w-5" />
                  </Button>
                )}
              </div>
            )}
  
            {/* Desktop Search Bar */}
            {!isMobile && !isCollapsed && (
              <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
                <CustomSearchTrigger onClick={openSearch} />
              </div>
            )}
  
            {/* Navigation */}
            <ScrollArea className={cn("flex-1", isCollapsed ? "px-2 py-2" : "px-4 py-6")}>
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

            {isCollapsed ? (
              <div className="p-2 mt-auto border-t border-zinc-200 dark:border-zinc-800 flex flex-col items-center space-y-3">
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsCollapsed(false)}
                  className="h-9 w-9 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                  title="Expand sidebar"
                >
                  <IconChevronRight className="h-5 w-5" />
                </Button>
              </div>
            ) : null}
              
  
            {/* Footer */}
            {isCollapsed ? (
              <div className="p-2 mt-auto border-t border-zinc-200 dark:border-zinc-800 flex flex-col items-center space-y-3">
                <UserAvatar size="md" />
                
              </div>
            ) : (
              <div className="border-t border-zinc-200 dark:border-zinc-800 p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-900 rounded-lg">
                    <div className="flex items-center">
                      <IconCurrencyDollar className="h-4 w-4 mr-2 text-amber-500" />
                      <span className="font-medium text-zinc-700 dark:text-zinc-300">Credits: {user.credits}</span>
                    </div>
                  </div>
                  <Link to="/logout" className="flex items-center h-10 px-3 text-base text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg">
                    <IconLogout className="h-5 w-5 mr-2" />
                    <span className="font-medium">Logout</span>
                  </Link>
                  <div className="flex items-center justify-between px-3 py-2">
                    <div className="flex items-center">
                      <IconSun className="h-4 w-4 mr-2 text-zinc-500 dark:text-zinc-400" />
                      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Light mode</span>
                    </div>
                    <ThemeToggle />
                  </div>
                </div>
              </div>
            )}
          </aside>
  
          {/* Main Content */}
          <div className={cn("flex-1 flex flex-col overflow-hidden", isMobile && "pt-16")}>
            {/* Desktop Header */}
            {!isMobile && (
              <header className="bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 h-16 flex items-center px-6">
                <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{getCurrentPageTitle()}</h1>
                <div className="ml-auto flex items-center gap-3">
                  
                  <Button variant="ghost" size="icon" className="h-10 w-10 relative">
                    <IconBell className="h-5 w-5" />
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
                            <IconSun className="mr-2 h-4 w-4" />
                            Light Mode
                          </>
                        ) : (
                          <>
                            <IconMoon className="mr-2 h-4 w-4" />
                            Dark Mode
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/logout" className="cursor-pointer text-red-600">
                          <IconLogout className="mr-2 h-4 w-4" />
                          Sign Out
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </header>
            )}
  
            {/* Render the hook's SearchComponent (modal) here */}
            {HookSearchComponent ? (
              <HookSearchComponent />
            ) : (
              <SearchModal isOpen={isSearchOpen} onClose={closeSearch} />
            )}
  
            {/* Page Content */}
            <main className="flex-1 overflow-auto p-4 bg-zinc-50 dark:bg-zinc-950">
              <div className="min-h-[calc(100vh-2rem)] flex-1 rounded-xl bg-white dark:bg-zinc-900 p-6 border border-zinc-200 dark:border-zinc-800">
                <Outlet /> {/* This renders the active route's component */}
              </div>
            </main>
          </div>
        </div>
      </SidebarContext.Provider>
    </ThemeContext.Provider>
  );
}