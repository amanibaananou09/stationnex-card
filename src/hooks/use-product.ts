import { useQuery } from "@tanstack/react-query";
import { getProduct } from "../common/api/product-api";

export const useProduct = (supplierId: number | null) => {
  const { data: product, isLoading } = useQuery({
    queryKey: ["product"],
    queryFn: () => getProduct(supplierId),
  });

  return {
    isLoading,
    product,
  };
};
