import { authService, userService } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth.store";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";

export const userKeys = {
  me: ["user", "me"] as const,
};

export function useMe() {
  const accessToken = useAuthStore((s) => s.accessToken); // ← from store, no prop needed

  return useQuery({
    queryKey: userKeys.me,
    queryFn: async () => {
      const { data, error } = await userService.getMe(accessToken!);
      if (error) throw new Error(error);
      return data;
    },
    enabled: !!accessToken, // ← only runs when token exists
    staleTime: 1000 * 60 * 5,
  });
}

export function useSignIn() {
  const router = useRouter();

  return useMutation({
    mutationFn: authService.signIn,
    onSuccess: () => router.replace("/"),
    onError: (error: Error) => console.error("Sign in error:", error.message),
  });
}