import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {activateCard, deactivateCard, getListofCard,} from "common/api/card-api";
import useQueryParams from "./use-query-params";
import {useAuth} from "../store/AuthContext";

export const useCard = (customerId: number) => {
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
export const useCardQueries = () => {
  const queryClient = useQueryClient();
  const { customerId } = useAuth();

  const { mutate: activate } = useMutation({
    mutationFn: (cardId: string) => activateCard(customerId, cardId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["card"] }),
  });

  const { mutate: desactivate } = useMutation({
    mutationFn: (cardId: string) => deactivateCard(customerId, cardId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["card"] }),
  });

  return {
    activate,
    desactivate,
  };
};
