import { Station } from "common/model";
import { ESSContextProps } from "common/react-props";
import React, { useContext, useEffect, useState } from "react";

const ESSContext = React.createContext<ESSContextProps>({
  station: null,
  stationId: 0,
  customerAccountId: 0,
  isLoading: false,
  selectStation: () => {},
  clearContext: () => {},
});

interface ESSContextProviderProps {
  children: React.ReactNode;
}

export const ESSContextProvider = ({ children }: ESSContextProviderProps) => {
  const storedValue: string | null = localStorage.getItem("ess");
  const selected: Station | null = storedValue ? JSON.parse(storedValue) : null;

  const [selectedStation, setSelectedStation] = useState<Station | null>(
    selected,
  );

  /*show loading screen when moving from dashboard to administration */
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const setESSContextHandler = (selectedStation: Station) => {
    localStorage.setItem("ess", JSON.stringify(selectedStation));
    setSelectedStation(selectedStation);
  };

  const clearESSContextHandler = () => {
    localStorage.removeItem("ess");
    setSelectedStation(null);
  };

  const contextValue: ESSContextProps = {
    station: selectedStation,
    stationId: selectedStation ? selectedStation.id : 0,
    customerAccountId: selectedStation ? selectedStation.customerAccountId : 0,
    isLoading,
    selectStation: setESSContextHandler,
    clearContext: clearESSContextHandler,
  };

  return (
    <ESSContext.Provider value={contextValue}>{children}</ESSContext.Provider>
  );
};

export const useESSContext = () => {
  return useContext(ESSContext);
};
