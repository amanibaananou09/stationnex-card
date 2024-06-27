import {
  FuelGrade,
  Pump,
  Station,
  TankDelivery,
  TankDeliveryCreteria,
  Transaction,
  TransactionCreteria,
} from "common/model";
import api from "./axios";

const API_URL = "/configuration";

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

export const getAllTankDelivery = async (
  station: Station,
  creteria: TankDeliveryCreteria,
): Promise<{
  content: TankDelivery[];
  totalPages: number;
  totalElements: number;
  numberOfElements: number;
}> => {
  const response = await api.get(
    `${API_URL}/delivery/${station.controllerPts.id}?filterType=${creteria.filterType}&tank=${creteria.tank}&startDate=${creteria.startDate}&endDate=${creteria.endDate}&page=${creteria.page}&size=${creteria.size}`,
  );

  return response.data;
};
