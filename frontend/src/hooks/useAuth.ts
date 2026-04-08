"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import * as api from "@/lib/api";
import type { LoginInput, RegisterInput } from "@/types";

export function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data, isLoading, error } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: api.getMe,
    retry: false,
    enabled: typeof window !== "undefined" && !!localStorage.getItem("token"),
  });

  const loginMutation = useMutation({
    mutationFn: (input: LoginInput) => api.login(input),
    onSuccess: (res) => {
      localStorage.setItem("token", res.data.token);
      queryClient.setQueryData(["auth", "me"], { success: true, data: res.data.user });
      router.push("/");
    },
  });

  const registerMutation = useMutation({
    mutationFn: (input: RegisterInput) => api.register(input),
    onSuccess: (res) => {
      localStorage.setItem("token", res.data.token);
      queryClient.setQueryData(["auth", "me"], { success: true, data: res.data.user });
      router.push("/");
    },
  });

  const logout = () => {
    localStorage.removeItem("token");
    queryClient.clear();
    router.push("/login");
  };

  return {
    user: data?.data ?? null,
    isLoading,
    isAuthenticated: !!data?.data,
    error,
    login: loginMutation,
    register: registerMutation,
    logout,
  };
}
