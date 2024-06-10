import { createRoot } from "react-dom/client";
import { HashRouter, Route, Switch } from "react-router-dom";

import { ChakraProvider } from "@chakra-ui/react";
// Custom Chakra theme
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import NotificationPopupContainer from "components/Notification/NotificationPopupContainer";
import AuthLayout from "layouts/Auth";
import DashboardLayout from "layouts/Dashboard";
import "react-international-phone/style.css";
import { StompSessionProvider } from "react-stomp-hooks";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MainRoute from "router/Route/MainRoute";
import PrivateRoute from "router/Route/PrivateRoute";
import { AuthContextProvider } from "store/AuthContext";
import { ESSContextProvider } from "store/ESSContext";
import QueryProvider from "store/QueryProvider";
import { TranslationProvider } from "store/TranslationContext";
import theme from "theme/theme";

const container = document.getElementById("root");

const root = createRoot(container);

root.render(
  <ChakraProvider theme={theme} resetCss={false} position="relative">
    <QueryProvider>
      <StompSessionProvider
        url={`${window.location.origin
          .replace("https://", "wss://")
          .replace("http://", "ws://")}/api/websocket-endpoint`}
      >
        <ESSContextProvider>
          <TranslationProvider>
            <AuthContextProvider>
              <HashRouter>
                <NotificationPopupContainer />
                <Switch>
                  <Route path={`/auth`} component={AuthLayout} />
                  <PrivateRoute
                    path={`/stationnex-card`}
                    component={DashboardLayout}
                  />
                  <MainRoute />
                </Switch>
              </HashRouter>
            </AuthContextProvider>
          </TranslationProvider>
        </ESSContextProvider>
      </StompSessionProvider>
      <ToastContainer />
      <ReactQueryDevtools buttonPosition="bottom-left" initialIsOpen={false} />
    </QueryProvider>
  </ChakraProvider>,
);
