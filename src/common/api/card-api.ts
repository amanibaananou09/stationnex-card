import { GeneralCard } from "common/model";
import api from "./axios";

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
  customerId: number,
): Promise<GeneralCard> => {
  const response = await api.get(
    `${API_URL_CUSTOMER}/${customerId}${API_URL}/${cardId}`,
  );
  return response.data;
};
export const activateCard = async (customerId: number, id: string) => {
  const response = await api.post(
    `${API_URL_CUSTOMER}/${customerId}${API_URL}/activate/${id}`,
  );

  return response.data;
};

export const deactivateCard = async (customerId: number, id: string) => {
  const response = await api.post(
    `${API_URL_CUSTOMER}/${customerId}${API_URL}/deactivate/${id}`,
  );
  return response.data;
};
