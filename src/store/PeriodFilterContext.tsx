import { Flex, Spinner } from "@chakra-ui/react";
import { PeriodType } from "common/enums";
import { Period } from "common/model";
import { usePeriods } from "hooks/use-periods";
import React, { useContext, useState } from "react";

type PeriodFilterContextProps = {
  period?: Period;
  setPeriod: (period: Period) => void;
};

type PeriodFilterContextProviderProps = {
  children: React.ReactNode;
};

const PeriodFilterContext = React.createContext<PeriodFilterContextProps>({
  period: undefined,
  setPeriod: () => {},
});

export const PeriodFilterContextProvider = ({
  children,
}: PeriodFilterContextProviderProps) => {
  const { periods } = usePeriods();

  const [period, setPeriod] = useState<Period>();

  if (!periods) {
    return (
      <Flex justifyContent="center" alignItems="center" height="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  const setFilterHandler = ({
    periodType,
    startDateTime,
    endDateTime,
  }: Period) => {
    if (periodType) {
      setPeriod(periods.find((p) => p.periodType === periodType));
      return;
    }

    const periodbyDates = periods.find(
      (p) => p.startDateTime === startDateTime && p.endDateTime == endDateTime,
    );

    if (periodbyDates) {
      setPeriod(periodbyDates);
      return;
    }

    setPeriod({
      startDateTime,
      endDateTime,
    });
  };

  const context: PeriodFilterContextProps = {
    period: period ?? periods.find((p) => p.periodType === PeriodType.TODAY),
    setPeriod: setFilterHandler,
  };

  return (
    <PeriodFilterContext.Provider value={context}>
      {children}
    </PeriodFilterContext.Provider>
  );
};

export const usePeriod = () => {
  return useContext(PeriodFilterContext);
};
