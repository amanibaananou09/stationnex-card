import api from "./axios";

const API_URL = "/transaction";

export const getChartByFuelCartPeriod = async (
  periode: string,
  startDate: string,
  endDate: string,
  customerId: number,
) => {
  let url = `${API_URL}/chart?customerId=${customerId}&startDate=${startDate}&endDate=${endDate}`;

  if (periode) {
    url += `&period=${periode}`;
  }

  const response = await api.get(url);

  return response.data;
};

export const getdailyChart = async (
  periode: string,
  startDate: string,
  endDate: string,
  customerId: number,
) => {
  let url = `${API_URL}/dailyChart?customerId=${customerId}&startDate=${startDate}&endDate=${endDate}`;

  if (periode) {
    url += `&period=${periode}`;
  }

  const response = await api.get(url);

  return response.data;
};
