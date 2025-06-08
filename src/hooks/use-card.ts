import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {activateCard, deactivateCard, getListofCard} from "common/api/card-api";
import useQueryParams from "./use-query-params";
import {useAuth} from "../store/AuthContext";

const useCardQueryParams = () => {
  const query = useQueryParams();
  return {
    cardId: query.get("cardId") ?? undefined,
    holder: query.get("holder") ?? undefined,
    actif: query.get("actif") ?? undefined,
    expirationDate: query.get("expirationDate") ?? undefined,
  };
};

export const useCard = (customerId: number) => {
  const {cardId, holder, actif, expirationDate} = useCardQueryParams();

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

export const useCardQueries = () => {
  const queryClient = useQueryClient();
  const { customerId } = useAuth();

  const commonMutationConfig = {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["card"] }),
  };

  const { mutate: activate } = useMutation({
    mutationFn: (cardId: string) => activateCard(customerId, cardId),
    ...commonMutationConfig,
  });

  const { mutate: desactivate } = useMutation({
    mutationFn: (cardId: string) => deactivateCard(customerId, cardId),
    ...commonMutationConfig,
  });

  return {
    activate,
    desactivate,
  };
};
