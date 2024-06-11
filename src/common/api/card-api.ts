import api from "./axios";
import { GeneralCard, Transaction, TransactionCreteria } from "../model";
import Transactions from "../../views/Dashboard/Transactions";

const API_URL_CUSTOMER = "/customer";
const API_URL = "/card";

type CardSearchCriteria = {
  customerId: number | null;
  cardId?: string;
  holder?: string;
  actif?: string;
  expirationDate?: string;
};
export const getListofCard = async (
  cardSearchCriteria: CardSearchCriteria = {
    customerId: 0,
  },
): Promise<GeneralCard[]> => {
  let url = `${API_URL_CUSTOMER}/${cardSearchCriteria.customerId}${API_URL}`;

  const { cardId, holder, actif, expirationDate } = cardSearchCriteria;

  const searchParams = new URLSearchParams();

  if (cardId || holder || actif || expirationDate) {
    url += "/filter";
  } else {
    url;
  }

  if (cardId) {
    searchParams.append("cardId", cardId);
  }

  if (holder) {
    searchParams.append("holder", holder);
  }

  if (actif) {
    searchParams.append("actif", actif);
  }
  if (expirationDate) {
    searchParams.append("expirationDate", expirationDate);
  }
  const response = await api.get(url + "?" + searchParams.toString());

  return response.data;
};

export const addCard = async (
  customerId: string | undefined,
  card: GeneralCard,
): Promise<GeneralCard> => {
  const response = await api.post(
    `${API_URL_CUSTOMER}/${customerId}${API_URL}/add`,
    card,
  );
  return response.data;
};
export const updateCard = async (
  customerId: string | undefined,
  card: GeneralCard,
): Promise<GeneralCard> => {
  const response = await api.put(
    `${API_URL_CUSTOMER}/${customerId}${API_URL}/update`,
    card,
  );
  return response.data;
};

export const cardInformation = async (
  cardId: number,
  customerId: string | undefined,
): Promise<GeneralCard> => {
  const response = await api.get(
    `${API_URL_CUSTOMER}/${customerId}${API_URL}/${cardId}/info`,
  );
  return response.data;
};
export const activateCard = async (
  customerId: string | undefined,
  id: string,
) => {
  const response = await api.post(
    `${API_URL_CUSTOMER}/${customerId}${API_URL}/activate/${id}`,
  );

  return response.data;
};

export const deactivateCard = async (
  customerId: string | undefined,
  id: string,
) => {
  const response = await api.post(
    `${API_URL_CUSTOMER}/${customerId}${API_URL}/deactivate/${id}`,
  );
  return response.data;
};
export const getAllTransaction = async (
  creteria: TransactionCreteria,
  customerId: string | undefined,
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
      ville: creteria.city.length == 0 ? null : creteria.city,
      period: {
        from: creteria.period.from,
        to: creteria.period.to,
      },
    },
  );

  return response.data;
};
