import { Layout } from "common/enums";
import { RouteConfig } from "common/model";
import { Route } from "react-router-dom";
import { useAuth } from "store/AuthContext";

const useRoutes = () => {
  const { isSignedIn } = useAuth();

  const getActiveRoute = (routes: RouteConfig[]): string => {
    let activeRoute = "Default Brand Text";
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse) {
        let collapseActiveRoute = getActiveRoute(routes[i].views ?? []);
        if (collapseActiveRoute !== activeRoute) {
          return collapseActiveRoute;
        }
      } else if (routes[i].category) {
        let categoryActiveRoute = getActiveRoute(routes[i].views ?? []);
        if (categoryActiveRoute !== activeRoute) {
          return categoryActiveRoute;
        }
      } else {
        if (
          window.location.href.indexOf(
            (routes[i].layout ?? "") + (routes[i].path ?? ""),
          ) !== -1
        ) {
          return routes[i].name ?? activeRoute;
        }
      }
    }
    return activeRoute;
  };
  // This changes navbar state(fixed or not)
  const getActiveNavbar = (routes: RouteConfig[]): boolean => {
    let activeNavbar = false;
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].category) {
        let categoryActiveNavbar = getActiveNavbar(routes[i].views ?? []);
        if (categoryActiveNavbar !== activeNavbar) {
          return categoryActiveNavbar;
        }
      } else {
        if (
          window.location.href.indexOf(
            (routes[i].layout ?? "") + (routes[i].path ?? ""),
          ) !== -1
        ) {
          if (routes[i].secondaryNavbar) {
            return routes[i].secondaryNavbar ?? false;
          }
        }
      }
    }
    return activeNavbar;
  };
  const getReactRoutes = (routes: RouteConfig[], layout: Layout): any => {
    return routes.reduce(
      (allRoutes: JSX.Element[], route: RouteConfig, key: number) => {
        if (
          (layout === Layout.AUTH && !isSignedIn) ||
          (layout === Layout.STATIONNEX && isSignedIn)
        ) {
          if (route.views && route.views.length > 0) {
            // If there are subroutes, recursively call getReactRoutes
            const subRoutes = getReactRoutes(route.views, layout);
            allRoutes.push(...subRoutes);
          }

          // Always include the main route
          allRoutes.push(
            <Route
              path={(route.layout ?? "") + (route.path ?? "")}
              component={route.component}
              key={key}
            />,
          );
        }

        return allRoutes;
      },
      [],
    );
  };

  return { getActiveRoute, getActiveNavbar, getReactRoutes };
};

export default useRoutes;
