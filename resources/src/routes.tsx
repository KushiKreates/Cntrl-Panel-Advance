import Dashboard from './Pages/Home';
import StorePage from './Pages/Store';
import Queue from './Pages/Admin/Queue';
import ServerPage from './Pages/Servers';
import ActivityPage from './Pages/Activity';
import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './router';

import CheckoutPage from './Pages/Checkout';

// Define a human-readable Dashboard route.
export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/home',
  component: Dashboard,
});

// Define a human-readable Store route.
export const storeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/home/store',
  component: StorePage,
});





// Define a human-readable Store route.
export const activityRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/home/activity',
  component: ActivityPage,
});

export const serversRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/home/servers',
  component: ServerPage,
});

export const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  // capture a dynamic “stuff” segment
  path: '/home/checkout/$productId',
  component: CheckoutPage,
});





/**
 * All admin routes are mentioned here
 */
export const adminQueue = createRoute({
  getParentRoute: () => rootRoute,
  path: '/home/admin/queue',
  component: Queue,
  // before loading this route, check userRoles on window
  beforeLoad: async ({ router }) => {
    const roles = (window as any).userRoles as string[] | undefined;
    const hasAccess = roles?.includes('Admin') && roles?.includes('User');
    if (!hasAccess) {
      // redirect to your 404 page
      return { redirect: '/404' };
    }
    return true;
  },
});