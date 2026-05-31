import api from "@/services/api";
import type { ApiResponse } from "@/types/api";

export type LoginPayload = {
  username: string;
  password: string;
};

export type LoginData = {
  username: string;
  token: string;
  refresh_token?: string;
};

export async function login(payload: LoginPayload) {
  const { data } = await api.post<ApiResponse<LoginData>>("/login", payload);
  return data;
}
