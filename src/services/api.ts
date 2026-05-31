import axios from "axios";
import { getToken } from "@/lib/storage";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.msg ||
      error?.response?.data?.status ||
      error?.message ||
      "Request failed";
    return Promise.reject(new Error(message));
  },
);

export default api;
