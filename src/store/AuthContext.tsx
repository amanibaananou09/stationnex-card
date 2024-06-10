import React, { useCallback, useContext, useEffect, useState } from "react";

import { User } from "common/model";
import { AuthContextProps, AuthContextProviderProps } from "common/react-props";
import { decodeToken } from "utils/utils";
import { useESSContext } from "./ESSContext";

export const AuthContext = React.createContext<AuthContextProps>({
  token: null,
  isSignedIn: false,
  user: null,
  customerId: 0,
  signIn: (user, customerId) => {},
  signOut: () => {},
});

let firstLoad = true;

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [user, setUser] = useState<User | null>(
    decodeToken(localStorage.getItem("stationnex-card")) || null,
  );
  const [customerId, setCustomerId] = useState<number>(
    Number(localStorage.getItem("customerId")) || 0,
  );
  const isSignedIn = !!user;

  const { clearContext } = useESSContext();

  const signInHandler = useCallback((user: User, customerId: number) => {
    setUser(user);
    setCustomerId(customerId || 0);
    localStorage.setItem("customerId", String(customerId || 0));
  }, []);

  const signOutHandler = useCallback(() => {
    setUser(null);
    setCustomerId(0);
    localStorage.removeItem("stationnex-card");
    localStorage.removeItem("customerId");
    clearContext();
  }, []);

  useEffect(() => {
    let signOutTimer: NodeJS.Timeout;

    if (user && user.expireTime) {
      const remainingTime = new Date(
        +user.expireTime - new Date().getTime(),
      ).getTime();
      if (remainingTime <= 0) {
        signOutHandler();
      }
      signOutTimer = setTimeout(() => {
        signOutHandler();
      }, remainingTime);
    }

    if (firstLoad) {
      firstLoad = false;
      return;
    }

    if (user && user.token) {
      localStorage.setItem("stationnex-card", user.token);
    } else {
      localStorage.removeItem("stationnex-card");
    }

    return () => {
      signOutTimer && clearTimeout(signOutTimer);
    };
  }, [user, signOutHandler]);

  const contextValue: AuthContextProps = {
    user: user,
    isSignedIn,
    signIn: signInHandler,
    signOut: signOutHandler,
    token: null,
    customerId: customerId,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
