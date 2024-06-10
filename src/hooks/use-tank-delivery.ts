import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAllTankDelivery } from "common/api/configuration-api";
import { TankDeliveryCreteria } from "common/model";
import { useESSContext } from "store/ESSContext";

export const useTankDeliveriesByCreteria = (creteria: TankDeliveryCreteria) => {
  const { station } = useESSContext();

  const { data, isLoading, error } = useQuery({
    queryKey: ["tankDeliveries", station?.id, creteria],
    queryFn: () => getAllTankDelivery(station!!, creteria),
    enabled: !!station?.id,
    placeholderData: keepPreviousData,
  });

  return {
    tankDeliveries: data?.content,
    totalPages: data?.totalPages ?? 0,
    totalElements: data?.totalElements ?? 0,
    numberOfElements: data?.numberOfElements ?? 0,
    isLoading,
    error,
  };
};
