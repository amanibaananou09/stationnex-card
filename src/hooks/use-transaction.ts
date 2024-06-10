import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getallTransactionPump } from "common/api/configuration-api";
import { TransactionCreteria } from "common/model";
import { useESSContext } from "store/ESSContext";

export const useTransactionsByCreteria = (creteria: TransactionCreteria) => {
  const { station } = useESSContext();

  const { data, isLoading, error } = useQuery({
    queryKey: ["transactions", station?.id, creteria],
    queryFn: () => getallTransactionPump(station!!, creteria),
    enabled: !!station?.id,
    placeholderData: keepPreviousData,
  });

  return {
    transactions: data?.content,
    totalPages: data?.totalPages ?? 0,
    totalElements: data?.totalElements ?? 0,
    numberOfElements: data?.numberOfElements ?? 0,
    isLoading,
    error,
  };
};
