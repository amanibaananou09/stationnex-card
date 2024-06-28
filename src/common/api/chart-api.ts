import api from "./axios";

const API_URL = "/transaction";

export const getChartByFuelCartPeriod = async (
  periode: string,
  startDate: string,
  endDate: string,
  customerId: number,
) => {
  const response = await api.get(
    `${API_URL}/chart?customerId=${customerId}&period=${periode}&startDate=${startDate}&endDate=${endDate}`,
  );

  return response.data;
};

export const getdailyChart = async (
  periode: string,
  startDate: string,
  endDate: string,
  customerId: number,
) => {
  console.log(
    `Calling API: ${API_URL}/dailyChart?customerId=${customerId}&period=${periode}&startDate=${startDate}&endDate=${endDate}`,
  );

  const response = await api.get(
    `${API_URL}/dailyChart?customerId=${customerId}&period=${periode}&startDate=${startDate}&endDate=${endDate}`,
  );

  return response.data;
};
