import { useMutation } from "@tanstack/react-query";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase/firebaseApp";
import type { LoginInput } from "../../types/auth";

export function useLogin() {
  return useMutation({
    mutationFn: async (input: LoginInput) => {
      const cred = await signInWithEmailAndPassword(
        auth,
        input.email,
        input.password,
      );
      return cred.user;
    },
  });
}
