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
  ShoppingBasket,
  Sliders,
  Ticket,
  Gamepad,
  Link,
  ClipboardList,
  UserCheck,
  UserX,
  LucideHand,
  LucideDollarSign,
  LucideToolCase,
} from "lucide-react";
import ssr from "@/lib/ssr";

// Get authenticated user via SSR
const authUser = ssr.get("authUser") || {};
const user = {
  name: authUser.name || "Unknown",
  email: authUser.email || "no-email@example.com",
  credits: authUser.credits || 0,
  serverCount: authUser.server_count || 0,
  serverLimit: authUser.server_limit || 0,
  avatar:
    authUser.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      authUser.name || "User"
    )}&background=6366f1&color=fff&size=128`,
  status: authUser.status || "offline",
  unreadNotifications: authUser.unreadNotifications || 0,
};

// Permissions mapping based on the backend PermissionGroups
const userPermissions = {
  TICKET_PERMISSIONS: true,
  OVERVIEW_PERMISSIONS: true,
  TICKET_ADMIN_PERMISSIONS: true,
  TICKET_BLACKLIST_PERMISSIONS: true,
  ROLES_PERMISSIONS: true,
  SETTINGS_PERMISSIONS: true,
  API_PERMISSIONS: true,
  USERS_PERMISSIONS: true,
  SERVERS_PERMISSIONS: true,
  PRODUCTS_PERMISSIONS: true,
  STORE_PERMISSIONS: true,
  VOUCHERS_PERMISSIONS: true,
  PARTNERS_PERMISSIONS: true,
  COUPONS_PERMISSIONS: true,
  USEFUL_LINKS_PERMISSIONS: true,
  PAYMENTS_PERMISSIONS: true,
  LOGS_PERMISSIONS: true,
};

// Application settings
const appSettings = {
  ticketEnabled: true,
  storeEnabled: true,
};

// Navigation items mapped from main.blade.php
const navItems = [
  {
    title: "User",
    items: [
      {
        title: "Dashboard",
        href: "/home",
        icon: Home,
        description: "View your dashboard"
      },
      {
        title: "Servers",
        href: "/servers",
        icon: Server,
        badge: `${user.serverCount} / ${user.serverLimit}`,
        badgeVariant: "secondary",
        description: "Manage your servers"
      },
      {
        title: "Store",
        href: "/store",
        icon: Coins,
        description: "Purchase items and credits",
        condition: appSettings.storeEnabled
      },
      {
        title: "Support Tickets",
        href: "/ticket",
        icon: Ticket,
        description: "Get help with issues",
        condition: appSettings.ticketEnabled && userPermissions.TICKET_PERMISSIONS
      }
    ],
  },
  {
    title: "Administration",
    adminOnly: true,
    condition: Object.values(userPermissions).some(perm => perm),
    items: [
      {
        title: "Overview",
        href: "/admin/overview",
        icon: Home,
        description: "Admin dashboard",
        condition: userPermissions.OVERVIEW_PERMISSIONS
      },
      {
        title: "Ticket List",
        href: "/admin/ticket",
        icon: Ticket,
        description: "Manage support tickets",
        condition: userPermissions.TICKET_ADMIN_PERMISSIONS
      },
      {
        title: "Ticket Blacklist",
        href: "/admin/ticket/blacklist",
        icon: UserX,
        description: "Manage blacklisted users",
        condition: userPermissions.TICKET_BLACKLIST_PERMISSIONS
      },
      {
        title: "Role Management",
        href: "/admin/roles",
        icon: UserCheck,
        description: "Manage user roles",
        condition: userPermissions.ROLES_PERMISSIONS
      },
      {
        title: "Settings",
        href: "/admin/settings",
        icon: LucideToolCase,
        description: "System settings",
        condition: userPermissions.SETTINGS_PERMISSIONS
      },
      {
        title: "Application API",
        href: "/admin/api",
        icon: Gamepad,
        description: "API management",
        condition: userPermissions.API_PERMISSIONS
      }
    ],
  },
  {
    title: "Management",
    adminOnly: true,
    condition: userPermissions.USERS_PERMISSIONS || userPermissions.SERVERS_PERMISSIONS || userPermissions.PRODUCTS_PERMISSIONS,
    items: [
      {
        title: "Users",
        href: "/admin/users",
        icon: Users,
        description: "Manage users",
        condition: userPermissions.USERS_PERMISSIONS
      },
      {
        title: "Servers",
        href: "/admin/servers",
        icon: Server,
        description: "Manage servers",
        condition: userPermissions.SERVERS_PERMISSIONS
      },
      {
        title: "Products",
        href: "/admin/products",
        icon: Sliders,
        description: "Manage products",
        condition: userPermissions.PRODUCTS_PERMISSIONS
      },
      {
        title: "Store",
        href: "/admin/store",
        icon: ShoppingBasket,
        description: "Manage store",
        condition: userPermissions.STORE_PERMISSIONS
      },
      {
        title: "Vouchers",
        href: "/admin/vouchers",
        icon: CreditCard,
        description: "Manage vouchers",
        condition: userPermissions.VOUCHERS_PERMISSIONS
      },
      {
        title: "Partners",
        href: "/admin/partners",
        icon: LucideHand,
        description: "Manage partners",
        condition: userPermissions.PARTNERS_PERMISSIONS
      },
      {
        title: "Coupons",
        href: "/admin/coupons",
        icon: Ticket,
        description: "Manage coupons",
        condition: userPermissions.COUPONS_PERMISSIONS
      }
    ]
  },
  {
    title: "Other",
    adminOnly: true,
    condition: userPermissions.USEFUL_LINKS_PERMISSIONS,
    items: [
      {
        title: "Useful Links",
        href: "/admin/usefullinks",
        icon: Link,
        description: "Manage useful links",
        condition: userPermissions.USEFUL_LINKS_PERMISSIONS
      }
    ]
  },
  {
    title: "Logs",
    adminOnly: true,
    condition: userPermissions.PAYMENTS_PERMISSIONS || userPermissions.LOGS_PERMISSIONS,
    items: [
      {
        title: "Payments",
        href: "/admin/payments",
        icon: LucideDollarSign,
        description: "View payment logs",
        badge: "New",
        badgeVariant: "success",
        condition: userPermissions.PAYMENTS_PERMISSIONS
      },
      {
        title: "Activity Logs",
        href: "/admin/activitylogs",
        icon: ClipboardList,
        description: "View activity logs",
        condition: userPermissions.LOGS_PERMISSIONS
      }
    ]
  }
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

// Enhanced sidebar item component with Vercel-like styling
const SidebarItem = ({ item, isCollapsed, level = 0 }) => {
  const currentPath = window.location.pathname || "/dashboard";
  const isActive = currentPath === item.href;
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.subItems && item.subItems.length > 0;

  // Check if any children are active to auto-expand parent
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
      case "success": return "default";
      default: return "default";
    }
  };

  // Collapsed state item (icon only)
  if (isCollapsed && level === 0) {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={200}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "w-full h-9 mb-1 relative group",
                isActive ? "bg-primary/10 text-primary" : "text-muted-foreground",
                !isActive && "hover:bg-accent/50 hover:text-foreground"
              )}
              onClick={() => {
                if (hasChildren) {
                  setIsOpen(!isOpen);
                } else {
                  console.log(`Navigate to ${item.href}`);
                }
              }}
            >
              <item.icon className={cn("h-4 w-4", isActive && "text-primary")} />
              {item.badge && (
                <Badge
                  variant={getBadgeVariant(item.badgeVariant)}
                  className="absolute -top-1 -right-1 h-4 w-4 p-0 text-[10px] flex items-center justify-center"
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
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
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

  // Expanded state item (full width)
  return (
    <div className="space-y-px">
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start h-9 px-2 group text-sm",
          level > 0 && "ml-4 w-[calc(100%-1rem)]",
          isActive ? "bg-primary/8 text-primary font-medium" : "text-muted-foreground font-normal",
          !isActive && "hover:bg-accent/40 hover:text-foreground"
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
          <item.icon className={cn("h-4 w-4 mr-2", isActive ? "text-primary" : "text-muted-foreground")} />
          <span className={cn("flex-1 text-left truncate", isActive && "font-medium")}>{item.title}</span>
          
          <div className="flex items-center gap-2">
            {item.shortcut && !hasChildren && (
              <kbd className="pointer-events-none hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                {item.shortcut}
              </kbd>
            )}
            
            {item.badge && (
              <Badge variant={getBadgeVariant(item.badgeVariant)} className="text-[10px] py-0 px-1">
                {item.badge}
              </Badge>
            )}
            
            {hasChildren && (
              <ChevronDown className={cn(
                "h-3.5 w-3.5 text-muted-foreground transition-transform duration-200",
                isOpen && "rotate-180"
              )} />
            )}
          </div>
        </div>
      </Button>
      
      {hasChildren && isOpen && (
        <div className="space-y-px ml-2 pl-2 border-l border-border/30">
          {item.subItems.map((subItem) => (
            <SidebarItem key={subItem.href} item={{...subItem, icon: subItem.icon || item.icon}} isCollapsed={false} level={level + 1} />
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
      <div className="flex flex-col items-center p-2 mt-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 relative group p-0">
              <div className="relative">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-8 w-8 rounded-full ring-1 ring-border group-hover:ring-primary/30 transition-all duration-200"
                />
                <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 bg-green-500 rounded-full border-2 border-background"></div>
                {user.unreadNotifications > 0 && (
                  <div className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-destructive rounded-full border-2 border-background flex items-center justify-center text-[10px] font-bold text-white">
                    {user.unreadNotifications}
                  </div>
                )}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" side="right" forceMount>
            <DropdownMenuLabel className="flex items-center gap-3 p-3">
              <img src={user.avatar} alt={user.name} className="h-9 w-9 rounded-full" />
              <div>
                <p className="font-medium text-sm">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-sm py-1.5">
              <User className="mr-2 h-3.5 w-3.5" />
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-sm py-1.5 relative">
              <Bell className="mr-2 h-3.5 w-3.5" />
              Notifications
              {user.unreadNotifications > 0 && (
                <Badge variant="destructive" className="ml-auto">
                  {user.unreadNotifications}
                </Badge>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={toggleTheme} className="cursor-pointer text-sm py-1.5">
              {theme === "dark" ? (
                <>
                  <Sun className="mr-2 h-3.5 w-3.5" />
                  Light Mode
                </>
              ) : (
                <>
                  <Moon className="mr-2 h-3.5 w-3.5" />
                  Dark Mode
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-sm py-1.5">
              <HelpCircle className="mr-2 h-3.5 w-3.5" />
              Help & Support
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-sm py-1.5 text-red-600 focus:text-red-600">
              <LogOut className="mr-2 h-3.5 w-3.5" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <div className="p-2 mt-auto border-t border-border/40">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="w-full justify-start h-12 px-2 py-1.5 group hover:bg-accent/40 rounded-md">
            <div className="flex items-center space-x-3 w-full">
              <div className="relative">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-8 w-8 rounded-full ring-1 ring-border group-hover:ring-primary/30 transition-all duration-200"
                />
                <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 bg-green-500 rounded-full border-2 border-background"></div>
                {user.unreadNotifications > 0 && (
                  <div className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-destructive rounded-full border-2 border-background flex items-center justify-center text-[10px] font-bold text-white">
                    {user.unreadNotifications}
                  </div>
                )}
              </div>
              <div className="text-left overflow-hidden flex-1">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground opacity-50 group-hover:opacity-100 transition-opacity" />
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <div className="flex items-center justify-between px-3 pt-2 pb-1">
            <div className="space-y-0.5">
              <p className="font-medium text-sm">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <Badge variant="outline" className="text-xs">
              {user.credits.toLocaleString()} credits
            </Badge>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer text-sm py-1.5">
            <User className="mr-2 h-3.5 w-3.5" />
            Profile Settings
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer text-sm py-1.5 relative">
            <Bell className="mr-2 h-3.5 w-3.5" />
            Notifications
            {user.unreadNotifications > 0 && (
              <Badge variant="destructive" className="ml-auto">
                {user.unreadNotifications}
              </Badge>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer text-sm py-1.5">
            <Settings className="mr-2 h-3.5 w-3.5" />
            Preferences
          </DropdownMenuItem>
          <DropdownMenuItem onClick={toggleTheme} className="cursor-pointer text-sm py-1.5">
            {theme === "dark" ? (
              <>
                <Sun className="mr-2 h-3.5 w-3.5" />
                Light Mode
              </>
            ) : (
              <>
                <Moon className="mr-2 h-3.5 w-3.5" />
                Dark Mode
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer text-sm py-1.5">
            <HelpCircle className="mr-2 h-3.5 w-3.5" />
            Help & Support
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer text-sm py-1.5 text-red-600 focus:text-red-600">
            <LogOut className="mr-2 h-3.5 w-3.5" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

// Enhanced Quick Actions component
const QuickActions = ({ isCollapsed }) => {
  if (isCollapsed) {
    return (
      <div className="px-2 py-2 border-b border-border/30">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <TooltipProvider>
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <Button size="icon" className="w-full h-9 bg-primary/90 hover:bg-primary shadow-sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="text-xs">
                  <p>Quick Actions</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" className="w-56">
            <DropdownMenuItem className="cursor-pointer text-sm py-1.5">
              <Server className="mr-2 h-3.5 w-3.5" />
              Create New Server
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-sm py-1.5">
              <Ticket className="mr-2 h-3.5 w-3.5" />
              Open Support Ticket
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-sm py-1.5">
              <CreditCard className="mr-2 h-3.5 w-3.5" />
              Redeem Voucher Code
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <div className="p-2 border-b border-border/30">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="w-full justify-between bg-primary/90 hover:bg-primary shadow-sm h-9 px-3 text-sm">
            <div className="flex items-center gap-2">
              <Plus className="h-3.5 w-3.5" />
              <span>Quick Actions</span>
            </div>
            <ChevronDown className="h-3.5 w-3.5 opacity-70" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem className="cursor-pointer text-sm py-1.5">
            <Server className="mr-2 h-3.5 w-3.5" />
            Create New Server
            <span className="ml-auto text-xs text-muted-foreground">{user.serverCount}/{user.serverLimit}</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer text-sm py-1.5">
            <Ticket className="mr-2 h-3.5 w-3.5" />
            Open Support Ticket
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer text-sm py-1.5">
            <CreditCard className="mr-2 h-3.5 w-3.5" />
            Redeem Voucher Code
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer text-sm py-1.5">
            <Coins className="mr-2 h-3.5 w-3.5" />
            Purchase Credits
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
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
  
  // Check admin status based on window.userRoles - more inclusive check
  const isAdmin = window.userRoles && 
    (window.userRoles.includes("admin") || 
     window.userRoles.includes("Admin") || 
     window.userRoles.includes("ADMIN") || 
     window.userRoles.some(role => role.toLowerCase().includes("admin")));
  
  const [activePath, setActivePath] = useState("/dashboard");

  // Check if mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
      // Auto-collapse sidebar on medium screens
      if (window.innerWidth < 1024 && window.innerWidth >= 768) {
        setIsCollapsed(true);
      }
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

  // Get current page title
  const getCurrentPageTitle = () => {
    const currentPath = window.location.pathname || "/dashboard";
    for (const section of navItems) {
      for (const item of section.items) {
        if (item.condition !== false && item.href === currentPath) return item.title;
        if (item.subItems) {
          for (const subItem of item.subItems) {
            if (subItem.condition !== false && subItem.href === currentPath) return subItem.title;
          }
        }
      }
    }
    return "Dashboard";
  };

  // Filter navigation items based on conditions and admin status from window.userRoles
  const filteredNavItems = navItems
    .filter(section => {
      // If user is admin, show all admin sections
      if (isAdmin && section.adminOnly) return true;
      // Otherwise filter as normal
      return (section.condition !== false) && (!section.adminOnly || isAdmin);
    })
    .map(section => ({
      ...section,
      items: section.items.filter(item => item.condition !== false)
    }))
    .filter(section => section.items.length > 0);

  // Mobile layout
  if (isMobile) {
    return (
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <div className="flex h-screen bg-background text-foreground">
          {/* Mobile header */}
          <div className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm border-b h-14 flex items-center px-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="h-8 w-8 text-muted-foreground"
            >
              {isMobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
            <div className="ml-3 flex items-center">
              <div className="h-7 w-7 bg-primary/10 rounded-md flex items-center justify-center mr-2">
                <img 
                  src={app?.logoUrl || window.logoUrl} 
                  alt="Logo" 
                  className="h-4 w-4"
                />
              </div>
              <h1 className="font-medium text-sm">{getCurrentPageTitle()}</h1>
            </div>
            <div className="ml-auto flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                <Search className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground relative">
                <Bell className="h-4 w-4" />
                {user.unreadNotifications > 0 && (
                  <div className="absolute top-1.5 right-1.5 h-1.5 w-1.5 bg-red-500 rounded-full"></div>
                )}
              </Button>
              <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-8 w-8 text-muted-foreground">
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
              "fixed top-14 left-0 bottom-0 z-50 w-64 bg-background border-r transition-transform duration-200 ease-out",
              isMobileOpen ? "translate-x-0" : "-translate-x-full"
            )}
          >
            <div className="flex flex-col h-full">
              <QuickActions isCollapsed={false} />
              <ScrollArea className="flex-1">
                <nav className="py-2">
                  {filteredNavItems.map((section, idx) => (
                    <div key={section.title} className={cn("py-2", idx > 0 && "mt-1")}>
                      <h3 className="px-3 text-xs font-medium text-muted-foreground mb-1">
                        {section.title}
                      </h3>
                      <div className="space-y-px">
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
                  <div className="text-center px-4">
                    <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Command className="h-6 w-6 text-primary" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">Welcome to your Control Panel</h2>
                    <p className="text-muted-foreground text-sm">
                      Select an item from the menu to get started with managing your infrastructure.
                    </p>
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
        <div className="flex h-screen overflow-hidden bg-background text-foreground">
          {/* Desktop Sidebar */}
          <aside
            className={cn(
              "flex flex-col bg-background border-r transition-all duration-200 ease-out",
              isCollapsed ? "w-[60px]" : "w-[240px]"
            )}
          >
            {/* Logo and collapse button */}
            <div className="flex items-center justify-between px-2 h-14 border-b">
              {!isCollapsed && (
                <div className="flex items-center gap-2 pl-1.5">
                  <div className="h-7 w-7 bg-primary/10 rounded-md flex items-center justify-center">
                    <img 
                      src={app?.logoUrl || window.logoUrl} 
                      alt="Logo" 
                      className="h-4 w-4"
                    />
                  </div>
                  <h1 className="text-sm font-semibold tracking-tight">
                    {app?.name || "Control Panel"}
                  </h1>
                </div>
              )}
              {isCollapsed && (
                <div className="mx-auto pt-3">
                  <div className="h-7 w-7 bg-primary/10 rounded-md flex items-center justify-center">
                    <img 
                      src={app?.logoUrl || window.logoUrl} 
                      alt="Logo" 
                      className="h-4 w-4"
                    />
                  </div>
                </div>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className={cn(
                  "h-7 w-7 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent/50",
                  isCollapsed && "mx-auto mt-2"
                )}
              >
                {isCollapsed ? (
                  <ChevronRight className="h-3.5 w-3.5" />
                ) : (
                  <ChevronLeft className="h-3.5 w-3.5" />
                )}
              </Button>
            </div>

            {/* Quick Actions */}
            <QuickActions isCollapsed={isCollapsed} />

            {/* Navigation */}
            <ScrollArea className="flex-1">
              <nav className={cn("py-2", isCollapsed ? "px-1" : "px-2")}>
                {filteredNavItems.map((section, idx) => (
                  <div key={section.title} className={cn("py-2", idx > 0 && "mt-1")}>
                    {!isCollapsed && (
                      <h3 className="px-2 text-xs font-medium text-muted-foreground mb-1">
                        {section.title}
                      </h3>
                    )}
                    <div className="space-y-px">
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
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Top Bar */}
            <header className="bg-background border-b h-14 flex items-center px-4 gap-4">
              <div className="flex items-center">
                <h2 className="text-sm font-medium">{getCurrentPageTitle()}</h2>
              </div>
              
              <div className="ml-auto flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                  <Search className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground relative">
                  <Bell className="h-4 w-4" />
                  {user.unreadNotifications > 0 && (
                    <div className="absolute top-1.5 right-1.5 h-1.5 w-1.5 bg-red-500 rounded-full"></div>
                  )}
                </Button>
                <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-8 w-8 text-muted-foreground">
                  {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
                <Separator orientation="vertical" className="h-6 mx-1" />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 p-0">
                      <img 
                        src={user.avatar} 
                        alt={user.name} 
                        className="h-7 w-7 rounded-full border border-border"
                      />
                      {user.unreadNotifications > 0 && (
                        <div className="absolute -top-0.5 -right-0.5 h-3 w-3 bg-destructive rounded-full border-2 border-background"></div>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="flex items-center gap-3 p-3">
                      <img src={user.avatar} alt={user.name} className="h-9 w-9 rounded-full" />
                      <div>
                        <p className="font-medium text-sm">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer text-sm py-1.5">
                      <User className="mr-2 h-3.5 w-3.5" />
                      Profile Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer text-sm py-1.5 relative">
                      <Bell className="mr-2 h-3.5 w-3.5" />
                      Notifications
                      {user.unreadNotifications > 0 && (
                        <Badge variant="destructive" className="ml-auto">
                          {user.unreadNotifications}
                        </Badge>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer text-sm py-1.5 text-red-600 focus:text-red-600">
                      <LogOut className="mr-2 h-3.5 w-3.5" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </header>

            {/* Page Content */}
            <main className="flex-1 overflow-auto p-6 bg-muted/5">
              {children || (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center max-w-md">
                    <div className="h-14 w-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Command className="h-7 w-7 text-primary" />
                    </div>
                    <h2 className="text-xl font-semibold mb-3">Welcome to your Control Panel</h2>
                    <p className="text-muted-foreground text-sm">
                      Your workspace is ready. Select an item from the sidebar to explore available features and manage your infrastructure efficiently.
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