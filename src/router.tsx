import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

import { ErrorComponent } from "./components/ErrorComponent";
import { NotFoundComponent } from "./components/NotFoundComponent";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultErrorComponent: ({ error, reset }) => <ErrorComponent error={error} reset={reset} />,
    defaultNotFoundComponent: () => <NotFoundComponent />,
  });

  return router;
};
