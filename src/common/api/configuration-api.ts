import { Transaction, TransactionCreteria } from "common/model";
import api from "./axios";

export const getAllTransaction = async (
  creteria: TransactionCreteria,
  customerId: number | undefined,
): Promise<{
  content: Transaction[];
  totalPages: number;
  totalElements: number;
  numberOfElements: number;
}> => {
  const response = await api.post(
    `/transaction?customerId=${customerId}&page=${creteria.page}&size=${creteria.size}`,
    {
      cardIds: creteria.cardIds.length == 0 ? null : creteria.cardIds,
      salePointIds:
        creteria.salePointIds.length == 0 ? null : creteria.salePointIds,
      productIds: creteria.productIds.length == 0 ? null : creteria.productIds,
      city: creteria.city.length == 0 ? null : creteria.city,
      period: {
        from: creteria.period.from,
        to: creteria.period.to,
      },
    },
  );

  return response.data;
};
