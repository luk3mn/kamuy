import { authService } from "@/services/auth.service";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";

export function useSignIn() {
  const router = useRouter();

  return useMutation({
    mutationFn: authService.signIn,
    onSuccess: () => router.replace("/"),
    onError: (error: Error) => console.error("Sign in error:", error.message),
  });
}