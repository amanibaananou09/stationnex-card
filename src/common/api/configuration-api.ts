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

export const getAllTank = async (station: Station) => {
  const response = await api.get(`${API_URL}/tank/${station.controllerPts.id}`);

  return response.data;
};

export const getAllFuelGrades = async (
  station: Station,
): Promise<FuelGrade[]> => {
  const response = await api.get(
    `${API_URL}/fuelGrade/${station.controllerPts.id}`,
  );

  return response.data;
};

export const getAllPump = async (station: Station): Promise<Pump[]> => {
  const response = await api.get(`${API_URL}/pump/${station.controllerPts.id}`);

  return response.data;
};

export const getAllNozzle = async (station: Station) => {
  const response = await api.get(
    `${API_URL}/nozzle/${station.controllerPts.id}`,
  );

  return response.data;
};

export const getControllerVersion = async () => {
  const response = await api.get(`${API_URL}/version`);

  return response.data;
};

export const getAllPumpByNozzel = async (
  station: Station,
  selectedPump: string,
) => {
  const response = await api.get(
    `${API_URL}/nozzleByPump/${station.controllerPts.id}/${selectedPump}`,
  );

  return response.data;
};

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
      ville: creteria.city.length == 0 ? null : creteria.city,
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

export const getAllProb = async (station: Station) => {
  const response = await api.get(
    `${API_URL}/probe/${station.controllerPts.id}`,
  );

  return response.data;
};

export const getAllReader = async (station: Station) => {
  const response = await api.get(
    `${API_URL}/reader/${station.controllerPts.id}`,
  );

  return response.data;
};
