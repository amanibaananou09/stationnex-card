import api from "./axios";
import { SalePoint } from "../model";

const API_URL_Supplier = "/supplier";
const API_URL = "/salePoint";

export const getSalePoint = async (supplierId: number | undefined) => {
  const response = await api.get<SalePoint[]>(
    `${API_URL_Supplier}/${supplierId}${API_URL}`,
  );
  return response.data;
};
