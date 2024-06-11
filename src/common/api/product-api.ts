import api from "./axios";
import { Product } from "../model";

const API_URL_Supplier = "/product/supplier";

export const getProduct = async (supplierId: number | null) => {
  const response = await api.get<Product[]>(
    `${API_URL_Supplier}/${supplierId}`,
  );
  return response.data;
};