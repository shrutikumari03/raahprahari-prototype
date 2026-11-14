import { createRouter } from '@tanstack/react-router'
import { RouteErrorPage } from '@/components/error-pages'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

// Create a new router instance
export const getRouter = () => {
  const router = createRouter({
    routeTree,
    defaultErrorComponent: RouteErrorPage,
    scrollRestoration: true,
    // From xl the content column scrolls instead of the window (see __root.tsx),
    // so new pages start at its top too.
    scrollToTopSelectors: ['#rp-content'],
    defaultPreloadStaleTime: 0,
  })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
