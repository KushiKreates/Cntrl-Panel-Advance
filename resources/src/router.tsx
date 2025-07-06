import React, { Suspense } from 'react';
import { 
  createRootRoute,
  createRoute,
  createRouter,
  Outlet
} from '@tanstack/react-router';
import SidebarLayout from './components/Sidebar/sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'
import nprogress from 'nprogress';

// Import NProgress CSS (add this to your main CSS file or import it here)
import 'nprogress/nprogress.css';
import AuthLayout from "./Pages/Layouts/GuestLayout"



const queryClient = new QueryClient()

// Export the rootRoute so other files can import it
export const rootRoute = createRootRoute({
  component: () => (
  <Suspense fallback={<div  className="justify-center items-center"><NadhiLoader/></div>}>
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <SidebarLayout />
      </SidebarProvider>
    </QueryClientProvider>
  </Suspense>
  ),
});

// Change authRoute from a root route to a regular route
export const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auth',
  component: AuthLayout
});



// Import routes from a separate file for readability.
import { activityRoute, adminQueue, checkoutRoute, indexRoute, loginRoute, serversRoute, storeRoute, ticketRoute, ticketRoutes } from './routes';
import NadhiLoader from './components/Loader/Nadhi.dev';

// Create the route tree with human-readable routes.
const routeTree = rootRoute.addChildren([
  indexRoute,
  storeRoute,
  activityRoute,
  adminQueue,
  serversRoute,
  checkoutRoute,
  loginRoute,
  ticketRoute,
  ticketRoutes
]);

// Update the loginRoute definition to use rootRoute as parent


export const router = createRouter({ 
  routeTree,
  defaultPreload: 'intent',
});

// Subscribe to router events for NProgress
router.subscribe('onBeforeLoad', () => {
  nprogress.start();
});

router.subscribe('onLoad', () => {
  nprogress.done();
});

// Optional: Handle navigation errors
router.subscribe('onError', () => {
  nprogress.done();
});

// Register the router for type safety.
declare module '@tanstack/react-router' {
  interface Register {
  router: typeof router;
  }
}