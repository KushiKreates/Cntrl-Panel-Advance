import React, { useState, useEffect, createContext, useContext } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  Server,
  Coins,
  LogOut,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Settings,
  User,
  ChevronLeft,
  Moon,
  Sun,
  Plus,
  Users,
  Shield,
  BarChart3,
  FileText,
  Bell,
  MessageSquare,
  Flag,
  CreditCard,
  Search,
  Zap,
  Activity,
  Database,
  Lock,
  HelpCircle,
  Command,
  Users2Icon,
} from "lucide-react";
import ssr from "@/lib/ssr";

// Mock user data
const user = {
  name: "Alex Johnson",
  email: "alex@company.com",
  credits: 1250,
  isAdmin: true,
  avatar: "https://ui-avatars.com/api/?name=Alex+Johnson&background=6366f1&color=fff&size=128",
  status: "online"
};

// Enhanced navigation items with better organization
const navItems = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: Home,
        description: "Main dashboard overview"
      },
      {
        title: "Analytics",
        href: "/analytics",
        icon: BarChart3,
        badge: "New",
        badgeVariant: "default",
        description: "View performance metrics"
      },
      {
        title: "Search",
        href: "/search",
        icon: Search,
        shortcut: "⌘K",
        description: "Search across all data"
      },
    ],
  },
  {
    title: "Infrastructure",
    items: [
      {
        title: "Servers",
        href: "/servers",
        icon: Server,
        badge: "3",
        badgeVariant: "secondary",
        description: "Manage your servers",
        subItems: [
          { title: "Production", href: "/servers/production", badge: "2" },
          { title: "Staging", href: "/servers/staging", badge: "1" },
          { title: "Development", href: "/servers/dev" },
        ]
      },
      {
        title: "Database",
        href: "/database",
        icon: Database,
        description: "Database management"
      },
      {
        title: "Monitoring",
        href: "/monitoring",
        icon: Activity,
        badge: "Live",
        badgeVariant: "destructive",
        description: "System monitoring"
      },
    ],
  },
  {
    title: "Business",
    items: [
      {
        title: "Billing",
        href: "/billing",
        icon: CreditCard,
        description: "Manage billing and payments"
      },
      {
        title: "Credits",
        href: "/credits",
        icon: Coins,
        badge: user.credits.toLocaleString(),
        badgeVariant: "outline",
        description: "View credit balance"
      },
    ],
  },
  {
    title: "Community",
    items: [
      {
        title: "Team Members",
        href: "/members",
        icon: Users,
        description: "Manage team members"
      },
      {
        title: "Messages",
        href: "/messages",
        icon: MessageSquare,
        badge: "12",
        badgeVariant: "default",
        description: "Team communications"
      },
      {
        title: "Announcements",
        href: "/announcements",
        icon: Bell,
        description: "Important updates"
      },
    ],
  },
  {
    title: "Security & Admin",
    adminOnly: true,
    items: [
      {
        title: "User Management", 
        href: "/admin/users",
        icon: Users2Icon,
        description: "Manage all users"
      },
      {
        title: "Security Center",
        href: "/admin/security",
        icon: Lock,
        description: "Security settings"
      },
      {
        title: "Reports",
        href: "/admin/reports",
        icon: Flag,
        description: "Generate reports"
      },
      {
        title: "System Settings",
        href: "/admin/settings",
        icon: Settings,
        description: "Configure system"
      },
    ],
  },
];

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
});

