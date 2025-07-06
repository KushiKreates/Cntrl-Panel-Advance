import { createRoute, lazyRouteComponent } from '@tanstack/react-router';
import { rootRoute } from './router';

// All routes using lazyRouteComponent (default exports)
export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/home',
  component: lazyRouteComponent(() => import('./Pages/Home')),
});

export const storeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/home/store',
  component: lazyRouteComponent(() => import('./Pages/Store')),
});

export const activityRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/home/activity',
  component: lazyRouteComponent(() => import('./Pages/Activity')),
});

export const serversRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/home/servers',
  component: lazyRouteComponent(() => import('./Pages/Servers')),
});

export const ticketRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/home/tickets',
  component: lazyRouteComponent(() => import('./Pages/Ticket')),
});

export const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/home/checkout/$productId',
  component: lazyRouteComponent(() => import('./Pages/Checkout')),
});


export const ticketRoutes = createRoute({
  getParentRoute: () => rootRoute,
  path: '/home/tickets/$ticketId',
  component: lazyRouteComponent(() => import('./Pages/Tickets-view')),
});



// Login page
export const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: lazyRouteComponent(() => import('./Pages/Auth/login')),
});

// Admin queue with beforeLoad access control
export const adminQueue = createRoute({
  getParentRoute: () => rootRoute,
  path: '/home/admin/queue',
  component: lazyRouteComponent(() => import('./Pages/Admin/Queue')),
  beforeLoad: async () => {
    const roles = (window as any).userRoles as string[] | undefined;
    const hasAccess = roles?.includes('Admin') && roles?.includes('User');
    if (!hasAccess) {
      return { redirect: '/404' };
    }
    return true;
  },
});
