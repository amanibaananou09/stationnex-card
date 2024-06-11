import { useQuery } from "@tanstack/react-query";
import { TransactionCreteria } from "common/model";
import { getAllTransaction } from "../common/api/configuration-api";
import { useAuth } from "../store/AuthContext";
import { getListofCard } from "../common/api/card-api";
import useQueryParams from "./use-query-params";

export const useTransaction = (creteria: TransactionCreteria) => {
  const { customerId } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["transactions", creteria, customerId],
    queryFn: () => getAllTransaction(creteria, customerId!!),
    enabled: !!customerId,
  });
  return {
    transactions: data?.content,
    totalPages: data?.totalPages ?? 0,
    totalElements: data?.totalElements ?? 0,
    numberOfElements: data?.numberOfElements ?? 0,
    isLoading,
  };
};

export const useCard = (customerId: number | null) => {
  const query = useQueryParams();

  const cardId = query.get("cardId") ?? undefined;
  const holder = query.get("holder") ?? undefined;
  const actif = query.get("actif") ?? undefined;
  const expirationDate = query.get("expirationDate") ?? undefined;

  const { data: cards, isLoading } = useQuery({
    queryKey: ["card", { cardId, holder, actif, expirationDate }, customerId],
    queryFn: () => {
      if (customerId) {
        return getListofCard({
          customerId,
          cardId,
          holder,
          actif,
          expirationDate,
        });
      }
    },
  });

  return {
    cards,
    isLoading,
  };
};