// Enhanced sidebar item component
const SidebarItem = ({ item, isCollapsed, level = 0 }) => {
  const currentPath = window.location.pathname || "/dashboard";
  const isActive = currentPath === item.href;
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.subItems && item.subItems.length > 0;


  useEffect(() => {
    if (hasChildren && item.subItems.some(subItem => currentPath === subItem.href)) {
      setIsOpen(true);
    }
  }, [currentPath, hasChildren, item.subItems]);

  const getBadgeVariant = (variant) => {
    switch (variant) {
      case "destructive": return "destructive";
      case "secondary": return "secondary";
      case "outline": return "outline";
      default: return "default";
    }
  };

  if (isCollapsed && level === 0) {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <Button
              variant={isActive ? "secondary" : "ghost"}
              size="icon"
              className={cn(
                "w-full h-12 my-1 relative group transition-all duration-200",
                isActive && "bg-primary/10 text-primary border-r-2 border-primary",
                !isActive && "hover:bg-accent hover:scale-105"
              )}
              onClick={() => {
                if (hasChildren) {
                  setIsOpen(!isOpen);
                } else {
                  console.log(`Navigate to ${item.href}`);
                }
              }}
            >
              <item.icon className={cn("h-5 w-5", isActive && "text-primary")} />
              {item.badge && (
                <Badge 
                  variant={getBadgeVariant(item.badgeVariant)}
                  className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center"
                >
                  {item.badge.length > 2 ? "•" : item.badge}
                </Badge>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{item.title}</span>
              {item.shortcut && (
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  {item.shortcut}
                </kbd>
              )}
            </div>
            {item.description && (
              <p className="text-xs text-muted-foreground">{item.description}</p>
            )}
            {item.badge && (
              <Badge variant={getBadgeVariant(item.badgeVariant)} className="w-fit">
                {item.badge}
              </Badge>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div className="space-y-1">
      <Button
        variant={isActive ? "secondary" : "ghost"}
        className={cn(
          "w-full justify-start h-11 px-3 group transition-all duration-200",
          level > 0 && "ml-4 w-[calc(100%-1rem)]",
          isActive && "bg-primary/10 text-primary border-r-2 border-primary shadow-sm",
          !isActive && "hover:bg-accent hover:translate-x-1"
        )}
        onClick={() => {
          if (hasChildren) {
            setIsOpen(!isOpen);
          } else {
            console.log(`Navigate to ${item.href}`);
          }
        }}
      >
        <div className="flex items-center w-full">
          <item.icon className={cn("h-5 w-5 mr-3", isActive && "text-primary")} />
          <span className="flex-1 text-left font-medium">{item.title}</span>
          
          <div className="flex items-center gap-2">
            {item.shortcut && !hasChildren && (
              <kbd className="pointer-events-none hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                {item.shortcut}
              </kbd>
            )}
            
            {item.badge && (
              <Badge variant={getBadgeVariant(item.badgeVariant)} className="text-xs">
                {item.badge}
              </Badge>
            )}
            
            {hasChildren && (
              <ChevronDown className={cn(
                "h-4 w-4 transition-transform duration-200",
                isOpen && "rotate-180"
              )} />
            )}
          </div>
        </div>
      </Button>
      
      {hasChildren && isOpen && (
        <div className="ml-6 space-y-1 pl-2 border-l border-border/50">
          {item.subItems.map((subItem) => (
            <SidebarItem key={subItem.href} item={subItem} isCollapsed={false} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

// Enhanced user profile component
const UserProfile = ({ isCollapsed }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  
  if (isCollapsed) {
    return (
      <div className="flex flex-col items-center p-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full h-12 w-12 relative group">
              <div className="relative">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-10 w-10 rounded-full ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-200"
                />
                <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 rounded-full border-2 border-background"></div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64" align="end" side="right">
            <DropdownMenuLabel className="flex items-center gap-3 p-3">
              <img src={user.avatar} alt={user.name} className="h-10 w-10 rounded-full" />
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              Preferences
            </DropdownMenuItem>
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
            <DropdownMenuItem className="cursor-pointer">
              <HelpCircle className="mr-2 h-4 w-4" />
              Help & Support
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <div className="p-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="w-full justify-start h-16 px-3 group hover:bg-accent/50">
            <div className="flex items-center space-x-3 w-full">
              <div className="relative">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-11 w-11 rounded-full ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-200"
                />
                <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 rounded-full border-2 border-background"></div>
              </div>
              <div className="text-left overflow-hidden flex-1">
                <p className="text-sm font-semibold truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                <div className="flex items-center gap-1 mt-1">
                  <div className="h-1.5 w-1.5 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-green-600 dark:text-green-400">Online</span>
                </div>
              </div>
              <ChevronDown className="h-4 w-4 opacity-50 group-hover:opacity-100 transition-opacity" />
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64" align="end">
          <DropdownMenuLabel className="flex items-center gap-3 p-3">
            <img src={user.avatar} alt={user.name} className="h-10 w-10 rounded-full" />
            <div>
              <p className="font-medium">{user.name}</p>
              <Badge variant="outline" className="text-xs mt-1">
                {user.credits.toLocaleString()} credits
              </Badge>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            Profile Settings
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            Preferences
          </DropdownMenuItem>
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
          <DropdownMenuItem className="cursor-pointer">
            <HelpCircle className="mr-2 h-4 w-4" />
            Help & Support
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

// Quick actions component
const QuickActions = ({ isCollapsed }) => {
  if (isCollapsed) {
    return (
      <div className="px-2 py-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" className="w-full h-10 bg-primary hover:bg-primary/90">
                <Plus className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Quick Actions</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  }

  return (
    <div className="px-3 py-2">
      <Button className="w-full justify-start gap-2 bg-primary hover:bg-primary/90">
        <Plus className="h-4 w-4" />
        Quick Actions
        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-primary-foreground/20 px-1.5 font-mono text-[10px] font-medium text-primary-foreground">
          ⌘N
        </kbd>
      </Button>
    </div>
  );
};

// Main sidebar layout component
export default function SidebarLayout({ children }) {
  const app = ssr.get("App");
  const Logo = ssr.get("logoUrl");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  // Initialize theme
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // Toggle sidebar collapse
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Filter navigation items based on user role
  const filteredNavItems = navItems.filter(
    (section) => !section.adminOnly || user.isAdmin
  );

  // Mobile layout
  if (isMobile) {
    return (
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <div className="flex h-screen bg-background">
          {/* Mobile header */}
          <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b h-14 flex items-center px-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="h-9 w-9"
            >
              {isMobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
            <h1 className="ml-3 font-semibold">Control Panel</h1>
            <div className="ml-auto flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-9 w-9">
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Mobile sidebar overlay */}
          {isMobileOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-40 mt-14"
              onClick={() => setIsMobileOpen(false)}
            />
          )}

          {/* Mobile sidebar */}
          <div
            className={cn(
              "fixed top-14 left-0 bottom-0 z-50 w-80 bg-background border-r transition-transform duration-300 ease-out",
              isMobileOpen ? "translate-x-0" : "-translate-x-full"
            )}
          >
            <div className="flex flex-col h-full">
              <QuickActions isCollapsed={false} />
              <ScrollArea className="flex-1 px-2">
                <nav className="space-y-6 py-4">
                  {filteredNavItems.map((section) => (
                    <div key={section.title} className="space-y-2">
                      <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {section.title}
                      </h3>
                      <div className="space-y-1">
                        {section.items.map((item) => (
                          <SidebarItem key={item.href} item={item} isCollapsed={false} />
                        ))}
                      </div>
                    </div>
                  ))}
                </nav>
              </ScrollArea>
              <UserProfile isCollapsed={false} />
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 pt-14">
            <main className="p-4 h-full overflow-auto">
              {children || (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Welcome to your Dashboard</h2>
                    <p className="text-muted-foreground">Select an item from the sidebar to get started.</p>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      </ThemeContext.Provider>
    );
  }

  // Desktop layout
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <SidebarContext.Provider value={{ isCollapsed, toggleSidebar, isMobile }}>
        <div className="flex h-screen overflow-hidden bg-background">
          {/* Desktop Sidebar */}
          <div
            className={cn(
              "flex flex-col bg-background border-r transition-all duration-300 ease-out shadow-sm",
              isCollapsed ? "w-16" : "w-72"
            )}
          >
            {/* Logo and collapse button */}
            <div className="flex items-center justify-between p-4 border-b min-h-[4rem]">
              {!isCollapsed && (
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                    <img 
                      src={app?.logoUrl || window.logoUrl}  
                      alt="Logo"
                      
                    />
                  </div>
                  <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    {app?.name}
                  </h1>
                </div>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="h-8 w-8 hover:bg-accent"
              >
                {isCollapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Quick Actions */}
            <QuickActions isCollapsed={isCollapsed} />

            {/* Navigation */}
            <ScrollArea className="flex-1 px-2">
              <nav className="space-y-6 py-4">
                {filteredNavItems.map((section) => (
                  <div key={section.title} className="space-y-2">
                    {!isCollapsed && (
                      <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {section.title}
                      </h3>
                    )}
                    <div className="space-y-1">
                      {section.items.map((item) => (
                        <SidebarItem key={item.href} item={item} isCollapsed={isCollapsed} />
                      ))}
                    </div>
                  </div>
                ))}
              </nav>
            </ScrollArea>

            {/* User Profile */}
            <UserProfile isCollapsed={isCollapsed} />
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Top Bar */}
            <header className="bg-background/95 backdrop-blur-sm border-b h-14 flex items-center px-6 shadow-sm">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold">Dashboard</h2>
              </div>
              
              <div className="ml-auto flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Search className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9 relative">
                  <Bell className="h-4 w-4" />
                  <div className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></div>
                </Button>
                <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-9 w-9">
                  {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
              </div>
            </header>

            {/* Page Content */}
            <main className="flex-1 overflow-auto p-6 bg-muted/20">
              {children || (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Command className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Welcome to your Control Panel</h2>
                    <p className="text-muted-foreground max-w-md">
                      Your enhanced dashboard is ready. Select an item from the sidebar to explore the available features and manage your infrastructure.
                    </p>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      </SidebarContext.Provider>
    </ThemeContext.Provider>
  );
}