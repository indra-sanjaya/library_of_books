import api from "@/services/api";
import type { ApiResponse } from "@/types/api";
import type { User, UserPayload } from "@/types/users";

export async function getUsers() {
  const { data } = await api.get<ApiResponse<User[]>>("/admin/pegawai");
  return data;
}

export async function getUser(id: string) {
  const { data } = await api.get<ApiResponse<User>>(`/admin/pegawai/${id}`);
  return data;
}

export async function createUser(payload: UserPayload) {
  const { data } = await api.post<ApiResponse<User>>(
    "/admin/pegawai/create",
    payload,
  );
  return data;
}

export async function updateUser(payload: UserPayload & { id: string }) {
  const { data } = await api.put<ApiResponse<User>>(
    "/admin/pegawai/update",
    payload,
  );
  return data;
}

export async function deleteUser(id: string) {
  const { data } = await api.delete<ApiResponse<null>>(
    "/admin/pegawai/delete",
    {
      data: { id },
    },
  );
  return data;
}
