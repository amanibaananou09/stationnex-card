import api from "./axios";
import {GeneralUser} from "../model";

const API_URL = "/user";

export const login = async (username: string, password: string) => {
  const response = await api.post("/login", {
    username,
    password,
    admin: true,
  });

  return response.data;
};
export const updateUser = async (user: GeneralUser) => {
  const response = await api.put(`${API_URL}/updateContact`, user);
  return response.data;
};

export const userProfile = async (username: string | undefined) => {
  const response = await api.get(`${API_URL}/profile?username=${username}`);
  return response.data;
};
