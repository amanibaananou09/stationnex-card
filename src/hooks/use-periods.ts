import { useQuery } from "@tanstack/react-query";
import { periodsdata } from "../common/period";

export const usePeriods = () => {
  const { data: periods, isLoading } = useQuery({
    queryKey: ["periods"],
    queryFn: () => periodsdata,
    staleTime: Infinity,
  });

  return {
    periods,
    isLoading,
  };
};
