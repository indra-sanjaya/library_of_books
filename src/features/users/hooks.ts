import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from "@/services/user.service";
import type { UserPayload } from "@/types/users";
import { userKeys } from "@/features/users/keys";

export function useUsers() {
  return useQuery({
    queryKey: userKeys.list(),
    queryFn: getUsers,
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => getUser(id),
    enabled: Boolean(id),
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UserPayload) => createUser(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: userKeys.list() });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UserPayload & { id: string }) => updateUser(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: userKeys.list() });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: userKeys.list() });
    },
  });
}
