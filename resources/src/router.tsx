import { 
    createRootRoute,
    createRoute,
    createRouter
} from '@tanstack/react-router';
import SidebarLayout from './components/Sidebar/sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'


const queryClient = new QueryClient()

// Export the rootRoute so other files can import it
export const rootRoute = createRootRoute({
  component: () => (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
      <SidebarLayout />
    </SidebarProvider>
    </QueryClientProvider>
    
  ),
});

// Import routes from a separate file for readability.
import { activityRoute, adminQueue, checkoutRoute, indexRoute, serversRoute, storeRoute } from './routes';

// Create the route tree with human-readable routes.
const routeTree = rootRoute.addChildren([
  indexRoute,
  storeRoute,
  activityRoute,
  adminQueue,
  serversRoute,
  checkoutRoute
]);

export const router = createRouter({ 
  routeTree,
  defaultPreload: 'intent',
});

// Register the router for type safety.
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}