import { useQuery } from "@tanstack/react-query";
import { getSalePoint } from "../common/api/sale-point-api";

export const useSalePoint = (supplierId: number) => {
  const { data: salepoint, isLoading } = useQuery({
    queryKey: ["salepoint", supplierId],
    queryFn: () => getSalePoint(supplierId),
    enabled: !!supplierId,
  });

  return {
    isLoading,
    salepoint: salepoint ?? [],
  };
};
